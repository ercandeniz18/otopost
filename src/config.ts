import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000'
};

export const API_BASE_URL = config.API_BASE_URL; 