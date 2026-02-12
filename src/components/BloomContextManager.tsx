import React from 'react';
import { useUnifiedContext } from '@/stores/unifiedContextStore';
import { Trash2, Box, Database } from 'lucide-react';
import { ContextNode } from '@/types/unified';
import { seedDemoData, seedAdaptiveScenario } from '@/utils/demoData';

export function BloomContextManager() {
    const { nodes, removeNode, addNode } = useUnifiedContext();
    const contextNodes = Array.from(nodes.values()).filter(n => !n.id.startsWith('user-self')); // Hide self node for now

    const handleSeed = () => {
        seedDemoData(addNode);
    };

    const getSectionForType = (type: string) => {
        const t = type.toLowerCase();
        if (['need', 'urgent'].includes(t)) return 'needs';
        if (['feeling', 'emotion', 'state'].includes(t)) return 'feelings';
        if (['action', 'task', 'todo'].includes(t)) return 'actions';
        if (['identity', 'role', 'value'].includes(t)) return 'identity';
        if (['medical', 'symptom'].includes(t)) return 'health';
        return 'general';
    };

    const groupedNodes = contextNodes.reduce((acc, node) => {
        const section = getSectionForType(node.type);
        if (!acc[section]) acc[section] = [];
        acc[section].push(node);
        return acc;
    }, {} as Record<string, typeof contextNodes>);

    const handleDragStart = (e: React.DragEvent, node: ContextNode) => {
        // Map type to Material Symbol for HexWorkspace
        let matIcon = 'circle';
        switch (node.type.toLowerCase()) {
            case 'concept': matIcon = 'lightbulb'; break;
            case 'action': matIcon = 'bolt'; break;
            case 'feeling': matIcon = 'favorite'; break;
            case 'location': matIcon = 'location_on'; break;
            case 'time': matIcon = 'schedule'; break;
            case 'note': matIcon = 'description'; break;
            case 'value': matIcon = 'diamond'; break;
            case 'need': matIcon = 'water_drop'; break;
            default: matIcon = 'widgets';
        }

        e.dataTransfer.setData('application/json', JSON.stringify({
            id: node.id,
            label: node.label,
            type: node.type,
            icon: matIcon
        }));
        e.dataTransfer.effectAllowed = 'copy';
    };

    const renderPill = (node: ContextNode, colorClass: string, iconStr: string) => (
        <div
            key={node.id}
            draggable
            onDragStart={(e) => handleDragStart(e, node)}
            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-grab active:cursor-grabbing hover:shadow-md ${colorClass}`}
        >
            <span className="material-symbols-rounded text-[16px]">{iconStr}</span>
            <span>{node.label}</span>

            {/* Delete Button (visible on hover) */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    removeNode(node.id);
                }}
                className="ml-1 p-0.5 rounded-full hover:bg-black/10 text-current opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove"
            >
                <Trash2 size={12} />
            </button>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white/50 backdrop-blur-sm rounded-xl shadow-sm border border-white/60 overflow-hidden">
            <div className="p-4 border-b border-gray-200/50 flex items-center justify-between bg-white/40">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-bloom-orange/10 rounded-lg text-bloom-orange">
                        <Box size={18} />
                    </div>
                    <h2 className="font-semibold text-gray-800 text-sm">Backpack</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSeed}
                        className="p-1.5 text-xs font-medium text-bloom-purple bg-purple-50 hover:bg-purple-100 rounded-md transition-colors flex items-center gap-1"
                        title="Load Demo Data"
                    >
                        <Database size={12} />
                        <span>Seed</span>
                    </button>
                    <button
                        onClick={() => seedAdaptiveScenario(addNode)}
                        className="p-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors flex items-center gap-1"
                        title="Load Adaptive Test Data"
                    >
                        <span className="material-symbols-rounded text-[12px]">science</span>
                        <span>Test</span>
                    </button>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {contextNodes.length}
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {contextNodes.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3 opacity-60">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <Box size={24} className="text-gray-300" />
                        </div>
                        <p className="text-xs font-medium">Your backpack is empty</p>
                    </div>
                )}

                {/* Identity & Values */}
                {groupedNodes.identity && (
                    <section>
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 pl-1">Identity</h3>
                        <div className="flex flex-wrap gap-2">
                            {groupedNodes.identity.map(n => renderPill(n, 'bg-gray-100/80 border-gray-200 text-gray-700 hover:border-gray-300', 'badge'))}
                        </div>
                    </section>
                )}

                {/* Needs & Urgent */}
                {groupedNodes.needs && (
                    <section>
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-bloom-orange mb-2 pl-1">Needs</h3>
                        <div className="flex flex-wrap gap-2">
                            {groupedNodes.needs.map(n => renderPill(n, 'bg-orange-50/80 border-orange-100 text-orange-700 hover:border-orange-200', 'emergency'))}
                        </div>
                    </section>
                )}

                {/* Feelings */}
                {groupedNodes.feelings && (
                    <section>
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-yellow-600 mb-2 pl-1">Feelings</h3>
                        <div className="flex flex-wrap gap-2">
                            {groupedNodes.feelings.map(n => renderPill(n, 'bg-yellow-50/80 border-yellow-100 text-yellow-800 hover:border-yellow-200', 'mood'))}
                        </div>
                    </section>
                )}

                {/* Actions */}
                {groupedNodes.actions && (
                    <section>
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-2 pl-1">Actions</h3>
                        <div className="flex flex-wrap gap-2">
                            {groupedNodes.actions.map(n => renderPill(n, 'bg-blue-50/80 border-blue-100 text-blue-700 hover:border-blue-200', 'bolt'))}
                        </div>
                    </section>
                )}

                {/* General / Concepts */}
                {(groupedNodes.general || groupedNodes.health) && (
                    <section>
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 pl-1">General</h3>
                        <div className="flex flex-wrap gap-2">
                            {groupedNodes.health?.map(n => renderPill(n, 'bg-red-50/80 border-red-100 text-red-700 hover:border-red-200', 'medical_services'))}
                            {groupedNodes.general?.map(n => renderPill(n, 'bg-white border-gray-200 text-gray-600 hover:border-gray-300', 'sell'))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
