# AGENTS.md

Versiedatum: 2026-05-19 13:34:29 +02:00

## Doel

Agent Project OS is een Smawa-app voor AI-assisted projectbesturing bij multi-agent softwareontwikkeling. De app helpt een project eerst als procesmodel te ontwerpen, controleren en bewaken, voordat er losse bestanden, taken of agentprompts worden gegenereerd.

Het project moet uitgroeien tot een enterprise-waardige oplossing: helder gemodelleerd, onderhoudbaar, veilig, testbaar, documenteerbaar en ontsloten via moderne UI-, API- en later MCP-interfaces.

## Projectprincipe

- Begin niet vanuit Markdown of losse prompts, maar vanuit een gestructureerd procesmodel.
- `.project-os/source/` wordt de bron van waarheid voor machine-leesbare modellen.
- `.project-os/generated/` bevat agent- en mensleesbare output die opnieuw gegenereerd mag worden.
- Markdown beschrijft, instrueert en rapporteert; YAML/gestructureerde data bepaalt straks de regels.
- Elke procesregel moet valideerbaar zijn op conflicten, ontbrekende criteria en rolbevoegdheden.

## Context eerst lezen

Lees bij de start van elke taak:

- `C:\Users\denni\OneDrive\Codex\AGENTS.md`
- `C:\Users\denni\OneDrive\Codex\DEPLOYMENT.md`
- `C:\Users\denni\OneDrive\Codex\LLM.md`
- `C:\Users\denni\OneDrive\Codex\UX.md`
- `AI_CONTEXT.md`
- `PROJECT.md`
- `GOVERNANCE.md`
- `ARCHITECTURE.md`
- `BACKLOG.md`
- relevante bestanden in `backlog/`

Als een verplicht globaal bestand ontbreekt, stop en meld dit.

## Rollen

Gebruik deze basisrollen totdat het bronmodel anders vastlegt:

| Rol | Hoofddoel | Mag niet |
| --- | --- | --- |
| Conductor | Proces bewaken, werk verdelen en escalaties starten | Code schrijven, requirements wijzigen of tests goedkeuren |
| Scrum Master / Delivery Manager | Taken voorbereiden, voortgang bewaken en blockers registreren | Technische oplossing bepalen of code schrijven |
| Architect | Technische richting, ADR's en architectuurrisico's bewaken | Functionele scope wijzigen of testbewijs overslaan |
| Engineer | Afgebakende taken bouwen en technische tests toevoegen | Buiten scope werken of architectuur wijzigen zonder ADR |
| Tester | Kwaliteit controleren en defects registreren | Code wijzigen of requirements aanpassen |
| Reviewer | Scope, codekwaliteit en procesnaleving reviewen | Nieuwe scope toevoegen of ongeteste wijzigingen accepteren |
| Deployment Manager | Releasebaarheid, omgeving en rollback controleren | Functionele scope wijzigen of code aanpassen zonder taak |

## Werkproces

Werk per kleine, controleerbare taak.

1. Controleer of de taak past bij `PROJECT.md`, `GOVERNANCE.md` en `LIFECYCLE.md`.
2. Controleer of scope, acceptatiecriteria, testcriteria en bestanden in scope duidelijk zijn.
3. Wijzig alleen bestanden die logisch bij de taak horen.
4. Werk documentatie bij wanneer gedrag, data, API, LLM, UX, security of deployment verandert.
5. Voer passende checks uit: lint, tests, build of documentatiecontrole.
6. Werk backlog/status bij.
7. Commit, push en deploy volgens `DEPLOYMENT.md` zodra er een deploybare wijziging is.

## Kwaliteitsregels

- Breek bestaande routes, API's, datacontracten en workflows niet zonder expliciete reden.
- Houd wijzigingen klein, gericht en uitlegbaar.
- Gebruik bestaande structuur, stijl en naamgeving voordat je iets nieuws introduceert.
- Voeg geen brede refactor toe zonder noodzaak.
- Maak fouten expliciet en handel ze op de juiste laag af.
- Behandel interne bedrijfsdata als gevoelig.
- Zet secrets nooit in code, logs, commits, Markdown, screenshots of testfixtures.

## AI-regels

- AI genereert voorstellen binnen een beperkte opdracht en een vast outputcontract.
- AI-output wordt altijd gevalideerd voordat die als projectregel geldt.
- Onzekerheden worden expliciet als open vragen gemarkeerd.
- De app ondersteunt minimaal OpenAI en OpenRouter via centrale LLM-configuratie.
- Modelkeuze, fallback en providerstatus horen in beheer/configuratie, niet verspreid door features.

## Rapportageplicht

Elke afgeronde taak rapporteert minimaal:

- wat is aangepast;
- welke bestanden belangrijk zijn;
- welke controles zijn uitgevoerd;
- welke besluiten of risico's zijn ontstaan;
- wat nog openstaat;
- commit-id, datum/tijd, pushstatus en deploystatus wanneer van toepassing.

