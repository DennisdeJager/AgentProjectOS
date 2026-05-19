# BACKLOG.md

Versiedatum: 2026-05-19 13:34:29 +02:00

## Werkwijze

Pak per taak bij voorkeur een kleine story op. Een taak is pas ready wanneer scope, acceptatiecriteria, testcriteria, eigenaar en reviewer duidelijk zijn.

## Epic 1 - Project OS foundation

Status: in voorbereiding.

Stories:

- STORY-001: Maak eerste projectdocumentatieset. Status: done op 2026-05-19.
- STORY-002: Maak `.project-os/source/` YAML-modellen. Status: done op 2026-05-19.
- STORY-003: Definieer JSON schema's voor source-modellen.
- STORY-004: Bouw eerste validator voor rollen en lifecycle. Status: deels gedaan op 2026-05-19 als runtime-validator; schema's volgen nog.
- STORY-005: Genereer Markdown vanuit source-modellen.
- STORY-006: Bouw eerste operationele app op basis van source-modellen. Status: done op 2026-05-19.

## Epic 2 - Work package readiness

Status: gepland.

Stories:

- STORY-010: Modelleer work package readiness checks.
- STORY-011: Bouw splitadvies voor te grote taken.
- STORY-012: Maak rapportageformat per lifecycle state.

## Epic 3 - Governance consistency engine

Status: gepland.

Stories:

- STORY-020: Detecteer rolconflicten.
- STORY-021: Detecteer lifecycle-gaps.
- STORY-022: Detecteer ontbrekende eigenaars en criteria.
- STORY-023: Maak conflictrapport met oplossingsvoorstel.

## Epic 4 - API en UI

Status: gepland.

Stories:

- STORY-030: Kies appstack en projectstructuur.
- STORY-031: Bouw projectoverzicht en projectdetail.
- STORY-032: Bouw governance CRUD.
- STORY-033: Bouw lifecycle CRUD.
- STORY-034: Bouw validatieresultaten.
- STORY-035: Bouw beheer tabs voor auth, LLM en audit.
- STORY-036: Verduidelijk primaire appflow en navigatie. Status: done op 2026-05-19.

## Epic 5 - AI-assisted generation

Status: gepland.

Stories:

- STORY-040: Voeg centrale LLM-configuratie toe.
- STORY-041: Bouw projectintake prompt met schema-output.
- STORY-042: Bouw governance generatie met validatie.
- STORY-043: Bouw lifecycle generatie met validatie.
- STORY-044: Bouw AI verbeterloop voor validation findings.
