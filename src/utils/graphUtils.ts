import { UnifiedNode, EdgeType } from '@/types/unified';

export const BRIDGE_TYPES: Set<EdgeType> = new Set([
    'PREFERS_OVER',
    'MEANS_TO_ME',
    'AVOIDS',
    'ASSOCIATES_WITH',
    'USES_IN_CONTEXT',
    'WORKS_WITH_PARTNER',
    'EXPANDS_TO',
    'TRIGGERS',
    'CONTRADICTS'
]);

/**
 * Validates if an edge connection is allowed based on Epistemic Layering rules.
 * Rule: Connections between 'world' and 'personal' layers MUST be Bridge types.
 */
export const validateEdgeConnection = (
    source: UnifiedNode,
    target: UnifiedNode,
    type: EdgeType
): { valid: boolean; reason?: string } => {

    // 1. Same layer connections are always allowed (if type is appropriate)
    if (source.layer === target.layer) {
        return { valid: true };
    }

    // 2. Cross-layer connections
    // If crossing World <-> Personal, MUST be a Bridge
    const isCrossingWorldPersonal =
        (source.layer === 'world' && target.layer === 'personal') ||
        (source.layer === 'personal' && target.layer === 'world');

    if (isCrossingWorldPersonal) {
        if (BRIDGE_TYPES.has(type)) {
            return { valid: true };
        } else {
            return {
                valid: false,
                reason: `Connection between ${source.layer} and ${target.layer} layers must use a Bridge type. Got: ${type}`
            };
        }
    }

    // 3. Connections to/from 'bridge' layer nodes (if reified nodes exist)
    // For now, allow them as they are likely intermediate helpers
    if (source.layer === 'bridge' || target.layer === 'bridge') {
        return { valid: true };
    }

    return { valid: true };
};
