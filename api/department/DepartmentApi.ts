import type {
  CreateDepartmentRequest,
  DeleteDepartmentRequest,
  GetDepartmentDetailsRequest,
  UpdateDepartmentRequest,
} from '~/types/schemas/department';
import BaseApi from '../common/BaseApi';
import type {
  CreateDepartmentResponse,
  DeleteDepartmentResponse,
  GetAllDepartmentsResponse,
  GetDepartmentDetailsResponse,
  UpdateDepartmentResponse,
} from '~/types/models/department';

export default class DepartmentApi extends BaseApi {
  create(data: CreateDepartmentRequest) {
    return this._restClient.clientSideFetch<CreateDepartmentResponse>('/', {
      method: 'POST',
      credentials: 'include',
      body: data,
    });
  }

  getAllDepartments() {
    return this._restClient.clientSideFetch<GetAllDepartmentsResponse>('/', {
      method: 'GET',
      credentials: 'include',
    });
  }

  delete(data: DeleteDepartmentRequest) {
    return this._restClient.clientSideFetch<DeleteDepartmentResponse>(
      `/${data.departmentId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );
  }

  update(data: UpdateDepartmentRequest) {
    return this._restClient.clientSideFetch<UpdateDepartmentResponse>(
      `/${data.departmentId}`,
      {
        method: 'PATCH',
        credentials: 'include',
        body: {
          name: data.name,
          userId: data.userId,
        },
      }
    );
  }

  getDepartmentDetails(data: GetDepartmentDetailsRequest) {
    return this._restClient.clientSideFetch<GetDepartmentDetailsResponse>(
      `/${data.departmentId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }
}
