# LLM.md

Versiedatum: 2026-05-19 13:34:29 +02:00

## Doel

Agent Project OS gebruikt AI voor begrensde generatie, analyse en verbetering van projectmodellen. AI-output is nooit automatisch de bron van waarheid; de app valideert en de gebruiker keurt goed.

## Providers

Ondersteun minimaal:

- OpenAI via `OPENAI_API_KEY`
- OpenRouter via `OPENROUTER_API_KEY`

Secrets worden alleen via environment variables of platform secret stores beheerd. Ze worden niet in Markdown, databasevelden, logs, screenshots of frontend state opgeslagen.

## Centrale configuratie

Gebruik een centrale instelling:

```json
{
  "llm_selection.default": {
    "selectedProvider": "openai",
    "selectedModel": "gpt-5-mini",
    "fallbackModel": "gpt-5-mini",
    "temperature": 0.2,
    "recommendation": "Beste standaardkeuze voor projectmodelgeneratie, validatiehulp en rapportconcepten.",
    "providers": []
  }
}
```

## AI-taken

Toegestane AI-taken:

- projectcharter voorstellen;
- governance model voorstellen;
- role model voorstellen;
- lifecycle model voorstellen;
- work package template voorstellen;
- conflictrapport toelichten;
- splitadvies formuleren;
- rapportconcept maken.

Niet toegestaan zonder expliciete goedkeuring:

- extra rollen verzinnen buiten opdracht;
- lifecycle-stappen overslaan;
- bronmodellen wijzigen zonder validatie;
- secrets verwerken;
- final approval geven op eigen output.

## Promptregels

Elke AI-call bevat:

- taaktype;
- projectcontext;
- toegestaan outputschema;
- verboden aannames;
- fallbackgedrag;
- correlation id;
- privacyclassificatie;
- instructie om onzekerheden als open vragen te markeren.

## Outputvalidatie

AI-output moet:

- parsebaar zijn volgens schema;
- alleen toegestane rollen, statussen en velden bevatten;
- open vragen apart markeren;
- geen secrets bevatten;
- geen bestaande goedgekeurde regels stilzwijgend vervangen.

