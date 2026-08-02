import BaseApi from '../common/BaseApi';
import type {
  GetMeResponse,
  GetUsersByRoleResponse,
  UpdateMeResponse,
} from '../../types/models/user';
import type {
  GetMeRequest,
  GetUserByRoleRequest,
  UpdateMeRequest,
} from '../../types/schemas/user';

export default class UserApi extends BaseApi {
  me() {
    return this._restClient.serverSideFetch<GetMeResponse>('me', {
      method: 'GET',
      credentials: 'include',
    });
  }

  updateMe(updateMeData: UpdateMeRequest) {
    return this._restClient.clientSideFetch<UpdateMeResponse>('me', {
      method: 'POST',
      credentials: 'include',
      body: updateMeData,
    });
  }

  getUserByRole(data: GetUserByRoleRequest) {
    return this._restClient.clientSideFetch<GetUsersByRoleResponse>('/', {
      method: 'GET',
      credentials: 'include',
      query: {
        role: data.role,
      },
    });
  }
}
