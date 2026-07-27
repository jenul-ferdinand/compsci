---
name: write-commits
description: Commit changes in conventional commit style, grouped into meaningful chunks of related files instead of one big commit. Use when asked to commit, or when uncommitted changes need committing before a PR.
---

# Write Commits

Commit the working tree as a series of small, logical commits — not one commit with everything in it.

## Scope

- If working on a specific task, commit the files relevant to that task.
- Otherwise, commit all changed files — still in chunks.

## Chunking

- Review `git status` and `git diff` first to understand what changed.
- Group files by logical unit of work: a feature, a fix, a refactor, a config change, docs.
- One chunk = one commit. Stage each chunk explicitly: `git add <file> <file>` — never `git add -A` for everything at once.
- Don't over-split either: files that only make sense together (e.g. a source file and its test) belong in the same commit.

## Message style

- Conventional commits: `type(scope): subject` — types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`, `build`, `style`. Scope is optional.
- Subject: imperative, lowercase, concise, no trailing period.
- No body unless the change genuinely needs explanation.
- No AI attribution — no `Co-Authored-By` or "Generated with" trailers.

## This repo

- Use the unit code as the scope for unit work: `feat(fit2102): add wk02 tute`. No scope for repo-level changes (README, .gitignore, skills).
- Unit content is usually `feat` (new work) or `refactor` (reorganising folders); `docs` for READMEs and notes.
- `algorithms/` is a git submodule — never commit inside it from here. Work happens in its own repo; then bump the pointer:

```bash
git -C algorithms fetch origin && git -C algorithms checkout origin/main
git add algorithms && git commit -m "chore: bump algorithms submodule"
```
