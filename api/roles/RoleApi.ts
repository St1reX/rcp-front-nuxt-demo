import type { GetAllRolesResponse } from '~/types/models/roles';
import BaseApi from '../common/BaseApi';

export default class RoleApi extends BaseApi {
  getAll() {
    return this._restClient.clientSideFetch<GetAllRolesResponse>('', {
      method: 'GET',
      credentials: 'include',
    });
  }
}
