// lib/api/auth.ts
import { axiosPublic } from "@/services/axiosService";
import { axiosHomePublic } from "@/services/axiosHomeService";
import { LoginRequest, LoginResponse, RegisterRequest } from "@/types";

// Common request config for auth requests
const authRequestConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Customer Authentication
export async function loginApi(data: LoginRequest): Promise<LoginResponse> {
  const response = await axiosHomePublic.post<LoginResponse>('accounts/login', data, authRequestConfig);
  return response.data;
}

export async function adminLoginApi(data: LoginRequest): Promise<LoginResponse> {
  const response = await axiosPublic.post<LoginResponse>('/accounts/login', data, authRequestConfig);
  return response.data;
}

export const registerCustomer = async (userData: RegisterRequest) => {
  const response = await axiosHomePublic.post<LoginResponse>('accounts/register/customer', userData, authRequestConfig);
  return response.data;
};

export const getCustomerProfile = async () => {
  const response = await axiosHomePublic.get('/auth/customer/me');
  return response.data;
};

export const refreshCustomerToken = async (refreshToken: string) => {
  const response = await axiosHomePublic.post<{ access_token: string }>('/auth/customer/refresh-token', {
    refresh_token: refreshToken,
  });
  return response.data;
};

// Password reset
export async function forgotPasswordApi(email: string) {
  const response = await axiosHomePublic.post('accounts/forgot-password', { email }, authRequestConfig);
  return response.data;
}

export async function resetPasswordApi(token: string, newPassword: string) {
  const response = await axiosHomePublic.post('accounts/reset-password', { token, newPassword }, authRequestConfig);
  return response.data;
}

// Common Authentication
export async function signupApi(data: { email: string; password: string }) {
  const response = await axiosPublic.post('/accounts/register/customer', data, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}