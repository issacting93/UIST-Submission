import { ModuleProps } from '@/types/ui';


export const TextModule: React.FC<ModuleProps> = ({ node, onFocus }) => {
    return (
        <div
            className="p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => onFocus?.(node.id)}
        >
            <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-rounded text-purple-400">
                    {node.source === 'user_created' ? 'edit_note' : 'chat'}
                </span>
                <span className="text-xs text-white/50 uppercase tracking-wider">{node.type}</span>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
                {node.label}
            </p>
            {node.data?.content && (
                <p className="mt-2 text-white/70 text-xs italic">
                    {node.data.content}
                </p>
            )}
        </div>
    );
};
