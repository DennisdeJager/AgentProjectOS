# PROJECT.md

Versiedatum: 2026-05-19 13:34:29 +02:00

## Project Charter

### Naam

Agent Project OS

### Businessdoel

Een AI-assisted applicatie bouwen die multi-agent softwareontwikkeling bestuurbaar, controleerbaar en overdraagbaar maakt. De app helpt om rollen, bevoegdheden, lifecycle-stappen, werkpakketten, kwaliteitsgates en rapportage eenduidig vast te leggen en automatisch te valideren.

### Gebruikers

- Smawa-eigenaar of projectleider die projecten wil structureren.
- Conductor die multi-agent werk verdeelt en bewaakt.
- Scrum Master / Delivery Manager die taken voorbereidt en voortgang bewaakt.
- Architect die technische richting en ADR's bewaakt.
- Engineer die afgebakende werkpakketten uitvoert.
- Tester die acceptatiecriteria en defects controleert.
- Reviewer die scope, codekwaliteit en procesnaleving beoordeelt.
- Deployment Manager die releases en overdracht controleert.

### Scope

- Projectintake en project charter.
- Governance model met rollen, verantwoordelijkheden, bevoegdheden en verboden acties.
- Development lifecycle met entry criteria, exit criteria, eigenaars en toegestane transities.
- Work package model met readiness-score en splitadvies.
- Rule consistency engine voor conflicten en ontbrekende regels.
- Rapportage over voortgang, risico's, besluiten en release readiness.
- AI-assisted generatie met validatie en menselijke goedkeuring.
- API-first kernfunctionaliteit, later bruikbaar voor MCP-tools.

### Out of scope voor de eerste fase

- Volledige CI/CD-implementatie van gegenereerde projecten.
- Automatisch uitvoeren van alle agenttaken in externe repositories.
- Productie-deployment naar Test of Prod.
- Vrije AI-agentautonomie zonder bronmodel en validatie.
- Secretbeheer buiten environment variables of platform secret stores.

### Kernentiteiten

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

### Belangrijkste statussen

- Idea
- Intake
- Refinement
- Architecture Review
- Ready for Build
- Implementation
- Developer Validation
- Test Review
- Code Review
- Release Review
- Done
- Blocked

### Succescriteria

- Een project kan vanuit intake naar gevalideerde source-modellen worden gebracht.
- Elke rol heeft verantwoordelijkheden, bevoegdheden en verboden acties.
- Elke lifecycle-stap heeft entry criteria, exit criteria, eigenaar en toegestane volgende statussen.
- Elke taak kan op agent-readiness worden gescoord.
- Conflicten tussen regels worden gevonden en uitlegbaar gerapporteerd.
- Markdown-output kan opnieuw worden gegenereerd vanuit de source of truth.
- Beheer, audit, LLM-keuze en security zijn vanaf het ontwerp meegenomen.

### Belangrijkste risico's

- Regels worden alsnog verspreid over losse Markdown-bestanden.
- AI genereert extra rollen of regels buiten opdracht.
- Taken worden te groot of bevatten te veel lagen tegelijk.
- Validatie mist conflicten tussen bevoegdheden en workflowregels.
- Rapportage wordt vrijblijvend in plaats van verplicht onderdeel van het proces.

