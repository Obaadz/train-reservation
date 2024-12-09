import { config } from './config';

// Get the current environment
const env = import.meta.env.MODE || 'development';

// Export the configuration for the current environment
export default config[env];

// Export types
export type { Config } from './config';