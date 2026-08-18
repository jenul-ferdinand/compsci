---
name: deadlines
description: Show upcoming assessment deadlines across the current units (fit2102, fit2109, fit3143, fit3184) with days left, weight, difficulty judged against what has been done so far, and time sensitivity. Use when asked "/deadlines", "what's due", "what should I work on", or for a weekly planning check.
---

# Deadlines

Read-only report. Never edit unit files; suggest TODO.md ticks if the repo shows something is done but unchecked.

Scope: `fit2102/`, `fit2109/`, `fit3143/`, `fit3184/`. Never `algorithms/`. Optional argument filters to one unit (`/deadlines fit3143`).

## 1. Fix the calendar

Read `calendar.md` next to this file. Get today with `date +%F`. Compute the current teaching week. If any date in `calendar.md` is marked unconfirmed, keep going but mark affected rows with `~`.

## 2. Collect deadlines

Per unit, in this order (later sources override earlier ones on conflict, and say so):

1. `README.md` assessment section: items, weights, week or date, rules (hurdles, no-extension, group, in-class, GenAI policy).
2. `TODO.md` (gitignored, local): checkbox state and any notes. Checked = done, drop it.
3. `wkXX/OVERVIEW.md` for the current and next two weeks: tasks named for the week, topics that an upcoming quiz or lab draws on.
4. Local spec/rubric PDFs wherever they sit (`ass01/`, `group/`, `wkXX/lab*-spec.pdf`, `wkXX/*rubric*`) if present: read the spec's due date, deliverables, hurdle/interview details. These are gitignored; read them, never quote large chunks into a committed file.

Also add the next occurrence of recurring work: FIT2102 weekly applied (due before next class), FIT2109 pre-class checks, FIT3143 unassessed lab prep before an assessed lab week. One row each, not eleven.

Anything with an unknown date or weight goes in a Watch list, not the main table.

## 3. Judge each item

Fill four fields. Keep reasons to one clause each; the reason is the useful part.

**Days left**: from today to the resolved date. `~` if the date rests on an unconfirmed assumption.

**Weight**: the percentage. For best-N-of-M schemes note the buffer left (e.g. "2%, 1 free miss unused").

**Difficulty (1-5)**: how hard it will be *for this student now*. Start from inherent load, then adjust for readiness:

- Inherent: assignments > in-class tests/quizzes > weekly exercises. Group work, presentations, and unfamiliar tooling (C/MPI, AWS, Docker) push up.
- Readiness evidence, in the repo:
  - `git log --since` and the week folders: is the tute/applied for the covered weeks actually done? Commits like "redo without ai" count as strong; a code bundle commit alone counts as not started.
  - Do the OVERVIEW learning objectives that the assessment draws on have matching completed work? A quiz over weeks 1-5 when wk04-05 tute folders are empty is harder than the weight suggests.
  - Assignment specs read against tute work: which required concepts (e.g. Observables, pure state updates, pthreads timing, containerising a service) already appear in the student's own code?
- Say what the gap is ("no wk04 tute yet; A1 needs the RxJS state pattern from it"), not just the number.

**Time sensitivity (fixed / firm / soft)**:

- fixed: in class, in a workshop, eAssessment window, no extension policy (FIT3143 everything, FIT3184 quizzes, FIT2109 in-class test, FIT2102 quizzes and applied). Missing it means zero.
- firm: submission with a standard extension policy, but a hurdle/interview follows so late rushed work still fails (assignments in FIT2102/FIT3184).
- soft: recurring items with a built-in buffer (best 10 of 11), or dates still TBD.
- Also raise it when others depend on you (group lab, shared repo) or when a one-off window exists (cloud credit invitations).

## 4. Priority and output

Sort by: due within 7 days first (by date), then by weight × difficulty, fixed before firm before soft on ties.

Print:

```
Today: <date>, week <N> [calendar note if unconfirmed]

| Due        | Days left | Unit    | Item                     | Weight | Difficulty | Time sensitivity | Why it's that hard / that urgent |
|------------|-----------|---------|--------------------------|--------|------------|------------------|----------------------------------|

Full words in headers and cells: "Difficulty" is `3/5`, "Time sensitivity" is `fixed` / `firm` / `soft`. No abbreviations anywhere in the output.
```

Then three short sections:

- **This week**: what to actually do in the next 7 days, ordered, one line each, with the smallest concrete first step (which folder, which exercise, who to message).
- **Watch**: TBD dates, unconfirmed weights, invitations, calendar assumptions to confirm.
- **Housekeeping**: TODO.md boxes that look done per git log but are unchecked; unit READMEs missing assessment info.

Keep the whole thing under a screen. No advice essays. If a unit has nothing due in the next 3 weeks, one line saying so.
