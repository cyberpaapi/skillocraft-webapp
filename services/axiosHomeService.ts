import axios, { type InternalAxiosRequestConfig, type AxiosError, type AxiosInstance } from "axios";

const isBrowser = typeof window !== 'undefined';

// Determine the base URL based on environment
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  } else {
    return 'http://localhost:4000';
  }
};

const baseURL = getBaseUrl();
const commonConfig = {
  baseURL,
  withCredentials: true, // Important for sending cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export const axiosHomePublic = axios.create({
  ...commonConfig,
  withCredentials: true, // Enable credentials for public endpoints that need cookies
});

export const axiosHomeProtected = axios.create({
  ...commonConfig,
  withCredentials: true,
});

// Flag to prevent multiple token refresh attempts
let isRefreshing = false;
// Array to hold the failed requests that need to be retried
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: any) => void; }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (isBrowser) {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('user_access_token='))
          ?.split('=')[1];

        if (token) {
          // Ensure only one Authorization header
          delete (config.headers as any).Authorization;
          config.headers.Authorization = `Bearer ${token}`;
        }
        // For multipart, allow browser to set boundary
        if (config.data instanceof FormData) {
          delete (config.headers as any)['Content-Type'];
        }
        config.withCredentials = true;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      if (error.response?.status !== 401 || !isBrowser) {
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        // Clear user cookies on persistent 401
        document.cookie = 'user_access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'user_refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        localStorage.removeItem('user_data');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token: any) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        const refreshToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('user_refresh_token='))
          ?.split('=')[1];

        if (!refreshToken) throw new Error('No refresh token available');

        const response = await axiosHomePublic.post('/accounts/refresh-token', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken, user } = response.data as any;

        if (accessToken && newRefreshToken) {
          const cookieOptions = {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            maxAge: 7 * 24 * 60 * 60,
          };

          document.cookie = `user_access_token=${accessToken}; Path=/; ${cookieOptions.secure ? 'Secure;' : ''} SameSite=${cookieOptions.sameSite}; Max-Age=${cookieOptions.maxAge}`;
          document.cookie = `user_refresh_token=${newRefreshToken}; Path=/; ${cookieOptions.secure ? 'Secure;' : ''} SameSite=${cookieOptions.sameSite}; Max-Age=${cookieOptions.maxAge}`;

          if (user) {
            const { id, name, email, role } = user;
            localStorage.setItem('user_data', JSON.stringify({ id, name, email, role }));
          }

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          processQueue(null, accessToken);
          return instance(originalRequest);
        }
        throw new Error('No access token in response');
      } catch (refreshError) {
        processQueue(refreshError, null);
        document.cookie = 'user_access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'user_refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        localStorage.removeItem('user_data');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
};

// Apply the shared interceptors to both instances
setupInterceptors(axiosHomePublic);
setupInterceptors(axiosHomeProtected);
