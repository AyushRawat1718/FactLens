import React, { useEffect, useState } from "react";
import { Gauge, FlaskConical } from "lucide-react";
import Reveal from "../components/ui/Reveal.jsx";

// Reads real data from /model-evaluation.json at runtime — nothing
// fabricated. Run `python -m src.evaluate_classifier` in the backend and
// copy the output here. Shows an honest empty state until it exists.

const LABEL_NAMES = {
  FACTUAL_CLAIM: "Factual",
  DISPUTED_CLAIM: "Disputed",
  NOT_A_CLAIM: "Not a claim",
};

function EmptyState() {
  return (
    <Reveal className="rounded-2xl border border-line bg-surface p-8 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-ink">
        <FlaskConical size={18} className="text-muted" />
      </div>
      <h3 className="mt-4 font-serif text-[18px] font-semibold">Evaluation data not yet published</h3>
      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted">
        This section renders real numbers from the classifier's own evaluation run — nothing here
        is estimated. Run the evaluation script and publish the result to populate it.
      </p>
      <code className="mt-4 inline-block rounded-lg border border-line bg-ink px-3 py-1.5 font-mono text-[11.5px] text-muted">
        python -m src.evaluate_classifier
      </code>
    </Reveal>
  );
}

function Matrix({ labels, matrix }) {
  const rowMax = matrix.map((row) => Math.max(...row, 1));

  return (
    <div className="overflow-x-auto">
      <div className="inline-grid min-w-full grid-cols-[auto_repeat(3,1fr)] gap-1.5">
        <div />
        {labels.map((l) => (
          <div key={l} className="px-2 pb-1 text-center font-mono text-[10px] uppercase tracking-wide text-muted">
            {LABEL_NAMES[l] || l}
          </div>
        ))}

        {matrix.map((row, ri) => (
          <React.Fragment key={labels[ri]}>
            <div className="flex items-center pr-2 font-mono text-[10px] uppercase tracking-wide text-muted">
              {LABEL_NAMES[labels[ri]] || labels[ri]}
            </div>
            {row.map((value, ci) => {
              const isDiagonal = ri === ci;
              const intensity = value / rowMax[ri];
              return (
                <div
                  key={ci}
                  className="flex aspect-square min-w-[64px] items-center justify-center rounded-lg border font-mono text-[15px] font-semibold"
                  style={{
                    borderColor: isDiagonal ? "#4FD1C560" : "#1E2430",
                    backgroundColor: isDiagonal
                      ? `rgba(79,209,197,${0.12 + intensity * 0.35})`
                      : `rgba(224,100,90,${intensity * 0.28})`,
                    color: isDiagonal ? "#4FD1C5" : value > 0 ? "#F3F1EA" : "#4A5162",
                  }}
                >
                  {value}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted">Rows = actual label, columns = predicted label.</p>
    </div>
  );
}

function PerClassTable({ labels, perClass }) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      {labels.map((l) => {
        const stats = perClass[l];
        if (!stats) return null;
        return (
          <div key={l} className="rounded-xl border border-line bg-ink p-3.5">
            <div className="font-mono text-[10.5px] uppercase tracking-wide text-muted">
              {LABEL_NAMES[l] || l}
            </div>
            <div className="mt-2 flex flex-col gap-1 text-[12px]">
              <div className="flex justify-between"><span className="text-muted">Precision</span><span className="font-mono">{Math.round(stats.precision * 100)}%</span></div>
              <div className="flex justify-between"><span className="text-muted">Recall</span><span className="font-mono">{Math.round(stats.recall * 100)}%</span></div>
              <div className="flex justify-between"><span className="text-muted">F1</span><span className="font-mono">{Math.round(stats.f1 * 100)}%</span></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ModelEvaluation() {
  const [data, setData] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/model-evaluation.json")
      .then((res) => (res.ok ? res.json() : null))
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setChecked(true));
  }, []);

  return (
    <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
      <Reveal className="mb-10 text-center">
        <h2 className="font-serif text-[30px] font-semibold sm:text-[36px]">Classifier performance</h2>
        <p className="mx-auto mt-3 max-w-sm text-[14.5px] text-muted">
          Real evaluation results from the claim classifier, not an estimate.
        </p>
      </Reveal>

      {!checked ? null : !data ? (
        <EmptyState />
      ) : (
        <Reveal className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Gauge size={16} className="text-teal" />
              <span className="text-[13.5px] font-medium">Overall accuracy</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[24px] font-bold text-teal">
                {Math.round(data.accuracy * 100)}%
              </span>
              <span className="text-[11.5px] text-muted">on {data.sample_size} labeled sentences</span>
            </div>
          </div>

          <Matrix labels={data.labels} matrix={data.confusion_matrix} />

          <div className="mt-6">
            <PerClassTable labels={data.labels} perClass={data.per_class} />
          </div>

          <p className="mt-5 text-[11px] leading-relaxed text-muted">
            Early-stage evaluation on a small, hand-picked benchmark — not a claim of final
            accuracy. Numbers update whenever the classifier is retrained and re-evaluated.
          </p>
        </Reveal>
      )}
    </section>
  );
}
