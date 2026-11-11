import React from 'react';
import { Download } from 'lucide-react';

// Helper to trigger SVG download
const downloadSvg = (svgId: string, filename: string) => {
  const svgElement = document.getElementById(svgId);
  if (!svgElement) return;
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = svgUrl;
  downloadLink.download = `${filename}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(svgUrl);
};

export const Figure4Sigmoid: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
          Fig. 4. Sigmoid link of Eq. (3)
        </h4>
        <button
          onClick={() => downloadSvg('svg-fig-4', 'Fig_4_Sigmoid_Link')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
          title="Download SVG"
        >
          <Download className="w-3 h-3" />
          <span>SVG</span>
        </button>
      </div>

      <div className="flex justify-center p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
        <svg
          id="svg-fig-4"
          viewBox="0 0 480 260"
          className="w-full max-w-lg h-auto"
          role="img"
          aria-label="Figure 4: Sigmoid link curve mapping logit z to probability sigma(z), showing decision threshold theta equals 0.45 at z equals -0.201"
        >
          {/* Grid lines */}
          <line x1="50" y1="20" x2="50" y2="220" stroke="#94a3b8" strokeWidth="1" />
          <line x1="50" y1="220" x2="450" y2="220" stroke="#94a3b8" strokeWidth="1" />
          <line x1="250" y1="20" x2="250" y2="220" stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="1" />
          <line x1="50" y1="120" x2="450" y2="120" stroke="#cbd5e1" strokeDasharray="3,3" strokeWidth="1" />

          {/* Axes ticks & labels */}
          <text x="50" y="235" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">-6</text>
          <text x="117" y="235" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">-4</text>
          <text x="183" y="235" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">-2</text>
          <text x="250" y="235" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">0</text>
          <text x="317" y="235" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">2</text>
          <text x="383" y="235" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">4</text>
          <text x="450" y="235" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">6</text>

          <text x="40" y="223" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">0.0</text>
          <text x="40" y="173" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">0.25</text>
          <text x="40" y="123" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">0.50</text>
          <text x="40" y="73" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">0.75</text>
          <text x="40" y="25" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">1.0</text>

          {/* Sigmoid Curve */}
          <path
            d="M 50 219 C 140 218 190 205 220 160 C 235 137 265 103 280 80 C 310 35 360 22 450 21"
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
          />

          {/* Operating threshold line theta = 0.45 */}
          <line x1="50" y1="130" x2="450" y2="130" stroke="#f59e0b" strokeDasharray="4,3" strokeWidth="1.5" />
          <text x="455" y="133" className="text-[10px] fill-amber-600 font-mono font-bold">θ=0.45</text>

          {/* z ≈ -0.201 line */}
          <line x1="243.3" y1="20" x2="243.3" y2="220" stroke="#f59e0b" strokeDasharray="4,3" strokeWidth="1.5" />
          <circle cx="243.3" cy="130" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />

          {/* Operating point annotation */}
          <rect x="252" y="140" width="135" height="28" rx="4" fill="#fef3c7" stroke="#fde68a" />
          <text x="257" y="152" className="text-[9px] fill-amber-900 font-mono font-semibold">Holdout operating point</text>
          <text x="257" y="163" className="text-[9px] fill-amber-900 font-mono">z = ln(0.45/0.55) ≈ -0.201</text>

          <text x="250" y="252" textAnchor="middle" className="text-[11px] fill-slate-600 dark:fill-slate-400 font-mono">
            Logit z = wᵀx + b
          </text>
          <text x="20" y="120" textAnchor="middle" transform="rotate(-90 20,120)" className="text-[11px] fill-slate-600 dark:fill-slate-400 font-mono">
            P(At-Risk) = σ(z)
          </text>
        </svg>
      </div>

      <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
        Fig. 4. Sigmoid link of Eq. (3). A student is flagged At-Risk when σ(z) ≥ θ; the operational threshold θ = 0.45 corresponds to the logit z ≈ −0.201.
      </p>
    </div>
  );
};

export const Figure5HoldoutMetrics: React.FC = () => {
  const metrics = [
    { label: 'Recall', val: 82.38, color: '#10b981' },
    { label: 'Precision', val: 74.68, color: '#6366f1' },
    { label: 'Specificity', val: 68.75, color: '#64748b' },
    { label: 'Accuracy', val: 75.95, color: '#3b82f6' },
    { label: 'F1×100', val: 78.34, color: '#8b5cf6' },
    { label: 'FPR', val: 31.25, color: '#ef4444' },
    { label: 'FNR', val: 17.62, color: '#f87171' },
  ];

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
          Fig. 5. Holdout metrics computed from the confusion matrix
        </h4>
        <button
          onClick={() => downloadSvg('svg-fig-5', 'Fig_5_Holdout_Metrics')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
          title="Download SVG"
        >
          <Download className="w-3 h-3" />
          <span>SVG</span>
        </button>
      </div>

      <div className="flex justify-center p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
        <svg
          id="svg-fig-5"
          viewBox="0 0 520 250"
          className="w-full max-w-lg h-auto"
          role="img"
          aria-label="Figure 5: Holdout metrics computed from confusion matrix with Eqs. 4 through 10. Green: recall; red: error rates."
        >
          <line x1="60" y1="20" x2="60" y2="200" stroke="#94a3b8" strokeWidth="1" />
          <line x1="60" y1="200" x2="490" y2="200" stroke="#94a3b8" strokeWidth="1" />

          {/* Y ticks */}
          <text x="50" y="203" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">0%</text>
          <text x="50" y="153" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">25%</text>
          <text x="50" y="103" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">50%</text>
          <text x="50" y="53" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">75%</text>
          <text x="50" y="23" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">100%</text>

          <line x1="60" y1="150" x2="490" y2="150" stroke="#e2e8f0" strokeDasharray="3,3" />
          <line x1="60" y1="100" x2="490" y2="100" stroke="#e2e8f0" strokeDasharray="3,3" />
          <line x1="60" y1="50" x2="490" y2="50" stroke="#e2e8f0" strokeDasharray="3,3" />

          {/* Bars */}
          {metrics.map((m, idx) => {
            const x = 75 + idx * 58;
            const barHeight = (m.val / 100) * 180;
            const y = 200 - barHeight;
            return (
              <g key={m.label}>
                <rect x={x} y={y} width="40" height={barHeight} rx="4" fill={m.color} />
                <text x={x + 20} y={y - 5} textAnchor="middle" className="text-[10px] font-mono font-bold fill-slate-800 dark:fill-slate-100">
                  {m.val.toFixed(2)}
                </text>
                <text x={x + 20} y="216" textAnchor="middle" className="text-[9px] font-mono fill-slate-600 dark:fill-slate-300">
                  {m.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
        Fig. 5. Holdout metrics computed from the confusion matrix with Eqs. (4)–(10). Green: recall (the primary target); red: error rates.
      </p>
    </div>
  );
};

export const Figure6F1Tradeoff: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
          Fig. 6. F1 of Eq. (7) as a function of recall
        </h4>
        <button
          onClick={() => downloadSvg('svg-fig-6', 'Fig_6_F1_Recall')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
          title="Download SVG"
        >
          <Download className="w-3 h-3" />
          <span>SVG</span>
        </button>
      </div>

      <div className="flex justify-center p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
        <svg
          id="svg-fig-6"
          viewBox="0 0 480 250"
          className="w-full max-w-lg h-auto"
          role="img"
          aria-label="Figure 6: F1 of Eq. (7) as a function of recall for fixed precision values. The red point is the holdout operating point (recall 0.8238, F1 = 0.7834), which lies on the dashed curve for precision 0.7468."
        >
          <line x1="50" y1="20" x2="50" y2="200" stroke="#94a3b8" strokeWidth="1" />
          <line x1="50" y1="200" x2="450" y2="200" stroke="#94a3b8" strokeWidth="1" />

          {/* Ticks */}
          <text x="50" y="215" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">0.5</text>
          <text x="130" y="215" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">0.6</text>
          <text x="210" y="215" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">0.7</text>
          <text x="290" y="215" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">0.8</text>
          <text x="370" y="215" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">0.9</text>
          <text x="450" y="215" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">1.0</text>

          <text x="40" y="203" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">0.5</text>
          <text x="40" y="153" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">0.6</text>
          <text x="40" y="103" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">0.7</text>
          <text x="40" y="53" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">0.8</text>
          <text x="40" y="23" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">0.9</text>

          {/* Curves for fixed precision */}
          <path d="M 50 177 Q 250 155 450 137" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="455" y="137" className="text-[9px] fill-slate-500 font-mono">Prec. 0.60</text>

          <path d="M 50 148 Q 250 120 450 96" fill="none" stroke="#64748b" strokeWidth="1.5" />
          <text x="455" y="96" className="text-[9px] fill-slate-600 font-mono">Prec. 0.70</text>

          <path d="M 50 135 Q 250 102 450 78" fill="none" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4,2" />
          <text x="455" y="78" className="text-[9px] fill-indigo-600 font-mono font-bold">Prec. 0.7468</text>

          <path d="M 50 119 Q 250 82 450 55" fill="none" stroke="#0ea5e9" strokeWidth="1.5" />
          <text x="455" y="55" className="text-[9px] fill-sky-600 font-mono">Prec. 0.80</text>

          {/* Holdout point: R = 0.8238 (x=309), F1 = 0.7834 (y=88) */}
          <circle cx="309" cy="88" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
          <text x="315" y="80" className="text-[10px] fill-red-600 font-mono font-bold">holdout (0.8238, 0.7834)</text>

          <text x="250" y="238" textAnchor="middle" className="text-[11px] fill-slate-600 dark:fill-slate-400 font-mono">
            Recall
          </text>
          <text x="20" y="110" textAnchor="middle" transform="rotate(-90 20,110)" className="text-[11px] fill-slate-600 dark:fill-slate-400 font-mono">
            F1
          </text>
        </svg>
      </div>

      <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
        Fig. 6. F1 of Eq. (7) as a function of recall for fixed precision values. The red point is the holdout operating point (recall 0.8238, F1 = 0.7834), which lies on the dashed curve for precision 0.7468.
      </p>
    </div>
  );
};

export const Figure7BrierLoss: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
          Fig. 7. Per-observation Brier loss of Eq. (11)
        </h4>
        <button
          onClick={() => downloadSvg('svg-fig-7', 'Fig_7_Brier_Loss')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
          title="Download SVG"
        >
          <Download className="w-3 h-3" />
          <span>SVG</span>
        </button>
      </div>

      <div className="flex justify-center p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
        <svg
          id="svg-fig-7"
          viewBox="0 0 480 250"
          className="w-full max-w-lg h-auto"
          role="img"
          aria-label="Figure 7: Per-observation Brier loss of Eq. (11). The penalty grows quadratically with the distance between the predicted probability and the true class; the holdout mean is BS=0.1638."
        >
          <line x1="50" y1="20" x2="50" y2="200" stroke="#94a3b8" strokeWidth="1" />
          <line x1="50" y1="200" x2="450" y2="200" stroke="#94a3b8" strokeWidth="1" />

          {/* Ticks */}
          <text x="50" y="215" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">0.0</text>
          <text x="130" y="215" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">0.2</text>
          <text x="210" y="215" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">0.4</text>
          <text x="290" y="215" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">0.6</text>
          <text x="370" y="215" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">0.8</text>
          <text x="450" y="215" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">1.0</text>

          <text x="40" y="203" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">0.0</text>
          <text x="40" y="158" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">0.25</text>
          <text x="40" y="113" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">0.50</text>
          <text x="40" y="68" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">0.75</text>
          <text x="40" y="23" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">1.0</text>

          {/* Curve for y=0: (p-0)^2 = p^2 */}
          <path d="M 50 200 Q 250 200 450 20" fill="none" stroke="#10b981" strokeWidth="2.5" />
          <text x="350" y="80" className="text-[10px] fill-emerald-600 font-mono font-bold">y = 0 (Successful)</text>

          {/* Curve for y=1: (p-1)^2 = (1-p)^2 */}
          <path d="M 50 20 Q 250 200 450 200" fill="none" stroke="#ef4444" strokeWidth="2.5" />
          <text x="70" y="80" className="text-[10px] fill-red-600 font-mono font-bold">y = 1 (At-Risk)</text>

          {/* Holdout mean Brier Score line at 0.1638 */}
          <line x1="50" y1="170.5" x2="450" y2="170.5" stroke="#f59e0b" strokeDasharray="4,3" strokeWidth="1.5" />
          <text x="250" y="165" textAnchor="middle" className="text-[10px] fill-amber-700 font-mono font-bold">
            holdout mean BS=0.1638
          </text>

          <text x="250" y="238" textAnchor="middle" className="text-[11px] fill-slate-600 dark:fill-slate-400 font-mono">
            predicted probability pᵢ
          </text>
          <text x="20" y="110" textAnchor="middle" transform="rotate(-90 20,110)" className="text-[11px] fill-slate-600 dark:fill-slate-400 font-mono">
            (pᵢ - yᵢ)²
          </text>
        </svg>
      </div>

      <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
        Fig. 7. Per-observation Brier loss of Eq. (11). The penalty grows quadratically with the distance between the predicted probability and the true class; the holdout mean is BS = 0.1638.
      </p>
    </div>
  );
};

export const Figure8FeasibleRegion: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
          Fig. 8. Feasible region of the threshold rule in Eq. (12)
        </h4>
        <button
          onClick={() => downloadSvg('svg-fig-8', 'Fig_8_Feasible_Region')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
          title="Download SVG"
        >
          <Download className="w-3 h-3" />
          <span>SVG</span>
        </button>
      </div>

      <div className="flex justify-center p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
        <svg
          id="svg-fig-8"
          viewBox="0 0 480 250"
          className="w-full max-w-lg h-auto"
          role="img"
          aria-label="Figure 8: Feasible region of the threshold rule in Eq. (12): recall >= 0.82 and precision >= 0.70 (shaded). The selected operating point theta* = 0.45 lies inside it on the holdout set."
        >
          <line x1="60" y1="20" x2="60" y2="200" stroke="#94a3b8" strokeWidth="1" />
          <line x1="60" y1="200" x2="450" y2="200" stroke="#94a3b8" strokeWidth="1" />

          {/* Ticks */}
          <text x="60" y="215" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">0.6</text>
          <text x="157.5" y="215" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">0.7</text>
          <text x="255" y="215" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">0.8</text>
          <text x="274.5" y="215" textAnchor="middle" className="text-[10px] fill-emerald-600 font-mono font-bold">0.82</text>
          <text x="352.5" y="215" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">0.9</text>
          <text x="450" y="215" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">1.0</text>

          <text x="50" y="203" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">0.6</text>
          <text x="50" y="155" textAnchor="end" className="text-[10px] fill-emerald-600 font-mono font-bold">0.70</text>
          <text x="50" y="110" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">0.8</text>
          <text x="50" y="65" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">0.9</text>
          <text x="50" y="23" textAnchor="end" className="text-[10px] fill-slate-500 font-mono">1.0</text>

          {/* Feasible Region Shading: Recall in [0.82, 1.0], Precision in [0.70, 1.0] */}
          <rect x="274.5" y="20" width="175.5" height="135" fill="#dcfce7" fillOpacity="0.7" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3,3" />
          <text x="362" y="45" textAnchor="middle" className="text-[11px] fill-emerald-800 font-mono font-bold">
            feasible set of Eq. (12)
          </text>
          <text x="362" y="60" textAnchor="middle" className="text-[9px] fill-emerald-700 font-mono">
            recall ≥ 0.82 &amp; precision ≥ 0.70
          </text>

          {/* Operating Point: Recall = 0.8238, Precision = 0.7468 */}
          <circle cx="278.2" cy="134" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
          <text x="290" y="130" className="text-[10px] fill-red-700 font-mono font-bold">
            holdout, θ=0.45
          </text>
          <text x="290" y="142" className="text-[9px] fill-slate-700 font-mono">
            (0.8238, 0.7468)
          </text>

          <text x="255" y="238" textAnchor="middle" className="text-[11px] fill-slate-600 dark:fill-slate-400 font-mono">
            Recall(θ)
          </text>
          <text x="20" y="110" textAnchor="middle" transform="rotate(-90 20,110)" className="text-[11px] fill-slate-600 dark:fill-slate-400 font-mono">
            Precision(θ)
          </text>
        </svg>
      </div>

      <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
        Fig. 8. Feasible region of the threshold rule in Eq. (12): recall ≥ 0.82 and precision ≥ 0.70 (shaded). The selected operating point θ* = 0.45 lies inside it on the holdout set.
      </p>
    </div>
  );
};
