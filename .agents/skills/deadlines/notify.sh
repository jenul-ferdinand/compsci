set -euo pipefail
export PATH="/home/jenul/.local/bin:$PATH"

REPO=/home/jenul/repos/compsci

NTFY_TOPIC=""
[ -f "$HOME/.config/deadlines/env" ] && . "$HOME/.config/deadlines/env"
[ -n "$NTFY_TOPIC" ] || { echo "$(date -Is) NTFY_TOPIC unset, see ~/.config/deadlines/env" >&2; exit 1; }

cd "$REPO"

msg=$(claude -p "$(cat <<'PROMPT'
Follow the deadlines skill at .agents/skills/deadlines/SKILL.md, then output ONLY the text of a
phone notification. No preamble, no markdown, no table, no closing remarks, under 200 characters.

If nothing is due within 14 days, output exactly: Nothing due in the next 2 weeks.

Otherwise list the 2 or 3 soonest items as "<unit> <item> <day>". Mark anything whose time
sensitivity is "fixed" with "(fixed)" because missing those means zero. End with:
Run /deadlines for the full report.
PROMPT
)")

[ -n "$msg" ] || { echo "$(date -Is) claude returned nothing" >&2; exit 1; }

curl -sS --fail -H "Title: Uni deadlines" -H "Tags: books" \
  -d "$msg" "https://ntfy.sh/$NTFY_TOPIC" >/dev/null
echo "$(date -Is) sent: $msg"
