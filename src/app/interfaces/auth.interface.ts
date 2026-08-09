export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  token: string;
  tokenType: string;
}
