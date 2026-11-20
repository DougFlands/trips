import { useEffect, useMemo, useSyncExternalStore } from "react";
import { SyncedDocument } from "../lib/synced-document";
import type { DocumentTransport } from "../lib/synced-document";

function draftStorage(id: string) {
  try {
    let tab = sessionStorage.getItem("document-draft-tab");
    if (!tab) { tab = crypto.randomUUID(); sessionStorage.setItem("document-draft-tab", tab); }
    return { storage: localStorage, draftKey: `document-draft:${tab}:${id}` };
  } catch { return {}; }
}

/** Keep initialValue, validate and transport stable (module constants or useMemo). */
export function useSyncedDocument<T>({ id, initialValue, validate, transport, canEdit = false, saveDelay = 1000, pollInterval = 15000 }: {
  id: string; initialValue: T; validate: (data: unknown) => data is T;
  transport: DocumentTransport<T>; canEdit?: boolean; saveDelay?: number; pollInterval?: number;
}) {
  const store = useMemo(() => new SyncedDocument({ id, initialValue, validate, transport,
    saveDelay, ...draftStorage(id) }), [id, initialValue, validate, transport, saveDelay]);
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
  useEffect(() => {
    store.start();
    const refresh = () => { if (document.visibilityState === "visible") void store.refresh(); };
    const timer = window.setInterval(refresh, Math.max(1000, pollInterval));
    window.addEventListener("online", refresh);
    document.addEventListener("visibilitychange", refresh);
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (store.getSnapshot().dirty) { event.preventDefault(); event.returnValue = ""; }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      store.stop(); clearInterval(timer);
      window.removeEventListener("online", refresh);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [store, pollInterval]);
  useEffect(() => { store.setEditable(canEdit); }, [store, canEdit]);
  return { ...state, update: store.update, retry: store.refresh,
    setEditing: store.setEditing, resolveConflict: store.resolveConflict };
}
