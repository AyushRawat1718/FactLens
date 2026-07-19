import React from "react";
import { motion } from "framer-motion";
import { Monitor, Server, ScanText, Brain, Search, ShieldCheck, RefreshCw, FileCheck2 } from "lucide-react";
import Reveal from "../components/ui/Reveal.jsx";

// Layered diagram (client/API/processing/verification/output) — each layer can hold multiple nodes side by side.
const layers = [
  {
    name: "Client",
    nodes: [{ label: "React Dashboard", Icon: Monitor }],
  },
  {
    name: "API",
    nodes: [{ label: "FastAPI Service", Icon: Server }],
  },
  {
    name: "Processing",
    nodes: [
      { label: "Segmentation", Icon: ScanText },
      { label: "Claim Classifier", Icon: Brain },
    ],
  },
  {
    name: "Verification",
    nodes: [
      { label: "Evidence Retrieval", Icon: Search },
      { label: "AI Verification", Icon: ShieldCheck },
      { label: "Automatic Fallback", Icon: RefreshCw },
    ],
  },
  {
    name: "Output",
    nodes: [{ label: "Report", Icon: FileCheck2 }],
  },
];

function LayerNode({ node, delay }) {
  return (
    <Reveal delay={delay} variant="scale" className="lift flex items-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-3">
      <node.Icon size={16} className="text-teal" />
      <span className="text-[13.5px] font-semibold">{node.label}</span>
    </Reveal>
  );
}

export default function Architecture() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
      <Reveal className="mb-12 text-center">
        <h2 className="font-serif text-[30px] font-semibold sm:text-[36px]">Architecture</h2>
        <p className="mx-auto mt-3 max-w-sm text-[14.5px] text-muted">
          Five layers, each with one job — a request moves straight down through all of them.
        </p>
      </Reveal>

      <div className="flex flex-col items-center">
        {layers.map((layer, li) => (
          <React.Fragment key={layer.name}>
            <div className="w-full">
              <div className="mb-2.5 text-center font-mono text-[10.5px] uppercase tracking-widest text-muted">
                {layer.name}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {layer.nodes.map((node, ni) => (
                  <LayerNode key={node.label} node={node} delay={li * 120 + ni * 60} />
                ))}
              </div>
            </div>

            {li < layers.length - 1 && (
              <div className="relative my-3 h-8 w-px bg-line">
                <motion.span
                  className="absolute -left-[3px] top-0 h-1.5 w-1.5 rounded-full bg-teal"
                  animate={{ y: ["0%", "220%"], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: li * 0.25 }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
