import axios, { type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/shared/config/env';
import { normalizeApiError } from '@/shared/api/errors';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 10_000,
  headers: {
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.Authorization = `Bearer ${env.authToken}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error)),
);
