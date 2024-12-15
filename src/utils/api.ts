import config from '../config';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  requiresAuth?: boolean;
}

interface ApiHeaders {
  'Content-Type': string;
  'Accept-Language': string;
  Authorization?: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const createApiClient = (getToken: () => string | null) => {
  const request = async (endpoint: string, options: RequestOptions = {}) => {
    const {
      params,
      requiresAuth = true,
      headers: customHeaders = {},
      ...otherOptions
    } = options;

    // Build URL with query parameters
    const url = new URL(`${config.apiUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    // Prepare headers with proper typing
    const headers: ApiHeaders = {
      'Content-Type': 'application/json',
      'Accept-Language': localStorage.getItem('i18nextLng') || 'ar',
    };

    // Add authorization header if required
    if (requiresAuth) {
      const token = getToken();
      if (!token) {
        throw new ApiError(401, 'Unauthorized');
      }
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url.toString(), {
        ...otherOptions,
        headers: { ...headers, ...customHeaders }
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new ApiError(response.status, error.message || 'An error occurred');
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Network error');
    }
  };

  return {
    get: (endpoint: string, options?: RequestOptions) =>
      request(endpoint, { ...options, method: 'GET' }),

    post: (endpoint: string, data?: any, options?: RequestOptions) =>
      request(endpoint, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data)
      }),

    put: (endpoint: string, data?: any, options?: RequestOptions) =>
      request(endpoint, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data)
      }),

    delete: (endpoint: string, options?: RequestOptions) =>
      request(endpoint, { ...options, method: 'DELETE' }),
  };
};

// Hook for using the API client
export const useApi = () => {
  const token = localStorage.getItem('token');
  return createApiClient(() => token);
};

// Add this export
export const api = createApiClient(() => localStorage.getItem('token'));
