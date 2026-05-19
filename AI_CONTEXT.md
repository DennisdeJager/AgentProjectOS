# AI Context

Een app die AI-assisted een consistent operating model voor multi-agent softwareontwikkeling ontwerpt, controleert en bewaakt.


Doel:

- De app begeleidt jou bij het maken van een projectstructuur waarin alle onderdelen op elkaar aansluiten:
- De app moet dus niet beginnen met files, maar met een procesmodel.

Naam:
Agent Project OS

Proces:
Doel van het project
↓
Ontwikkelproces
↓
Rollen en bevoegdheden
↓
Werkpakketten
↓
Besluitvorming
↓
Kwaliteitscontrole
↓
Voortgangsrapportage
↓
Release en overdracht

De lagen van de projectstructuur

Ik zou de app laten werken met deze lagen:

1. Project Charter

Hierin staat waarom het project bestaat.

Projectdoel
Gebruikers
Businessdoel
Scope
Out-of-scope
Belangrijkste risico’s
Succescriteria

Dit is de bovenste laag. Alles eronder moet hiermee kloppen.

2. Governance Model

Dit is de belangrijkste laag.

Hierin staat:

Welke rollen bestaan er
Welke verantwoordelijkheden hebben ze
Welke bevoegdheden hebben ze
Welke dingen mogen ze expliciet niet doen
Welke beslissingen vereisen escalatie
Welke output moet elke rol opleveren

Voorbeeld:

roles:
  architect:
    responsibilities:
      - Ontwerpt technische oplossingsrichtingen
      - Beoordeelt impact op architectuur
      - Maakt ADR’s bij structurele keuzes
    allowed:
      - Architecture proposals maken
      - ADR’s opstellen
      - Technische risico’s markeren
    forbidden:
      - Productscope zelfstandig wijzigen
      - Features direct implementeren zonder taak
      - Tests accepteren namens tester

De app kan daarna controleren:

Mag de architect code schrijven?
Mag de tester bugs fixen?
Mag de engineer requirements aanpassen?
Mag de scrum master technische keuzes maken?

En als twee regels botsen, moet de app dat signaleren.

3. Development Lifecycle

Dit is de vaste volgorde waarin werk mag bewegen.

Bijvoorbeeld:

Idea
↓
Intake
↓
Refinement
↓
Architecture Review
↓
Ready for Build
↓
Implementation
↓
Developer Validation
↓
Test Review
↓
Code Review
↓
Release Review
↓
Done

Elke status heeft:

Entry criteria
Exit criteria
Eigenaar
Toegestane rollen
Verplichte documenten
Verplichte checks
Volgende toegestane statussen

Voorbeeld:

states:
  ready_for_build:
    entry_criteria:
      - Acceptance criteria zijn ingevuld
      - Files in scope zijn benoemd
      - Testaanpak is beschreven
      - Architectuurimpact is beoordeeld
    owner: scrum_master
    allowed_next:
      - implementation

Hiermee voorkom je dat een agent zomaar begint te bouwen terwijl de taak nog vaag is.

4. Work Package Model

Dit is cruciaal voor multi-agent ontwikkeling.

Elke taak moet klein, geïsoleerd en controleerbaar zijn.

Een taak bevat minimaal:

ID
Titel
Doel
Context
Niet-doelen
Files in scope
Files out of scope
Afhankelijkheden
Acceptatiecriteria
Testcriteria
Toegestane rol
Reviewer
Risico’s
Verwachte output
Rapportageformat

De app moet taken kunnen beoordelen op “agent readiness”.

Bijvoorbeeld met score:

Scope duidelijk: ja/nee
Acceptatiecriteria concreet: ja/nee
Te groot: ja/nee
Files in scope benoemd: ja/nee
Testbaar: ja/nee
Architectuurimpact duidelijk: ja/nee

Als een taak te groot is, moet de app voorstellen om hem te splitsen.

5. Rule Consistency Engine

Dit is eigenlijk het hart van de app.

De app moet regels analyseren op conflicten.

Voorbeelden van conflicten:

Engineer mag geen dependencies toevoegen
Maar task-template zegt: voeg benodigde dependencies toe

Tester mag geen code aanpassen
Maar bugfix workflow zegt: tester fixt kleine defects

Architect mag geen implementatie doen
Maar spike workflow zegt: architect mag prototype bouwen

Scrum master bepaalt prioriteit
Maar product owner bepaalt prioriteit

De app moet dan teruggeven:

Conflict gevonden
Betrokken bestanden/regels
Waarom dit botst
Voorstel voor oplossing
Welke regel leidend moet zijn

Belangrijk: je wilt niet alleen genereren, maar ook valideren.

Dus:

project-os validate

Geeft bijvoorbeeld:

3 conflicten gevonden
5 ontbrekende verantwoordelijkheden
2 rollen met overlappende bevoegdheden
4 processtappen zonder exit criteria
1 status zonder eigenaar
De projectstructuur die de app zou moeten genereren

Niet als technische appstructuur, maar als processtructuur:

project/
├── AGENTS.md
├── PROJECT.md
├── GOVERNANCE.md
├── .project-os/
│   ├── source/
│   │   ├── project-charter.yaml
│   │   ├── governance-model.yaml
│   │   ├── lifecycle-model.yaml
│   │   ├── role-model.yaml
│   │   ├── work-package-model.yaml
│   │   ├── reporting-model.yaml
│   │   └── quality-model.yaml
│   ├── generated/
│   │   ├── roles/
│   │   ├── process/
│   │   ├── templates/
│   │   └── agent-instructions/
│   ├── validation/
│   │   ├── consistency-report.md
│   │   ├── role-conflicts.md
│   │   ├── lifecycle-gaps.md
│   │   └── missing-rules.md
│   └── state/
│       ├── project-status.yaml
│       ├── active-work.yaml
│       ├── decisions.yaml
│       └── risks.yaml
├── backlog/
│   ├── epics/
│   ├── stories/
│   ├── tasks/
│   ├── blocked/
│   ├── review/
│   └── done/
├── reports/
│   ├── daily/
│   ├── weekly/
│   ├── role-status/
│   ├── risks/
│   └── release-readiness/
├── decisions/
│   └── ADR-0001-template.md
├── handovers/
├── reviews/
└── test-results/

Belangrijk verschil:

.project-os/source/

is leidend.

Alles in:

.project-os/generated/

mag opnieuw gegenereerd worden.

Zo voorkom je dat gegenereerde tekst de waarheid wordt.

De AI-assisted flow in de app

Ik zou de app zo laten werken.

Stap 1 — Project intake

De app vraagt:

Wat bouwen we?
Voor wie?
Waarom?
Wat is absoluut belangrijk?
Wat mag er niet gebeuren?
Welke mate van strengheid wil je?
Welke rollen wil je gebruiken?
Welke technologie wordt verwacht?
Hoe autonoom mogen agents werken?

Output:

project-charter.yaml
Stap 2 — Governance generation

AI maakt een eerste governance model.

Daarna controleert de app:

Zijn alle rollen uniek?
Zijn verantwoordelijkheden niet dubbel?
Zijn bevoegdheden expliciet?
Zijn verboden handelingen vastgelegd?
Is er een escalatiepad?

Output:

governance-model.yaml
role-model.yaml
GOVERNANCE.md
roles/*.md
Stap 3 — Lifecycle generation

AI maakt de ontwikkelvolgorde.

Bijvoorbeeld:

Intake
Refinement
Architecture
Planning
Build
Self-check
Test
Review
Release
Done

De app controleert:

Heeft elke stap een eigenaar?
Heeft elke stap entry criteria?
Heeft elke stap exit criteria?
Zijn overgangen logisch?
Kan werk teruggezet worden?
Waar worden blockers geregistreerd?

Output:

lifecycle-model.yaml
process/workflow.md
process/task-lifecycle.md
Stap 4 — Work package model

AI maakt taaktemplates.

De app controleert of taken klein genoeg zijn.

Bijvoorbeeld:

Maximaal één functionele wijziging
Maximaal één technische laag tegelijk
Geen gecombineerde refactor + feature
Geen gecombineerde backend + frontend + database tenzij expliciet toegestaan
Altijd testbaar
Altijd reviewbaar

Output:

templates/task-template.md
templates/story-template.md
templates/handover-template.md
Stap 5 — Reporting model

Hier wordt bepaald hoe voortgang wordt bijgehouden.

Bijvoorbeeld:

Per taak
Per rol
Per epic
Per dag
Per release
Per risico
Per blocker

Een agent moet na werk altijd rapporteren in vast format:

Wat is gedaan
Welke bestanden zijn aangepast
Welke tests zijn uitgevoerd
Welke beslissingen zijn genomen
Welke risico’s zijn ontstaan
Wat is nog open
Advies voor volgende rol

Output:

reports/daily/YYYY-MM-DD.md
reports/role-status/engineer.md
reports/risks/open-risks.md
.project-os/state/project-status.yaml
Belangrijk: maak rapportage verplicht onderdeel van de workflow

Dus niet vrijblijvend.

Elke taak heeft een status.

Bijvoorbeeld:

task:
  id: TASK-0012
  title: Add login validation
  status: implementation
  owner: engineer
  reviewer: tester
  lifecycle_state: build
  progress:
    last_update: 2026-05-19
    confidence: medium
    blockers: []
    tests_run:
      - npm test
      - npm run typecheck

Dan kan de app altijd een voortgangsrapport maken.

Bijvoorbeeld:

Projectstatus
- 4 taken klaar voor build
- 2 taken in implementatie
- 1 taak geblokkeerd
- 3 taken wachten op test
- 1 architectuurbesluit open
- Release readiness: 62%
De rollen die ik zou starten

Ik zou beginnen met deze rollen:

Conductor

Bewaakt het totale proces.

Mag:

Werk verdelen
Status opvragen
Conflicten signaleren
Escalaties starten

Mag niet:

Code schrijven
Requirements wijzigen
Tests goedkeuren
Architectuur wijzigen
Scrum Master / Delivery Manager

Bewaakt voortgang en taakvolwassenheid.

Mag:

Epics splitsen
Taken voorbereiden
Blockers registreren
Voortgang rapporteren

Mag niet:

Technische oplossing bepalen
Code schrijven
Testresultaten accepteren
Architect

Bewaakt technische richting.

Mag:

Architectuurbesluiten nemen binnen mandaat
ADR’s schrijven
Technische risico’s benoemen
Designs reviewen

Mag niet:

Functionele scope veranderen
Taken sluiten zonder review
Testbewijs overslaan
Engineer

Bouwt alleen afgebakende taken.

Mag:

Code wijzigen binnen scope
Tests toevoegen
Technische bevindingen rapporteren

Mag niet:

Buiten scope werken
Architectuur wijzigen zonder ADR
Acceptatiecriteria aanpassen
Tester

Controleert kwaliteit.

Mag:

Testplannen maken
Defects registreren
Acceptatiecriteria valideren

Mag niet:

Code wijzigen
Features goedkeuren zonder bewijs
Requirements aanpassen
Reviewer

Controleert scope, kwaliteit en proces.

Mag:

Code reviewen
Procesafwijkingen signaleren
Taken terugzetten

Mag niet:

Nieuwe scope toevoegen
Ongeteste wijzigingen accepteren
Deployment Manager

Bewaakt releasebaarheid.

Mag:

Release checklist uitvoeren
Rollbackplan controleren
Omgevingsvariabelen controleren

Mag niet:

Functionele scope wijzigen
Code aanpassen zonder taak
Wat de app met AI moet doen

De AI moet niet vrij gaan fantaseren.

De AI krijgt per stap een beperkte opdracht.

Bijvoorbeeld:

Genereer alleen het role-model.
Gebruik alleen deze projectcontext.
Gebruik deze vaste YAML-structuur.
Verzin geen extra rollen tenzij gevraagd.
Markeer onzekerheden als open_questions.

Daarna valideert de app de output.

Dus flow:

AI genereert voorstel
↓
App valideert structuur
↓
App checkt inconsistenties
↓
AI mag verbeteren
↓
Gebruiker keurt goed
↓
Bestanden worden gegenereerd

Dit is veel sterker dan “AI maak even een projectstructuur”.

De belangrijkste validators

De app moet minimaal deze checks hebben:

Elke rol heeft verantwoordelijkheden
Elke rol heeft bevoegdheden
Elke rol heeft verboden acties
Elke processtap heeft entry criteria
Elke processtap heeft exit criteria
Elke processtap heeft een eigenaar
Elke status heeft toegestane volgende statussen
Elke taaktemplate heeft acceptatiecriteria
Elke taaktemplate heeft testcriteria
Elke taaktemplate heeft rapportage-eisen
Geen twee rollen zijn eindverantwoordelijk voor hetzelfde besluit
Geen rol mag iets doen wat elders verboden is
Geen lifecycle-stap kan worden overgeslagen zonder expliciete bypass-regel
Geen taak kan naar done zonder testbewijs
Geen architectuurwijziging zonder ADR-regel
De app zou uiteindelijk drie soorten output maken
1. Source of truth

Machine-leesbaar:

project-charter.yaml
governance-model.yaml
role-model.yaml
lifecycle-model.yaml
quality-model.yaml
reporting-model.yaml
2. Agent-readable documents

Voor Codex/Hermes:

AGENTS.md
roles/engineer.md
roles/tester.md
process/workflow.md
templates/task-template.md
3. Human-readable reports

Voor jou:

Projectstatus
Roloverzicht
Open risico’s
Open beslissingen
Conflictrapport
Release readiness
Mijn advies voor het ontwerp

Maak de app rond deze centrale objecten:

Project
Role
Responsibility
Authority
Restriction
LifecycleState
Transition
WorkPackage
Decision
Risk
Report
QualityGate

Dan kun je alles logisch valideren.

Niet beginnen vanuit Markdown.

Markdown is output.

Het echte model moet gestructureerd zijn.

Simpel voorbeeld van het centrale model
project:
  name: booking-platform
  strictness: high

roles:
  engineer:
    owns:
      - implementation
      - unit_tests
    may:
      - modify_code_within_task_scope
      - add_tests
    may_not:
      - change_requirements
      - approve_own_work
      - change_architecture_without_adr

lifecycle:
  states:
    refinement:
      owner: scrum_master
      exit_criteria:
        - task_has_acceptance_criteria
        - task_has_scope
        - task_has_test_criteria
    architecture_review:
      owner: architect
      exit_criteria:
        - architecture_impact_assessed
    implementation:
      owner: engineer
      exit_criteria:
        - code_complete
        - tests_added
        - self_check_report_written
    test_review:
      owner: tester
      exit_criteria:
        - acceptance_criteria_validated
        - defects_registered_or_none
    done:
      owner: reviewer
      entry_criteria:
        - all_quality_gates_passed

Vanuit dit model kun je alles genereren.

Wat ik zou voorkomen

Niet doen:

Een enorme AGENTS.md met alles erin
Losse rolprompts zonder centrale controle
Vrije tekst als bron van waarheid
Agents zelf laten bepalen wat het proces is
Taken zonder scope
Geen expliciete bevoegdheden
Geen rapportageplicht
Geen validatie op conflicten

Want dan krijg je precies waar je bang voor bent: regels die elkaar tegenspreken en agents die allemaal net iets anders doen.