export type ApiError = {
  message: string;
  statusCode?: number;
  isNetworkError: boolean;
  details?: unknown;
};

export type ApiErrorPayload = {
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
};
