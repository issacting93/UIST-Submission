# BLOOM / Spectrum Design Goals

> [!NOTE]
> **Primary Source:** Please refer to `design.md` for the definitive design philosophy and study conditions.

## Core Philosophy: Context as Interface
(Extracted from UIST Paper and design.md)
The interface structure should be a function of the user's context.

### Key Pillars
1. **Implicit → Explicit**: Context is externalized into inspectable objects.
2. **Ephemeral → Persistent**: Context survives across sessions.
3. **Immutable → Mutable**: Users can directly edit and reconfigure state.

## Implementation Roadmap
See `roadmap.md` for the technical execution plan.
The interface structure should be a function of the user's context, not a static hierarchy.
- **Shift from Navigation to Composition:** Users shouldn't navigate menus; the system should compose the necessary tools based on the active context.
- **Context Construction vs. Detection:** Support both automatic detection (convenience) and manual construction (agency/accountability).

## 2. Key Architecture Goals
### A. Four-Stage Reactive Pipeline
1.  **Ingestion:** Accept heterogeneous signals (QR, GPS, Text, Manual) and treat them as unified graph nodes.
2.  **Context Graph:** Maintain a live graph with "Maturity" (Lifecycle) and "Decp" (Cognitive Salience).
3.  **Adaptation:** Resolve UI modules based on active graph nodes (Threshold > 0.8).
4.  **Rendering:** Dynamic grid composition driven by the resolved modules.

### B. Three-Layer Epistemic Graph
Strict separation of data to ensure explainability and preserve user voice.
- **World Layer:** Canonical facts (e.g., standard medical terms).
- **Personal Layer:** User beliefs, scripts, and preferences.
- **Bridge Layer:** The *only* connections between World and Personal.
    - *Types:* `PREFERS_OVER`, `MEANS_TO_ME`, `AVOIDS`, `EXPANDS_TO`.

### C. Hexagonal Gestural Interface
- **Visibile Friction:** Make context construction effortful to preserve agency.
- **Tracing as Thinking:** "Trace" paths between nodes (e.g., CHILD -> PAIN -> DOCTOR) to explicitly define relationships.
- **Constraint:** Limited slots (6) to mirror working memory and force prioritization.

## 3. User Experience Goals
- **Minimize Navigation Overhead:** Critical for AAC users (2-10 wpm).
- **Prevent Context Collapse:** Allow distinct contexts (Housing, Medical) to coexist without blurring.
- **Explainability:** Every suggestion must be traceable to a specific bridge or user action. "Why did you suggest this?" -> "Because you traced X to Y."

## 4. Prioritization
- **Offline-First:** Core AAC must work without internet.
- **LLM-Agnostic:** Switch between OpenAI, Ollama, LM Studio zero-code.
- **Unified Type System:** All signals become `UnifiedNode` types.
