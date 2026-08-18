import envData from './env.json';

export type RuntimeMode = 'local' | 'development' | 'public';

export interface RuntimeEnvironment {
  homeLocation?: string | null;
  deploymentEnv?: string | null;
  environment?: string | null;
}

const LOOPBACK_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1', '[::1]']);

export function isLoopbackUrl(value: string | null | undefined): boolean {
  if (!value) return false;

  try {
    return LOOPBACK_HOSTNAMES.has(new URL(value).hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function getRuntimeMode(
  environment: RuntimeEnvironment = envData
): RuntimeMode {
  if (
    environment.deploymentEnv === 'local' ||
    isLoopbackUrl(environment.homeLocation)
  ) {
    return 'local';
  }

  if (
    environment.deploymentEnv === 'staging' ||
    environment.environment === 'development'
  ) {
    return 'development';
  }

  return 'public';
}

export function isLocalMode(
  environment: RuntimeEnvironment = envData
): boolean {
  return getRuntimeMode(environment) === 'local';
}

export function isDevelopmentMode(
  environment: RuntimeEnvironment = envData,
  nodeEnvironment = process.env.NODE_ENV
): boolean {
  return (
    environment.environment === 'development' &&
    nodeEnvironment !== 'production'
  );
}
