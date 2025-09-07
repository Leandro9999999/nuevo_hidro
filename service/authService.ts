// service\authService.ts
import api from "./api";
import {
  Login,
  UserCreate,
  loginResponseSchema,
  LoginResponse as RawLoginResponse,
} from "../types";
import { API_ENDPOINTS } from "../constants/api-endpoints";

// Tipo final con camelCase
export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

const mapLoginResponse = (raw: RawLoginResponse): LoginResponse => ({
  accessToken: raw.access_token,
  refreshToken: raw.refresh_token,
  tokenType: raw.token_type,
  expiresIn: raw.expires_in,
  user: raw.user,
});

export const loginUser = async (loginData: Login): Promise<LoginResponse> => {
  const { data } = await api.post(API_ENDPOINTS.auth.login, loginData);
  const parsed = loginResponseSchema.parse(data); // validación centralizada
  return mapLoginResponse(parsed);
};

export const registerUser = async (
  userData: UserCreate
): Promise<LoginResponse> => {
  await api.post(API_ENDPOINTS.users.base, userData);
  return loginUser({ email: userData.email, password: userData.password });
};
