import { useEffect, useId, useMemo, useState } from "react";
import { LockKeyhole, RefreshCw } from "lucide-react";
import { EditableTable, isTableData } from "./editable-table";
import type { TableData } from "./editable-table";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { useEditAccess } from "../hooks/use-edit-access";
import { useSyncedDocument } from "../hooks/use-synced-document";
import { createDocumentTransport } from "../lib/synced-document";
import type { SyncStatus } from "../lib/synced-document";

const initialTable: TableData = {
  schemaVersion: 1,
  columns: [{ id: "name", name: "名称" }, { id: "date", name: "日期" }, { id: "notes", name: "备注" }],
  rows: [],
};
const statuses: Record<SyncStatus, string> = {
  loading: "读取中", synced: "已同步", pending: "待保存", saving: "保存中", error: "同步失败", conflict: "版本冲突",
};

export function SyncedTable({ id, title }: { id: string; title?: string }) {
  const passwordId = useId();
  const access = useEditAccess();
  const [password, setPassword] = useState("");
  const transport = useMemo(() => createDocumentTransport(isTableData, access.getPassword), [access.getPassword]);
  const document = useSyncedDocument({ id: `tables:${id}`, initialValue: initialTable, validate: isTableData,
    transport, canEdit: access.canEdit });
  useEffect(() => { if (document.unauthorized) access.lock(); }, [document.unauthorized, access.lock]);
  const readOnly = !access.canEdit || !document.ready;
  return <div className="flex min-w-0 flex-col gap-4">
      <section aria-label="编辑权限" className="rounded-lg border bg-card p-4 sm:p-5">
        {access.canEdit ? <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3"><Badge>可编辑</Badge><span className="text-sm">已在此浏览器记住密码。</span></div>
          <Button variant="outline" size="sm" onClick={access.lock}><LockKeyhole data-icon="inline-start" />锁定编辑</Button>
        </div> : <form className="flex flex-wrap items-end gap-3" onSubmit={event => {
          event.preventDefault(); void access.unlock(password).then(() => setPassword(""));
        }}>
          <FieldGroup className="max-w-xs"><Field>
            <FieldLabel htmlFor={passwordId}>编辑密码 <Badge variant="outline">当前只读</Badge></FieldLabel>
            <Input id={passwordId} type="password" autoComplete="current-password" value={password}
              onChange={event => setPassword(event.target.value)} placeholder="输入密码后可编辑" required disabled={access.checking} />
          </Field></FieldGroup>
          <Button type="submit" disabled={access.checking || !password}>{access.checking ? "核对中…" : "解锁编辑"}</Button>
        </form>}
        {access.error && <p role="alert" className="mt-3 text-sm text-destructive">{access.error}</p>}
      </section>
      <section aria-label="记录内容" className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3"><p className="text-lg font-semibold">{title ?? (id === "notes" ? "通用记录" : id)}</p>
            <Badge variant={document.status === "error" || document.status === "conflict" ? "destructive" : "outline"}>
              <span role="status">{document.status === "synced" && document.revision === 0 ? "尚无记录" : statuses[document.status]}</span>
            </Badge></div>
          <div className="flex flex-wrap items-center gap-3">
            {document.updatedAt && <time className="text-xs text-muted-foreground" dateTime={document.updatedAt}>
              最近保存 {new Date(document.updatedAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </time>}
            <Button variant="ghost" size="sm" onClick={() => void document.retry()}><RefreshCw data-icon="inline-start" />刷新</Button>
          </div>
        </div>
        {document.error && <Alert variant="destructive"><AlertTitle>暂未完成同步</AlertTitle><AlertDescription>{document.error} 本地修改会保留。</AlertDescription></Alert>}
        {document.storageError && <Alert variant="destructive"><AlertTitle>草稿提醒</AlertTitle><AlertDescription>{document.storageError}</AlertDescription></Alert>}
        {document.remote && <Alert><AlertTitle>其他页面也修改了这份记录</AlertTitle><AlertDescription>
          <p>你的草稿仍在。选择保留本地内容，或放弃草稿并使用云端版本。</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button size="sm" disabled={!access.canEdit} onClick={() => document.resolveConflict("local")}>保留本地并保存</Button>
            <Button variant="outline" size="sm" onClick={() => document.resolveConflict("remote")}>使用云端版本</Button>
          </div>
        </AlertDescription></Alert>}
        {document.ready || document.dirty ? <EditableTable value={document.data} onChange={document.update}
          readOnly={readOnly} onEditingChange={document.setEditing} />
          : <p className="rounded-lg border p-10 text-center text-sm text-muted-foreground">
            {document.status === "loading" ? "正在读取记录…" : "记录暂时无法读取，请稍后重试。"}
          </p>}
        <p className="text-xs leading-6 text-muted-foreground">{readOnly ? "所有人都可以查看，输入密码后可编辑。" : "双击或点击铅笔编辑 · Enter 确认 · Esc 取消"} 更新约每 15 秒自动读取。</p>
      </section>
  </div>;
}
