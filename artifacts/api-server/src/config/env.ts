const optionalUrl = (value: string | undefined) => value?.trim() || undefined;

export const env = {
  clientUrl: optionalUrl(process.env.CLIENT_URL),
  serverUrl: optionalUrl(process.env.SERVER_URL),
  nodeEnv: process.env.NODE_ENV ?? "development",
};