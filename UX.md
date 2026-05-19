# UX.md

Versiedatum: 2026-05-19 13:34:29 +02:00

## UX-doel

Agent Project OS is een operationele tool. De gebruiker moet direct begrijpen welk project actief is, welke proceslaag wordt beheerd, welke regels ontbreken en welke acties nodig zijn.

## Hoofdrecord

Het hoofdrecord is Project.

Projectoverzicht:

- projectnaam;
- doel;
- status;
- strictness;
- laatste validatie;
- open blockers;
- release-readiness.

Projectdetail:

- charter;
- governance;
- lifecycle;
- work packages;
- validatie;
- rapportage;
- besluiten;
- risico's;
- beheer.

## CRUD-regels

Alle beheerbare data krijgt:

- overzichtslijst;
- zichtbare knop `Nieuw`;
- zichtbare actie `Wijzigen` per record;
- zichtbare actie `Verwijderen` per record;
- bevestiging bij verwijderen;
- lege staat met toevoegknop;
- laadstaat;
- foutstaat;
- validatie bij opslaan;
- feedback na succesvol opslaan.

Aanmaken en wijzigen gebeurt bij voorkeur via modal wanneer de gebruiker binnen dezelfde lijst of tab moet blijven.

## Beheer

Voorzie een apart beheermenu met tabs:

- Gebruikers en rollen.
- Domeinrollen.
- Authenticatie.
- LLM keuze.
- Secret/key status.
- Logging en audit.
- Validatieregels.
- Export en generatie.

## Themakeuze

Ondersteun:

- Light;
- Dark;
- Volg systeem.

Sla de keuze op bij het gebruikersprofiel.

## Responsive controle

Controleer minimaal:

- 360px mobiel;
- 768px tablet;
- 1280px desktop;
- 1600px breed scherm.

Tabellen mogen horizontaal scrollen wanneer nodig. Lange tekst moet afbreken of netjes worden ingekort.

## Versie-indicatie

Toon in een rustige hoek een versiedatum en tijd in lokaal formaat, inclusief seconden.

## Eerste runtime

De eerste appversie gebruikt Project als hoofdrecord en toont child-categorieen als hoofdsecties:

- Source-modellen
- Governance
- Lifecycle
- Werkpakketten
- Validatie
- Rapportage
- Beheer

Beheerbare data gebruikt lijsten met `Nieuw`, `Wijzigen`, `Verwijderen`, modals en bevestiging bij verwijderen. Op mobiel wordt de versie-indicatie onder de content geplaatst zodat die geen content overlapt.

## Primaire gebruikersroute

De startpagina moet de gebruiker direct orienteren op de werkvolgorde:

1. Begrijp het project- en procesmodel.
2. Controleer rollen, bevoegdheden en lifecycle.
3. Maak werkpakketten klein, toetsbaar en agent-ready.
4. Run validatie en los blockers op.
5. Leg besluiten, risico's, audit en release-informatie vast.

Het dashboard toont daarom een aanbevolen volgende stap op basis van validatiestatus, blockers en open werkpakketten. Navigatie gebruikt mensentaal naast de interne modelnamen, zodat gebruikers niet hoeven te raden waar `source`, `governance` of `lifecycle` voor dient.
