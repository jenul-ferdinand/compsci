#!/usr/bin/env bash
set -u

printf 'FIT2109 Rescue Report\n'
printf 'Project root: %s\n' "$(pwd)"
printf 'Log files:\n'
find rescue/logs -maxdepth 1 -type f -name '*.log' | sort
