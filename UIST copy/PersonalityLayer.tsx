import React from 'react';
import clsx from 'clsx';
import { ContextNode } from '@/types/unified';

interface PersonalityLayerProps {
    layerId: number;
    title: string;
    description: string;
    nodes: ContextNode[];
    color: string;
    onNodeDragStart: (e: React.DragEvent, node: ContextNode) => void;
}

export function PersonalityLayer({
    layerId,
    title,
    description,
    nodes,
    color,
    onNodeDragStart,
}: PersonalityLayerProps) {
    return (
        <div className={clsx(
            "relative p-4 rounded-xl border-2 transition-all duration-300",
            "hover:shadow-md",
            `border-${color}-100 bg-${color}-50/30`
        )}>
            {/* Layer Header */}
            <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                    <span className={clsx(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white",
                        `bg-${color}-500`
                    )}>
                        {layerId}
                    </span>
                    <h3 className={clsx("font-bold", `text-${color}-900`)}>{title}</h3>
                </div>
                <p className={clsx("text-xs", `text-${color}-700/80`)}>{description}</p>
            </div>

            {/* Nodes Grid */}
            <div className="grid grid-cols-2 gap-2">
                {nodes.map(node => (
                    <div
                        key={node.id}
                        draggable
                        onDragStart={(e) => onNodeDragStart(e, node)}
                        className={clsx(
                            "p-2 rounded-lg border bg-white cursor-grab active:cursor-grabbing",
                            "transition-all hover:-translate-y-0.5 hover:shadow-sm select-none",
                            `border-${color}-200 text-${color}-900`
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-rounded text-lg">
                                {node.data?.icon || 'psychology'}
                            </span>
                            <span className="text-sm font-medium truncate">{node.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
