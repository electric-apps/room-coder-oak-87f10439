#!/bin/bash
BODY="$(cat)"
RESPONSE=$(curl -s -X POST "https://electric-agent.fly.dev/api/sessions/87f10439-64f3-4bae-b3a1-1281b9698c21/hook-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 5e92b3747414e646d45c9124a30311b68512515a826a29068e5ea16e962447ad" \
  -d "${BODY}" \
  --max-time 360 \
  --connect-timeout 5 \
  2>/dev/null)
if echo "${RESPONSE}" | grep -q '"hookSpecificOutput"'; then
  echo "${RESPONSE}"
fi
exit 0