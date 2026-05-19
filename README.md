# Agent Project OS

Versiedatum: 2026-05-19 13:34:29 +02:00

Agent Project OS ontwerpt, controleert en bewaakt een consistent operating model voor multi-agent softwareontwikkeling. De app helpt om projecten niet te starten vanuit losse bestanden of agentprompts, maar vanuit een expliciet procesmodel met rollen, bevoegdheden, lifecycle-stappen, werkpakketten, kwaliteitscontroles en rapportage.

## Kernidee

Het systeem maakt drie soorten output:

- Source of truth: machine-leesbare modellen in `.project-os/source/`.
- Agent-readable documents: instructies, workflows en templates in `.project-os/generated/`.
- Human-readable reports: voortgang, risico's, besluiten en release-readiness in `reports/`.

De belangrijkste belofte: regels worden niet alleen gegenereerd, maar ook gevalideerd op conflicten, ontbrekende criteria en onduidelijke eigenaarschap.

## Documenten

| Bestand | Doel |
| --- | --- |
| `AGENTS.md` | Werkinstructies voor Codex en andere agents in dit project |
| `PROJECT.md` | Project charter, scope en succescriteria |
| `GOVERNANCE.md` | Rollen, bevoegdheden, verboden acties en escalaties |
| `ARCHITECTURE.md` | Architectuur, lagen, kernobjecten en validatieflow |
| `DATA_MODEL.md` | Centrale domeinobjecten en relaties |
| `LIFECYCLE.md` | Statussen, entry criteria, exit criteria en transities |
| `WORK_PACKAGES.md` | Taakmodel, readiness-score en splitregels |
| `QUALITY.md` | Validators, kwaliteitsgates en teststrategie |
| `REPORTING.md` | Rapportageformats en statusmodel |
| `API.md` | Verwachte API-contracten voor kernfunctionaliteit |
| `MCP.md` | Voorbereiding voor latere MCP-tools |
| `LLM.md` | AI-provider, modelkeuze, prompts en guardrails |
| `UX.md` | Schermstructuur, beheer, CRUD en responsive UX |
| `SECURITY.md` | Auth, autorisatie, secrets, audit en privacy |
| `DEPLOYMENT.md` | Lokale deployafspraken voor Dev |
| `BACKLOG.md` | Eerste werkvoorraad |

## Huidige status

De eerste werkende app is aanwezig:

- React/Vite frontend met operationele projectnavigatie.
- Node API voor source-modellen, projectstate, validatie en CRUD.
- Source-modellen in `.project-os/source/`.
- Lokale projectstate in `.project-os/state/app-data.json`.
- CRUD voor werkpakketten, besluiten, risico's, gebruikers en domeinrollen.
- Beheer voor authenticatie- en LLM-instellingen.
- Health/readiness endpoints: `/api/health`, `/api/ready`, `/api/version`.

## Lokaal draaien

```powershell
npm install
npm run dev
```

Productiebuild lokaal controleren:

```powershell
npm run build
npm run preview
```

Validator:

```powershell
npm run validate
```
