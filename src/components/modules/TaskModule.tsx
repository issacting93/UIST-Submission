import { ModuleProps } from '@/types/ui';

export const TaskModule: React.FC<ModuleProps> = ({ node, onFocus }) => {
    return (
        <div
            className="p-4 bg-orange-900/10 border border-orange-500/20 rounded-xl backdrop-blur-sm hover:bg-orange-900/20 transition-colors cursor-pointer"
            onClick={() => onFocus?.(node.id)}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-rounded text-orange-400">check_circle</span>
                    <span className="text-xs text-orange-400/70 uppercase">Action</span>
                </div>
                {node.relevance > 0.8 && (
                    <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-300 text-[10px] rounded uppercase font-bold tracking-wide">
                        High Priority
                    </span>
                )}
            </div>
            <h3 className="text-orange-50 font-medium mb-1 line-clamp-2">
                {node.label}
            </h3>
        </div>
    );
};
