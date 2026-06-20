import { useEffect, useState } from "react";

interface IntegritySealProps {
  integrityIndex: number;
  zombieCount: number;
}

export function IntegritySeal({ integrityIndex, zombieCount }: IntegritySealProps) {
  const [mounted, setMounted] = useState(false);
  const isClean = zombieCount === 0;

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const ringColor = isClean ? "var(--color-valid)" : "var(--color-zombie)";
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (integrityIndex / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-paper/10"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={ringColor}
            strokeWidth="1.5"
            strokeDasharray={circumference}
            strokeDashoffset={mounted ? offset : circumference}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl leading-none text-paper">
            {integrityIndex.toFixed(1)}
          </span>
          <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-ink">
            Índice
          </span>
        </div>
      </div>

      <div
        className={`rounded-sm border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${
          isClean
            ? "border-valid/40 text-valid"
            : "border-zombie/40 text-zombie"
        }`}
      >
        {isClean ? "Sin citas zombis detectadas" : `${zombieCount} cita(s) zombi detectada(s)`}
      </div>
    </div>
  );
}
