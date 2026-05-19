# ARCHITECTURE.md

Versiedatum: 2026-05-19 13:34:29 +02:00

## Architectuurvisie

Agent Project OS wordt model-first gebouwd. De applicatie beheert gestructureerde modellen, valideert die modellen en genereert daaruit Markdown, rapportages en agentinstructies.

## Lagen

### Domain

Bevat kernobjecten en businessregels:

- Project
- Role
- Responsibility
- Authority
- Restriction
- LifecycleState
- Transition
- WorkPackage
- Decision
- Risk
- Report
- QualityGate
- ValidationFinding

### Application

Bevat use cases:

- project intake vastleggen;
- governance model genereren;
- lifecycle model genereren;
- work package readiness scoren;
- consistentie valideren;
- Markdown-output genereren;
- rapportage bijwerken;
- release-readiness bepalen.

### Infrastructure

Bevat opslag, adapters en integraties:

- database of bestandopslag voor source-modellen;
- AI-providerclients;
- auditlog;
- export/generator voor Markdown;
- API-adapters;
- later MCP-adapterapp.

### API

Ontsluit kernfunctionaliteit via contract-first endpoints. UI en latere MCP-tools gebruiken dezelfde businessregels.

### UI

Operational tool, geen demo. De UI volgt hoofdrecord-detailstructuur met tabbladen voor rollen, lifecycle, werkpakketten, validatie, rapportage en beheer.

## Source of truth

`.project-os/source/` wordt leidend. Geplande modellen:

- `project-charter.yaml`
- `governance-model.yaml`
- `role-model.yaml`
- `lifecycle-model.yaml`
- `work-package-model.yaml`
- `quality-model.yaml`
- `reporting-model.yaml`

`.project-os/generated/` bevat gegenereerde output. Bestanden daar mogen opnieuw worden opgebouwd.

## Validatieflow

1. Gebruiker of AI maakt een voorstel.
2. De app valideert schema en verplichte velden.
3. De consistency engine zoekt conflicten.
4. AI mag een verbeterd voorstel maken binnen dezelfde opdracht.
5. Gebruiker keurt goed.
6. Source model wordt opgeslagen.
7. Markdown en rapportages worden gegenereerd.

## Belangrijke ontwerpkeuzes

- Vrije tekst is niet leidend voor procesregels.
- Elke regel moet een eigenaar, bron en validatiestatus kunnen hebben.
- Rollen en lifecycle zijn apart gemodelleerd, maar worden samen gevalideerd.
- Rapportage is onderdeel van de workflow, niet een losse notitie achteraf.

