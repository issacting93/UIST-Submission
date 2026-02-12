/**
 * Section Mapping Utilities
 *
 * Maps node types to default sections and provides section metadata.
 */

import type { ContextSection, UnifiedNode, NodeType } from '@/types/unified';

// =============================================================================
// DEFAULT SECTION MAPPINGS
// =============================================================================

/**
 * Maps node types to their default context section
 */
export const NODE_TYPE_DEFAULT_SECTIONS: Partial<Record<NodeType, ContextSection>> = {
    // Identity section
    'User': 'identity',
    'PersonalInfo': 'identity',

    // Health section
    'MedicalInfo': 'health',
    'BodyPart': 'health',

    // Communication section
    'Script': 'communication',
    'VocabItem': 'communication',
    'Pattern': 'communication',
    'Partner': 'communication',

    // Situational section (context-dependent)
    'Service': 'situational',
    'Task': 'situational',
    'Document': 'situational',
    'Place': 'situational',
    'Location': 'situational',
    'Memory': 'situational',
    'Preference': 'situational',
};

// =============================================================================
// SECTION METADATA
// =============================================================================

export interface SectionMetadata {
    id: ContextSection;
    label: string;
    description: string;
    icon: string;
    color: string;
    bgColor: string;
    borderColor: string;
}

export const SECTION_METADATA: Record<ContextSection, SectionMetadata> = {
    identity: {
        id: 'identity',
        label: 'Identity',
        description: 'Personal identification and authentication',
        icon: 'User',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
    },
    health: {
        id: 'health',
        label: 'Health',
        description: 'Medical conditions, allergies, and medications',
        icon: 'Heart',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
    },
    communication: {
        id: 'communication',
        label: 'Communication',
        description: 'Scripts, vocabulary, and communication patterns',
        icon: 'MessageSquare',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200',
    },
    situational: {
        id: 'situational',
        label: 'Situational',
        description: 'Context-dependent information like location and tasks',
        icon: 'MapPin',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
    },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get the section for a node - uses explicit section or derives from type
 */
export function getNodeSection(node: UnifiedNode): ContextSection {
    // Explicit section takes precedence
    if (node.section) {
        return node.section;
    }

    // Derive from node type
    const derivedSection = NODE_TYPE_DEFAULT_SECTIONS[node.type];
    if (derivedSection) {
        return derivedSection;
    }

    // Default to situational for unknown types
    return 'situational';
}

/**
 * Get all available sections
 */
export function getAllSections(): ContextSection[] {
    return ['identity', 'health', 'communication', 'situational'];
}

/**
 * Get metadata for a section
 */
export function getSectionMetadata(section: ContextSection): SectionMetadata {
    return SECTION_METADATA[section];
}
