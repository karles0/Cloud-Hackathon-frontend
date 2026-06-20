import { useState } from "react";
import { ChevronDown, Skull, CheckCircle2 } from "lucide-react";
import type { EvaluationResult } from "../../types/manuscript";

interface ResultsListProps {
  results: EvaluationResult[];
}

export function ResultsList({ results }: ResultsListProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const sorted = [...results].sort((a, b) => Number(b.isZombie) - Number(a.isZombie));

  return (
    <div className="divide-y divide-paper/10 rounded-sm border border-paper/12">
      {sorted.map((result) => {
        const isOpen = openId === result.referenceId;
        return (
          <div key={result.referenceId} className="bg-paper/[0.015]">
            <button
              onClick={() => setOpenId(isOpen ? null : result.referenceId)}
              className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-paper/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-seal"
            >
              <span className="mt-0.5 shrink-0">
                {result.isZombie ? (
                  <Skull className="h-4 w-4 text-zombie" strokeWidth={1.5} />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-valid" strokeWidth={1.5} />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-mono text-sm leading-relaxed text-paper/90">
                  {result.citationText}
                </span>
              </span>

              <ChevronDown
                className={`mt-0.5 h-4 w-4 shrink-0 text-muted-ink transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
                strokeWidth={1.5}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pl-13">
                <div
                  className={`rounded-sm border-l-2 px-4 py-3 text-sm leading-relaxed ${
                    result.isZombie
                      ? "border-zombie/60 bg-zombie-bg/40 text-paper/80"
                      : "border-valid/60 bg-valid-bg/40 text-paper/80"
                  }`}
                >
                  {result.analysisContext}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
