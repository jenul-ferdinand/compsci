#!/usr/bin/env bash
set -u

cd "$(dirname "$0")"

score=0
total=8
image_name="fit2109-week6:student"

pass() {
    printf '[ok] %s\n' "$1"
    score=$((score + 1))
}

miss() {
    printf '[not ready] %s\n' "$1"
}

venv_python() {
    printf '%s/bin/python' "$1"
}

if grep -Eq '^requests==2\.31\.0[[:space:]]*$' requirements.txt; then
    pass "requirements.txt records the tested direct package version"
else
    miss "write the exact tested requests version in requirements.txt"
fi

if [ -x "$(venv_python .venv-investigate)" ] \
    && [ -x "$(venv_python .venv-rebuild)" ]; then
    pass "two separate virtual environments exist"
else
    miss "create .venv-investigate and .venv-rebuild"
fi

investigate_version=""
rebuild_version=""
if [ -x "$(venv_python .venv-investigate)" ]; then
    investigate_version=$("$(venv_python .venv-investigate)" -c \
        'import requests; print(requests.__version__)' 2>/dev/null || true)
fi
if [ -x "$(venv_python .venv-rebuild)" ]; then
    rebuild_version=$("$(venv_python .venv-rebuild)" -c \
        'import requests; print(requests.__version__)' 2>/dev/null || true)
fi
if [ "$investigate_version" = "2.31.0" ] && [ "$rebuild_version" = "2.31.0" ]; then
    pass "both venvs contain the tested direct package version"
else
    miss "make both venvs use requests 2.31.0"
fi

inspect_output=""
if [ -x "$(venv_python .venv-rebuild)" ]; then
    inspect_output=$("$(venv_python .venv-rebuild)" inspect_env.py 2>/dev/null || true)
fi
if ! grep -q '<TODO' inspect_env.py \
    && grep -q 'sys\.executable' inspect_env.py \
    && grep -q 'sys\.version' inspect_env.py \
    && grep -q 'requests\.__version__' inspect_env.py \
    && grep -q 'requests\.__file__' inspect_env.py \
    && grep -q 'shutil\.which' inspect_env.py \
    && printf '%s\n' "$inspect_output" | grep -Eq 'python executable:.*\.venv-rebuild' \
    && printf '%s\n' "$inspect_output" | grep -Eq 'requests file:.*\.venv-rebuild' \
    && printf '%s\n' "$inspect_output" | grep -Eq 'working directory:' \
    && printf '%s\n' "$inspect_output" | grep -Eq 'curl path:'; then
    pass "inspect_env.py reports the active environment dynamically"
else
    miss "complete every inspect_env.py TODO using runtime values"
fi

if [ -x "$(venv_python .venv-rebuild)" ] \
    && "$(venv_python .venv-rebuild)" check_python.py >/dev/null 2>&1; then
    pass "the Python-layer check passes in .venv-rebuild"
else
    miss "run the Python-layer check in the rebuilt venv"
fi

if docker image inspect "$image_name" >/dev/null 2>&1; then
    app_output=$(docker run --rm "$image_name" 2>/dev/null || true)
    if printf '%s\n' "$app_output" | grep -Eq 'FIT2109 environment project - version (1|2 - .+)' \
        && printf '%s\n' "$app_output" | grep -Eq '^requests 2\.31\.0$' \
        && printf '%s\n' "$app_output" | grep -Eq '^curl [0-9]'; then
        pass "the image runs the complete application"
    else
        miss "make the image default command run app.py with requests and curl"
    fi
else
    miss "build the image tagged fit2109-week6:student"
fi

if docker image inspect "$image_name" >/dev/null 2>&1 \
    && [ "$(docker run --rm "$image_name" pwd 2>/dev/null || true)" = "/app" ] \
    && docker run --rm "$image_name" python inspect_env.py 2>/dev/null \
        | grep -Eq 'python executable:|requests file:'; then
    pass "the image supplies /app and inspectable runtime paths"
else
    miss "verify /app and inspect_env.py inside the image"
fi

if ! grep -q 'TODO' README.md \
    && grep -Eq 'docker build' README.md \
    && grep -Eq 'docker run' README.md \
    && grep -Eq 'docker run.*pwd' README.md \
    && ! grep -q 'TODO' observations.md; then
    pass "README.md and observations.md are complete"
else
    miss "finish the README build/run/directory-check instructions and three observations"
fi

printf '\nProgress: %s/%s\n' "$score" "$total"
[ "$score" -eq "$total" ]
