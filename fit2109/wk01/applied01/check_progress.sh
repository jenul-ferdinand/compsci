#!/usr/bin/env bash
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT" || exit 1

score=0
total=3

pass() {
  printf '[PASS] %s\n' "$1"
  score=$((score + 1))
}

fail() {
  printf '[FAIL] %s\n' "$1"
}

printf 'FIT2109 Week 1 Basic Commands Check\n'
printf 'Working directory: %s\n\n' "$ROOT"

if [ -d project ] && [ -d project/notes ] && [ -d project/tmp ] && [ -f project/notes/team-notes.txt ]; then
  pass 'starter project structure is present'
else
  fail 'starter project structure is present'
fi

if [ -f project/archive/team-notes-copy.txt ] \
  && cmp -s project/notes/team-notes.txt project/archive/team-notes-copy.txt; then
  pass 'team notes were copied into project/archive'
else
  fail 'team notes were copied into project/archive'
fi

if [ -f project/tmp/old-debug.archived ] && [ ! -e project/tmp/old-debug.txt ]; then
  pass 'old temporary debug note was renamed'
else
  fail 'old temporary debug note was renamed'
fi

percent=$((score * 100 / total))
printf '\nScore: %s/%s (%s%%)\n' "$score" "$total" "$percent"

if [ "$score" -eq "$total" ]; then
  printf 'Result: terminal setup and basic file operations are ready for the workshop.\n'
  exit 0
else
  printf 'Result: complete the failed file-operation checks, then run this checker again.\n'
  exit 1
fi
