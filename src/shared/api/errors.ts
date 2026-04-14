import { AxiosError, isAxiosError } from 'axios';
import { type ApiError, type ApiErrorPayload } from '@/shared/api/types';

const DEFAULT_ERROR_MESSAGE = 'Request failed';
const NETWORK_ERROR_MESSAGE = 'Network error. Please try again.';

function extractErrorMessage(payload: ApiErrorPayload | undefined): string | undefined {
  return payload?.message ?? payload?.error?.message;
}

export function normalizeApiError(error: unknown): ApiError {
  if (!isAxiosError<ApiErrorPayload>(error)) {
    return {
      message: DEFAULT_ERROR_MESSAGE,
      isNetworkError: false,
      details: error,
    };
  }

  const axiosError = error as AxiosError<ApiErrorPayload>;

  if (!axiosError.response) {
    return {
      message: NETWORK_ERROR_MESSAGE,
      isNetworkError: true,
      details: axiosError.toJSON(),
    };
  }

  const statusCode = axiosError.response.status;
  const message = extractErrorMessage(axiosError.response.data) ?? DEFAULT_ERROR_MESSAGE;

  return {
    message,
    statusCode,
    isNetworkError: false,
    details: axiosError.response.data,
  };
}
