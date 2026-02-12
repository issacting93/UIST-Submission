import { UnifiedNode, ContextState } from './unified';

export interface ModuleProps {
    node: UnifiedNode;
    context: ContextState;
    onFocus?: (nodeId: string) => void;
    onDismiss?: (nodeId: string) => void;
}

export interface ModuleDefinition {
    id: string;
    name: string;
    description: string;
    match: (node: UnifiedNode) => boolean;
    component: React.FC<ModuleProps>;
    colSpan?: (node: UnifiedNode) => number; // 1-4, default 1
    rowSpan?: (node: UnifiedNode) => number; // 1-4, default 1
    priority?: number; // Higher wins
}
