# REPORTING.md

Versiedatum: 2026-05-19 13:34:29 +02:00

## Doel

Rapportage is verplicht onderdeel van de workflow. De app moet altijd kunnen vertellen waar werk staat, wie eigenaar is, welk bewijs bestaat en wat nog open is.

## Rapportagesoorten

- Projectstatus.
- Rolstatus.
- Dagrapport.
- Weekrapport.
- Open risico's.
- Open besluiten.
- Work package status.
- Release readiness.
- Handover.

## Minimale taakrapportage

Elke taak rapporteert:

- wat is gedaan;
- welke bestanden zijn aangepast;
- welke tests of checks zijn uitgevoerd;
- welke beslissingen zijn genomen;
- welke risico's zijn ontstaan;
- wat nog openstaat;
- advies voor de volgende rol.

## Statusvelden

Een taakstatus bevat minimaal:

```yaml
task:
  id: TASK-0001
  title: Voorbeeldtaak
  status: implementation
  owner: engineer
  reviewer: tester
  lifecycle_state: implementation
  progress:
    last_update: 2026-05-19
    confidence: medium
    blockers: []
    tests_run: []
```

## Release readiness

Release readiness combineert:

- open blockers;
- testbewijs;
- reviewstatus;
- deploymentplan;
- rollbackplan;
- open risico's;
- open besluiten;
- documentatievolledigheid.

