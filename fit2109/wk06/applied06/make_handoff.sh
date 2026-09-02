#!/usr/bin/env bash
set -eu

if [ "$#" -ne 1 ]; then
    echo "Usage: bash make_handoff.sh DESTINATION"
    exit 2
fi

destination=$1

if [ -e "$destination" ]; then
    echo "Destination already exists: $destination"
    echo "Choose a new empty path."
    exit 2
fi

mkdir -p "$destination"

cp \
    .dockerignore \
    Dockerfile \
    README.md \
    app.py \
    check_progress.sh \
    check_python.py \
    inspect_env.py \
    make_handoff.sh \
    observations.md \
    project_brief.md \
    requirements.txt \
    "$destination"/

echo "Clean handoff created at: $destination"
echo "Local venvs and Docker objects were not copied."
