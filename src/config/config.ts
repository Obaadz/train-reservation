export interface Config {
  apiUrl: string;
  environment: string;
}

export const config: { [key: string]: Config } = {
  development: {
    apiUrl: 'http://localhost:3001/api',
    environment: 'development'
  },
  production: {
    apiUrl: 'http://localhost:3001/api',
    environment: 'production'
  }
};