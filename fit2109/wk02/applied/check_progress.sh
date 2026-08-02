#!/usr/bin/env bash
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT" || exit 1

score=0
total=12

pass() {
  printf '[PASS] %s\n' "$1"
  score=$((score + 1))
}

fail() {
  printf '[FAIL] %s\n' "$1"
  if [ "${2-}" ]; then
    printf '       Hint: %s\n' "$2"
  fi
}

contains() {
  grep -Fq "$2" "$1" 2>/dev/null
}

line_count_equals() {
  [ -f "$1" ] && [ "$(wc -l < "$1" | tr -d ' ')" = "$2" ]
}

printf 'FIT2109 Week 2 Shell Rescue and Log Automation Check\n'
printf 'Working directory: %s\n\n' "$ROOT"

if [ -d logs ] && [ -d src ] && [ -d scripts ] && [ -d rescue ] \
  && [ -f logs/app-2026.log ] \
  && [ -f scripts/unsafe-summary.sh ] \
  && [ -f rescue/notes/team-notes.txt ] \
  && [ -f rescue/scripts/run-report.sh ]; then
  pass 'starter project structure is present'
else
  fail 'starter project structure is present' \
    'Check that you are in the extracted week2-automation folder and that logs/, src/, scripts/, and rescue/ exist.'
fi

if [ -s evidence/location.txt ] && contains evidence/location.txt 'week2-automation'; then
  pass 'evidence/location.txt records the lab directory'
else
  fail 'evidence/location.txt records the lab directory' \
    'Create evidence/ first, then run pwd from inside week2-automation and save it to evidence/location.txt.'
fi

if contains evidence/top-level-listing.txt 'check_progress.sh' \
  && contains evidence/top-level-listing.txt 'rescue' \
  && contains evidence/tree.txt 'logs/app-2026.log' \
  && contains evidence/tree.txt 'scripts/unsafe-summary.sh' \
  && contains evidence/tree.txt 'rescue/scripts/run-report.sh'; then
  pass 'saved listings record the top level and project tree'
else
  fail 'saved listings record the top level and project tree' \
    'Regenerate evidence/top-level-listing.txt with ls -l and evidence/tree.txt with find . -maxdepth 3 -print | sort.'
fi

if [ -f "Week 2 Materials/errors log.txt" ] \
  && { contains evidence/unquoted-error.txt 'No such' || contains evidence/unquoted-error.txt 'cannot access'; } \
  && contains evidence/quoted-listing.txt 'errors log.txt'; then
  pass 'quoting evidence shows unsafe and safe filename handling'
else
  fail 'quoting evidence shows unsafe and safe filename handling' \
    'Check the Week 2 Materials/errors log.txt path, evidence/unquoted-error.txt, and evidence/quoted-listing.txt.'
fi

if [ -f rescue/archive/team-notes-copy.txt ] \
  && cmp -s rescue/notes/team-notes.txt rescue/archive/team-notes-copy.txt; then
  pass 'rescue notes were copied into rescue/archive'
else
  fail 'rescue notes were copied into rescue/archive' \
    'The copy should be rescue/archive/team-notes-copy.txt and should match rescue/notes/team-notes.txt.'
fi

if [ -f rescue/tmp/old-debug.archived ] \
  && [ ! -e rescue/tmp/old-debug.txt ] \
  && contains evidence/rescue-tree.txt 'rescue/archive/team-notes-copy.txt' \
  && contains evidence/rescue-tree.txt 'rescue/tmp/old-debug.archived'; then
  pass 'rescue temporary file was renamed and tree evidence was saved'
else
  fail 'rescue temporary file was renamed and tree evidence was saved' \
    'Check that old-debug.txt was renamed to old-debug.archived and regenerate evidence/rescue-tree.txt.'
fi

if [ -x rescue/scripts/run-report.sh ]; then
  pass 'rescue report script has owner execute permission'
else
  fail 'rescue report script has owner execute permission' \
    'Inspect the permission with ls -l and make the owner execute bit visible for rescue/scripts/run-report.sh.'
fi

if contains evidence/path-error.txt 'not found'; then
  pass 'command-name failure was captured in evidence/path-error.txt'
else
  fail 'command-name failure was captured in evidence/path-error.txt' \
    'Run the script by command name only and redirect standard error to evidence/path-error.txt.'
fi

if contains evidence/report.txt 'FIT2109 Rescue Report' \
  && contains evidence/report.txt 'rescue/logs/app.log'; then
  pass 'rescue report script output was saved in evidence/report.txt'
else
  fail 'rescue report script output was saved in evidence/report.txt' \
    'After fixing permission, run ./rescue/scripts/run-report.sh and save standard output to evidence/report.txt.'
fi

if [ -f evidence/missing-stdout.txt ] && [ ! -s evidence/missing-stdout.txt ] \
  && [ -s evidence/missing-stderr.txt ] \
  && [ -f evidence/missing-status.txt ] \
  && [ "$(tr -d '[:space:]' < evidence/missing-status.txt)" != "0" ]; then
  pass 'stdout, stderr, and exit status were captured for missing.log'
else
  fail 'stdout, stderr, and exit status were captured for missing.log' \
    'Recreate missing-stdout.txt, missing-stderr.txt, and missing-status.txt from the same failing ls command.'
fi

if line_count_equals evidence/error-codes.txt 5 \
  && contains evidence/error-codes.txt 'ERROR 404' \
  && contains evidence/error-codes.txt 'ERROR 500' \
  && contains evidence/error-codes.txt 'ERROR 403' \
  && contains evidence/error-code-summary.txt '2 ERROR 404' \
  && contains evidence/error-code-summary.txt '2 ERROR 500' \
  && contains evidence/error-code-summary.txt '1 ERROR 403' \
  && contains evidence/todo-fixme.txt 'src/main.py' \
  && contains evidence/todo-fixme.txt 'TODO' \
  && contains evidence/todo-fixme.txt 'src/utils.py' \
  && contains evidence/todo-fixme.txt 'FIXME' \
  && contains evidence/non-executable-scripts.txt 'scripts/unsafe-summary.sh'; then
  pass 'grep patterns, pipeline, recursive grep, and find evidence is complete'
else
  fail 'grep patterns, pipeline, recursive grep, and find evidence is complete' \
    'Inspect error-codes.txt, error-code-summary.txt, todo-fixme.txt, and non-executable-scripts.txt.'
fi

if [ -x scripts/error-summary.sh ] \
  && grep -Fq 'set -u' scripts/error-summary.sh \
  && grep -Fq 'set -o pipefail' scripts/error-summary.sh \
  && grep -Fq '"$' scripts/error-summary.sh \
  && contains evidence/script-summary.txt '2 ERROR 404' \
  && contains evidence/script-summary.txt '2 ERROR 500' \
  && contains evidence/script-summary.txt '1 ERROR 403' \
  && [ -s evidence/script-missing-stderr.txt ] \
  && [ -f evidence/script-missing-status.txt ] \
  && [ "$(tr -d '[:space:]' < evidence/script-missing-status.txt)" = "1" ]; then
  pass 'safe summary script exists, runs, and reports missing directories'
else
  fail 'safe summary script exists, runs, and reports missing directories' \
    'Check scripts/error-summary.sh permissions, set options, quoted argument use, and the script-summary evidence files.'
fi

percent=$((score * 100 / total))
printf '\nScore: %s/%s (%s%%)\n' "$score" "$total" "$percent"

if [ "$score" -eq "$total" ]; then
  printf 'Result: 100%%. You are ready for the tutor checkpoint.\n'
  exit 0
else
  if [ "$score" -lt 3 ]; then
    printf 'Next checkpoint: reach 3/12 after Task 1 by saving your location and listings.\n'
  elif [ "$score" -lt 4 ]; then
    printf 'Next checkpoint: reach 4/12 after Task 2 by capturing the quoting comparison.\n'
  elif [ "$score" -lt 6 ]; then
    printf 'Next checkpoint: reach 6/12 after Task 3 by repairing the rescue filesystem.\n'
  elif [ "$score" -lt 9 ]; then
    printf 'Next checkpoint: reach 9/12 after Task 4 by fixing the rescue report script and capturing stream evidence.\n'
  elif [ "$score" -lt 11 ]; then
    printf 'Next checkpoint: reach 11/12 after Task 5 by completing grep pattern, pipeline, and find evidence.\n'
  else
    printf 'Next checkpoint: reach 12/12 after Task 6 by writing and running the safe summary script.\n'
  fi
  printf 'Result: keep going. Re-read the failed checks and inspect the matching files.\n'
  exit 1
fi
