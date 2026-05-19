import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_FILE = path.join('.project-os', 'state', 'app-data.json');

export async function loadAppData(rootDir) {
  const filePath = path.join(rootDir, DATA_FILE);

  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }

    const seeded = createSeedData();
    await saveAppData(rootDir, seeded);
    return seeded;
  }
}

export async function saveAppData(rootDir, data) {
  const filePath = path.join(rootDir, DATA_FILE);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

export async function mutateAppData(rootDir, mutator) {
  const data = await loadAppData(rootDir);
  const result = await mutator(data);
  data.updatedAt = new Date().toISOString();
  await saveAppData(rootDir, data);
  return result ?? data;
}

export function createAuditEntry(action, subject, details = {}) {
  return {
    id: `AUD-${Date.now()}`,
    at: new Date().toISOString(),
    actor: 'local-admin',
    action,
    subject,
    details
  };
}

function createSeedData() {
  const now = '2026-05-19T14:00:00+02:00';

  return {
    version: '0.1.0',
    createdAt: now,
    updatedAt: now,
    workPackages: [
      {
        id: 'TASK-0003',
        title: 'Definieer schema\'s voor source-modellen',
        goal: 'Maak JSON/YAML schema\'s zodat source-modellen automatisch gevalideerd kunnen worden.',
        context: 'Volgt op de baseline source-modellen in .project-os/source.',
        nonGoals: ['Geen runtime validator bouwen in deze taak.'],
        filesInScope: ['schemas/', '.project-os/source/*.yaml', 'QUALITY.md'],
        filesOutOfScope: ['src/', 'server/'],
        dependencies: ['STORY-002'],
        acceptanceCriteria: [
          'Voor elk source-model bestaat een schema.',
          'Verplichte velden en enums zijn expliciet vastgelegd.',
          'Schema\'s zijn geschikt voor de latere validator.'
        ],
        testCriteria: ['Schema\'s kunnen door een validator geladen worden.'],
        allowedRole: 'architect',
        reviewerRole: 'reviewer',
        risks: ['Te veel schema-detail kan de eerste validator onnodig vertragen.'],
        expectedOutput: 'Schema-map met modelcontracten.',
        reportingFormat: 'work_package_status',
        lifecycleState: 'refinement',
        status: 'refinement',
        owner: 'architect',
        reviewer: 'reviewer',
        confidence: 'medium',
        blockers: []
      },
      {
        id: 'TASK-0004',
        title: 'Bouw eerste source-model validator',
        goal: 'Valideer rollen, lifecycle en work package readiness op de belangrijkste blocking regels.',
        context: 'Gebruikt schema\'s en baseline source-modellen.',
        nonGoals: ['Geen volledige UI-validatie bouwen.'],
        filesInScope: ['server/lib/validation.mjs', 'scripts/validate-source.mjs', 'test-results/'],
        filesOutOfScope: ['Productie-authenticatie', 'MCP-runtime'],
        dependencies: ['STORY-003'],
        acceptanceCriteria: [
          'Validator leest alle source-modellen.',
          'Validator rapporteert severity, regel, uitleg en aanbeveling.',
          'CLI exit faalt op blockers.'
        ],
        testCriteria: ['npm run validate geeft een samenvatting.'],
        allowedRole: 'engineer',
        reviewerRole: 'reviewer',
        risks: ['Conflictdetectie start beperkt en moet uitbreidbaar blijven.'],
        expectedOutput: 'Werkende validator en CLI-script.',
        reportingFormat: 'work_package_status',
        lifecycleState: 'intake',
        status: 'intake',
        owner: 'engineer',
        reviewer: 'reviewer',
        confidence: 'medium',
        blockers: ['Wacht op STORY-003']
      }
    ],
    decisions: [
      {
        id: 'DEC-0001',
        title: 'Source-modellen zijn leidend',
        status: 'accepted',
        ownerRole: 'architect',
        context: 'De app moet voorkomen dat Markdown de waarheid wordt.',
        decision: '.project-os/source wordt de source of truth; Markdown is uitleg of gegenereerde output.',
        consequences: 'Generatoren en validators moeten source-modellen lezen in plaats van vrije tekst.',
        relatedWorkPackages: ['TASK-0003', 'TASK-0004']
      }
    ],
    risks: [
      {
        id: 'RISK-0001',
        title: 'Markdown wordt bron van waarheid',
        description: 'Teams kunnen handmatig Markdown aanpassen en de source-modellen vergeten.',
        severity: 'high',
        likelihood: 'medium',
        ownerRole: 'conductor',
        mitigation: 'Maak generatie en validatie source-first.',
        status: 'open'
      },
      {
        id: 'RISK-0002',
        title: 'AI-output buiten schema',
        description: 'AI kan extra rollen, statussen of regels voorstellen buiten het goedgekeurde contract.',
        severity: 'high',
        likelihood: 'medium',
        ownerRole: 'reviewer',
        mitigation: 'Valideer AI-output tegen schema en markeer onzekerheden.',
        status: 'open'
      }
    ],
    users: [
      {
        id: 'USR-0001',
        name: 'Eerste beheerder',
        email: 'admin@example.invalid',
        role: 'admin',
        status: 'invited'
      }
    ],
    domainRoles: [
      {
        id: 'DOM-0001',
        domain: 'smawa.nl',
        defaultRole: 'project_admin',
        status: 'active'
      }
    ],
    settings: {
      auth: {
        provider: 'google',
        clientIdConfigured: false,
        clientSecretConfigured: false,
        bootstrapFirstAdmin: true
      },
      llm: {
        selectedProvider: 'openai',
        selectedModel: 'gpt-5-mini',
        fallbackModel: 'gpt-5-mini',
        temperature: 0.2,
        recommendation: 'Beste standaardkeuze voor projectmodelgeneratie, validatiehulp en rapportconcepten.'
      },
      ui: {
        theme: 'system'
      }
    },
    audit: [
      createAuditEntry('seeded', 'app-data', {
        reason: 'Initial app state for Agent Project OS'
      })
    ]
  };
}

