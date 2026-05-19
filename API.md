# API.md

Versiedatum: 2026-05-19 13:34:29 +02:00

## Doel

Agent Project OS krijgt API-first kernfunctionaliteit. UI, automatisering en latere MCP-tools gebruiken dezelfde businessregels en validatie.

## API-principes

- Contract-first waar mogelijk.
- JSON request/response types.
- Duidelijke foutcodes.
- Paginering en filtering voor lijsten.
- Server-side autorisatie.
- Audit voor beheer- en modelwijzigingen.
- Geen secrets in responses.

## Geplande resources

| Resource | Doel |
| --- | --- |
| `/api/projects` | Projecten beheren |
| `/api/projects/{projectId}/charter` | Project charter beheren |
| `/api/projects/{projectId}/roles` | Rollen, bevoegdheden en restricties beheren |
| `/api/projects/{projectId}/lifecycle` | Lifecycle-stappen en transities beheren |
| `/api/projects/{projectId}/work-packages` | Werkpakketten beheren en scoren |
| `/api/projects/{projectId}/validation` | Validaties uitvoeren en findings opvragen |
| `/api/projects/{projectId}/reports` | Rapportages genereren en opvragen |
| `/api/projects/{projectId}/decisions` | Besluiten en ADR-verwijzingen beheren |
| `/api/projects/{projectId}/risks` | Risico's beheren |
| `/api/admin/config` | Beheerinstellingen, inclusief LLM-selectie |

## Eerste implementatie

De huidige app gebruikt een compacte lokale API zonder Express:

| Endpoint | Methode | Doel |
| --- | --- | --- |
| `/api/health` | GET | Healthcheck |
| `/api/ready` | GET | Readiness met validatiesamenvatting |
| `/api/version` | GET | App-id, versie en lokale versietijd |
| `/api/project-os` | GET | Source-modellen, app-state en validatie |
| `/api/validation/run` | GET/POST | Validator draaien |
| `/api/work-packages` | GET/POST | Werkpakketten lezen en aanmaken |
| `/api/work-packages/{id}` | GET/PUT/DELETE | Werkpakket lezen, wijzigen en verwijderen |
| `/api/decisions` | GET/POST | Besluiten lezen en aanmaken |
| `/api/decisions/{id}` | GET/PUT/DELETE | Besluit lezen, wijzigen en verwijderen |
| `/api/risks` | GET/POST | Risico's lezen en aanmaken |
| `/api/risks/{id}` | GET/PUT/DELETE | Risico lezen, wijzigen en verwijderen |
| `/api/users` | GET/POST | Gebruikers lezen en aanmaken |
| `/api/users/{id}` | GET/PUT/DELETE | Gebruiker lezen, wijzigen en verwijderen |
| `/api/domain-roles` | GET/POST | Domeinrollen lezen en aanmaken |
| `/api/domain-roles/{id}` | GET/PUT/DELETE | Domeinrol lezen, wijzigen en verwijderen |
| `/api/settings` | GET/PUT | Auth-, LLM- en UI-instellingen lezen en wijzigen |

## Foutgedrag

Minimale foutvorm:

```json
{
  "error": {
    "code": "validation_failed",
    "message": "Lifecycle state mist exit criteria.",
    "correlationId": "req_...",
    "details": []
  }
}
```

## Autorisatie

Elke mutatie controleert:

- gebruiker is ingelogd;
- gebruiker heeft projectrol of adminrol;
- rol mag de gevraagde actie uitvoeren;
- actie past bij lifecycle-status.
