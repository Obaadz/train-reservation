export interface Config {
  apiUrl: string;
  wsUrl: string;
  environment: string;
}

export const config: { [key: string]: Config } = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    wsUrl: 'ws://localhost:3000',
    environment: 'development'
  },
  production: {
    apiUrl: 'https://api.trainco.sa/api',
    wsUrl: 'wss://api.trainco.sa',
    environment: 'production'
  }
};