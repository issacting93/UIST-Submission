import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
    UnifiedNode,
    UnifiedEdge,
    ContextState,
    ContextSignal,
    MaturityLevel,
    PluginConfig,
    ContextSection,
} from '@/types/unified';
import { getNodeSection } from '@/utils/sectionMapping';
import { validateEdgeConnection } from '@/utils/graphUtils';

interface UnifiedContextStore extends ContextState {
    // Plugin
    plugin: PluginConfig | null;
    setPlugin: (plugin: PluginConfig) => void;

    // Node Operations
    addNode: (node: UnifiedNode) => void;
    updateNode: (id: string, updates: Partial<UnifiedNode>) => void;
    removeNode: (id: string) => void;
    getNode: (id: string) => UnifiedNode | undefined;

    // Edge Operations
    addEdge: (edge: UnifiedEdge) => void;
    removeEdge: (id: string) => void;
    getEdgesForNode: (nodeId: string) => UnifiedEdge[];

    // Signal Processing
    ingestSignal: (signal: ContextSignal) => void;
    resetContext: () => void;

    // Focus Management
    setFocused: (nodeId: string, focused: boolean) => void;
    getFocusedNodes: () => UnifiedNode[];

    // Maturity
    calculateMaturity: () => MaturityLevel;

    // Queries
    getActiveNodes: (threshold?: number) => UnifiedNode[];
    getNodesByType: (type: string) => UnifiedNode[];
    getNodesByLayer: (layer: 'world' | 'personal' | 'bridge') => UnifiedNode[];
    getNodesBySection: (section: ContextSection) => UnifiedNode[];
    getSectionSummary: () => Record<ContextSection, number>;
    traverse: (startNodeId: string, edgeTypes?: string[], maxDepth?: number) => UnifiedNode[];

    // Decay
    applyDecay: () => void;

    // Subscriptions
    subscribers: Set<(state: ContextState) => void>;
    subscribe: (callback: (state: ContextState) => void) => () => void;
    notifySubscribers: () => void;

    // Persistence
    exportGraph: () => { nodes: UnifiedNode[]; edges: UnifiedEdge[] };
    importGraph: (data: { nodes: UnifiedNode[]; edges: UnifiedEdge[] }) => void;
    clearContext: () => void;
}

// Helper function
function calculateMaturityLevel(
    nodes: Map<string, UnifiedNode>,
    focusedNodeIds: Set<string>
): MaturityLevel {
    const activeNodes = Array.from(nodes.values()).filter(n => n.relevance >= 0.3);
    const focusedCount = focusedNodeIds.size;

    if (focusedCount >= 2) return 'focused';
    if (activeNodes.length >= 5) return 'established';
    if (activeNodes.length >= 2) return 'building';
    return 'initial';
}

export const useUnifiedContext = create<UnifiedContextStore>()(
    persist(
        (set, get) => ({
            // Initial State
            nodes: new Map(),
            edges: new Map(),
            maturity: 'initial',
            focusedNodeIds: new Set(),
            activePluginId: 'aac',
            activeProfileId: 'default',
            lastUpdated: Date.now(),
            signalCount: 0,
            plugin: null,
            subscribers: new Set(),

            // Plugin
            setPlugin: (plugin) => {
                set({ plugin, activePluginId: plugin.metadata.id });
            },

            // Node Operations
            addNode: (node) => {
                const state = get();
                const nodes = new Map(state.nodes);
                nodes.set(node.id, {
                    ...node,
                    timestamp: node.timestamp || Date.now(),
                    relevance: node.relevance ?? 1.0
                });

                const newMaturity = calculateMaturityLevel(nodes, state.focusedNodeIds);

                set({
                    nodes,
                    maturity: newMaturity,
                    lastUpdated: Date.now(),
                    signalCount: state.signalCount + 1
                });

                get().notifySubscribers();
            },

            updateNode: (id, updates) => {
                const state = get();
                const node = state.nodes.get(id);
                if (!node) return;

                const nodes = new Map(state.nodes);
                nodes.set(id, { ...node, ...updates });

                set({ nodes, lastUpdated: Date.now() });
                get().notifySubscribers();
            },

            removeNode: (id) => {
                const state = get();
                const nodes = new Map(state.nodes);
                nodes.delete(id);

                // Remove associated edges
                const edges = new Map(state.edges);
                for (const [edgeId, edge] of edges) {
                    if (edge.source === id || edge.target === id) {
                        edges.delete(edgeId);
                    }
                }

                const focusedNodeIds = new Set(state.focusedNodeIds);
                focusedNodeIds.delete(id);

                set({ nodes, edges, focusedNodeIds, lastUpdated: Date.now() });
                get().notifySubscribers();
            },

            getNode: (id) => get().nodes.get(id),

            // Edge Operations
            addEdge: (edge) => {
                const state = get();

                // Epistemic Layer Validation
                const sourceNode = state.nodes.get(edge.source);
                const targetNode = state.nodes.get(edge.target);

                if (sourceNode && targetNode) {
                    const validation = validateEdgeConnection(sourceNode, targetNode, edge.type);
                    if (!validation.valid) {
                        console.warn(`[Epistemic Validation Failed] ${validation.reason}`);
                        // Optionally reject the edge, but for now we warn and proceed (or reject?)
                        // To strictly enforce, we should return.
                        return;
                    }
                }

                const edges = new Map(state.edges);
                edges.set(edge.id, edge);
                set({ edges, lastUpdated: Date.now() });
                get().notifySubscribers();
            },

            removeEdge: (id) => {
                const state = get();
                const edges = new Map(state.edges);
                edges.delete(id);
                set({ edges, lastUpdated: Date.now() });
                get().notifySubscribers();
            },

            getEdgesForNode: (nodeId) => {
                const edges: UnifiedEdge[] = [];
                for (const edge of get().edges.values()) {
                    if (edge.source === nodeId || edge.target === nodeId) {
                        edges.push(edge);
                    }
                }
                return edges;
            },

            // Signal Processing
            ingestSignal: (signal) => {
                // Implementation of signal processing logic
                let node: UnifiedNode | undefined;

                switch (signal.type) {
                    case 'QR':
                        node = {
                            id: `qr:${signal.payload.label}:${signal.timestamp}`,
                            type: signal.payload.type || 'Service',
                            label: signal.payload.label,
                            relevance: 1.0,
                            timestamp: signal.timestamp,
                            layer: 'world',
                            source: 'qr_scan',
                            data: signal.payload
                        };
                        break;
                    case 'GPS':
                        node = {
                            id: `gps:${signal.timestamp}`,
                            type: 'Location',
                            label: signal.payload.name || 'Current Location',
                            relevance: 0.9,
                            timestamp: signal.timestamp,
                            layer: 'personal',
                            source: 'gps_signal',
                            data: signal.payload
                        };
                        break;
                    case 'MANUAL':
                        const payloadNode = signal.payload.node;
                        const nodeLabel = payloadNode?.label ?? signal.payload.label;
                        const nodeType = payloadNode?.type ?? signal.payload.type ?? 'Service';
                        const nodeId = payloadNode?.id ?? `manual:${nodeLabel}:${signal.timestamp}`;

                        if (nodeLabel) {
                            node = {
                                id: nodeId,
                                type: nodeType,
                                label: nodeLabel,
                                relevance: payloadNode?.relevance ?? 1.0,
                                timestamp: signal.timestamp,
                                layer: payloadNode?.data?.layer ?? signal.payload.layer ?? 'personal',
                                source: 'manual_input',
                                focused: signal.payload.focused ?? true,
                                data: payloadNode?.data ?? signal.payload,
                                imageUrl: payloadNode?.imageUrl ?? signal.payload.imageUrl,
                                persistent: payloadNode?.data?.persistent ?? false,
                            };
                        }
                        break;
                }

                if (node) {
                    get().addNode(node);
                }
            },

            resetContext: () => {
                const state = get();
                const nodes = new Map(state.nodes);

                for (const [id, node] of nodes) {
                    if (!node.persistent) {
                        nodes.delete(id);
                    }
                }

                set({
                    nodes,
                    edges: new Map(),
                    focusedNodeIds: new Set(),
                    maturity: 'initial',
                    signalCount: 0
                });
                get().notifySubscribers();
            },

            // Focus Management
            setFocused: (nodeId, focused) => {
                const state = get();
                const focusedNodeIds = new Set(state.focusedNodeIds);

                if (focused) {
                    focusedNodeIds.add(nodeId);
                } else {
                    focusedNodeIds.delete(nodeId);
                }

                const newMaturity = calculateMaturityLevel(state.nodes, focusedNodeIds);

                set({ focusedNodeIds, maturity: newMaturity });
                get().notifySubscribers();
            },

            getFocusedNodes: () => {
                const state = get();
                return Array.from(state.focusedNodeIds)
                    .map(id => state.nodes.get(id))
                    .filter(Boolean) as UnifiedNode[];
            },

            // Maturity
            calculateMaturity: () => {
                const state = get();
                return calculateMaturityLevel(state.nodes, state.focusedNodeIds);
            },

            // Queries
            getActiveNodes: (threshold = 0.3) => {
                return Array.from(get().nodes.values())
                    .filter(n => n.relevance >= threshold);
            },

            getNodesByType: (type) => {
                return Array.from(get().nodes.values())
                    .filter(n => n.type === type);
            },

            getNodesByLayer: (layer) => {
                return Array.from(get().nodes.values())
                    .filter(n => n.layer === layer);
            },

            getNodesBySection: (section) => {
                return Array.from(get().nodes.values())
                    .filter(n => getNodeSection(n) === section);
            },

            getSectionSummary: () => {
                const nodes = Array.from(get().nodes.values());
                const summary: Record<ContextSection, number> = {
                    identity: 0,
                    health: 0,
                    communication: 0,
                    situational: 0,
                };
                nodes.forEach(node => {
                    const section = getNodeSection(node);
                    if (summary[section] !== undefined) {
                        summary[section]++;
                    }
                });
                return summary;
            },

            traverse: (startNodeId, edgeTypes = [], maxDepth = 1) => {
                const state = get();
                const visited = new Set<string>();
                const results: UnifiedNode[] = [];
                const queue: { id: string; depth: number }[] = [{ id: startNodeId, depth: 0 }];

                visited.add(startNodeId);

                while (queue.length > 0) {
                    const { id, depth } = queue.shift()!;

                    if (depth >= maxDepth) continue;

                    // Get edges from this node
                    const edges = Array.from(state.edges.values()).filter(e => e.source === id);

                    for (const edge of edges) {
                        // Filter by edge type if specified
                        if (edgeTypes.length > 0 && !edgeTypes.includes(edge.type)) continue;

                        const targetId = edge.target;
                        if (!visited.has(targetId)) {
                            visited.add(targetId);
                            const node = state.nodes.get(targetId);
                            if (node) {
                                results.push(node);
                                queue.push({ id: targetId, depth: depth + 1 });
                            }
                        }
                    }
                }

                return results;
            },

            // Decay
            applyDecay: () => {
                const state = get();
                const plugin = state.plugin;
                const nodes = new Map(state.nodes);
                const now = Date.now();

                for (const [id, node] of nodes) {
                    if (node.persistent) continue;

                    const nodeConfig = plugin?.nodeTypes.find(t => t.type === node.type);
                    const decayRate = nodeConfig?.decayRate ?? 0.05;

                    const age = (now - node.timestamp) / (1000 * 60); // Age in minutes
                    const decay = Math.exp(-decayRate * age);

                    const newRelevance = node.relevance * decay;

                    if (newRelevance < 0.1) {
                        nodes.delete(id);
                    } else {
                        nodes.set(id, { ...node, relevance: newRelevance });
                    }
                }

                set({ nodes });
                get().notifySubscribers();
            },

            // Subscriptions
            subscribe: (callback) => {
                const state = get();
                state.subscribers.add(callback);
                return () => state.subscribers.delete(callback);
            },

            notifySubscribers: () => {
                const state = get();
                const contextState: ContextState = {
                    nodes: state.nodes,
                    edges: state.edges,
                    maturity: state.maturity,
                    focusedNodeIds: state.focusedNodeIds,
                    activePluginId: state.activePluginId,
                    lastUpdated: state.lastUpdated,
                    signalCount: state.signalCount
                };

                for (const callback of state.subscribers) {
                    callback(contextState);
                }
            },

            // Persistence
            exportGraph: () => {
                const state = get();
                return {
                    nodes: Array.from(state.nodes.values()),
                    edges: Array.from(state.edges.values())
                };
            },

            importGraph: (data) => {
                const nodes = new Map(data.nodes.map(n => [n.id, n]));
                const edges = new Map(data.edges.map(e => [e.id, e]));
                set({ nodes, edges, lastUpdated: Date.now() });
                get().notifySubscribers();
            },

            clearContext: () => {
                const state = get();
                const nodes = new Map(state.nodes);

                for (const [id, node] of nodes) {
                    if (!node.persistent) {
                        nodes.delete(id);
                    }
                }

                set({
                    nodes,
                    edges: new Map(),
                    focusedNodeIds: new Set(),
                    maturity: 'initial',
                    signalCount: 0
                });
                get().notifySubscribers();
            }
        }),
        {
            name: 'unified-context',
            partialize: (state) => ({
                nodes: Array.from(state.nodes.entries()),
                edges: Array.from(state.edges.entries()),
                focusedNodeIds: Array.from(state.focusedNodeIds),
                activePluginId: state.activePluginId
            }),
            storage: {
                getItem: (name) => {
                    const str = localStorage.getItem(name);
                    if (!str) return null;
                    const { state } = JSON.parse(str);
                    return {
                        state: {
                            ...state,
                            nodes: new Map(state.nodes),
                            edges: new Map(state.edges),
                            focusedNodeIds: new Set(state.focusedNodeIds),
                        },
                    };
                },
                setItem: (name, newValue: any) => {
                    const str = JSON.stringify({
                        state: {
                            ...newValue.state,
                            nodes: Array.from(newValue.state.nodes.entries()),
                            edges: Array.from(newValue.state.edges.entries()),
                            focusedNodeIds: Array.from(newValue.state.focusedNodeIds),
                        },
                    });
                    localStorage.setItem(name, str);
                },
                removeItem: (name) => localStorage.removeItem(name),
            },
        }
    )
);
