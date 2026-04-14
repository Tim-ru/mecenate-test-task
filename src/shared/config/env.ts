type AppEnv = {
  apiBaseUrl: string;
  authToken: string;
};

function getRequiredEnvVar(name: 'EXPO_PUBLIC_API_BASE_URL' | 'EXPO_PUBLIC_AUTH_TOKEN'): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `[env] Missing required variable "${name}". Add it to your .env file before running the app.`,
    );
  }

  return value;
}

export const env: AppEnv = {
  apiBaseUrl: getRequiredEnvVar('EXPO_PUBLIC_API_BASE_URL'),
  authToken: getRequiredEnvVar('EXPO_PUBLIC_AUTH_TOKEN'),
};
