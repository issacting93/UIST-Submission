# Context as Interface: Adaptive UI Generation Through Personal Knowledge Graphs and Contextual Signal Ingestion

**UIST 2026 — Full Paper Submission**

**Authors:** Issac, Sid 
**Affiliation:** NYU Tandon School of Engineering, Integrated Digital Media
**Contact:** [contact information]

**Target Venue:** ACM Symposium on User Interface Software and Technology (UIST 2026)
**Location:** Detroit, Michigan, USA — GM Renaissance Center
**Dates:** November 2–5, 2026
**Deadline:** Abstract March 24, 2026 / Paper March 31, 2026

---

## Abstract

We present **Spectrum**, a system that demonstrates a new paradigm for user interface construction: *context as interface*. Rather than presenting users with static, application-centric layouts that require manual navigation, Spectrum dynamically composes interfaces in response to a user's evolving contextual state. The system ingests heterogeneous signals (QR codes, manual gestures, text input, temporal data), maintains a live context graph with maturity-driven relevance scoring and temporal decay, and uses this graph to resolve and render adaptive UI modules in real time.

The core technical contribution is a four-stage pipeline—**Ingestion → Context Graph → Adaptation → Rendering**—that transforms raw signals into composed, domain-appropriate interfaces without explicit navigation. We implement this within an Augmentative and Alternative Communication (AAC) platform, where the cost of navigating wrong menus is measured in lost communication opportunities for non-verbal individuals. The system introduces three architectural innovations: (1) a **three-layer epistemic graph** that separates world knowledge, personal knowledge, and user stance to enable explainable suggestions; (2) a **maturity model** that tracks context lifecycle from initial exposure through focused attention, with exponential decay modeling cognitive salience; and (3) a **gestural context mapping** interface where users construct context through hexagonal drag-and-trace interactions, making the normally-hidden interpretive labor of AI systems visible and contestable.

We describe the system architecture, demonstrate its operation across AAC, housing policy, and medical domains via a plugin system, and discuss how making context construction effortful—rather than invisible—preserves user agency in AI-mediated interaction.

**Keywords:** adaptive user interfaces, context-aware computing, personal knowledge graphs, augmentative and alternative communication, signal-driven UI composition, explainable AI

---

## 1. Introduction

User interfaces are static. A healthcare app presents the same menus whether you are checking in for an appointment or discussing medication side effects. A government services portal requires the same navigation whether you are a first-time visitor or returning to complete a familiar task. For most users, this is an inconvenience. For non-verbal individuals who communicate through Augmentative and Alternative Communication (AAC) systems at 2–10 words per minute, every unnecessary menu navigation is a lost sentence.

Current AAC systems epitomize the static interface problem. Proloquo2Go, TouchChat, and similar tools organize vocabulary into fixed hierarchical categories—*Greetings → Meals → Medical → Transportation*—regardless of whether the user is in a hospital or a restaurant. The user must navigate to the right category before they can speak. Context-aware systems have attempted to address this through sensor-based detection (GPS [17], calendar integration, biometric inference), but these approaches treat context as something to be *detected* by the system rather than *constructed* by the user—a distinction with significant implications for agency and trust.

We propose a different approach: **context as interface**. Instead of designing interfaces and then adapting them to context, we let the context graph *become* the interface. The user's active context nodes—maintained through a combination of signal ingestion and deliberate construction—directly determine which UI modules are rendered, which suggestions are surfaced, and which information is foregrounded.

### Contributions

This paper contributes:

1. **A four-stage pipeline** (Ingestion → Context Graph → Adaptation → Rendering) for transforming heterogeneous signals into composed, adaptive interfaces without explicit navigation.

2. **A three-layer epistemic architecture** (World / Bridge / Personal) for personal knowledge graphs that enforces separation between canonical knowledge, user beliefs, and user stance—enabling explainable, auditable AI suggestions.

3. **A context maturity model** with temporal decay that tracks how context nodes evolve from initial exposure (relevance 0.0) through building (0.3–0.7), established (0.7–0.9), to focused (0.9+) states, modeling cognitive salience over time.

4. **A gestural context mapping interface** using hexagonal drag-and-trace interactions that makes context construction visible, tangible, and effortful—reframing friction as a site of user agency rather than a usability problem.

5. **A working implementation** demonstrating the paradigm across AAC communication, housing policy navigation, and medical contexts through a domain-agnostic plugin architecture.

---

## 2. Related Work

### 2.1 Adaptive User Interfaces

Research on adaptive interfaces has a long history in UIST and adjacent venues. Early work on mixed-initiative interfaces [10] explored systems that adapted layout based on usage patterns. More recently, generative UI approaches use LLMs to produce interface components on the fly [14]. Our approach differs in that the *context graph itself* drives composition—UI modules subscribe to context state rather than being generated from prompts.

Contextual UI systems like Google Now and Apple Intelligence surfaces demonstrate commercial interest in context-driven interfaces, but these systems operate as recommendation layers atop fixed apps rather than as interface composition engines. Spectrum collapses the distinction between "context detection" and "interface rendering" into a single reactive pipeline.

### 2.2 Context-Aware AAC

Traditional AAC research has explored context-awareness primarily through detection:

- **Patel & Radhakrishnan (2007)** [17]: GPS-based vocabulary adaptation
- **Valencia et al. (2023)** [20]: LLM-powered abbreviation expansion
- **Kane & Morris (2017)** [12]: Image recognition for symbol selection
- **Holyfield et al. (2025)** [9]: Just-in-time programming for autistic children

These systems add intelligence to existing static interfaces. Spectrum instead proposes that the interface structure itself should be a function of context.

### 2.3 Personal Knowledge Graphs

PKGs have been explored in information retrieval [1] and personal information management [5]. Our contribution is the *epistemic layering*: enforcing, at the data model level, the distinction between what exists in the world, what the user believes, and how the user relates to world knowledge. This draws on Agre's critical technical practice [2], which calls for systems that make their assumptions visible.

### 2.4 Gestural Interaction and Embodied Cognition

Our hexagonal context mapping interface draws on Buxton's work on chunking and phrasing in gestural input [6], Kirsh & Maglio's epistemic actions [13]—actions performed to change one's own cognitive state—and Suchman's situated action theory [19]. We frame context tracing as an *epistemic gesture*: the physical act of connecting nodes is a way of thinking through relationships, not merely selecting pre-defined options.

---

## 3. System Architecture

### 3.1 Overview

Spectrum implements the Context-as-Interface (CII) paradigm through a four-stage reactive pipeline:

```
SIGNAL SOURCES → CONTEXT ENGINE → ADAPTIVE INTERFACE → DYNAMIC WORKSPACE
     │                 │                  │                    │
  QR/GPS/Text/    Create/boost      Module resolution    Grid composition
  Manual/Time     nodes, compute    via registry +       + theme engine
                  maturity, decay   semantic matching
```

The system is built as a React/TypeScript frontend with Zustand state management and a FastAPI/Python backend with multi-provider LLM integration (OpenAI, Ollama, LM Studio). Graph storage uses Neo4j in production and an in-memory store for development. The architecture is offline-first: core AAC functionality operates entirely from localStorage, with server synchronization when connectivity is restored.

### 3.2 Stage 1: Signal Ingestion

The Context Engine accepts signals from multiple heterogeneous sources:

| Signal Type | Source | Processing |
|------------|--------|------------|
| **QR** | Scanned at service location | Creates node, extracts metadata, triggers maturity calculation |
| **GPS** | Device location | Creates location context node, influences module resolution |
| **TIME** | System clock | Morning/afternoon affects vocabulary loading, service availability |
| **TEXT** | User transcript, chat input | Semantic analysis for domain inference, keyword extraction |
| **MANUAL** | User drags node onto hex grid | Explicit context construction, relevance set to 1.0 |

Each signal passes through a validation layer (type checking, sanitization) before entering the context graph. The key design decision is that *all signal types produce the same graph primitives*—unified nodes and edges—enabling a single downstream pipeline regardless of input modality.

### 3.3 Stage 2: Context Graph

The context graph is the system's working memory. Each node carries a relevance score (0.0–1.0) that evolves through a maturity lifecycle:

```
INITIAL (0.0–0.2) → BUILDING (0.3–0.7) → ESTABLISHED (0.7–0.9) → FOCUSED (0.9+)
```

**Temporal decay** models cognitive salience:

```
relevance(t) = relevance(0) × e^(-λ × Δt)
```

where λ is a domain-specific decay rate (default 5%/min; medical contexts use 2%/min, reflecting longer cognitive engagement). Relevance increases when reinforced by new signals and decreases over time unless the user explicitly *pins* a node (setting relevance to 1.0 and marking it persistent).

The graph implements the **three-layer epistemic architecture**:

```
┌─────────────────────────────────────────────────┐
│ WORLD LAYER                                     │
│   Canonical facts: AAC symbol libraries,        │
│   context schemas, domain vocabularies           │
│   KEY: No subjective state. "What exists."      │
└─────────────────────┬───────────────────────────┘
                      │
              ┌───────▼───────┐
              │   BRIDGES     │
              │   User's stance toward world      │
              │   knowledge: PREFERS_OVER,         │
              │   MEANS_TO_ME, EXPANDS_TO, etc.    │
              └───────┬───────┘
                      │
┌─────────────────────▼───────────────────────────┐
│ PERSONAL LAYER                                  │
│   Beliefs, preferences, patterns, scripts        │
│   KEY: Agent-specific, can contradict World.    │
│   "What I believe / how I communicate."          │
└─────────────────────────────────────────────────┘
```

**Bridges** are the *only* allowed connections between layers. Nine bridge types encode user stance: `PREFERS_OVER`, `MEANS_TO_ME`, `AVOIDS`, `ASSOCIATES_WITH`, `USES_IN_CONTEXT`, `WORKS_WITH_PARTNER`, `EXPANDS_TO`, `TRIGGERS`, `CONTRADICTS`. This separation ensures that every AI suggestion can be traced to specific graph paths, answering "why did you suggest this?" with a concrete provenance chain.

**Example provenance trace:**

```
User types: "need meds"
System suggests: "I need to discuss my medication."

Why?
1. "meds" → EXPANDS_TO → "medication" (Pattern p:042, confidence 0.95)
2. User in context "healthcare_visit" (detected via QR code)
3. Script "I need to discuss my medication" USES_IN_CONTEXT "healthcare_visit"
4. User PREFERS "discuss" over "talk about" (Bridge b:pref:019)
```

### 3.4 Stage 3: Adaptive Interface Resolution

The `AdaptiveInterface` component subscribes to context graph changes. When a node's relevance crosses 0.8, the system queries a `ModuleRegistry` for matching UI modules:

**Resolution algorithm:**
1. **Direct match**: Does `node.label` match a registry key? (e.g., "housing scheme" → `HousingPolicyModule`)
2. **Keyword match**: Do node keywords match registered category terms? (e.g., "my rent is high" → housing category → `HousingPolicyModule`)
3. **Semantic match** (planned): Embedding-based fuzzy matching for novel contexts

Relevance thresholds drive UI placement:
- **0.0–0.2**: Pruned (removed from interface)
- **0.2–0.8**: Context Cloud (passive suggestions, background awareness)
- **0.8–0.9**: Active Workspace (full UI modules rendered)
- **0.9+**: Pinned (locked, persistent, survives decay)

### 3.5 Stage 4: Dynamic Workspace Rendering

Resolved modules are composed into a responsive grid layout. A **layout engine** calculates grid sizing ('small', 'medium', 'full') to optimally pack active modules. A **theme engine** detects the dominant domain intent (medical → blue, financial → slate/green) and applies global styling, providing ambient domain awareness without requiring user attention.

### 3.6 Context Collapse Prevention

A critical design goal is preventing **context collapse**—where distinct functional contexts (medical communication, housing policy, personal preferences) blur into a single undifferentiated stream. The context graph maintains separate node clusters per domain. Users can "equip" the Housing module without losing the AAC Support module; they coexist as separate visual blocks. The hex workspace (6 slots) mirrors cognitive working memory limits [15], forcing prioritization while preserving parallel contexts.

---

## 4. Gestural Context Mapping

### 4.1 The Bloom Interface

**Bloom** is a hexagonal visual interface for constructing personal context graphs. It embodies a central design provocation: *what if the effort required to construct context is not a usability problem, but a site of agency?*

#### Hexagonal Grid (6 Slots)

Users drag context nodes from a sidebar onto a hexagonal grid. The hex layout:
- **Evokes organic growth**: Hexagons tile naturally, suggesting interconnection
- **Constrains complexity**: 6 slots force prioritization, mirroring cognitive capacity
- **Enables gestural tracing**: Adjacent hexes can be connected via continuous drag

#### Trace Interaction

Users construct relationships by tracing paths between placed nodes:

1. **Press** on a starting node (e.g., "Child")
2. **Drag** through adjacent nodes (e.g., "Pain" → "Doctor")
3. **Release** to finalize the path

The traced path creates `CONNECTED_TO` edges in the context graph:

```
[Child] --CONNECTED_TO--> [Pain] --CONNECTED_TO--> [Doctor]
```

These edges are included in LLM prompts, producing relationship-aware scripts:
- *"My child is in pain and needs to see a doctor"* (reflects traced path)
- Rather than three independent suggestions about children, pain, and doctors

### 4.2 Friction as Expression

This design deliberately inverts the "frictionless" paradigm dominant in assistive technology. When an AAC system automatically suggests "I need my medication" because it detected a hospital GPS signal, whose interpretation of the situation is being expressed—the user's or the algorithm's?

By making context construction gestural and visible, Bloom:
- **Externalizes cognitive work**: The trace path is a thinking artifact
- **Creates accountability**: The AI can be held accountable to the user's expressed relationships
- **Enables contestation**: Users can point to their trace and say "this is what I meant"
- **Preserves agency**: The system only knows what the user explicitly constructs

### 4.3 Transparency Through Constraint

Bloom deliberately does *not* use ambient data (GPS, calendar, biometrics, conversation history) for automatic context detection. It only knows what the user places on the hex grid. This constraint:
- Makes AI's reasoning legible (it can only use what's on the grid)
- Prevents surveillance creep (no hidden data collection)
- Respects user autonomy (users decide what context is relevant)

The system supports both modes: automatic signal ingestion for convenience *and* manual gestural construction for agency. The user chooses their preferred trade-off.

---

## 5. Three-Layer Epistemic Architecture

### 5.1 Why Separate Layers?

Traditional systems collapse facts, beliefs, and preferences into a single flat store. This creates:
- **Epistemic ambiguity**: "Is this true, or just what the AI thinks I believe?"
- **Authority creep**: AI overwrites user beliefs with "correct" information
- **Trust erosion**: Users can't audit what the system "knows" about them

Spectrum's three-layer separation is enforced at the *data model level*, not just in prompts. This guarantees:
- User beliefs are preserved even when they contradict world facts
- Every AI suggestion traces through explicit bridge paths
- Users can directly edit their Personal layer without affecting World knowledge

### 5.2 Bridge Types and Explainability

Bridges encode nuanced user stance:

| Bridge Type | Meaning | Example |
|-------------|---------|---------|
| `PREFERS_OVER` | User prefers term A over B | "bathroom" over "restroom" |
| `MEANS_TO_ME` | Idiosyncratic meaning | "To infinity!" → excitement |
| `AVOIDS` | User avoids this term | Avoids "wheelchair bound" |
| `EXPANDS_TO` | Abbreviation expansion | "appt" → "appointment" |
| `TRIGGERS` | Word triggers script | "pain" → "I am experiencing pain" |
| `CONTRADICTS` | User belief vs. world fact | Personal belief differs from medical advice |

This enables full provenance for every suggestion: users can ask "why?" and receive a graph traversal answer rooted in their own declared preferences and patterns.

### 5.3 Implications for AAC

For AAC users specifically, the epistemic architecture addresses a critical gap: preserving *authentic voice*. When a user's scripts include echolalic phrases (e.g., "To infinity and beyond!" meaning "I'm excited"), the `MEANS_TO_ME` bridge preserves this idiosyncratic meaning rather than "correcting" it. The system learns and amplifies the user's unique communication patterns rather than normalizing them to a generic standard.

---

## 6. Plugin Architecture

The Context Engine core is domain-agnostic. Domain-specific behavior is encapsulated in plugins:

```python
class ContextPlugin(ABC):
    def process_node(self, node, context_graph) -> List[Suggestion]
    def on_signal(self, signal) -> List[Node]
    def get_suggestions(self, nodes, context_state) -> List[Suggestion]
```

Each plugin defines:
- **Node/Edge types** for its domain (e.g., AAC adds `Script`, `VocabItem`)
- **Signal handlers** for domain-specific signals
- **Suggestion generation** with custom LLM prompt templates
- **User profile schema** for domain-relevant information

Current implementations include AAC (primary), Shopping, and Education plugins. A person navigating both AAC communication *and* housing policy uses the same context engine—contexts can be interdependent (e.g., "I'm at hospital" informs both medical vocabulary *and* social benefits inquiries).

This proves the architecture's generalizability: the context-as-interface paradigm is not AAC-specific but applicable to any domain where static interfaces impose unnecessary navigation overhead.

---

## 7. Implementation

### 7.1 Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | React 18, TypeScript, Vite | Component model, type safety, fast HMR |
| **State** | Zustand with persist middleware | Minimal, TypeScript-friendly, offline-capable |
| **Graph Visualization** | D3.js, React Flow, SVG overlays | Visual context representation |
| **Backend** | FastAPI (Python) | Async-first, automatic OpenAPI spec |
| **Graph Storage** | Neo4j (prod) / In-memory (dev) | Persistent context graphs at scale |
| **LLM Integration** | Multi-provider (OpenAI, Ollama, LM Studio) | LLM-agnostic; zero-code-change provider switching |
| **Real-time** | WebSockets | Live graph updates, collaborative sessions |
| **Speech** | Web Speech API / TTS | Audio I/O for AAC |

### 7.2 Unified Type System

All components consume a single node type:

```typescript
interface UnifiedNode {
    id: string;
    type: NodeType;          // 'Service' | 'Task' | 'Script' | 'VocabItem' | ...
    label: string;
    relevance: number;       // 0–1, drives maturity + UI placement
    timestamp: number;
    layer: 'world' | 'personal' | 'bridge';
    source: NodeSource;      // 'qr' | 'gps' | 'text' | 'manual'
    persistent?: boolean;    // Survives decay
    data?: Record<string, any>;
}
```

This unification means the context engine, CII compositor, and AI services all operate on the same data primitives regardless of which plugin or domain produced them.

### 7.3 Offline-First Architecture

Core AAC functionality (script selection, word bank, TTS, message composition) works entirely offline via localStorage. The service worker scaffolding enables PWA installation. Server synchronization occurs when connectivity is restored, with an offline queue that persists pending messages to IndexedDB.

### 7.4 Multi-Provider LLM Strategy

Spectrum is LLM-agnostic by design. Switching from cloud (OpenAI) to local (Ollama) to desktop GUI (LM Studio) requires only environment variable changes—zero code modifications. This supports:
- **Privacy-first deployment**: Local models for sensitive contexts
- **Offline operation**: Full AI capability without internet
- **Cost flexibility**: Open-source models for resource-constrained settings

---

## 8. Walkthrough: ATF Housing Scenario

To illustrate the pipeline end-to-end, we trace a scenario where a user navigates a housing policy interaction.

**1. Signal Ingestion.** The user scans a QR code at a government housing office. The system creates a node: `{ type: "MANUAL", label: "Housing Scheme", relevance: 0.6 }`.

**2. Context Graph Update.** The Context Engine boosts the "Housing Scheme" node's relevance. Related nodes ("ATF Application," "Financial Assessment") are activated via edge traversal. The housing cluster's aggregate relevance crosses 0.8.

**3. Module Resolution.** The Adaptive Interface detects the threshold crossing. It queries the ModuleRegistry: "housing scheme" → direct match → `HousingPolicyModule`. Secondary match: "financial assessment" → `FinanceModule`.

**4. Workspace Composition.** The layout engine renders `HousingPolicyModule` (medium grid) and `FinanceModule` (small grid) alongside the persistent `CitizenProfileModule`. The theme engine applies a slate/green financial palette. The AAC module remains available but shifts to the context cloud (background).

**5. User Communicates.** The user types "worried rent." The AI expands this using PKG patterns and the active housing context: *"I am worried about my rent increasing."* The suggestion traces through: "rent" USES_IN_CONTEXT "housing_policy" + user PREFERS "worried" over "concerned" (Bridge b:pref:041).

The entire transition—from QR scan to fully composed housing interface with context-aware AI suggestions—occurs without the user navigating a single menu.

---

## 9. Evaluation Considerations

### 9.1 Metrics Framework

| Metric | Definition | Measurement |
|--------|------------|-------------|
| **Navigation overhead** | Menu selections required before first meaningful action | Comparison: static AAC vs. Spectrum |
| **Communication rate** | Words per minute during task completion | Timed service interaction scenarios |
| **Keystroke savings** | (Manual keystrokes − actual) / manual | Logged during use |
| **Restatement count** | Times user re-stated a constraint the system should have retained | Conversation log analysis |
| **Constraint violations** | LLM outputs that violated active user constraints | Automated + manual review |
| **Suggestion acceptance** | Accepted / shown suggestions | Click-through logging |
| **Context switch overhead** | Time to resume a task after switching to another | Task-switching protocol |

### 9.2 Planned Studies

**Lab study**: Simulated service interactions (healthcare check-in, housing policy inquiry) comparing Spectrum against a static AAC baseline. Measures: communication rate, navigation count, task completion time, SUS scores.

**Deployment study**: 3-month longitudinal deployment with AAC users in real service settings. Measures: PKG growth patterns, bridge creation rates, context construction strategies, qualitative interviews on agency and trust.

---

## 10. Discussion

### 10.1 Why Not Full Automation?

A natural question is: why require any user effort in context construction? Why not auto-detect everything via sensors?

We deliberately rejected full automation for three reasons:

1. **Accountability**: When the user explicitly constructs context ("I scanned the hospital QR"), the system's subsequent suggestions can be traced to that action. Ambient detection ("I noticed your GPS is near a hospital") creates attribution ambiguity.

2. **Control**: A user might be *at* a hospital without wanting medical context (visiting a friend, using the cafeteria). Explicit construction lets the user decide what context is relevant.

3. **Agency as expression**: For AAC users specifically, the act of constructing context is itself a form of communication. Tracing CHILD → PAIN → DOCTOR asserts a relationship, not just a selection.

The system supports both modes. Users who want convenience can rely on QR signals and automatic context detection. Users who want agency can use the hex grid. The architecture accommodates this spectrum.

### 10.2 Limitations

- **Commons graph**: The collective intelligence layer (BLOOM commons) is designed but not yet deployed. Patterns like "most people who visit SGEnable also visit the hospital within 14 days" require real population data.
- **Module registry**: Currently uses string matching; planned embedding-based fuzzy matching would enable novel context → module resolution.
- **User studies**: The system is implemented and functional but has not yet undergone formal evaluation with AAC users.
- **Scale**: Tested with 500+ nodes and 1000+ edges in-memory. Production Neo4j deployment is planned but not yet benchmarked.

### 10.3 Generalizability

The context-as-interface paradigm is not AAC-specific. Any domain where users must navigate complex information spaces under cognitive or time constraints—emergency response, clinical decision support, complex form completion—could benefit from signal-driven adaptive UI composition. The plugin architecture demonstrates this generalizability: the same engine powers AAC, housing policy, and medical contexts with domain logic encapsulated in swappable plugins.

---

## 11. Conclusion

Spectrum demonstrates that interfaces need not be static artifacts that users navigate, but can be dynamic compositions that emerge from contextual state. The four-stage pipeline—Ingestion, Context Graph, Adaptation, Rendering—provides a general architecture for context-driven UI composition. The three-layer epistemic graph ensures that AI suggestions are explainable and auditable. And the gestural context mapping interface shows that making context construction visible and effortful can preserve user agency rather than diminish it.

For non-verbal individuals communicating at 2–10 words per minute, every unnecessary menu navigation is a lost sentence. Context as interface eliminates that navigation—not by automating away user choice, but by letting the user's expressed context shape the interface they need.

---

## References

1. Balog, K., Kenter, T., de Vries, A.,"; Serdyukov, P. (2019). Personal knowledge graphs: A research agenda. *ICTIR 2019*.
2. Agre, P. E. (1997). *Computation and Human Experience*. Cambridge University Press.
3. Amershi, S., et al. (2019). Guidelines for human-AI interaction. *CHI 2019*.
4. Baecker, R. M. (1998). Sorting out sorting: A case study of software visualization. *CACM*.
5. Bauer, C., & Neidhardt, J. (2020). Personal knowledge graph construction from text. *RecSys Workshop*.
6. Buxton, W. (1986). Chunking and phrasing and the design of human-computer dialogues. *IFIP Congress*, 475–480.
7. Gajos, K. Z., Wobbrock, J. O., & Weld, D. S. (2010). Automatically generating personalized user interfaces with Supple. *Artificial Intelligence*, 174(12–13), 910–950.
8. Horvitz, E. (1999). Principles of mixed-initiative user interfaces. *CHI 1999*.
9. Holyfield, C., et al. (2025). Just-in-time programming for AAC. *JSLHR*.
10. Horvitz, E. (1999). Principles of mixed-initiative user interfaces. *CHI 1999*.
11. Hurst, A., & Tobias, J. (2011). Empowering individuals with do-it-yourself assistive technology. *ASSETS 2011*.
12. Kane, S. K., & Morris, M. R. (2017). Let's talk about X. *CHI 2017*.
13. Kirsh, D., & Maglio, P. (1994). On distinguishing epistemic from pragmatic action. *Cognitive Science*, 18(4), 513–549.
14. Li, T., et al. (2024). Generative UI: Creating adaptive interfaces with large language models. *CHI 2024*.
15. Miller, G. A. (1956). The magical number seven, plus or minus two. *Psychological Review*, 63(2), 81–97.
16. Myers, B. A. (1995). User interface software tools. *ACM TOCHI*, 2(1), 64–103.
17. Patel, R., & Radhakrishnan, T. (2007). Contextual vocabulary adaptation for AAC. *ASSETS 2007*.
18. Light, J. (1989). Toward a definition of communicative competence for individuals using AAC systems. *AAC*, 4(2), 137–144.
19. Suchman, L. A. (1987). *Plans and Situated Actions*. Cambridge University Press.
20. Valencia, S., et al. (2023). LLM-powered abbreviation expansion for AAC. *ASSETS 2023*.

---

## Appendix A: System Demonstration

A video demonstration is available showing:
1. QR signal ingestion triggering automatic module composition
2. Hexagonal gestural context mapping with trace-to-script generation
3. Three-layer PKG with bridge-traced suggestion provenance
4. Domain switching (AAC → Housing → Medical) via context graph transitions
5. Offline operation with local LLM provider

## Appendix B: Code Availability

Source code available at: [GitHub repository URL]
License: MIT (for research/educational use)

**Codebase statistics:**
- Frontend: ~15,000 lines (React/TypeScript)
- Backend: ~8,000 lines (Python/FastAPI)
- Documentation: 20+ architectural guides

---

*Word Count: ~4,200 words (approximately 10 pages in ACM two-column format)*
