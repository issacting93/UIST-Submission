import { useState } from 'react';
import clsx from 'clsx';
import { SAMPLE_PROVENANCE } from './UISTConfig';

const BRIDGE_COLORS: Record<string, string> = {
  CONSTRUCTED: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  CONNECTED_TO: 'text-blue-600 bg-blue-50 border-blue-200',
  USES_IN_CONTEXT: 'text-purple-600 bg-purple-50 border-purple-200',
  PREFERS_OVER: 'text-amber-600 bg-amber-50 border-amber-200',
  EXPANDS_TO: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  AVOIDS: 'text-red-600 bg-red-50 border-red-200',
};

const BRIDGE_ICONS: Record<string, string> = {
  CONSTRUCTED: 'pan_tool',
  CONNECTED_TO: 'link',
  USES_IN_CONTEXT: 'hub',
  PREFERS_OVER: 'swap_horiz',
  EXPANDS_TO: 'unfold_more',
  AVOIDS: 'block',
};

export function ProvenancePanel() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const { script, traces } = SAMPLE_PROVENANCE;

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-rounded text-purple-600 text-xl">account_tree</span>
          <h2 className="text-xl font-bold text-gray-900">Suggestion Provenance</h2>
        </div>
        <p className="text-sm text-gray-500">
          Bridge-traced explanation for AI-generated script. Every word is accountable.
        </p>
      </div>

      {/* Generated Script */}
      <div className="p-6">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          Generated Script
        </div>
        <div className="bg-white border-2 border-purple-200 rounded-xl p-5 shadow-sm">
          <p className="text-lg font-medium text-gray-900 leading-relaxed">
            &ldquo;{script}&rdquo;
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <span className="material-symbols-rounded text-sm">auto_awesome</span>
            PKG-guided generation &middot; {traces.length} bridge traces
          </div>
        </div>
      </div>

      {/* Provenance Chain */}
      <div className="px-6 pb-6 flex-1">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
          Provenance Chain
        </div>

        <div className="space-y-1">
          {traces.map((trace, idx) => {
            const isLast = idx === traces.length - 1;
            const isExpanded = expandedIdx === idx;
            const colors = BRIDGE_COLORS[trace.bridgeType] || 'text-gray-600 bg-gray-50 border-gray-200';
            const icon = BRIDGE_ICONS[trace.bridgeType] || 'help';

            return (
              <div key={idx} className="flex gap-3">
                {/* Tree line */}
                <div className="flex flex-col items-center w-6 shrink-0">
                  <div className={clsx(
                    'w-3 h-3 rounded-full border-2 mt-3',
                    colors
                  )} />
                  {!isLast && <div className="w-0.5 flex-1 bg-gray-200" />}
                </div>

                {/* Trace card */}
                <button
                  onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                  className={clsx(
                    'flex-1 text-left rounded-lg border p-3 mb-1 transition-all',
                    isExpanded ? 'shadow-md ring-2 ring-purple-200' : 'hover:shadow-sm',
                    'bg-white border-gray-200'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={clsx('material-symbols-rounded text-base', colors.split(' ')[0])}>
                        {icon}
                      </span>
                      <code className="text-sm font-bold text-gray-900">&ldquo;{trace.word}&rdquo;</code>
                    </div>
                    <span className={clsx(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                      colors
                    )}>
                      {trace.bridgeType}
                    </span>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Source</span>
                        <span className="font-medium text-gray-800">{trace.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Confidence</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full"
                              style={{ width: `${trace.confidence * 100}%` }}
                            />
                          </div>
                          <span className="font-mono text-gray-700">{trace.confidence.toFixed(2)}</span>
                        </div>
                      </div>
                      {trace.bridgeId && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Bridge ID</span>
                          <code className="font-mono text-purple-600">{trace.bridgeId}</code>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Annotation footer */}
      <div className="p-4 bg-purple-50 border-t border-purple-100 text-xs text-purple-700">
        <span className="font-bold">PKG Explainability:</span> Every AI suggestion traces back through
        typed bridges to user-constructed context. No black boxes &mdash; full provenance from gesture to generation.
      </div>
    </div>
  );
}
