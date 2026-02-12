import { UnifiedNode, ContextState } from '@/types/unified';
import { resolveModule } from '@/systems/ModuleRegistry';

interface DynamicGridProps {
    nodes: UnifiedNode[];
    context: ContextState;
    onFocus?: (nodeId: string) => void;
}

export const DynamicGrid: React.FC<DynamicGridProps> = ({ nodes, context, onFocus }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-min">
            {nodes.map(node => {
                const moduleDef = resolveModule(node);
                const Component = moduleDef.component;
                const colSpan = moduleDef.colSpan ? moduleDef.colSpan(node) : 1;

                return (
                    <div
                        key={node.id}
                        className={`col-span-${colSpan} relative group`}
                    >
                        <Component
                            node={node}
                            context={context}
                            onFocus={onFocus}
                        />
                    </div>
                );
            })}
        </div>
    );
};
