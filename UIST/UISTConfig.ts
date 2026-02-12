import { ContextNode, NodeType } from '@/types/unified';

// --- UIST Medical Scenario Nodes ---
export const UIST_SCENARIO_NODES: { id: string; label: string; type: NodeType; icon: string }[] = [
  { id: 'uist-child', label: 'Child', type: 'Concept', icon: 'child_care' },
  { id: 'uist-pain', label: 'Pain', type: 'Feeling', icon: 'sick' },
  { id: 'uist-doctor', label: 'Doctor', type: 'Concept', icon: 'medical_services' },
  { id: 'uist-medicine', label: 'Medicine', type: 'Need', icon: 'medication' },
  { id: 'uist-hospital', label: 'Hospital', type: 'Location', icon: 'local_hospital' },
  { id: 'uist-appointment', label: 'Appointment', type: 'Concept', icon: 'event' },
  { id: 'uist-fever', label: 'Fever', type: 'Feeling', icon: 'thermostat' },
  { id: 'uist-urgent', label: 'Urgent', type: 'Concept', icon: 'priority_high' },
];

// --- Step Definitions ---
export const UIST_STEPS = [
  { id: 1, label: 'Construct Context', description: 'Gestural context mapping via hex workspace', paper: 'Bloom' },
  { id: 2, label: 'Adaptive Interface', description: 'Context-driven UI composition', paper: 'CII' },
  { id: 3, label: 'Explainability', description: 'Bridge-traced suggestion provenance', paper: 'PKG' },
] as const;

// --- Hub Keywords for Edge Logic ---
export const UIST_HUB_KEYWORDS = [
  'Hospital',
  'Doctor',
  'Medicine',
  'Appointment',
];

// --- Sample Provenance Trace ---
export const SAMPLE_PROVENANCE = {
  script: 'My child is in pain and needs to see a doctor.',
  traces: [
    {
      word: 'child',
      bridgeType: 'CONSTRUCTED',
      source: 'Hex Workspace (Manual, slot 1)',
      confidence: 1.0,
      bridgeId: null,
    },
    {
      word: 'pain',
      bridgeType: 'CONNECTED_TO',
      source: 'child (Gestural trace)',
      confidence: 1.0,
      bridgeId: null,
    },
    {
      word: 'doctor',
      bridgeType: 'CONNECTED_TO',
      source: 'pain (Gestural trace)',
      confidence: 1.0,
      bridgeId: null,
    },
    {
      word: 'needs to see',
      bridgeType: 'USES_IN_CONTEXT',
      source: 'healthcare_visit',
      confidence: 0.92,
      bridgeId: 'b:ctx:012',
    },
    {
      word: 'see a doctor',
      bridgeType: 'PREFERS_OVER',
      source: '"visit physician"',
      confidence: 0.87,
      bridgeId: 'b:pref:031',
    },
  ],
};

// --- Helper to create ContextNode from scenario config ---
export const createUISTNode = (n: typeof UIST_SCENARIO_NODES[0]): ContextNode => ({
  id: n.id,
  type: n.type,
  label: n.label,
  relevance: 1.0,
  timestamp: Date.now(),
  data: { icon: n.icon, source: 'uist-scenario', category: n.type },
});
