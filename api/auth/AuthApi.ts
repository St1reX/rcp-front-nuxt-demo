import BaseApi from '../common/BaseApi';
import type {
  LoginResponse,
  ChangePasswordResponse,
  RequestPasswordResetResponse,
  ResetPasswordResponse,
  CreateInviteResponse,
  ResendInviteResponse,
  AcceptInviteResponse,
  RemoveInviteResponse,
  ListInvitesResponse,
} from '../../types/models/auth';
import type {
  LoginRequest,
  ChangePasswordRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  CreateInviteRequest,
  AcceptInviteRequest,
  RemoveIntiveRequest,
  ResendInviteRequest,
} from '../../types/schemas/auth';
import type { GetInviteByIdRequest } from '~/types/schemas/auth';

export default class AuthApi extends BaseApi {
  login(loginData: LoginRequest) {
    return this._restClient.clientSideFetch<LoginResponse>('login', {
      method: 'POST',
      credentials: 'include',
      body: loginData,
    });
  }

  demoAdminLogin() {
    return this._restClient.clientSideFetch<LoginResponse>('demo-admin-login', {
      method: 'POST',
      credentials: 'include',
    });
  }

  logout() {
    return this._restClient.clientSideFetch<string>('logout', {
      method: 'POST',
      credentials: 'include',
    });
  }

  changePassword(data: ChangePasswordRequest) {
    return this._restClient.clientSideFetch<ChangePasswordResponse>(
      'change-password',
      {
        method: 'POST',
        credentials: 'include',
        body: data,
      }
    );
  }

  requestPasswordReset(data: RequestPasswordResetRequest) {
    return this._restClient.clientSideFetch<RequestPasswordResetResponse>(
      'request-password-reset',
      {
        method: 'POST',
        credentials: 'include',
        body: data,
      }
    );
  }

  resetPassword(data: ResetPasswordRequest) {
    return this._restClient.clientSideFetch<ResetPasswordResponse>(
      'reset-password',
      {
        method: 'POST',
        credentials: 'include',
        body: data,
      }
    );
  }

  createInvite(data: CreateInviteRequest) {
    return this._restClient.clientSideFetch<CreateInviteResponse>('/invite', {
      method: 'POST',
      credentials: 'include',
      body: data,
    });
  }

  resendInvite(data: ResendInviteRequest) {
    return this._restClient.clientSideFetch<ResendInviteResponse>('/invite/resend', {
      method: 'POST',
      credentials: 'include',
      body: data,
    });
  }

  acceptIntive(data: AcceptInviteRequest) {
    return this._restClient.clientSideFetch<AcceptInviteResponse>('/invite/accept', {
      method: 'POST',
      credentials: 'include',
      body: data,
    });
  }

  getInviteById(data: GetInviteByIdRequest) {
    return this._restClient.clientSideFetch<ListInvitesResponse>(
      `invite/${data.id}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }

  removeInvite(data: RemoveIntiveRequest) {
    return this._restClient.clientSideFetch<RemoveInviteResponse>('/invite/remove', {
      method: 'DELETE',
      credentials: 'include',
      body: data,
    });
  }

  listInvites() {
    return this._restClient.clientSideFetch<ListInvitesResponse[]>('/invite/list', {
      method: 'GET',
      credentials: 'include',
    });
  }
}
