type JsonLike = Record<string, unknown> | unknown[] | null;

const snakeToCamelCase = (value: string) =>
  value.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());

const snakeToCamelKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map((item) => snakeToCamelKeys(item));

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [snakeToCamelCase(key), snakeToCamelKeys(item)]),
    );
  }

  return value;
};

const jsonResponse = (status: number, data?: JsonLike) =>
  new Response(data === undefined ? undefined : JSON.stringify(snakeToCamelKeys(data)), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const errorResponse = (status: number, error: string) => jsonResponse(status, { error });

export const okay = (data?: JsonLike) =>
  jsonResponse(data === undefined || data === null ? 204 : 200, data);

export const created = (data?: JsonLike) => jsonResponse(201, data);

export const badRequest = (message = 'Bad Request') => errorResponse(400, message);

export const unauthorized = (message = 'Unauthorized') => errorResponse(401, message);

export const conflict = (message = 'Conflict') => errorResponse(409, message);

export const unprocessableEntity = (message = 'Unprocessable Entity') =>
  errorResponse(422, message);

export const notFound = (message = 'Not Found') => errorResponse(404, message);
