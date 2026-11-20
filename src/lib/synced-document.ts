export const MAX_DOCUMENT_BYTES = 512 * 1024;
// ponytail: sync small documents as complete JSON snapshots; use record-level writes beyond this limit.
export type VersionedDocument<T> = { data: T; revision: number; updatedAt: string };
export type DocumentTransport<T> = {
  read(id: string, signal: AbortSignal): Promise<VersionedDocument<T> | null>;
  write(id: string, data: T, revision: number, signal: AbortSignal): Promise<VersionedDocument<T>>;
};
export type SyncStatus = "loading" | "synced" | "pending" | "saving" | "error" | "conflict";
export type DocumentSnapshot<T> = {
  data: T; revision: number; updatedAt: string | null; ready: boolean;
  dirty: boolean; status: SyncStatus; error: string | null;
  unauthorized: boolean;
  remote: VersionedDocument<T> | null;
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export class DocumentError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
}

export function decodeDocument<T>(value: unknown, validate: (data: unknown) => data is T): VersionedDocument<T> {
  if (!isRecord(value) || !validate(value.data) || !Number.isSafeInteger(value.revision)
    || typeof value.revision !== "number" || value.revision < 1
    || typeof value.updatedAt !== "string" || !Number.isFinite(Date.parse(value.updatedAt))) {
    throw new Error("保存的数据格式不兼容，请勿覆盖；可重试或联系维护者。");
  }
  return { data: value.data, revision: value.revision, updatedAt: value.updatedAt };
}

export async function requestDocumentApi(path: string, init: RequestInit = {}) {
  const response = await fetch(path, {
    ...init, cache: "no-store",
    signal: AbortSignal.any([...(init.signal ? [init.signal] : []), AbortSignal.timeout(12000)]),
  });
  if (!response.ok) {
    const messages: Record<number, string> = {
      401: "编辑密码已失效，请重新输入。", 409: "其他页面已更新，请选择要保留的内容。",
      413: "内容超过 512 KB，请减少数据后再试。", 503: "同步服务尚未配置，请联系维护者。",
    };
    throw new DocumentError(messages[response.status] ?? "同步失败，请检查网络后重试。", response.status);
  }
  if (!response.headers.get("Content-Type")?.includes("application/json")) {
    throw new DocumentError("同步服务暂不可用，请稍后重试。", 502);
  }
  return response;
}

export function createDocumentTransport<T>(validate: (data: unknown) => data is T, getPassword: () => string): DocumentTransport<T> {
  const path = (id: string) => `/api/documents/${encodeURIComponent(id)}`;
  return {
    async read(id, signal) {
      try {
        const response = await requestDocumentApi(path(id), { signal });
        return decodeDocument(await response.json(), validate);
      } catch (error) {
        if (error instanceof DocumentError && error.status === 404) return null;
        throw error;
      }
    },
    async write(id, data, expectedRevision, signal) {
      const response = await requestDocumentApi(path(id), {
        method: "PUT", signal,
        headers: { "Content-Type": "application/json", "X-Edit-Password": encodeURIComponent(getPassword()) },
        body: JSON.stringify({ data, expectedRevision }),
      });
      return decodeDocument(await response.json(), validate);
    },
  };
}

type SyncOptions<T> = {
  id: string; initialValue: T; transport: DocumentTransport<T>;
  validate: (data: unknown) => data is T;
  saveDelay?: number;
};

// One document controller per hook. Kept outside React so races can be tested with real deferred requests.
export class SyncedDocument<T> {
  private options: SyncOptions<T>;
  private state: DocumentSnapshot<T>;
  private listeners = new Set<() => void>();
  private active = false;
  private epoch = 0;
  private editable = false;
  private editing = false;
  private generation = 0;
  private reading = false;
  private writing = false;
  private requests = new Set<AbortController>();
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor(options: SyncOptions<T>) {
    this.options = options;
    this.state = { data: options.initialValue, revision: 0, updatedAt: null, ready: false,
      dirty: false, status: "loading", error: null, unauthorized: false, remote: null };
  }
  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private publish(patch: Partial<DocumentSnapshot<T>>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach(listener => listener());
  }
  start = () => {
    this.active = true; this.epoch++; this.reading = false; this.writing = false;
    void this.refresh();
  };
  stop = () => {
    this.active = false; this.epoch++;
    clearTimeout(this.timer); this.timer = undefined;
    this.requests.forEach(request => request.abort()); this.requests.clear();
  };
  setEditable = (editable: boolean) => {
    this.editable = editable;
    if (!editable) { clearTimeout(this.timer); this.timer = undefined; }
    else { this.publish({ unauthorized: false }); this.schedule(); }
  };
  setEditing = (editing: boolean) => {
    this.editing = editing;
    if (!editing) void this.refresh();
  };
  update = (data: T) => {
    if (!this.editable || !this.state.ready) return;
    if (!this.options.validate(data) || new TextEncoder().encode(JSON.stringify(data)).length > MAX_DOCUMENT_BYTES) {
      this.publish({ error: "内容格式有误或超过 512 KB，请减少内容。" }); return;
    }
    if (JSON.stringify(data) === JSON.stringify(this.state.data)) return;
    this.generation++;
    this.publish({ data, dirty: true, status: this.state.remote ? "conflict" : "pending", error: null });
    this.schedule();
  };
  private schedule() {
    if (!this.active || !this.editable || !this.state.ready || !this.state.dirty
      || this.state.remote || this.writing || this.timer !== undefined || this.state.status === "error") return;
    this.timer = setTimeout(() => { this.timer = undefined; void this.save(); }, this.options.saveDelay ?? 1000);
  }
  refresh = async () => {
    if (!this.active || this.reading || this.writing) return;
    const epoch = this.epoch;
    const requestedRevision = this.state.revision;
    const controller = new AbortController(); this.requests.add(controller); this.reading = true;
    try {
      const remote = await this.options.transport.read(this.options.id, controller.signal);
      if (!this.active || epoch !== this.epoch || this.writing) return;
      const revision = remote?.revision ?? 0;
      if (revision < this.state.revision && requestedRevision !== this.state.revision) return;
      if (revision < this.state.revision) throw new Error("云端版本落后，请重试；当前页面内容已保留。");
      if (this.editing) return;
      if (this.state.dirty) {
        if (remote && JSON.stringify(remote.data) === JSON.stringify(this.state.data)) {
          this.publish({ ...remote, ready: true, dirty: false, remote: null, status: "synced", error: null });
        } else if (revision !== this.state.revision) {
          this.publish({ ready: true, remote, status: "conflict", error: null });
        } else if (!this.state.remote) {
          this.publish({ ready: true, status: "pending", error: null }); this.schedule();
        }
      } else {
        this.publish({ ...remote, ready: true, status: "synced", error: null });
      }
    } catch (error) {
      if (this.active && epoch === this.epoch) this.fail(error);
    } finally {
      this.requests.delete(controller);
      if (epoch === this.epoch) this.reading = false;
    }
  };
  private fail(error: unknown) {
    const unauthorized = error instanceof DocumentError && error.status === 401;
    if (unauthorized) this.editable = false;
    this.publish({ status: "error", unauthorized, error: error instanceof Error ? error.message : "同步失败，请重试。" });
  }
  private async save() {
    if (!this.active || !this.editable || this.writing || !this.state.dirty || this.state.remote) return;
    const epoch = this.epoch; const generation = this.generation;
    const { data, revision } = this.state;
    let conflict = false;
    const controller = new AbortController(); this.requests.add(controller); this.writing = true;
    this.publish({ status: "saving", error: null });
    try {
      const remote = await this.options.transport.write(this.options.id, data, revision, controller.signal);
      if (!this.active || epoch !== this.epoch) return;
      const dirty = generation !== this.generation;
      this.publish({ revision: remote.revision, updatedAt: remote.updatedAt, dirty,
        status: dirty ? "pending" : "synced", error: null });
    } catch (error) {
      if (this.active && epoch === this.epoch) {
        conflict = error instanceof DocumentError && error.status === 409;
        this.fail(error);
      }
    } finally {
      this.requests.delete(controller);
      if (epoch === this.epoch) {
        this.writing = false;
        if (conflict) void this.refresh();
        else this.schedule();
      }
    }
  }
  resolveConflict = (choice: "remote" | "local") => {
    const remote = this.state.remote;
    if (!remote || this.editing || (choice === "local" && !this.editable)) return;
    this.generation++;
    this.publish({ data: choice === "remote" ? remote.data : this.state.data,
      revision: remote.revision, updatedAt: remote.updatedAt, remote: null,
      dirty: choice === "local", status: choice === "local" ? "pending" : "synced", error: null });
    this.schedule();
  };
}
