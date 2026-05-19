# LIFECYCLE.md

Versiedatum: 2026-05-19 13:34:29 +02:00

## Doel

De lifecycle bepaalt hoe werk door Agent Project OS beweegt. Een taak mag pas naar een volgende status wanneer entry criteria, exit criteria en verplichte checks kloppen.

## Statussen

| Status | Eigenaar | Toegestane volgende statussen |
| --- | --- | --- |
| Idea | Conductor | Intake, Blocked |
| Intake | Scrum Master / Delivery Manager | Refinement, Blocked |
| Refinement | Scrum Master / Delivery Manager | Architecture Review, Ready for Build, Blocked |
| Architecture Review | Architect | Ready for Build, Refinement, Blocked |
| Ready for Build | Scrum Master / Delivery Manager | Implementation, Blocked |
| Implementation | Engineer | Developer Validation, Blocked |
| Developer Validation | Engineer | Test Review, Implementation, Blocked |
| Test Review | Tester | Code Review, Implementation, Blocked |
| Code Review | Reviewer | Release Review, Implementation, Test Review, Blocked |
| Release Review | Deployment Manager | Done, Code Review, Blocked |
| Done | Reviewer |  |
| Blocked | Conductor | vorige geldige status |

## Minimale criteria

### Intake

Entry criteria:

- doel van de wijziging is bekend;
- gebruiker of businesscontext is benoemd.

Exit criteria:

- eerste scope is beschreven;
- open vragen zijn genoteerd;
- eigenaar voor refinement is bekend.

### Refinement

Exit criteria:

- acceptatiecriteria zijn concreet;
- testcriteria zijn beschreven;
- files in scope en out of scope zijn benoemd wanneer bekend;
- afhankelijkheden en risico's zijn benoemd;
- work package is klein genoeg of opgesplitst.

### Architecture Review

Entry criteria:

- architectuurimpact is mogelijk of onzeker.

Exit criteria:

- impact is beoordeeld;
- ADR is aangemaakt wanneer structurele keuze nodig is;
- technische risico's zijn vastgelegd.

### Ready for Build

Exit criteria:

- taak is agent-ready;
- rol en reviewer zijn toegekend;
- benodigde documentatie is beschikbaar.

### Implementation

Exit criteria:

- wijziging is binnen scope uitgevoerd;
- relevante tests of checks zijn toegevoegd of uitgevoerd;
- self-check is geschreven.

### Test Review

Exit criteria:

- acceptatiecriteria zijn gecontroleerd;
- defects zijn geregistreerd of uitgesloten;
- testbewijs is vastgelegd.

### Code Review

Exit criteria:

- scope is gecontroleerd;
- kwaliteit en regressierisico zijn beoordeeld;
- open findings zijn opgelost of expliciet geaccepteerd.

### Release Review

Exit criteria:

- build/lint/teststatus is bekend;
- deploymentplan en rollback zijn gecontroleerd;
- health/readiness-checks zijn bekend.

## Bypass

Een lifecycle-stap mag alleen worden overgeslagen wanneer:

- de bypass-regel expliciet bestaat;
- eigenaar en reden zijn vastgelegd;
- risico en vervolgactie zijn geregistreerd;
- een reviewer of conductor dit accepteert.

