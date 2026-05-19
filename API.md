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

