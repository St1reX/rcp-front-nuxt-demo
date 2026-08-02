import BaseApi from '../common/BaseApi';
import type {
  CreateEmployeeResponse,
  GetOneEmployeeResponse,
  GetAllEmployeesResponse,
  DeleteEmployeeResponse,
  UpdateEmployeeResponse,
  GetEmployeesByDepartmentResponse,
} from '../../types/models/employee';
import type {
  CreateEmployeeRequest,
  GetOneEmployeeRequest,
  DeleteEmployeeRequest,
  GetAllEmployeesRequest,
  UpdateEmployeeRequest,
  GetEmployeesByDepartmentRequest,
} from '../../types/schemas/employee';

export default class EmployeeApi extends BaseApi {
  create(data: CreateEmployeeRequest) {
    return this._restClient.clientSideFetch<CreateEmployeeResponse>('', {
      method: 'POST',
      credentials: 'include',
      body: data,
    });
  }

  getOne(data: GetOneEmployeeRequest) {
    return this._restClient.clientSideFetch<GetOneEmployeeResponse>(`${data.id}`, {
      method: 'GET',
      credentials: 'include',
    });
  }

  getAll(data: GetAllEmployeesRequest) {
    return this._restClient.clientSideFetch<GetAllEmployeesResponse>('', {
      method: 'GET',
      credentials: 'include',
      query: {
        limit: data.limit,
        offset: data.offset,
        orderBy: data.orderBy,
        sort: data.sort,
      },
    });
  }

  getByDepartment(data: GetEmployeesByDepartmentRequest) {
    return this._restClient.clientSideFetch<GetEmployeesByDepartmentResponse>(
      `/by-department/${data.departmentId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }

  update(data: UpdateEmployeeRequest) {
    return this._restClient.clientSideFetch<UpdateEmployeeResponse>(
      `${data.employeeId}`,
      {
        method: 'PATCH',
        credentials: 'include',
        body: {
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: data.middleName,
          departmentId: data.departmentId,
        },
      }
    );
  }

  delete(data: DeleteEmployeeRequest) {
    return this._restClient.clientSideFetch<DeleteEmployeeResponse>(`${data.id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  }
}
