import type { CollectionName, ProjectPayload, ValidationResult } from '../types';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error?.message ?? `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getProjectOs(): Promise<ProjectPayload> {
  return request<ProjectPayload>('/api/project-os');
}

export function runValidation(): Promise<ValidationResult> {
  return request<ValidationResult>('/api/validation/run', { method: 'POST' });
}

export function createItem<T>(collection: CollectionName, item: Partial<T>): Promise<T> {
  return request<T>(`/api/${collection}`, {
    method: 'POST',
    body: JSON.stringify(item)
  });
}

export function updateItem<T extends { id: string }>(collection: CollectionName, item: T): Promise<T> {
  return request<T>(`/api/${collection}/${encodeURIComponent(item.id)}`, {
    method: 'PUT',
    body: JSON.stringify(item)
  });
}

export function deleteItem<T>(collection: CollectionName, id: string): Promise<T> {
  return request<T>(`/api/${collection}/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
}

export function updateSettings<T>(settings: T): Promise<T> {
  return request<T>('/api/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  });
}

