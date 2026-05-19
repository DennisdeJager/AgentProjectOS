# DEPLOYMENT.md

Versiedatum: 2026-05-19 13:34:29 +02:00

## Doel

Dit document beschrijft de lokale deploymentafspraken voor Agent Project OS. De globale deploymentrichtlijn blijft leidend.

## Standaarddoel

Deploy standaard naar Dev:

| Omgeving | CTID | Hostname | IP | User | App directory |
| --- | --- | --- | --- | --- | --- |
| Dev | `142` | `capps-sg-dev` | `192.168.10.12` | `capps` | `/data/dev/apps/agent-project-os` |

## Repository

Beoogde GitHub repository:

```text
https://github.com/DennisdeJager/AgentProjectOS
```

## App-id

```text
agent-project-os
```

## Deploymentroute

1. Werk lokaal in de projectrepo.
2. Voer relevante checks uit.
3. Commit en push naar GitHub.
4. Laat ALM het project registreren/provisionen en deployen via de ALM-managed GitHub workflows `deploy-latest-dev.yml` en `deploy.yml`.
5. Controleer health/readiness.

## Huidige status

Er is een werkende Node/React-app met productiebuild en lokale server. Deployment naar Dev loopt via ALM naar app-id `agent-project-os`.

ALM-runtime:

- container internal port: `3000`
- health/readiness: `/api/health` en `/api/ready`
- Docker image build: `Dockerfile`

Lokale runtime:

```powershell
npm install
npm run build
npm run preview
```

Default local port:

```text
4173
```

## Geplande health endpoints

- `/health`
- `/ready`
- `/api/version`

## Beschikbare health endpoints

- `/api/health`
- `/api/ready`
- `/api/version`

## Releasecontrole

Rapporteer na elke deploy:

- commit-id;
- datum/tijd;
- doelcontainer;
- deployduur;
- health/readiness-status;
- eventuele open risico's.
