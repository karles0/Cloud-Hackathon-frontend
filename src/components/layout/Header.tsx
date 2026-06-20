import { ShieldCheck } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-paper/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-seal" strokeWidth={1.5} />
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg tracking-tight text-paper">
              Centinela
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-ink">
              Integridad Científica
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-ink">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-valid opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-valid" />
          </span>
          En linea
        </div>
      </div>
    </header>
  );
}
