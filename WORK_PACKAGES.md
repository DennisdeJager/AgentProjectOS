# WORK_PACKAGES.md

Versiedatum: 2026-05-19 13:34:29 +02:00

## Doel

Work packages maken multi-agent werk klein, geisoleerd, controleerbaar en overdraagbaar.

## Minimale inhoud

Een work package bevat minimaal:

- ID
- titel
- doel
- context
- niet-doelen
- files in scope
- files out of scope
- afhankelijkheden
- acceptatiecriteria
- testcriteria
- toegestane rol
- reviewer
- risico's
- verwachte output
- rapportageformat

## Agent-readiness score

De app beoordeelt een work package met deze checks:

| Check | Verwachte waarde |
| --- | --- |
| Scope duidelijk | ja |
| Acceptatiecriteria concreet | ja |
| Testcriteria concreet | ja |
| Files in scope benoemd | ja of bewust onbekend met reden |
| Niet te groot | ja |
| Architectuurimpact duidelijk | ja |
| Afhankelijkheden bekend | ja |
| Reviewer bekend | ja |
| Rapportageformat bekend | ja |

## Splitregels

Splits een taak wanneer:

- backend, frontend en database tegelijk wijzigen zonder noodzaak;
- feature en refactor gecombineerd worden;
- meerdere domeinen tegelijk geraakt worden;
- acceptatiecriteria niet in een korte lijst passen;
- teststrategie onduidelijk blijft;
- meerdere rollen tegelijk eigenaar lijken te zijn.

## Definition of Ready

Een taak is ready wanneer:

- doel en scope duidelijk zijn;
- acceptatiecriteria en testcriteria concreet zijn;
- lifecycle state `Ready for Build` bereikt mag worden;
- toegestane rol en reviewer bekend zijn;
- blokkades en risico's bekend zijn.

## Definition of Done

Een taak is done wanneer:

- alle acceptatiecriteria zijn gehaald;
- relevante tests/checks zijn uitgevoerd of verantwoord;
- documentatie is bijgewerkt;
- review is afgerond;
- release- of overdrachtsinformatie beschikbaar is;
- rapportage is bijgewerkt.

