# QUALITY.md

Versiedatum: 2026-05-19 13:34:29 +02:00

## Doel

Kwaliteit in Agent Project OS betekent dat procesregels compleet, consistent, testbaar en uitlegbaar zijn.

## Minimale validators

De app moet minimaal controleren:

- elke rol heeft verantwoordelijkheden;
- elke rol heeft bevoegdheden;
- elke rol heeft verboden acties;
- elke processtap heeft entry criteria;
- elke processtap heeft exit criteria;
- elke processtap heeft een eigenaar;
- elke status heeft toegestane volgende statussen;
- elke taaktemplate heeft acceptatiecriteria;
- elke taaktemplate heeft testcriteria;
- elke taaktemplate heeft rapportage-eisen;
- geen twee rollen zijn eindverantwoordelijk voor hetzelfde besluit;
- geen rol mag iets doen wat elders verboden is;
- geen lifecycle-stap kan worden overgeslagen zonder bypass-regel;
- geen taak kan naar Done zonder testbewijs;
- geen architectuurwijziging kan zonder ADR-regel wanneer dat verplicht is.

## Finding-niveaus

| Niveau | Betekenis |
| --- | --- |
| Blocker | Mag niet worden goedgekeurd of gedeployed |
| High | Moet opgelost of expliciet geaccepteerd worden |
| Medium | Moet worden gepland of verantwoord |
| Low | Verbetering of documentatiepunt |

## Kwaliteitsgates

- Schema validation.
- Governance consistency.
- Lifecycle completeness.
- Work package readiness.
- AI-output contract validation.
- Security and secret check.
- Documentation completeness.
- Release readiness.

## Teststrategie

Unit tests:

- rolbevoegdheden;
- transitieregels;
- readiness-score;
- conflictregels.

Integratietests:

- source model opslaan en laden;
- generatoroutput;
- API-contracten;
- auditlog.

End-to-end tests:

- project intake;
- governance generatie;
- lifecycle validatie;
- work package beoordeling;
- release readiness rapport.

