import { useCallback, useEffect, useRef, useState } from "react";
import { DocumentError, isRecord, requestDocumentApi } from "../lib/synced-document";

const PASSWORD_KEY = "shared-edit-password";
export function getSavedEditPassword() {
  try { return localStorage.getItem(PASSWORD_KEY) ?? ""; } catch { return ""; }
}

export function useEditAccess() {
  const [canEdit, setCanEdit] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const password = useRef("");
  const request = useRef<AbortController | null>(null);
  const getPassword = useCallback(() => password.current, []);
  const lock = useCallback(() => {
    request.current?.abort(); request.current = null;
    password.current = ""; setCanEdit(false); setChecking(false);
    try { localStorage.removeItem(PASSWORD_KEY); } catch { setError("无法清除浏览器保存的密码，请手动清除站点数据。"); }
  }, []);
  const unlock = useCallback(async (value: string) => {
    request.current?.abort();
    const controller = new AbortController(); request.current = controller;
    setChecking(true); setError(null); setCanEdit(false);
    try {
      const response = await requestDocumentApi("/api/edit-access", { method: "POST", signal: controller.signal,
        headers: { "X-Edit-Password": encodeURIComponent(value) } });
      const result: unknown = await response.json();
      if (!isRecord(result) || result.ok !== true) throw new Error("密码核对服务返回异常，请重试。");
      if (controller.signal.aborted) return;
      password.current = value; setCanEdit(true);
      try { localStorage.setItem(PASSWORD_KEY, value); }
      catch { setError("已解锁，但浏览器未能记住密码。下次需要重新输入。"); }
    } catch (failure) {
      if (controller.signal.aborted) return;
      password.current = "";
      if (failure instanceof DocumentError && failure.status === 401) {
        try { localStorage.removeItem(PASSWORD_KEY); } catch { /* The editor stays locked even if storage is unavailable. */ }
      }
      setError(failure instanceof Error ? failure.message : "密码核对失败，请重试。");
    } finally { if (!controller.signal.aborted) setChecking(false); }
  }, []);
  useEffect(() => {
    const saved = getSavedEditPassword();
    if (saved) void unlock(saved);
    const changed = (event: StorageEvent) => {
      if (event.key === PASSWORD_KEY || event.key === null) {
        const value = getSavedEditPassword();
        if (value) void unlock(value);
        else {
          request.current?.abort(); request.current = null;
          password.current = ""; setCanEdit(false); setChecking(false);
        }
      }
    };
    window.addEventListener("storage", changed);
    return () => { request.current?.abort(); window.removeEventListener("storage", changed); };
  }, [unlock]);
  return { canEdit, checking, error, unlock, lock, getPassword };
}
