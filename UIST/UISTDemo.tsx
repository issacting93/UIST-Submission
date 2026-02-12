import { useState, useEffect, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import { contextEngine } from '@/engine/ContextGraph';
import { ContextNode } from '@/types/unified';
import { ContextCloud } from '@/components/bloom/ContextCloud';
import { WorkspaceNode } from '@/components/bloom/HexWorkspace';
import { ContextWorkspacePanel } from '@/components/bloom/ContextWorkspacePanel';
import { useEdgeLogic } from '@/apps/Demo/hooks/useEdgeLogic';
import { AdaptiveInterface } from '@/apps/CII/AdaptiveInterface';
import { StepIndicator } from './StepIndicator';
import { ProvenancePanel } from './ProvenancePanel';
import { UIST_SCENARIO_NODES, UIST_HUB_KEYWORDS, createUISTNode } from './UISTConfig';

export default function UISTDemo() {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeNodes, setActiveNodes] = useState<ContextNode[]>([]);

  // Hex workspace state
  const [slots, setSlots] = useState<(WorkspaceNode | null)[]>(new Array(6).fill(null));
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  // Edge logic
  const {
    isLinkMode,
    setIsLinkMode,
    toggleEdge,
    calculateEdges,
  } = useEdgeLogic(slots, selectedIndices, activeNodes, UIST_HUB_KEYWORDS);

  // Subscribe to context engine
  useEffect(() => {
    const unsubscribe = contextEngine.subscribe((nodes) => {
      setActiveNodes(nodes);
    });
    return () => unsubscribe();
  }, []);

  // Seed UIST medical scenario nodes
  useEffect(() => {
    const seedNodes = async () => {
      await new Promise(r => setTimeout(r, 300));
      UIST_SCENARIO_NODES.forEach((node) => {
        contextEngine.ingest({
          type: 'MANUAL',
          payload: { node: createUISTNode(node) },
          timestamp: Date.now(),
        });
      });
    };
    seedNodes();
  }, []);

  const handleEdgeCreate = useCallback((source: number, target: number) => {
    toggleEdge(source, target);
  }, [toggleEdge]);

  const { visualEdges } = useMemo(() => calculateEdges(), [calculateEdges]);

  // Active context for adaptive UI (nodes in workspace)
  const workspaceContextNodes = useMemo(() => {
    return slots.filter(Boolean).map(slot => ({
      id: slot!.id,
      label: slot!.label,
      type: 'Concept' as const,
      relevance: 1,
      data: {},
      timestamp: Date.now(),
    }));
  }, [slots]);

  const canContinue = currentStep === 1
    ? slots.filter(Boolean).length >= 2
    : true;

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} onStepClick={setCurrentStep} />

      {/* Phase Content */}
      <div className="flex-1 overflow-hidden relative">
        {/* ============ PHASE 1: Context Construction ============ */}
        {currentStep === 1 && (
          <div className="h-full flex flex-col md:flex-row overflow-hidden">
            {/* Annotation banner */}
            <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
              <div className="mx-auto w-fit mt-2 px-4 py-1.5 bg-amber-400/90 text-amber-950 text-xs font-bold rounded-full shadow-lg backdrop-blur">
                Phase 1: The user constructs context gesturally via hex workspace
              </div>
            </div>

            {/* Workspace */}
            <div className="w-full md:w-[480px] flex flex-col border-r border-gray-200 bg-white">
              <ContextWorkspacePanel
                className="flex-1 md:flex-none md:h-[360px] border-b border-gray-200"
                slots={slots}
                selectedIndices={selectedIndices}
                onSlotsChange={setSlots}
                onSelectionChange={setSelectedIndices}
                edges={visualEdges}
                isLinkMode={isLinkMode}
                onToggleLinkMode={() => setIsLinkMode(!isLinkMode)}
                onEdgeCreate={handleEdgeCreate}
              />
              {/* Inventory */}
              <div className="flex-1 flex flex-col min-h-0 bg-white">
                <div className="p-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Medical Context Nodes &middot; Drag to Hex
                </div>
                <div className="flex-1 overflow-hidden relative">
                  <ContextCloud nodes={activeNodes} />
                </div>
              </div>
            </div>

            {/* Preview / instructions */}
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
              <div className="max-w-md text-center">
                <span className="material-symbols-rounded text-6xl text-amber-400 mb-4 block">gesture</span>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Gestural Context Mapping</h3>
                <p className="text-gray-500 mb-2">
                  Drag medical scenario nodes onto the hex workspace. Trace paths between them to establish semantic connections.
                </p>
                <p className="text-sm text-gray-400">
                  Try: <strong>Child</strong> &rarr; <strong>Pain</strong> &rarr; <strong>Doctor</strong>
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!canContinue}
                    className={clsx(
                      'px-6 py-3 rounded-xl font-bold text-sm transition-all',
                      canContinue
                        ? 'bg-amber-400 text-amber-950 hover:bg-amber-500 shadow-lg shadow-amber-200/50'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    )}
                  >
                    Continue to Adaptive Interface &rarr;
                  </button>
                  {!canContinue && (
                    <p className="mt-2 text-xs text-gray-400">Place at least 2 nodes to continue</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ PHASE 2: Adaptive Interface ============ */}
        {currentStep === 2 && (
          <div className="h-full flex flex-col md:flex-row overflow-hidden">
            {/* Annotation banner */}
            <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
              <div className="mx-auto w-fit mt-2 px-4 py-1.5 bg-blue-500/90 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur">
                Phase 2: Context signals drive module resolution and UI composition
              </div>
            </div>

            {/* Mini workspace (left) */}
            <div className="w-full md:w-[280px] flex flex-col border-r border-gray-200 bg-white shrink-0">
              <div className="p-2 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Active Context ({workspaceContextNodes.length} nodes)
              </div>
              <div className="flex-1 overflow-hidden">
                <ContextWorkspacePanel
                  className="h-full scale-75 origin-top"
                  slots={slots}
                  selectedIndices={selectedIndices}
                  onSlotsChange={setSlots}
                  onSelectionChange={setSelectedIndices}
                  edges={visualEdges}
                  isLinkMode={isLinkMode}
                  onToggleLinkMode={() => setIsLinkMode(!isLinkMode)}
                  onEdgeCreate={handleEdgeCreate}
                />
              </div>

              {/* Pipeline annotation */}
              <div className="p-3 bg-gray-50 border-t border-gray-100 space-y-1.5">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Resolution Pipeline</div>
                {['Signal', 'Context Graph', 'Module Resolution', 'Rendered UI'].map((step, i) => (
                  <div key={step} className="flex items-center gap-2 text-xs">
                    <span className={clsx(
                      'w-4 h-4 rounded flex items-center justify-center text-[9px] font-bold',
                      'bg-blue-100 text-blue-700'
                    )}>{i + 1}</span>
                    <span className="text-gray-600">{step}</span>
                    {i < 3 && <span className="text-gray-300 ml-auto">&darr;</span>}
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-gray-100">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="w-full px-4 py-2.5 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors"
                >
                  Continue to Explainability &rarr;
                </button>
              </div>
            </div>

            {/* Adaptive Interface (right) */}
            <div className="flex-1 relative overflow-hidden">
              <AdaptiveInterface activeNodes={workspaceContextNodes} />
            </div>
          </div>
        )}

        {/* ============ PHASE 3: Explainability ============ */}
        {currentStep === 3 && (
          <div className="h-full flex flex-col md:flex-row overflow-hidden">
            {/* Annotation banner */}
            <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
              <div className="mx-auto w-fit mt-2 px-4 py-1.5 bg-purple-600/90 text-white text-xs font-bold rounded-full shadow-lg backdrop-blur">
                Phase 3: Every AI suggestion traces back through typed bridges to user context
              </div>
            </div>

            {/* Mini workspace (left) */}
            <div className="hidden md:flex w-[240px] flex-col border-r border-gray-200 bg-white shrink-0">
              <div className="p-2 bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Source Context
              </div>
              <div className="flex-1 overflow-hidden">
                <ContextWorkspacePanel
                  className="h-full scale-[0.65] origin-top"
                  slots={slots}
                  selectedIndices={selectedIndices}
                  onSlotsChange={setSlots}
                  onSelectionChange={setSelectedIndices}
                  edges={visualEdges}
                  isLinkMode={isLinkMode}
                  onToggleLinkMode={() => setIsLinkMode(!isLinkMode)}
                  onEdgeCreate={handleEdgeCreate}
                />
              </div>

              {/* Context summary */}
              <div className="p-3 border-t border-gray-100">
                <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Workspace Nodes</div>
                <div className="space-y-1">
                  {slots.filter(Boolean).map(slot => (
                    <div key={slot!.id} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="material-symbols-rounded text-sm text-purple-500">{slot!.icon || 'circle'}</span>
                      {slot!.label}
                    </div>
                  ))}
                  {slots.filter(Boolean).length === 0 && (
                    <p className="text-xs text-gray-400 italic">No nodes placed</p>
                  )}
                </div>
              </div>
            </div>

            {/* Provenance Panel (right) */}
            <div className="flex-1 overflow-hidden">
              <ProvenancePanel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
