export const jsonBody = async <TBody>(request: Request): Promise<TBody | undefined> => {
  try {
    return (await request.json()) as TBody;
  } catch {
    return undefined;
  }
};

export const searchParams = (req: Request): Record<string, string | undefined> =>
  Object.fromEntries(new URL(req.url).searchParams.entries());
