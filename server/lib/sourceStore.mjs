import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

export const SOURCE_MODEL_FILES = [
  'project-charter.yaml',
  'governance-model.yaml',
  'role-model.yaml',
  'lifecycle-model.yaml',
  'work-package-model.yaml',
  'quality-model.yaml',
  'reporting-model.yaml'
];

export async function loadSourceModels(rootDir) {
  const sourceDir = path.join(rootDir, '.project-os', 'source');

  const models = await Promise.all(
    SOURCE_MODEL_FILES.map(async (fileName) => {
      const absolutePath = path.join(sourceDir, fileName);
      const raw = await fs.readFile(absolutePath, 'utf8');
      const data = yaml.load(raw);
      const id = fileName.replace(/\.yaml$/, '');

      return {
        id,
        fileName,
        path: `.project-os/source/${fileName}`,
        kind: data?.kind ?? id,
        schemaVersion: data?.schema_version ?? null,
        sourceStatus: data?.metadata?.source_status ?? null,
        versionedAt: data?.metadata?.versioned_at ?? null,
        data,
        stats: summarizeModel(data)
      };
    })
  );

  return models;
}

export async function loadSourceModelMap(rootDir) {
  const models = await loadSourceModels(rootDir);
  return Object.fromEntries(models.map((model) => [model.id, model]));
}

function summarizeModel(data) {
  if (!data || typeof data !== 'object') {
    return { sections: 0, items: 0 };
  }

  const topLevelKeys = Object.keys(data);
  let items = 0;

  for (const value of Object.values(data)) {
    if (Array.isArray(value)) {
      items += value.length;
    } else if (value && typeof value === 'object') {
      items += Object.keys(value).length;
    }
  }

  return {
    sections: topLevelKeys.length,
    items
  };
}

