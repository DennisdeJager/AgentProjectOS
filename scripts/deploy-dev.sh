#!/usr/bin/env bash
set -euo pipefail

BUNDLE_DIR="${1:-.deploy/agent-project-os}"
DEPLOY_HOST="${DEPLOY_HOST:-192.168.10.12}"
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_APP_DIR="${DEPLOY_APP_DIR:-/data/dev/apps/agent-project-os}"
DEPLOY_SERVICE="${DEPLOY_SERVICE:-agent-project-os-dev}"
DEPLOY_PORT="${DEPLOY_PORT:-4173}"
REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}"

if [[ ! -d "${BUNDLE_DIR}" ]]; then
  echo "Bundle directory not found: ${BUNDLE_DIR}" >&2
  exit 1
fi

ssh "${REMOTE}" "mkdir -p '${DEPLOY_APP_DIR}/current'"
rsync -az --delete "${BUNDLE_DIR}/" "${REMOTE}:${DEPLOY_APP_DIR}/current/"

ssh "${REMOTE}" "DEPLOY_APP_DIR='${DEPLOY_APP_DIR}' DEPLOY_SERVICE='${DEPLOY_SERVICE}' DEPLOY_PORT='${DEPLOY_PORT}' bash -s" <<'REMOTE_SCRIPT'
set -euo pipefail

cd "${DEPLOY_APP_DIR}/current"
npm ci --omit=dev
chown -R capps:capps "${DEPLOY_APP_DIR}"

cat > "/etc/systemd/system/${DEPLOY_SERVICE}.service" <<UNIT
[Unit]
Description=Agent Project OS Dev
After=network.target

[Service]
Type=simple
User=capps
WorkingDirectory=${DEPLOY_APP_DIR}/current
Environment=NODE_ENV=production
Environment=HOST=0.0.0.0
Environment=PORT=${DEPLOY_PORT}
ExecStart=/usr/bin/env node server/index.mjs
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable "${DEPLOY_SERVICE}"
systemctl restart "${DEPLOY_SERVICE}"
sleep 2
curl -fsS "http://127.0.0.1:${DEPLOY_PORT}/api/ready"
REMOTE_SCRIPT

