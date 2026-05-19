# Source Models

Versiedatum: 2026-05-19 13:34:29 +02:00

Deze map wordt de bron van waarheid voor Agent Project OS.

Bronmodellen:

- `project-charter.yaml`: projectdoel, gebruikers, scope, risico's en succescriteria.
- `governance-model.yaml`: governanceprincipes, besluitregels, escalaties en consistentieregels.
- `role-model.yaml`: rollen, verantwoordelijkheden, bevoegdheden, verboden acties en output.
- `lifecycle-model.yaml`: statussen, eigenaars, criteria, transities en bypassregels.
- `work-package-model.yaml`: verplichte taakvelden, readiness checks, splitregels en done/ready definities.
- `quality-model.yaml`: validators, kwaliteitsgates, finding-niveaus en teststrategie.
- `reporting-model.yaml`: rapportagesoorten, taakstatusschema en release-readiness inputs.

Markdown-documenten mogen nooit belangrijker worden dan deze source-modellen. Als een Markdown-bestand afwijkt van `source/`, is `source/` leidend.

## Status

Baseline aangemaakt op 2026-05-19. De volgende stap is het definieren van JSON/YAML schema's en een validator die deze modellen automatisch controleert.
