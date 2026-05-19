# GOVERNANCE.md

Versiedatum: 2026-05-19 13:34:29 +02:00

## Doel

Governance bepaalt wie wat mag doen, wie eigenaar is van beslissingen en welke acties expliciet verboden zijn. Dit document is de eerste mensleesbare versie; het toekomstige `governance-model.yaml` en `role-model.yaml` worden leidend.

## Basisrollen

### Conductor

Verantwoordelijkheden:

- Bewaakt het totale multi-agent proces.
- Verdeelt werk naar rollen.
- Vraagt status op.
- Signaleert conflicten en procesafwijkingen.
- Start escalaties.

Mag:

- Werkpakketten toewijzen binnen het goedgekeurde proces.
- Statusrapportages opvragen.
- Blockers en risico's markeren.
- Escalatie naar eigenaar of gebruiker starten.

Mag niet:

- Code schrijven.
- Requirements wijzigen.
- Tests goedkeuren.
- Architectuur wijzigen.

### Scrum Master / Delivery Manager

Verantwoordelijkheden:

- Bewaakt voortgang en taakvolwassenheid.
- Splitst epics naar stories en werkpakketten.
- Registreert blockers.
- Houdt voortgangsrapportage actueel.

Mag:

- Taken voorbereiden en opsplitsen.
- Agent-readiness beoordelen.
- Blockers registreren.
- Voortgang rapporteren.

Mag niet:

- Technische oplossing bepalen.
- Code schrijven.
- Testresultaten accepteren.
- Architectuurbesluiten nemen.

### Architect

Verantwoordelijkheden:

- Bewaakt technische richting.
- Beoordeelt architectuurimpact.
- Schrijft ADR's bij structurele keuzes.
- Benoemt technische risico's.

Mag:

- Architecture proposals maken.
- ADR's opstellen.
- Technische risico's markeren.
- Designs reviewen.

Mag niet:

- Functionele scope veranderen.
- Taken sluiten zonder review.
- Testbewijs overslaan.

### Engineer

Verantwoordelijkheden:

- Bouwt afgebakende taken.
- Voegt passende tests toe.
- Rapporteert technische bevindingen.

Mag:

- Code wijzigen binnen taakscope.
- Tests toevoegen of aanpassen.
- Technische blocking issues melden.

Mag niet:

- Buiten scope werken.
- Architectuur wijzigen zonder ADR.
- Acceptatiecriteria aanpassen.
- Eigen werk definitief goedkeuren.

### Tester

Verantwoordelijkheden:

- Controleert kwaliteit tegen acceptatiecriteria.
- Maakt testplannen en registreert defects.
- Valideert of bewijs voldoende is.

Mag:

- Testcases opstellen.
- Defects registreren.
- Taken terugzetten bij ontbrekend bewijs.

Mag niet:

- Code wijzigen.
- Features goedkeuren zonder bewijs.
- Requirements aanpassen.

### Reviewer

Verantwoordelijkheden:

- Controleert scope, kwaliteit en proces.
- Signaleert procesafwijkingen.
- Zet taken terug bij reviewbevindingen.

Mag:

- Code en documentatie reviewen.
- Procesafwijkingen markeren.
- Taken afkeuren of terugzetten.

Mag niet:

- Nieuwe scope toevoegen.
- Ongeteste wijzigingen accepteren.
- Kwaliteitsgates overslaan zonder expliciete bypass.

### Deployment Manager

Verantwoordelijkheden:

- Controleert releasebaarheid.
- Bewaakt deploymentplan, rollback en omgevingsvariabelen.
- Controleert health/readiness na deploy.

Mag:

- Release checklist uitvoeren.
- Rollbackplan controleren.
- Deploymentstatus rapporteren.

Mag niet:

- Functionele scope wijzigen.
- Code aanpassen zonder taak.
- Secrets in documentatie of logs zetten.

## Escalatie

Escalatie is verplicht wanneer:

- twee regels elkaar tegenspreken;
- een rol iets moet doen wat elders verboden is;
- een taak geen eigenaar heeft;
- acceptatiecriteria of testcriteria ontbreken;
- een architectuurwijziging nodig lijkt zonder ADR;
- release doorgang vraagt ondanks falende gate.

## Besluitregels

- Productscope wordt niet door technische rollen gewijzigd.
- Architectuurwijzigingen vereisen architectuurreview en waar nodig een ADR.
- Done is alleen mogelijk met testbewijs en review.
- Bypass van lifecycle-stappen moet expliciet, gelogd en goedgekeurd zijn.

