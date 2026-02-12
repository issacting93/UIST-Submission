import { useState } from 'react';
import { UnifiedNode } from '@/types/unified';
import { nanoid } from 'nanoid';

interface NodeCreationFormProps {
    onSubmit: (node: UnifiedNode) => void;
    onCancel: () => void;
}

const NODE_TYPES = [
    'Concept', 'Action', 'Task', 'Note', 'Thought', 'Location',
    'Identity', 'Value', 'Need', 'Feeling', 'Project', 'Goal'
];

const LAYERS = ['world', 'personal', 'bridge'] as const;

export const NodeCreationForm: React.FC<NodeCreationFormProps> = ({ onSubmit, onCancel }) => {
    const [label, setLabel] = useState('');
    const [type, setType] = useState('Concept');
    const [layer, setLayer] = useState<'world' | 'personal' | 'bridge'>('personal');
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newNode: UnifiedNode = {
            id: `user-${nanoid()}`,
            type,
            label,
            relevance: 1.0,
            timestamp: Date.now(),
            layer,
            source: 'manual_input',
            data: content ? { content } : undefined
        };

        onSubmit(newNode);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Label */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label *
                </label>
                <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="e.g., Morning Workout"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-purple focus:border-transparent"
                    required
                />
            </div>

            {/* Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                </label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-purple focus:border-transparent"
                >
                    {NODE_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>

            {/* Layer */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Layer *
                </label>
                <div className="flex gap-2">
                    {LAYERS.map(l => (
                        <button
                            key={l}
                            type="button"
                            onClick={() => setLayer(l)}
                            className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all ${layer === l
                                    ? 'border-bloom-purple bg-bloom-purple/10 text-bloom-purple font-medium'
                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    World = Facts | Personal = Preferences | Bridge = Connections
                </p>
            </div>

            {/* Content */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Optional details..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bloom-purple focus:border-transparent resize-none"
                />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!label.trim()}
                    className="flex-1 px-4 py-2 bg-bloom-purple text-white rounded-lg font-medium hover:bg-bloom-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Create Node
                </button>
            </div>
        </form>
    );
};
