import { ContextSignal, IngestionEngine, UnifiedNode } from '@/types/unified';

/**
 * Stage 1: Signal Ingestion Engine
 * Handles normalization, validation, and initial scoring of incoming signals
 */
export class IngestionSystem implements IngestionEngine {
    private addNode: (node: UnifiedNode) => void;

    constructor(addNode: (node: UnifiedNode) => void) {
        this.addNode = addNode;
    }

    validateSignal(signal: ContextSignal): boolean {
        if (!signal.type || !signal.payload) return false;
        // Basic schema validation could go here
        return true;
    }

    async ingest(signal: ContextSignal): Promise<void> {
        if (!this.validateSignal(signal)) {
            console.warn('Invalid signal dropped:', signal);
            return;
        }

        const node = this.processSignal(signal);
        if (node) {
            this.addNode(node);
        }
    }

    private processSignal(signal: ContextSignal): UnifiedNode | undefined {
        const timestamp = signal.timestamp || Date.now();

        switch (signal.type) {
            case 'QR':
                return {
                    id: `qr:${signal.payload.id || signal.payload.label}:${timestamp}`,
                    type: signal.payload.type || 'Service',
                    label: signal.payload.label,
                    relevance: 1.0, // Explicit scan = max relevance
                    timestamp,
                    layer: 'world',
                    source: 'qr_scan',
                    data: signal.payload,
                    persistent: false
                };

            case 'GPS':
                return {
                    id: `gps:${timestamp}`,
                    type: 'Location',
                    label: signal.payload.name || 'Unknown Location',
                    relevance: 0.8, // Ambient signal = high but not max
                    timestamp,
                    layer: 'world',
                    source: 'gps_signal',
                    data: signal.payload
                };

            case 'MANUAL':
                return {
                    id: signal.payload.id || `manual:${timestamp}`,
                    type: signal.payload.type || 'Task',
                    label: signal.payload.label,
                    relevance: 1.0, // Manual creation = max relevance
                    timestamp,
                    layer: 'personal',
                    source: 'manual_input',
                    data: signal.payload.data,
                    persistent: signal.payload.persistent || true
                };

            case 'TIME':
                // Time signals might not create nodes directly but boost existing ones
                // For now, we return a temporal node
                return {
                    id: `time:${signal.payload.period}:${timestamp}`,
                    type: 'Temporal',
                    label: signal.payload.label, // e.g., "Morning"
                    relevance: 0.5,
                    timestamp,
                    layer: 'world',
                    source: 'time_decay'
                };

            // Text/Chat handled by separate logic or generalized here
            default:
                console.warn('Unhandled signal type:', signal.type);
                return undefined;
        }
    }
}
