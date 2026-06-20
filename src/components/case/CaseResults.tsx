import { RotateCcw } from "lucide-react";
import type { CaseFile, ManuscriptResultsResponse } from "../../types/manuscript";
import { IntegritySeal } from "../results/IntegritySeal";
import { ResultsList } from "../results/ResultsList";

interface CaseResultsProps {
  caseFile: CaseFile;
  results: ManuscriptResultsResponse;
  onReset: () => void;
}

export function CaseResults({ caseFile, results, onReset }: CaseResultsProps) {
  return (
    <div className="space-y-8">
      <div className="rounded-sm border border-paper/12 bg-paper/[0.02] px-8 py-10">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-seal">
              Expediente cerrado
            </p>
            <h3 className="mt-1.5 font-display text-xl text-paper">{caseFile.fileName}</h3>
            <p className="mt-2 text-sm text-muted-ink">
              {results.totalEvaluated} referencias evaluadas
              {caseFile.topic && <> · clasificado como <span className="text-paper/80">{caseFile.topic}</span></>}
            </p>
          </div>

          <IntegritySeal
            integrityIndex={caseFile.globalIntegrityIndex ?? 0}
            zombieCount={results.zombieCount}
          />
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-ink">
          Bibliografía auditada
        </h4>
        <ResultsList results={results.results} />
      </div>

      <button
        onClick={onReset}
        className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-ink transition-colors hover:text-paper"
      >
        <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
        Abrir otro expediente
      </button>
    </div>
  );
}
