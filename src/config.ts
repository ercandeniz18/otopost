export const config = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  PORT: process.env.PORT || 3000,
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100
}; 