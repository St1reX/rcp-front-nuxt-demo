export interface LoginUser {
  id: string;
  username: string;
  email: string;
  role: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
  department: {
    id: string;
    name: string;
  } | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  user: LoginUser;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface RequestPasswordResetResponse {
  message: string;
  retryAfterSeconds?: number;
  resetLink?: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface CreateInviteResponse {
  token: string;
  inviteLink: string;
}

export interface ResendInviteResponse {
  token: string;
  inviteLink: string;
}

export interface AcceptInviteResponse {
  message: string;
}

export interface RemoveInviteResponse {
  message: string;
}

export interface ListInvitesResponse {
  id: string;
  accepted: boolean;
  acceptedAt: Date | null;
  email: string;
  role: {
    id: String;
    name: String;
  };
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
