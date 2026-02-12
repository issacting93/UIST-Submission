import { ContextNode, NodeType } from '@/types/unified';

// --- Personality Framework Nodes (6 Layers) ---
export const PERSONALITY_LAYERS = [
  {
    id: 1,
    title: 'Biological Temperament',
    description: 'Neurobiological foundation: reactivity, regulation, sensitivity.',
    color: 'rose',
    nodes: [
      { id: 'p-emotional-reactivity', label: 'High Reactivity', type: 'Trait', icon: 'bolt' },
      { id: 'p-sensory-sensitivity', label: 'High Sensitivity', type: 'Trait', icon: 'sensors' },
      { id: 'p-withdrawal', label: 'Withdrawal', type: 'Trait', icon: 'login' },
    ]
  },
  {
    id: 2,
    title: 'Basic Traits',
    description: 'Stable patterns of thinking, feeling, and behaving.',
    color: 'orange',
    nodes: [
      { id: 'p-openness', label: 'Openness', type: 'Trait', icon: 'lightbulb' },
      { id: 'p-conscientiousness', label: 'Conscientiousness', type: 'Trait', icon: 'task_alt' },
      { id: 'p-extraversion', label: 'Extraversion', type: 'Trait', icon: 'groups' },
      { id: 'p-agreeableness', label: 'Agreeableness', type: 'Trait', icon: 'handshake' },
    ]
  },
  {
    id: 3,
    title: 'Attachment & Schemas',
    description: 'Internal working models of self and others.',
    color: 'amber',
    nodes: [
      { id: 'p-secure', label: 'Secure Attachment', type: 'State', icon: 'favorite' },
      { id: 'p-anxious', label: 'Anxious', type: 'State', icon: 'diversity_1' },
      { id: 'p-avoidant', label: 'Dismissive', type: 'State', icon: 'do_not_disturb_on' },
    ]
  },
  {
    id: 4,
    title: 'Character & Self',
    description: 'Values, identity, and meaning-making.',
    color: 'emerald',
    nodes: [
      { id: 'p-autonomy', label: 'Self-Directed', type: 'Value', icon: 'person_pin' },
      { id: 'p-purpose', label: 'Purpose', type: 'Value', icon: 'flag' },
      { id: 'p-transcendence', label: 'Transcendence', type: 'Value', icon: 'landscape' },
    ]
  },
  {
    id: 5,
    title: 'Cognitive Patterns',
    description: 'Coping strategies and emotional regulation.',
    color: 'cyan',
    nodes: [
      { id: 'p-reappraisal', label: 'Reappraisal', type: 'Skill', icon: 'sync_alt' },
      { id: 'p-suppression', label: 'Suppression', type: 'Skill', icon: 'compress' },
      { id: 'p-mindfulness', label: 'Metacognition', type: 'Skill', icon: 'self_improvement' },
    ]
  },
  {
    id: 6,
    title: 'Behavioral Expression',
    description: 'Observable habits, roles, and cultural expressions.',
    color: 'indigo',
    nodes: [
      { id: 'p-professional', label: 'Professional Role', type: 'Role', icon: 'work' },
      { id: 'p-parent', label: 'Parent Role', type: 'Role', icon: 'family_restroom' },
      { id: 'p-social', label: 'Social Butterfly', type: 'Habit', icon: 'celebration' },
    ]
  }
] as const;

// Flattened list for the engine
export const UIST_SCENARIO_NODES = PERSONALITY_LAYERS.flatMap(layer =>
  layer.nodes.map(n => ({ ...n, layerId: layer.id }))
);

// --- Step Definitions ---
export const UIST_STEPS = [
  { id: 1, label: 'Externalize State', description: 'Construct personality profile layers 1-6', paper: 'Bloom' },
  { id: 2, label: 'Adaptive Interface', description: 'UI adapts to personality context', paper: 'CII' },
  { id: 3, label: 'Provenance', description: 'Trace behavior back to traits', paper: 'PKG' },
] as const;

// --- Hub Keywords for Edge Logic ---
export const UIST_HUB_KEYWORDS = [
  'Professional',
  'Parent',
  'Social',
  'Openness',
];

// --- Sample Provenance Trace ---
export const SAMPLE_PROVENANCE = {
  script: 'I need a moment to process this before responding.',
  traces: [
    {
      word: 'need a moment',
      bridgeType: 'CONSTRUCTED',
      source: 'Hex Workspace',
      confidence: 1.0,
      bridgeId: null,
    },
    {
      word: 'process',
      bridgeType: 'connected_to',
      source: 'High Reactivity (Layer 1)',
      confidence: 0.95,
      bridgeId: 'b:l1:042',
    },
    {
      word: 'responding',
      bridgeType: 'regulated_by',
      source: 'Reappraisal (Layer 5)',
      confidence: 0.88,
      bridgeId: 'b:l5:019',
    },
  ],
};

// --- Helper to create ContextNode from scenario config ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createUISTNode = (n: any): ContextNode => ({
  id: n.id,
  type: n.type,
  label: n.label,
  relevance: 1.0,
  timestamp: Date.now(),
  data: { icon: n.icon, source: 'uist-personality', layerId: n.layerId },
});
