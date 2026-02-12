import { ModuleProps } from '@/types/ui';

export const LocationModule: React.FC<ModuleProps> = ({ node, onFocus }) => {
    return (
        <div
            className="p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-xl backdrop-blur-sm hover:bg-emerald-900/30 transition-colors cursor-pointer group"
            onClick={() => onFocus?.(node.id)}
        >
            <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-rounded text-emerald-400 group-hover:scale-110 transition-transform">
                    location_on
                </span>
                <span className="text-xs text-emerald-400/70 uppercase tracking-wider">Location</span>
            </div>
            <h3 className="text-emerald-100 font-medium truncate">
                {node.label}
            </h3>
            {node.data?.accuracy && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400/50">
                    <span className="material-symbols-rounded text-[12px]">gps_fixed</span>
                    <span>Accuracy: {node.data.accuracy}m</span>
                </div>
            )}
        </div>
    );
};
