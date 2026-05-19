# SECURITY.md

Versiedatum: 2026-05-19 13:34:29 +02:00

## Doel

Agent Project OS beheert procesregels, projectcontext en mogelijk interne bedrijfsinformatie. Behandel alle projectdata als gevoelig.

## Authenticatie

Standaard:

- Google-authenticatie met de lichtste passende variant.
- Eerste ingelogde gebruiker wordt beheerder wanneer er nog geen beheerder bestaat.
- Als de laatste beheerder verwijderd wordt, start bootstrap opnieuw bij de volgende login.
- Vooraf aangemaakte gebruikers kunnen direct een rol krijgen.
- Domeinen kunnen een standaardrol krijgen.

## Autorisatie

Controleer server-side:

- projecttoegang;
- rolbevoegdheid;
- lifecycle-status;
- beheerrechten;
- mutatierechten op bronmodellen.

UI-autorisatie is aanvullend, nooit leidend.

## Secrets

- Secrets nooit in code, Markdown, logs, commits of screenshots.
- Gebruik environment variables of platform secret stores.
- `.env.example` bevat alleen namen en lege of veilige voorbeeldwaarden.
- Log alleen of een secret aanwezig is, nooit de waarde.

## Audit

Audit minimaal:

- wijzigingen in project charter;
- wijzigingen in rollen en bevoegdheden;
- wijzigingen in lifecycle;
- wijzigingen in LLM-configuratie;
- validatie-uitkomsten met blocking findings;
- approvals, bypasses en releasebesluiten.

Audit bevat geen secrets en zo min mogelijk persoonsgegevens.

## Privacy

- Beperk logging van prompts en projectinhoud.
- Gebruik correlation ids voor diagnose.
- Bewaar alleen data die nodig is voor procesbesturing, validatie en audit.

## Eerste runtime

- De huidige app gebruikt lokale state in `.project-os/state/app-data.json`.
- Auth-instellingen tonen alleen configuratiestatus, geen secrets.
- LLM-instellingen bevatten modelkeuze en provider, geen API keys.
- API-mutaties schrijven auditregels zonder secretwaarden.
- `.gitignore` blokkeert lokale env-bestanden, secretbestanden, build-output en logs.

Productieauthenticatie met Google is nog niet actief; server-side autorisatie moet worden toegevoegd voordat de app extern gebruikt wordt.
