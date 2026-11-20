import { ArrowLeft, Table2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { SyncedTable } from "../../components/synced-table";

export default function TablesPage() {
  const requestedId = new URLSearchParams(window.location.search).get("id") ?? "notes";
  const id = /^[a-zA-Z0-9-]{1,64}$/.test(requestedId) ? requestedId : "notes";
  return <main className="min-h-screen bg-background text-foreground">
    <nav className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b px-5 py-3 sm:px-8">
      <Button variant="ghost" size="sm" asChild><a href="/"><ArrowLeft data-icon="inline-start" />旅行列表</a></Button>
      <span className="font-mono text-xs tracking-widest text-muted-foreground">TRAVEL // NOTES</span>
    </nav>
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-5 py-10 sm:px-8 sm:py-14">
      <header className="flex flex-col gap-3">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground"><Table2 className="size-4" />随手记录</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">一张表，记点事情。</h1>
        <p className="max-w-xl text-sm leading-7 text-muted-foreground">住宿、花费、待办，都可以写在这里。解锁后双击编辑，内容自动保存。</p>
      </header>
      <SyncedTable key={id} id={id} />
    </div>
  </main>;
}
