import { requireHrmApiBase } from './hrmApiBase';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type ApiEnvelope<T> = { success: boolean; data?: T; error?: string };

export class HrmApiError extends Error {
  status?: number;
  kind: 'network' | 'http';

  constructor(message: string, kind: 'network' | 'http', status?: number) {
    super(message);
    this.name = 'HrmApiError';
    this.kind = kind;
    this.status = status;
  }
}

export async function hrmRequest<TResponse, TBody = unknown>(
  path: string,
  method: HttpMethod = 'GET',
  body?: TBody,
  token?: string | null,
): Promise<TResponse> {
  const base = requireHrmApiBase();
  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      method,
      /** Bearer auth only; omit avoids cross-origin credential + CORS issues with Worker. */
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new HrmApiError(
      `Cannot reach HRM API at ${base}. In dev, start the Worker on 8787 (or \`npm run local-api -w website\`) and use the Next.js \`/hrm-api\` rewrite, or set NEXT_PUBLIC_HRM_API_BASE_URL.`,
      'network',
    );
  }

  let payload: ApiEnvelope<TResponse> | null = null;
  try {
    payload = (await response.json()) as ApiEnvelope<TResponse>;
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.success) {
    const message = payload?.error ?? `Request failed (${response.status})`;
    throw new HrmApiError(message, 'http', response.status);
  }

  return payload.data as TResponse;
}
