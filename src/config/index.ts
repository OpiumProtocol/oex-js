export enum Namespace {
  production = 'production',
  development = 'development',
  local = 'local'
}

export const namespace: Namespace = Namespace.development

export const endpoints = {
  [Namespace.production]: 'https://api.opium.exchange/v1',
  [Namespace.development]: 'https://api.stage.opium.exchange/v1',
  [Namespace.local]: 'http://localhost:3000/v1'
}
