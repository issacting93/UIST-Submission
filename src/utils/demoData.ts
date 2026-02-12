import { UnifiedNode } from '@/types/unified';


export const seedDemoData = (
    addNode: (node: UnifiedNode) => void,

) => {
    const timestamp = Date.now();

    const nodes: UnifiedNode[] = [
        // Identity
        {
            id: 'demo-id-1',
            type: 'Identity',
            label: 'Zac',
            relevance: 1.0,
            timestamp,
            layer: 'personal',
            source: 'seed',
            data: { role: 'User' }
        },
        {
            id: 'demo-value-1',
            type: 'Value',
            label: 'Creativity',
            relevance: 0.9,
            timestamp,
            layer: 'personal',
            source: 'seed'
        },

        // Needs
        {
            id: 'demo-need-1',
            type: 'Need',
            label: 'Coffee',
            relevance: 0.8,
            timestamp,
            layer: 'personal',
            source: 'seed'
        },
        {
            id: 'demo-need-2',
            type: 'Need',
            label: 'Focus',
            relevance: 0.95,
            timestamp,
            layer: 'personal',
            source: 'seed'
        },

        // Feelings
        {
            id: 'demo-feeling-1',
            type: 'Feeling',
            label: 'Flow State',
            relevance: 0.9,
            timestamp,
            layer: 'personal',
            source: 'seed'
        },
        {
            id: 'demo-feeling-2',
            type: 'Feeling',
            label: 'Curious',
            relevance: 0.7,
            timestamp,
            layer: 'personal',
            source: 'seed'
        },

        // Actions
        {
            id: 'demo-action-1',
            type: 'Action',
            label: 'Refactor Code',
            relevance: 1.0,
            timestamp,
            layer: 'bridge',
            source: 'seed'
        },
        {
            id: 'demo-action-2',
            type: 'Action',
            label: 'Write Documentation',
            relevance: 0.6,
            timestamp,
            layer: 'bridge',
            source: 'seed'
        },

        // Project
        {
            id: 'demo-project-1',
            type: 'Project',
            label: 'Bloom App',
            relevance: 1.0,
            timestamp,
            layer: 'world',
            source: 'seed'
        }
    ];

    nodes.forEach(node => addNode(node));
};

export const seedAdaptiveScenario = (addNode: (node: UnifiedNode) => void) => {
    const timestamp = Date.now();

    const nodes: UnifiedNode[] = [
        // Location (Should trigger LocationModule)
        {
            id: 'test-loc-1',
            type: 'Location',
            label: 'Washington Square Park',
            relevance: 1.0,
            timestamp,
            layer: 'world',
            source: 'gps_signal',
            data: { accuracy: 12, coordinates: [40.7308, -73.9973] }
        },
        // Task (Should trigger TaskModule)
        {
            id: 'test-task-1',
            type: 'Action',
            label: 'Review Pull Request #42',
            relevance: 0.9,
            timestamp,
            layer: 'bridge',
            source: 'manual_input',
            data: { priority: 'high', status: 'pending' }
        },
        // Long Text (Should trigger TextModule with colSpan=2)
        {
            id: 'test-note-1',
            type: 'Note',
            label: 'Meeting Notes: Q3 Planning',
            relevance: 0.8,
            timestamp,
            layer: 'personal',
            source: 'user_created',
            data: {
                content: 'Discussed the roadmap for the upcoming quarter. Key focus areas include performance optimization, user onboarding flow, and the new plugin architecture. We need to schedule follow-ups for the design team and get sign-off on the new API specifications by Friday.'
            }
        },
        // Short Text
        {
            id: 'test-thought-1',
            type: 'Thought',
            label: 'Quick Idea',
            relevance: 0.5,
            timestamp,
            layer: 'personal',
            source: 'user_created',
            data: { content: 'Maybe we should use a graph database?' }
        }
    ];

    nodes.forEach(node => addNode(node));
};
