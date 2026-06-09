import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosError } from "axios";

const isBrowser = typeof window !== 'undefined';

// Determine the base URL based on environment
const getBaseUrl = () => {
  // If NEXT_PUBLIC_API_URL is explicitly set, use it
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }else{
    return 'http://localhost:4000';
  }
  
  // // For production, use HTTPS
  // if (process.env.NEXT_PUBLIC_ENV_STATUS === 'production') {
  //   return 'https://api.yourdomain.com'; // Replace with your production API URL
  // }
  
  // // Default to local development
  // return 'http://localhost:4000';
};

const baseURL = getBaseUrl();
const commonConfig = {
  baseURL,
  withCredentials: true, // This is important for sending cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  xsrfCookieName: 'admin_access_token',
  xsrfHeaderName: 'Authorization',
  withXSRFToken: true,
  // Ensure we're using the correct protocol based on environment
  httpsAgent: process.env.NEXT_PUBLIC_ENV_STATUS === 'production' 
    ? new (require('https').Agent)({ rejectUnauthorized: true }) 
    : undefined,
};

export const axiosPublic = axios.create({
  ...commonConfig,
  withCredentials: false, // Public requests don't need credentials
});

export const axiosProtected = axios.create({
  ...commonConfig,
  withCredentials: true, // Protected requests need credentials
});

// Add request interceptor for protected instance
axiosProtected.interceptors.request.use(
  (config) => {
    // Only run this on the client side
    if (typeof window !== 'undefined') {
      // Get token from cookies first, fallback to localStorage
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=').map(c => c.trim());
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      
      const token = cookies['admin_access_token'] || localStorage.getItem('admin_access_token');
      
      if (token) {
        // Remove any existing Authorization header to prevent duplicates
        delete config.headers.Authorization;
        // Set the token in the Authorization header
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // For file uploads, let the browser set the Content-Type with the boundary
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
      
      // Ensure withCredentials is true for protected requests
      config.withCredentials = true;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Flag to prevent multiple token refresh attempts
let isRefreshing = false;
// Array to hold the failed requests that need to be retried
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get token from cookies
      const token = isBrowser ? document.cookie
        .split('; ')
        .find(row => row.startsWith('admin_access_token='))
        ?.split('=')[1] : null;
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // If error is not 401 or it's not a browser environment, reject
      if (error.response?.status !== 401 || !isBrowser) {
        return Promise.reject(error);
      }

      // If this is a retry attempt, reject
      if (originalRequest._retry) {
        // Only redirect if we're not already on the auth page
        if (!window.location.pathname.includes('/admin/auth')) {
          // Clear auth data and redirect to login
          document.cookie = 'admin_access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          document.cookie = 'admin_refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          localStorage.removeItem('admin_user_data');
          window.location.href = '/admin/auth';
        }
        return Promise.reject(error);
      }

      // If we're already refreshing the token, add the request to the queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Set the flag and try to refresh the token
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        // Get refresh token from cookies
        const refreshToken = document.cookie
          .split('; ')
          .find(row => row.startsWith('admin_refresh_token='))
          ?.split('=')[1];
          
        if (!refreshToken) throw new Error('No refresh token available');

        // Try to refresh the token
        const response = await axiosPublic.post('/accounts/refresh-token', {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken, user } = response.data;

        if (accessToken && newRefreshToken) {
          // Set new tokens as HTTP-only cookies
          const cookieOptions = {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
          };
          
          document.cookie = `admin_access_token=${accessToken}; Path=/; ${cookieOptions.secure ? 'Secure;' : ''} SameSite=${cookieOptions.sameSite}; Max-Age=${cookieOptions.maxAge}`;
          document.cookie = `admin_refresh_token=${newRefreshToken}; Path=/; ${cookieOptions.secure ? 'Secure;' : ''} SameSite=${cookieOptions.sameSite}; Max-Age=${cookieOptions.maxAge}`;
          
          // Store user data in localStorage (non-sensitive data only)
          if (user) {
            const { id, name, email, role } = user;
            localStorage.setItem('admin_user_data', JSON.stringify({ id, name, email, role }));
          }

          // Update the Authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          // Process the queue with the new token
          processQueue(null, accessToken);

          // Retry the original request
          return instance(originalRequest);
        } else {
          throw new Error('No access token in response');
        }
      } catch (refreshError) {
        // If refresh fails, clear auth data and redirect to login
        processQueue(refreshError, null);
        localStorage.removeItem('admin_access_token');
        localStorage.removeItem('admin_refresh_token');
        localStorage.removeItem('admin_user_data');
        window.location.href = '/admin/auth';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
};

setupInterceptors(axiosPublic);
setupInterceptors(axiosProtected);
