# BLOOM: Context OS

> **"Context as an Interaction Primitive"**

BLOOM is a novel interaction architecture for conversational AI systems that treats context as a first-class interaction object. Instead of relying on ephemeral, turn-based dialogue history, BLOOM externalizes context as structured, persistent, and user-editable state.

This project is positioned for **UIST (User Interface Software and Technology)** as a contribution to interaction techniques and system architecture.

---

## 🌟 Core Philosophy: Context as Interface

BLOOM is built around three fundamental structural transformations:

1.  **Implicit → Explicit Context**: Context is externalized into inspectable, structured objects rather than being buried in conversational turns.
2.  **Ephemeral → Persistent Context**: Context survives across tasks and sessions, eliminating the need for repetitive specification.
3.  **Immutable → Mutable Context**: Users can directly edit, revise, and reconfigure their contextual state to maintain perfect alignment with the AI.

---

## 🏗️ Technical Architecture

### 1. The Three-Layer Epistemic Graph
To ensure explainability and preserve user voice, BLOOM uses a strict layered graph logic:
-   **World Layer**: Canonical facts and shared knowledge.
-   **Personal Layer**: User-specific preferences, beliefs, and scripts.
-   **Bridge Layer**: The *only* valid connections between World and Personal (e.g., `PREFERS_OVER`, `MEANS_TO_ME`).

### 2. Adaptive UI Engine
The interface is a function of the user's active context.
-   **Module Registry**: Maps abstract context nodes to specialized UI modules (Location, Task, Note, etc.).
-   **Dynamic Grid**: Auto-recomposes the interface layout based on node salience and relevance thresholds.

### 3. Interaction Primitives
-   **Hexagonal Workspace**: A manual composition canvas designed with "visible friction" to ensure user agency in context construction.
-   **Node Inspector**: A direct manipulation panel for editing node properties, fulfilling the requirement for **Mutable Context**.
-   **Signal Ingestion**: A reactive pipeline that transforms heterogeneous signals (QR, GPS, Text) into unified graph nodes.

---

## 🛠️ Technology Stack

-   **Frontend**: React 18, TypeScript, Vite
-   **Styling**: Tailwind CSS, CSS Variables
-   **Icons**: Lucide React, Material Symbols (Rounded)
-   **State Management**: Zustand (with Persistence)
-   **Utilities**: Nanoid, Clsx, Lucide

---

## 🚀 Getting Started

### Development
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

---

## 📖 Related Documents

-   [`design.md`](./design.md): Definitive design philosophy and UIST study conditions.
-   [`Design Goals.md`](./Design%20Goals.md): Implementation pillars and UX requirements.
-   [`roadmap.md`](./roadmap.md): Current development status and future phases.

---

## 🤝 Contribution

This codebase is part of a research project aiming to redefine conversational AI transitions from turn-taking to structured state management.
