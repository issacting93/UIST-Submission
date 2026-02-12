import { useState } from 'react';
import clsx from 'clsx';

export interface WorkspaceNode {
    id: string; // Unique ID (e.g., from context)
    label: string;
    icon: string;
    type?: string; // Optional type for logic
}

export interface HexWorkspaceProps {
    slots: (WorkspaceNode | null)[];
    selectedIndices: number[]; // Controlled prop
    onSlotsChange: (newSlots: (WorkspaceNode | null)[]) => void;
    onSelectionChange: (selectedIndices: number[]) => void;
    edges?: { source: number, target: number }[]; // Explicit connections between slots
    mode?: 'select' | 'connect';
    onEdgeCreate?: (source: number, target: number) => void;
}

// 6-Node Geometry
const HEX_POSITIONS = [
    { x: 130, y: 34 },    // Top (0)
    { x: 46, y: 86 },     // Upper left (1)
    { x: 214, y: 86 },    // Upper right (2)
    { x: 46, y: 174 },    // Lower left (3)
    { x: 214, y: 174 },   // Lower right (4)
    { x: 130, y: 226 },   // Bottom (5)
];

// Default Adjacency Graph
const HEX_CONNECTIONS = [
    [0, 1], [0, 2],
    [1, 2],
    [1, 3], [2, 4],
    [3, 4],
    [3, 5], [4, 5],
];

export function HexWorkspace({ slots, selectedIndices, onSlotsChange, onSelectionChange, edges, mode = 'select', onEdgeCreate }: HexWorkspaceProps) {
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    // Interaction State
    const [isInteracting, setIsInteracting] = useState(false);
    const [startNodeIndex, setStartNodeIndex] = useState<number | null>(null);
    const [pointerPos, setPointerPos] = useState<{ x: number, y: number } | null>(null);
    const [hoverNodeIndex, setHoverNodeIndex] = useState<number | null>(null);

    // --- Helpers ---
    const getEventPos = (e: React.PointerEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const getHitIndex = (x: number, y: number, radius = 40) => {
        return HEX_POSITIONS.findIndex(p => {
            const dx = x - p.x;
            const dy = y - p.y;
            return Math.sqrt(dx * dx + dy * dy) < radius;
        });
    };

    // --- Drag & Drop (Node Placement) ---
    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        setDragOverIndex(null);
        try {
            const raw = e.dataTransfer.getData('application/json');
            console.log('[HexWorkspace] Dropped data:', raw);
            const data = JSON.parse(raw);
            if (data.id && data.label) {
                const newSlots = [...slots];
                newSlots[index] = {
                    id: data.id,
                    label: data.label,
                    icon: data.icon || '🔹',
                    type: data.type || 'Concept'
                };
                console.log('[HexWorkspace] Updating slots:', newSlots);
                onSlotsChange(newSlots);
            } else {
                console.warn('[HexWorkspace] Invalid drop data:', data);
            }
        } catch (err) {
            console.error("Drop failed", err);
        }
    };

    const removeNode = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        const newSlots = [...slots];
        newSlots[index] = null;
        onSlotsChange(newSlots);
        if (selectedIndices.includes(index)) {
            onSelectionChange(selectedIndices.filter(i => i !== index));
        }
    };

    // --- Unified Pointer Interaction (Trace & Link) ---
    const handlePointerDown = (e: React.PointerEvent) => {
        const pos = getEventPos(e);
        const hitIndex = getHitIndex(pos.x, pos.y);

        if (hitIndex !== -1 && slots[hitIndex]) {
            // Only prevent default for touch to avoid conflicts
            if (e.pointerType === 'touch') {
                e.preventDefault();
            }

            setIsInteracting(true);
            setStartNodeIndex(hitIndex);
            setPointerPos(pos);

            // Capture pointer on the container, not the target
            const container = e.currentTarget as HTMLElement;
            try {
                container.setPointerCapture(e.pointerId);
            } catch (err) {
                // Ignore capture errors
            }

            if (mode === 'select') {
                // Start selection path
                onSelectionChange([hitIndex]);
            }
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        const pos = getEventPos(e);
        const hitIndex = getHitIndex(pos.x, pos.y, 30); // Tighter hit radius for move

        // Update hover state for visual feedback
        if (mode === 'connect' && isInteracting && startNodeIndex !== null) {
            if (hitIndex !== -1 && hitIndex !== startNodeIndex && slots[hitIndex]) {
                setHoverNodeIndex(hitIndex);
            } else {
                setHoverNodeIndex(null);
            }
        }

        if (!isInteracting || startNodeIndex === null) return;

        setPointerPos(pos);

        if (hitIndex !== -1 && slots[hitIndex]) {
            if (mode === 'select') {
                // Determine if we should extend the path
                const lastIdx = selectedIndices[selectedIndices.length - 1];
                if (hitIndex !== lastIdx && !selectedIndices.includes(hitIndex)) {
                    onSelectionChange([...selectedIndices, hitIndex]);
                }
            }
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isInteracting) return;

        if (mode === 'connect' && startNodeIndex !== null) {
            const pos = getEventPos(e);
            const hitIndex = getHitIndex(pos.x, pos.y);

            // If we released on a DIFFERENT valid node, toggle edge
            if (hitIndex !== -1 && hitIndex !== startNodeIndex && slots[hitIndex]) {
                onEdgeCreate?.(startNodeIndex, hitIndex);
            }
        }

        // Reset
        setIsInteracting(false);
        setStartNodeIndex(null);
        setPointerPos(null);
        setHoverNodeIndex(null);

        // Safe pointer capture release from container
        try {
            const container = e.currentTarget as HTMLElement;
            if (container.hasPointerCapture(e.pointerId)) {
                container.releasePointerCapture(e.pointerId);
            }
        } catch (err) {
            // Ignore if pointer capture wasn't set
        }
    };

    return (
        <div
            className="relative w-[300px] h-[320px] mx-auto select-none touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            {/* SVG Lines Layer */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                {/* 1. Background Grid / Explicit Edges */}
                {(slots.some(Boolean) && edges && edges.length > 0 ? edges : HEX_CONNECTIONS).map((edge: any, i) => {
                    let source, target;
                    if (Array.isArray(edge)) {
                        [source, target] = edge;
                    } else {
                        source = edge.source;
                        target = edge.target;
                    }

                    if (source === undefined || target === undefined || !HEX_POSITIONS[source] || !HEX_POSITIONS[target]) return null;

                    return (
                        <line
                            key={`bg-${i}`}
                            x1={HEX_POSITIONS[source]?.x ?? 0}
                            y1={HEX_POSITIONS[source]?.y ?? 0}
                            x2={HEX_POSITIONS[target]?.x ?? 0}
                            y2={HEX_POSITIONS[target]?.y ?? 0}
                            stroke="#e5e5e5"
                            strokeWidth={2}
                            strokeLinecap="round"
                        />
                    );
                })}

                {/* 2. Active Selection Path (Yellow) */}
                {selectedIndices.length > 1 && (
                    <polyline
                        points={selectedIndices.map(i => {
                            const p = HEX_POSITIONS[i];
                            return p ? `${p.x},${p.y}` : '0,0';
                        }).join(' ')}
                        fill="none"
                        stroke="#f5c542"
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                )}

                {/* 3. Dragging Line Indicator */}
                {isInteracting && pointerPos && startNodeIndex !== null && HEX_POSITIONS[startNodeIndex] && (
                    <>
                        <line
                            x1={HEX_POSITIONS[startNodeIndex].x}
                            y1={HEX_POSITIONS[startNodeIndex].y}
                            x2={pointerPos.x}
                            y2={pointerPos.y}
                            stroke="#f5c542"
                            strokeWidth={mode === 'connect' ? 3 : 4}
                            strokeLinecap="round"
                            strokeDasharray={mode === 'connect' ? "8 4" : undefined}
                            opacity={0.7}
                        />
                        {/* Arrow indicator at pointer position in connect mode */}
                        {mode === 'connect' && (
                            <circle
                                cx={pointerPos.x}
                                cy={pointerPos.y}
                                r="4"
                                fill="#f5c542"
                                opacity={0.7}
                            />
                        )}
                    </>
                )}
            </svg>

            {/* Nodes Layer */}
            {HEX_POSITIONS.map((pos, i) => {
                const node = slots[i];
                const isSelected = selectedIndices.includes(i);
                const isDragOver = dragOverIndex === i;
                const isLast = selectedIndices[selectedIndices.length - 1] === i;
                const isStartNode = isInteracting && startNodeIndex === i && mode === 'connect';
                const isHoverTarget = hoverNodeIndex === i;

                return (
                    <div
                        key={i}
                        className={clsx(
                            "absolute bloom-node -ml-10 -mt-10 z-10 group transition-all duration-200",
                            // Empty State
                            !node && "bloom-node-empty border-dashed border-2 border-gray-200 bg-white/50 hover:border-bloom-purple/50",

                            // Drag Over State
                            !node && isDragOver && "border-bloom-purple bg-purple-50 scale-110 shadow-[0_0_15px_rgba(147,51,234,0.3)] animate-pulse border-solid",

                            // Filled State
                            node && !isSelected && !isStartNode && !isHoverTarget && "bloom-node-filled shadow-sm hover:shadow-md",

                            // Selected State
                            node && isSelected && !isLast && "text-white ring-2 ring-[#f5c542] ring-offset-2 scale-110 z-20",
                            node && isSelected && !isLast && "bg-[#1a1a1a]",
                            node && isLast && "bloom-node-selected shadow-lg scale-105 z-20",

                            // Interaction States
                            isStartNode && "ring-2 ring-[#f5c542] ring-offset-2 scale-110 shadow-lg z-20",
                            isHoverTarget && "ring-2 ring-[#f5c542] ring-offset-2 scale-105 shadow-lg z-20"
                        )}
                        style={{ left: pos.x, top: pos.y }}
                        onDragOver={(e) => handleDragOver(e, i)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, i)}
                    >
                        {node ? (
                            <>
                                <span className="material-symbols-rounded text-2xl">{node.icon}</span>
                                <span className={clsx(
                                    "text-[10px] font-semibold uppercase tracking-wide truncate max-w-[60px]",
                                    isLast ? "text-bloom-black" : ""
                                )}>
                                    {node.label}
                                </span>
                                <button
                                    onClick={(e) => removeNode(e, i)}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-white border border-[#e5e5e5] rounded-full flex items-center justify-center text-[#888888] hover:text-[#e85a3c] hover:border-[#e85a3c] opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)' }}
                                >
                                    <span className="material-symbols-rounded text-[14px]">close</span>
                                </button>
                            </>
                        ) : (
                            <span className="material-symbols-rounded text-2xl font-light">add</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
