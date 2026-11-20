import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { useSyncedDocument } from "../src/hooks/use-synced-document";
import { useEditAccess } from "../src/hooks/use-edit-access";
import { createDocumentTransport, isRecord } from "../src/lib/synced-document";
import "../src/styles.css";

const initialValue = { note: "" };
const validate = (value: unknown): value is typeof initialValue => isRecord(value) && typeof value.note === "string";

// This deliberately imports no table code: it exercises the same hook with an unrelated JSON shape.
function Notes() {
  const access = useEditAccess();
  const [password, setPassword] = useState("");
  const transport = useMemo(() => createDocumentTransport(validate, access.getPassword), [access.getPassword]);
  const document = useSyncedDocument({ id: "test:plain-note", initialValue, validate, transport, canEdit: access.canEdit, pollInterval: 1000 });
  return <main className="mx-auto flex max-w-xl flex-col gap-5 p-8">
    <h1>通用同步 Hook 验收：普通备忘</h1>
    <p>用 npm run dev:tables 启动；默认本地密码 trips。开两个页面检查同步。</p>
    {!access.canEdit && <form onSubmit={event => { event.preventDefault(); void access.unlock(password); }}>
      <label>密码<input aria-label="密码" type="password" value={password} onChange={event => setPassword(event.target.value)} /></label>
      <button>解锁</button>
    </form>}
    <label>备忘<input className="w-full border p-3" value={document.data.note} disabled={!access.canEdit || !document.ready}
      onChange={event => document.update({ note: event.target.value })} /></label>
    <p role="status">{document.status}</p>
    {(access.error || document.error) && <p role="alert">{access.error || document.error}</p>}
  </main>;
}
createRoot(document.getElementById("root")!).render(<StrictMode><Notes /></StrictMode>);
