# Task Lifecycle

Versiedatum: 2026-05-19 13:34:29 +02:00

## Taakregels

- Een taak heeft altijd een eigenaar en reviewer.
- Een taak heeft altijd acceptatiecriteria en testcriteria.
- Een taak kan niet naar `Ready for Build` zonder readiness-check.
- Een taak kan niet naar `Done` zonder testbewijs en review.
- Een taak met architectuurimpact vereist architectuurbeoordeling.

## Blocked

Een geblokkeerde taak bevat:

- reden;
- eigenaar;
- eerste vervolgstap;
- datum van blokkade;
- impact op planning of release.

