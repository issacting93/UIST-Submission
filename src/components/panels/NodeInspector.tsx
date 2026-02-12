import { useState } from 'react';
import { UnifiedNode } from '@/types/unified';
import { useUnifiedContext } from '@/stores/unifiedContextStore';
import { X, Trash2 } from 'lucide-react';

interface NodeInspectorProps {
    node: UnifiedNode | null;
    onClose: () => void;
}

const LAYERS = ['world', 'personal', 'bridge'] as const;

export const NodeInspector: React.FC<NodeInspectorProps> = ({ node, onClose }) => {
    const { updateNode, removeNode } = useUnifiedContext();
    const [label, setLabel] = useState(node?.label || '');
    const [layer, setLayer] = useState<'world' | 'personal' | 'bridge'>(node?.layer || 'personal');
    const [content, setContent] = useState(node?.data?.content || '');

    if (!node) return null;

    const handleSave = () => {
        updateNode(node.id, {
            label,
            layer,
            data: content ? { ...node.data, content } : node.data
        });
        onClose();
    };

    const handleDelete = () => {
        if (confirm(`Delete "${node.label}"?`)) {
            removeNode(node.id);
            onClose();
        }
    };

    return (
        <div className="h-full flex flex-col bg-white border-l border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Node Inspector</h3>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X size={18} className="text-gray-500" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Type Badge */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                    <div className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 inline-block">
                        {node.type}
                    </div>
                </div>

                {/* Label */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Label</label>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-purple focus:border-transparent text-sm"
                    />
                </div>

                {/* Layer */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">Layer</label>
                    <div className="flex gap-2">
                        {LAYERS.map(l => (
                            <button
                                key={l}
                                onClick={() => setLayer(l)}
                                className={`flex-1 px-2 py-1.5 rounded-lg border-2 transition-all text-xs font-medium ${layer === l
                                        ? 'border-bloom-purple bg-bloom-purple/10 text-bloom-purple'
                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                    }`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-purple focus:border-transparent resize-none text-sm"
                        placeholder="Additional details..."
                    />
                </div>

                {/* Metadata */}
                <div className="pt-2 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Relevance</span>
                        <span className="font-medium text-gray-700">{(node.relevance * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Source</span>
                        <span className="font-medium text-gray-700">{node.source}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Created</span>
                        <span className="font-medium text-gray-700">
                            {new Date(node.timestamp).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-gray-200 space-y-2">
                <button
                    onClick={handleSave}
                    className="w-full px-4 py-2 bg-bloom-purple text-white rounded-lg font-medium hover:bg-bloom-purple/90 transition-colors text-sm"
                >
                    Save Changes
                </button>
                <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                    <Trash2 size={16} />
                    Delete Node
                </button>
            </div>
        </div>
    );
};
