import fs from 'node:fs/promises';
import path from 'node:path';
import { loadAppData, mutateAppData, createAuditEntry } from './appDataStore.mjs';
import { loadSourceModels } from './sourceStore.mjs';
import { validateProjectOs } from './validation.mjs';

const COLLECTIONS = {
  'work-packages': 'workPackages',
  decisions: 'decisions',
  risks: 'risks',
  users: 'users',
  'domain-roles': 'domainRoles'
};

export async function handleApiRequest(req, res, rootDir = process.cwd()) {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const { pathname } = url;
  const method = req.method ?? 'GET';

  if (method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, { status: 'ok', service: 'agent-project-os' });
    return;
  }

  if (method === 'GET' && pathname === '/api/version') {
    sendJson(res, 200, await getVersion(rootDir));
    return;
  }

  if (method === 'GET' && pathname === '/api/ready') {
    const payload = await getProjectPayload(rootDir);
    sendJson(res, 200, {
      status: payload.validation.status === 'passed' ? 'ready' : 'degraded',
      validation: payload.validation.summary,
      sourceModels: payload.models.length
    });
    return;
  }

  if (method === 'GET' && pathname === '/api/project-os') {
    sendJson(res, 200, await getProjectPayload(rootDir));
    return;
  }

  if ((method === 'GET' || method === 'POST') && pathname === '/api/validation/run') {
    const payload = await getProjectPayload(rootDir);
    await mutateAppData(rootDir, (data) => {
      data.audit.unshift(createAuditEntry('validation.run', 'project-os', { status: payload.validation.status }));
      data.audit = data.audit.slice(0, 50);
    });
    sendJson(res, 200, payload.validation);
    return;
  }

  if (pathname === '/api/settings') {
    if (method === 'GET') {
      const data = await loadAppData(rootDir);
      sendJson(res, 200, data.settings);
      return;
    }

    if (method === 'PUT') {
      const body = await readJson(req);
      const updated = await mutateAppData(rootDir, (data) => {
        data.settings = { ...data.settings, ...body };
        data.audit.unshift(createAuditEntry('settings.update', 'settings', { keys: Object.keys(body) }));
        data.audit = data.audit.slice(0, 50);
        return data.settings;
      });
      sendJson(res, 200, updated);
      return;
    }
  }

  const collectionMatch = pathname.match(/^\/api\/([^/]+)(?:\/([^/]+))?$/);
  if (collectionMatch && COLLECTIONS[collectionMatch[1]]) {
    await handleCollectionRequest(req, res, rootDir, collectionMatch[1], collectionMatch[2]);
    return;
  }

  sendJson(res, 404, {
    error: {
      code: 'not_found',
      message: `Route ${method} ${pathname} bestaat niet.`
    }
  });
}

async function getProjectPayload(rootDir) {
  const [models, appData] = await Promise.all([loadSourceModels(rootDir), loadAppData(rootDir)]);
  const validation = validateProjectOs(models, appData);

  return {
    version: await getVersion(rootDir),
    models,
    appData,
    validation
  };
}

async function handleCollectionRequest(req, res, rootDir, collectionName, id) {
  const key = COLLECTIONS[collectionName];
  const method = req.method ?? 'GET';

  if (method === 'GET') {
    const data = await loadAppData(rootDir);
    sendJson(res, 200, id ? data[key].find((item) => item.id === id) ?? null : data[key]);
    return;
  }

  if (method === 'POST') {
    const body = await readJson(req);
    const created = await mutateAppData(rootDir, (data) => {
      const item = { ...body, id: body.id || nextId(collectionName, data[key]) };
      data[key].unshift(item);
      data.audit.unshift(createAuditEntry(`${collectionName}.create`, item.id, { title: item.title ?? item.name ?? item.domain }));
      data.audit = data.audit.slice(0, 50);
      return item;
    });
    sendJson(res, 201, created);
    return;
  }

  if (method === 'PUT' && id) {
    const body = await readJson(req);
    const updated = await mutateAppData(rootDir, (data) => {
      const index = data[key].findIndex((item) => item.id === id);
      if (index === -1) {
        return null;
      }
      data[key][index] = { ...data[key][index], ...body, id };
      data.audit.unshift(createAuditEntry(`${collectionName}.update`, id, { title: body.title ?? body.name ?? body.domain }));
      data.audit = data.audit.slice(0, 50);
      return data[key][index];
    });

    if (!updated) {
      sendJson(res, 404, { error: { code: 'not_found', message: `${id} niet gevonden.` } });
      return;
    }

    sendJson(res, 200, updated);
    return;
  }

  if (method === 'DELETE' && id) {
    const deleted = await mutateAppData(rootDir, (data) => {
      const index = data[key].findIndex((item) => item.id === id);
      if (index === -1) {
        return null;
      }
      const [item] = data[key].splice(index, 1);
      data.audit.unshift(createAuditEntry(`${collectionName}.delete`, id, { title: item.title ?? item.name ?? item.domain }));
      data.audit = data.audit.slice(0, 50);
      return item;
    });

    if (!deleted) {
      sendJson(res, 404, { error: { code: 'not_found', message: `${id} niet gevonden.` } });
      return;
    }

    sendJson(res, 200, deleted);
    return;
  }

  sendJson(res, 405, { error: { code: 'method_not_allowed', message: `${method} is niet toegestaan.` } });
}

function nextId(collectionName, items) {
  const prefix = {
    'work-packages': 'TASK',
    decisions: 'DEC',
    risks: 'RISK',
    users: 'USR',
    'domain-roles': 'DOM'
  }[collectionName];

  const highest = items
    .map((item) => String(item.id ?? '').match(/\d+$/)?.[0])
    .filter(Boolean)
    .map(Number)
    .reduce((max, value) => Math.max(max, value), 0);

  return `${prefix}-${String(highest + 1).padStart(4, '0')}`;
}

async function getVersion(rootDir) {
  const packagePath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf8'));

  return {
    appId: 'agent-project-os',
    name: packageJson.name,
    version: packageJson.version,
    versionedAt: new Date().toLocaleString('nl-NL', {
      timeZone: 'Europe/Amsterdam',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  };
}

async function readJson(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
  }

  return raw ? JSON.parse(raw) : {};
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

