# MCP.md

Versiedatum: 2026-05-19 13:34:29 +02:00

## Doel

MCP-tools worden later in een aparte applicatie ondergebracht en gevoed via de API van Agent Project OS. Dit document beschrijft de beoogde tools zodat de API en domeinlogica daar nu al rekening mee houden.

## Tool: project_os_validate

Doel:

- Valideer projectmodellen op schemafouten, ontbrekende regels en conflicten.

Inputschema:

```json
{
  "projectId": "string",
  "scope": "all | governance | lifecycle | work_packages | quality"
}
```

Outputschema:

```json
{
  "status": "passed | failed",
  "findings": [],
  "summary": {
    "blockers": 0,
    "high": 0,
    "medium": 0,
    "low": 0
  }
}
```

Autorisatie:

- Projectlid met leesrechten of hoger.

Foutgedrag:

- `project_not_found`
- `unauthorized`
- `validation_failed`

## Tool: project_os_score_work_package

Doel:

- Bepaal of een taak agent-ready is en geef splitadvies.

Inputschema:

```json
{
  "projectId": "string",
  "workPackageId": "string"
}
```

Outputschema:

```json
{
  "readiness": "ready | not_ready",
  "score": 0,
  "checks": [],
  "splitAdvice": []
}
```

Autorisatie:

- Projectlid met leesrechten of hoger.

Foutgedrag:

- `work_package_not_found`
- `unauthorized`
- `invalid_state`

## Tool: project_os_generate_docs

Doel:

- Genereer Markdown-output vanuit goedgekeurde source-modellen.

Inputschema:

```json
{
  "projectId": "string",
  "targets": ["agents", "governance", "workflow", "templates", "reports"]
}
```

Outputschema:

```json
{
  "generated": [],
  "skipped": [],
  "warnings": []
}
```

Autorisatie:

- Projectbeheerder of rol met documentatiebevoegdheid.

Foutgedrag:

- `source_model_invalid`
- `unauthorized`
- `generation_failed`

## Tool: project_os_report_status

Doel:

- Geef actuele projectstatus, blockers, risico's en release-readiness.

Inputschema:

```json
{
  "projectId": "string",
  "level": "summary | detailed"
}
```

Outputschema:

```json
{
  "projectStatus": {},
  "workPackages": {},
  "risks": [],
  "decisions": [],
  "releaseReadiness": {}
}
```

Autorisatie:

- Projectlid met leesrechten of hoger.

Foutgedrag:

- `project_not_found`
- `unauthorized`
- `report_unavailable`

## Huidige API-bronnen voor latere MCP

De eerste runtime heeft nog geen MCP-server, maar exposeert wel API's die direct als bron kunnen dienen:

- `GET /api/project-os` voor source-modellen, projectstate en validatie.
- `GET|POST /api/validation/run` voor validatie.
- `GET|POST|PUT|DELETE /api/work-packages` voor werkpakketten.
- `GET|POST|PUT|DELETE /api/decisions` voor besluiten.
- `GET|POST|PUT|DELETE /api/risks` voor risico's.
- `GET|PUT /api/settings` voor centrale auth-, LLM- en UI-instellingen.

MCP-tools moeten deze API's blijven volgen, zodat UI en MCP dezelfde regels gebruiken.
