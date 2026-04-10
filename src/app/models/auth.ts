export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  roles: string[];
  position?: string;
  department?: string;
  grade?: string;
  hireDate?: string | null;
  docType?: string;
  docNumber?: string;
  nationality?: string;
  loyaltyTier?: string;
  emergencyContact?: string;
}

export interface AuthResponse {
  token: string;
  email?: string;
  roles?: string[];
}
