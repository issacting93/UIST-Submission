Context as an Interaction Primitive:
Explicit, Persistent, and Mutable Context in Conversational AI
1. Overview

This project introduces a novel interaction architecture for conversational AI systems in which context is treated as a first-class interaction object. Rather than relying on ephemeral, turn-based conversational memory, the system externalizes context as structured, persistent, and user-editable state.

The work is positioned for UIST as a contribution in interaction techniques and system architecture, rather than a traditional usability study. The core contribution is a new interaction model that transforms conversational AI from implicit, transient dialogue into structured state manipulation.

2. Conceptual Foundation

The architecture is built around three structural transformations:

Implicit → Explicit Context
Context is externalized into inspectable representations rather than embedded solely within conversational turns.

Ephemeral → Persistent Context
Context persists across tasks and sessions instead of being reconstructed through repetition.

Immutable → Mutable Context
Users can directly edit, revise, and reconfigure contextual state rather than relying on conversational repair.

These transformations redefine conversational AI interaction from turn-taking to structured state management.

3. Interaction Conditions

The evaluation compares three interaction architectures:

Condition 1: Baseline Chat

Standard turn-based GPT interaction.

Context is implicit and ephemeral.

No structured inspection or editing.

Condition 2: Text-Augmented Persistence

Context is explicitly summarized in text form.

Context persists across tasks.

No structured editing or mutation mechanism.

Condition 3: BLOOM (Full Context Interface)

Context represented as structured objects.

Persistent across tasks.

Directly mutable by the user.

Supports constraint inspection and modification.

The manipulation isolates the effect of context persistence and mutability as interaction primitives.

4. Interaction Design Constraints

The study is designed under the following constraints:

4.1 Context Accumulation

Tasks must require context to persist across steps. One-shot tasks are insufficient to evaluate structural differences.

4.2 Shared Latent Structure

All tasks share:

Goal states

Personal constraints

Trade-offs

Dependency relationships

This ensures persistence meaningfully impacts performance.

4.3 Mid-Task Constraint Mutation

Participants encounter a new constraint mid-task (e.g., injury, schedule change). This forces replanning and highlights differences in mutation capability.

4.4 Controlled Visual Variables

Interface aesthetics, typography, and model outputs remain consistent across conditions to isolate interaction architecture effects.

5. Task Design
Task 0: Context Construction

Participants build an initial profile:

Schedule constraints

Energy levels

Goals

Preferences

This establishes persistent state.

Task 1: Advice Task

Participants seek tailored advice based on their profile.

Example:

Improve energy while maintaining full-time work responsibilities.

Task 2: Planning Task

Participants generate a structured multi-week plan that incorporates prior context.

Task 3: Constraint Mutation & Replanning

A new constraint is introduced mid-task:

Example: A knee injury limits gym activity.

Participants must update the plan accordingly.

This task operationalizes context mutation.

6. Measured Outcomes
6.1 Primary Interaction Metrics

Constraint survival rate

Repair loop frequency

Context repetition frequency

Context mutation frequency

Time to successful replanning

These measure structural governance rather than surface usability.

6.2 Secondary Metrics

NASA-TLX (cognitive load)

Task completion time

Perceived control

Perceived transparency

Trust calibration

7. Hypotheses

H1: Persistent context reduces repeated specification burden.
H2: Explicit context reduces repair loops.
H3: Mutable context improves adaptive replanning performance.
H4: Structured context increases perceived control.
H5: Constraint survival rate is highest in the mutable condition.

8. Study Structure
Quantitative Study

N = 100

Between-subjects design

Balanced across three conditions

Qualitative Follow-up

N = 20

Semi-structured interviews probing:

Perceived control

Role perception of AI

Repair experience

Frustration moments

9. UIST Contribution Framing

This work contributes:

A novel interaction technique: context as a manipulable object.

A system architecture for persistent and mutable AI context.

An empirical evaluation demonstrating altered interaction dynamics.

A framework for measuring constraint survival and repair in conversational systems.

The contribution extends conversational interfaces beyond turn-based interaction toward structured state manipulation.

10. Positioning Within UIST

The work aligns with UIST’s emphasis on:

Interaction techniques

Novel UI primitives

Human-AI interface design

System-level innovation

Rather than focusing solely on usability improvement, this project demonstrates how context persistence and mutability fundamentally change the structure of AI interaction.