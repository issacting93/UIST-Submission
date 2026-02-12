import { useState } from 'react';
import { BloomChat } from './BloomChat';
import { BloomContextManager } from './BloomContextManager';
import { HexWorkspace, WorkspaceNode } from './HexWorkspace';
import { useUnifiedContext } from '@/stores/unifiedContextStore';
import { Grid, Hexagon, Plus } from 'lucide-react';
import { DynamicGrid } from './DynamicGrid';
import { Modal } from './ui/Modal';
import { NodeCreationForm } from './forms/NodeCreationForm';
import { NodeInspector } from './panels/NodeInspector';
import { UnifiedNode } from '@/types/unified';

export default function BloomApp() {
    // State for HexWorkspace
    const { addEdge, addNode } = useUnifiedContext();
    const [hexSlots, setHexSlots] = useState<(WorkspaceNode | null)[]>([null, null, null, null, null, null]);
    const [selectedHexIndices, setSelectedHexIndices] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<'hex' | 'grid'>('hex');
    const context = useUnifiedContext();
    const { nodes } = context;
    const contextNodes = nodes ? Array.from(nodes.values()).filter(n => !n.id.startsWith('user-self')) : [];

    // State for Node Creation/Inspection
    const [isCreating, setIsCreating] = useState(false);
    const [selectedNode, setSelectedNode] = useState<UnifiedNode | null>(null);

    const handleNodeCreate = (node: UnifiedNode) => {
        addNode(node);
        setIsCreating(false);
    };

    const handleNodeFocus = (nodeId: string) => {
        if (!nodes) return;
        const node = nodes.get(nodeId);
        if (node) setSelectedNode(node);
    };

    const handleHexSlotsChange = (newSlots: (WorkspaceNode | null)[]) => {
        setHexSlots(newSlots);
    };

    const handleHexSelectionChange = (indices: number[]) => {
        setSelectedHexIndices(indices);
    };

    const handleEdgeCreate = (sourceIndex: number, targetIndex: number) => {
        // Find node IDs in those slots
        const sourceNode = hexSlots[sourceIndex];
        const targetNode = hexSlots[targetIndex];

        if (sourceNode && targetNode) {
            addEdge({
                id: `edge-${Date.now()}`,
                source: sourceNode.id,
                target: targetNode.id,
                type: 'related',
                weight: 1.0,
                bidirectional: true,
                timestamp: Date.now(),
                source_type: 'manual_input'
            });
            console.log(`Created edge between ${sourceNode.id} and ${targetNode.id}`);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans text-gray-900 relative selection:bg-bloom-purple/20">
            {/* Animated Ambient Background */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-bloom-purple/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-bloom-blue/5 blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
                <div className="absolute top-[30%] left-[30%] w-[40%] h-[40%] rounded-full bg-bloom-yellow/5 blur-[80px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
            </div>

            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 shrink-0 z-20 backdrop-blur-md bg-white/70 border-b border-white/50 sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-bloom-purple to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-bloom-purple/20 ring-1 ring-white/20">
                        B
                    </div>
                    <div className="flex flex-col">
                        <h1 className="font-bold text-lg tracking-tight leading-none text-gray-900">Bloom</h1>
                        <span className="text-xs text-gray-500 font-medium tracking-wide">ContextOS</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-bloom-purple text-white rounded-full shadow-sm hover:bg-bloom-purple/90 transition-all"
                    >
                        <Plus size={16} />
                        <span className="text-xs font-semibold">Add Node</span>
                    </button>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-full border border-gray-200/50 backdrop-blur-sm shadow-sm transition-all hover:bg-white hover:shadow-md cursor-help">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-gray-600">Active Session</span>
                    </div>
                </div>
            </header>

            {/* Main Content Grid */}
            <main className="flex-1 grid grid-cols-12 gap-0 min-h-0 z-10">

                {/* Left Panel: Context Manager (Backpack) */}
                <div className="col-span-3 border-r border-gray-200/60 flex flex-col min-h-0 bg-white/40 backdrop-blur-sm transition-all">
                    <BloomContextManager />
                </div>

                {/* Center Panel: Workspace (Hex Grid) */}
                <div className="col-span-6 relative flex flex-col items-center justify-center p-8 min-h-0 overflow-hidden">
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                        style={{
                            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />

                    <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-2xl h-full justify-center">
                        <div className="text-center space-y-2 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards">
                            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">Workspace</h2>
                            <p className="text-gray-500 font-medium">Drag context here to organize</p>
                        </div>

                        <div className="flex-1 w-full flex items-center justify-center min-h-[400px] overflow-y-auto">
                            {viewMode === 'hex' ? (
                                <div className="transform scale-125 origin-center transition-transform duration-500 hover:scale-[1.27]">
                                    <HexWorkspace
                                        slots={hexSlots}
                                        selectedIndices={selectedHexIndices}
                                        onSlotsChange={handleHexSlotsChange}
                                        onSelectionChange={handleHexSelectionChange}
                                        onEdgeCreate={handleEdgeCreate}
                                        edges={[]} // Pass active edges if needed from store
                                        mode="select"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full p-4 overflow-y-auto">
                                    <DynamicGrid
                                        nodes={contextNodes}
                                        context={context}
                                        onFocus={handleNodeFocus}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300 fill-mode-forwards z-50">
                            <div className="flex items-center gap-1 p-1 bg-white/60 rounded-full border border-gray-200/50 backdrop-blur-md shadow-sm">
                                <button
                                    onClick={() => setViewMode('hex')}
                                    className={`p-2 rounded-full transition-colors ${viewMode === 'hex' ? 'bg-bloom-purple text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                                    title="Hex View"
                                >
                                    <Hexagon size={16} />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-bloom-purple text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
                                    title="Adaptive Grid View"
                                >
                                    <Grid size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Chat or Inspector */}
                <div className="col-span-3 border-l border-gray-200/60 bg-white/60 backdrop-blur-md flex flex-col min-h-0 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.03)] z-20">
                    {selectedNode ? (
                        <NodeInspector node={selectedNode} onClose={() => setSelectedNode(null)} />
                    ) : (
                        <BloomChat />
                    )}
                </div>

            </main>

            {/* Node Creation Modal */}
            <Modal isOpen={isCreating} onClose={() => setIsCreating(false)} title="Create New Node">
                <NodeCreationForm
                    onSubmit={handleNodeCreate}
                    onCancel={() => setIsCreating(false)}
                />
            </Modal>
        </div>
    );
}
