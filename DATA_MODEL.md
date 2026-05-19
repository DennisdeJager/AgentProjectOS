# DATA_MODEL.md

Versiedatum: 2026-05-19 13:34:29 +02:00

## Doel

Dit document beschrijft het eerste domeinmodel. Het model wordt later uitgewerkt in schema's, migraties en API-contracten.

## Entiteiten

### Project

Velden:

- id
- name
- businessGoal
- users
- scope
- outOfScope
- strictness
- successCriteria
- risks
- status

Relaties:

- heeft rollen;
- heeft lifecycle-stappen;
- heeft werkpakketten;
- heeft besluiten, risico's en rapportages.

### Role

Velden:

- id
- name
- purpose
- responsibilities
- authorities
- restrictions
- escalationRules
- requiredOutputs

### LifecycleState

Velden:

- id
- name
- ownerRole
- entryCriteria
- exitCriteria
- allowedRoles
- requiredDocuments
- requiredChecks
- allowedNextStates
- bypassRules

### WorkPackage

Velden:

- id
- title
- goal
- context
- nonGoals
- filesInScope
- filesOutOfScope
- dependencies
- acceptanceCriteria
- testCriteria
- allowedRole
- reviewerRole
- risks
- expectedOutput
- reportingFormat
- lifecycleState
- readinessScore

### Decision

Velden:

- id
- title
- context
- decision
- status
- ownerRole
- consequences
- relatedWorkPackages

### Risk

Velden:

- id
- title
- description
- severity
- likelihood
- ownerRole
- mitigation
- status

### QualityGate

Velden:

- id
- name
- appliesTo
- requiredEvidence
- blocking
- ownerRole

### ValidationFinding

Velden:

- id
- type
- severity
- involvedRules
- explanation
- recommendation
- status

## Relatieregels

- Een work package heeft altijd precies een lifecycle state.
- Een lifecycle state heeft altijd een owner role.
- Een work package heeft altijd minimaal een allowed role en reviewer role.
- Een role moet minimaal verantwoordelijkheden, bevoegdheden en restricties hebben.
- Een transition mag niet naar `Done` zonder vereiste kwaliteitsgates.
- Een architectuurwijziging moet een besluit of ADR kunnen refereren.

