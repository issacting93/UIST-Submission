/**
 * Unified type system that merges PKG, BLOOM, and Context types
 */

// =============================================================================
// BACKWARDS COMPATIBILITY ALIASES
// (Merged from deprecated context.ts and chat.ts)
// =============================================================================

/**
 * ContextNode - backwards compatible interface from deprecated context.ts
 * New code should use UnifiedNode for full type safety
 */
export interface ContextNode {
    id: string;
    type: NodeType;
    label: string;
    data?: Record<string, any>;
    imageUrl?: string;
    relevance: number;
    timestamp: number;
    // Optional UnifiedNode properties for interop
    layer?: 'world' | 'personal' | 'bridge';
    source?: NodeSource;
    category?: string;
    contexts?: string[];
    persistent?: boolean;
    focused?: boolean;
}

/**
 * ContextEdge - backwards compatible interface from deprecated context.ts
 * New code should use UnifiedEdge for full type safety
 */
export interface ContextEdge {
    source: string;
    target: string;
    type: EdgeType;
    weight: number;
    // Optional UnifiedEdge properties for interop
    id?: string;
    bidirectional?: boolean;
    timestamp?: number;
    source_type?: NodeSource;
}

/**
 * Signal Payloads (from context.ts)
 */
export interface ManualPayload {
    node?: Partial<UnifiedNode>;
    label?: string;
    type?: string;
    [key: string]: any;
}

export type SignalPayload = ManualPayload | Record<string, any>;

/**
 * AISuggestion (from chat.ts)
 */
export interface AISuggestion {
    id: string;
    type: 'completion' | 'clarification' | 'script' | 'vocab';
    text: string;
    confidence: number;
    explanation?: string;
}

// =============================================================================
// CONTEXT SECTIONS
// =============================================================================

/**
 * ContextSection - categorizes nodes into logical sections
 * Used for structured display and filtering
 */
export type ContextSection = 'identity' | 'health' | 'communication' | 'situational';

// =============================================================================
// UNIFIED NODE TYPES
// =============================================================================

/**
 * Base node interface - all nodes extend this
 */
export interface UnifiedNode {
    id: string;
    type: NodeType;
    label: string;

    // Context properties
    relevance: number;           // 0-1, current relevance
    timestamp: number;           // When added/updated

    // PKG Legacy Support
    category?: string;
    contexts?: string[];
    usageCount?: number;
    description?: string;
    imageUrl?: string;

    // Layer identification
    layer: 'world' | 'personal' | 'bridge';

    // Section classification
    section?: ContextSection;    // Optional section for structured context

    // Flexible data (plugin-specific)
    data?: Record<string, any>;

    // Metadata
    source: NodeSource;
    persistent?: boolean;        // Survives context clear
    focused?: boolean;           // User explicitly selected
}

/**
 * Specialized Node Types
 */
export interface ScriptNode extends UnifiedNode {
    type: 'Script';
    category?: string;
    contexts?: string[];
    usageCount: number;
}

export interface VocabNode extends UnifiedNode {
    type: 'VocabItem';
    category?: string;
    contexts?: string[];
    usageCount: number;
}

/**
 * Type Guard Helpers
 */
export const isScriptNode = (node: UnifiedNode): node is ScriptNode => node.type === 'Script';
export const isVocabNode = (node: UnifiedNode): node is VocabNode => node.type === 'VocabItem';

/**
 * Node types - unified from PKG and BLOOM
 */
export type NodeType =
    // PKG Personal Types
    | 'Script'
    | 'VocabItem'
    | 'Pattern'
    | 'Preference'
    | 'Memory'
    | 'Partner'

    // BLOOM/Context Types
    | 'Service'
    | 'Task'
    | 'Document'
    | 'Place'
    | 'Location'

    // Medical/AAC Types (plugin-provided)
    | 'MedicalInfo'
    | 'BodyPart'
    | 'PersonalInfo'

    // User Identity
    | 'User'

    // World Layer Types
    | 'WorldRef'
    | 'ContextSchema'
    | 'Symbol'

    // Extensible
    | string;

export type NodeSource =
    | 'user_created'
    | 'ai_inferred'
    | 'qr_scan'
    | 'gps_signal'
    | 'manual_input'
    | 'time_decay'
    | 'plugin_generated'
    | 'commons_aggregated'
    | 'seed'
    | 'text';

export type ConsentLevel = 'private' | 'scoped' | 'shared';

// =============================================================================
// UNIFIED EDGE TYPES
// =============================================================================

export interface UnifiedEdge {
    id: string;
    source: string;              // Node ID
    target: string;              // Node ID
    type: EdgeType;

    // Properties
    weight: number;              // 0-1, relationship strength
    bidirectional: boolean;

    // Metadata
    timestamp: number;
    source_type: NodeSource;
}

export type EdgeType =
    // =========================================================================
    // UIST 2026: THE 9 EPISTEMIC BRIDGE TYPES
    // Only these edges can connect World Layer -> Personal Layer
    // =========================================================================
    | 'PREFERS_OVER'         // User preference (A > B)
    | 'MEANS_TO_ME'          // Idiosyncratic meaning
    | 'AVOIDS'               // Negative preference
    | 'ASSOCIATES_WITH'      // Loose association
    | 'USES_IN_CONTEXT'      // Contextual binding
    | 'WORKS_WITH_PARTNER'   // Social context
    | 'EXPANDS_TO'           // Abbreviation/Macro
    | 'TRIGGERS'             // Action trigger
    | 'CONTRADICTS'          // Personal belief vs World fact

    // =========================================================================
    // SYSTEM / ONTOLOGICAL EDGES
    // =========================================================================
    | 'CONNECTED_TO'         // Generic connection
    | 'PART_OF'              // Meronymy
    | 'HAS_ATTRIBUTE'        // Property
    | string;                // Extensible for plugins

// =============================================================================
// CONTEXT STATE
// =============================================================================

export interface ContextState {
    // Graph Data
    nodes: Map<string, UnifiedNode>;
    edges: Map<string, UnifiedEdge>;

    // Maturity Tracking
    maturity: MaturityLevel;

    // Focus
    focusedNodeIds: Set<string>;

    // Plugin
    activePluginId: string;

    // Metadata
    lastUpdated: number;
    signalCount: number;
}

export type MaturityLevel = 'initial' | 'building' | 'established' | 'focused';

// =============================================================================
// SIGNALS
// =============================================================================

export interface ContextSignal {
    type: SignalType;
    payload: Record<string, any>;
    timestamp: number;
    consent?: ConsentLevel;
}

export type SignalType = 'QR' | 'GPS' | 'MANUAL' | 'IMAGE' | 'TIME' | 'PROFILE';

// =============================================================================
// PLUGIN CONFIG (drives all behavior)
// =============================================================================

export interface PluginConfig {
    metadata: {
        id: string;
        name: string;
        version: string;
        description: string;
    };

    nodeTypes: Array<{
        type: string;
        icon: string;
        persistent: boolean;
        decayRate: number;
        schema: Record<string, string>;
    }>;

    edgeTypes: Array<{
        type: string;
        bidirectional: boolean;
        defaultWeight: number;
    }>;

    domainBridges: Array<{
        source: string;
        target: string;
        type: string;
    }>;

    userProfileSchema: Array<{
        nodeType: string;
        fields: Record<string, any>;
    }>;

    maturityThresholds: {
        building: number;
        established: number;
        focused: number;
    };

    settings: Record<string, any>;
}

// =============================================================================
// CONTEXT ENGINE CORE INTERFACES (UIST PIPELINE)
// =============================================================================

/**
 * Stage 1: Ingestion Engine
 */
export interface IngestionEngine {
    ingest(signal: ContextSignal): Promise<void>;
    validateSignal(signal: ContextSignal): boolean;
}

/**
 * Stage 2: Context Graph Store
 */
export interface ContextGraphStore {
    // CRUD
    addNode(node: UnifiedNode): void;
    addEdge(edge: UnifiedEdge): void;
    updateNode(id: string, patch: Partial<UnifiedNode>): void;

    // Lifecycle
    applyDecay(decayRate: number): void; // Reduces relevance
    prune(threshold: number): void;      // Removes low relevance nodes

    // Traversal
    getActiveContext(threshold: number): ContextState;
    traverse(startNodeId: string, edgeTypes: EdgeType[]): UnifiedNode[];
}

/**
 * Stage 3: Adaptive Resolver
 */
export interface AdaptiveResolver {
    /**
     * Given the active context graph, return a list of UI modules to render
     */
    resolveModules(state: ContextState): ResolvedModule[];
}

export interface ResolvedModule {
    id: string;
    component: string; // React component key in registry
    props: Record<string, any>;
    relevance: number; // Inherited from context trigger
    layout: {
        w: number;
        h: number;
        priority: number;
    };
}

/**
 * Stage 4: Renderer (Theme & Layout)
 */
export interface RendererConfig {
    themeMode: 'light' | 'dark' | 'auto';
    density: 'compact' | 'comfortable';
    showMaturityVisuals: boolean;
}
