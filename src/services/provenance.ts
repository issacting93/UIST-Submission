import { UnifiedNode, UnifiedEdge, ContextState } from '@/types/unified';
import { BRIDGE_TYPES } from '@/utils/graphUtils';

export interface ProvenanceStep {
    source: UnifiedNode;
    edge: UnifiedEdge;
    target: UnifiedNode;
}

export interface ProvenanceChain {
    steps: ProvenanceStep[];
    root: UnifiedNode; // The Personal layer node that anchors this chain
    confidence: number;
}

/**
 * Traces backwards from a suggested/active World node to find its roots in the Personal layer.
 * This answers: "Why is this node relevant?"
 */
export const traceProvenance = (
    state: ContextState,
    targetNodeId: string,
    maxDepth: number = 3
): ProvenanceChain[] => {
    const chains: ProvenanceChain[] = [];
    const targetNode = state.nodes.get(targetNodeId);

    if (!targetNode) return [];

    // Queue stores: currentId, currentPath, accumulatedConfidence
    const queue: { id: string; path: ProvenanceStep[]; confidence: number }[] = [
        { id: targetNodeId, path: [], confidence: 1.0 }
    ];

    const visited = new Set<string>();
    visited.add(targetNodeId);

    while (queue.length > 0) {
        const { id, path, confidence } = queue.shift()!;

        if (path.length >= maxDepth) continue;

        // Find incoming edges (reverse traverse)
        // We want to find: Personal -> Bridge -> World(target)
        // So we look for edges where edge.target === id
        const incomingEdges = Array.from(state.edges.values())
            .filter(e => e.target === id);

        for (const edge of incomingEdges) {
            const sourceNode = state.nodes.get(edge.source);
            if (!sourceNode) continue;

            // Avoid cycles in current path
            if (path.some(step => step.source.id === sourceNode.id)) continue;

            const newStep: ProvenanceStep = {
                source: sourceNode,
                edge,
                target: state.nodes.get(id)!
            };

            const newPath = [newStep, ...path]; // Prepend because we are tracing backwards
            const newConfidence = confidence * edge.weight;

            // If we hit a Personal layer node, we found a root
            if (sourceNode.layer === 'personal') {
                chains.push({
                    steps: newPath,
                    root: sourceNode,
                    confidence: newConfidence
                });
            } else {
                // Continue tracing
                queue.push({
                    id: sourceNode.id,
                    path: newPath,
                    confidence: newConfidence
                });
            }
        }
    }

    // Sort by confidence
    return chains.sort((a, b) => b.confidence - a.confidence);
};

/**
 * Formats provenance chains into a string for LLM system prompts.
 */
export const formatProvenanceForLLM = (chains: ProvenanceChain[]): string => {
    if (chains.length === 0) return "";

    return chains.map(chain => {
        const pathStr = chain.steps.map(step => {
            const bridgeInfo = BRIDGE_TYPES.has(step.edge.type) ? ` --[${step.edge.type}]--> ` : ` -> `;
            return `${step.source.label}${bridgeInfo}${step.target.label}`;
        }).join('');
        return `- ${pathStr} (Confidence: ${chain.confidence.toFixed(2)})`;
    }).join('\n');
};
