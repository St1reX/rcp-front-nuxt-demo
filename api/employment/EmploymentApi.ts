import BaseApi from '../common/BaseApi';
import type {
  CreateEmploymentTypeResponse,
  AssignEmploymentResponse,
  GetAllEmploymentTypesResponse,
  GetEmployeeEmploymentResponse,
  GetPreferredWorkingHoursResponse,
  SetPreferredWorkingHoursResponse,
  GetEmploymentTypeByIdResponse,
  DeleteEmploymentTypeResponse,
  UnassignEmploymentResponse,
} from '../../types/models/employment';
import type {
  CreateEmploymentTypeRequest,
  AssignEmploymentRequest,
  GetEmployeeEmploymentRequest,
  GetPreferredWorkingHoursRequest,
  SetPreferredWorkingHoursRequest,
  GetEmploymentTypeByIdRequest,
  DeleteEmploymentTypeRequest,
  UnassignEmploymentRequest,
} from '../../types/schemas/employment';

export default class EmploymentApi extends BaseApi {
  create(data: CreateEmploymentTypeRequest) {
    return this._restClient.clientSideFetch<CreateEmploymentTypeResponse>(
      '/employment-type',
      {
        method: 'POST',
        credentials: 'include',
        body: data,
      }
    );
  }

  delete(data: DeleteEmploymentTypeRequest) {
    return this._restClient.clientSideFetch<DeleteEmploymentTypeResponse>(
      `/employment-type/${data.employmentId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );
  }

  getAllType() {
    return this._restClient.clientSideFetch<GetAllEmploymentTypesResponse>(
      'employment-types',
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }

  getTypeById(data: GetEmploymentTypeByIdRequest) {
    return this._restClient.clientSideFetch<GetEmploymentTypeByIdResponse>(
      `employment-types/${data.employmentTypeId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }

  assignToEmployee(data: AssignEmploymentRequest) {
    return this._restClient.clientSideFetch<AssignEmploymentResponse>(
      'assign-employment',
      {
        method: 'POST',
        credentials: 'include',
        body: data,
      }
    );
  }

  unassignFromEmployee(data: UnassignEmploymentRequest) {
    return this._restClient.clientSideFetch<UnassignEmploymentResponse>(
      `unassign-employment/${data.employeeId}/${data.employmentTypeId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );
  }

  getForEmployee(data: GetEmployeeEmploymentRequest) {
    return this._restClient.clientSideFetch<GetEmployeeEmploymentResponse>(
      `employee-employment/${data.employeeId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }

  setPreferredWorkingHoursForEmployee(data: SetPreferredWorkingHoursRequest) {
    return this._restClient.clientSideFetch<SetPreferredWorkingHoursResponse>(
      'preferred-working-hours',
      {
        method: 'POST',
        credentials: 'include',
        body: data,
      }
    );
  }

  getEmployeePreferredWorkingHours(data: GetPreferredWorkingHoursRequest) {
    return this._restClient.clientSideFetch<GetPreferredWorkingHoursResponse>(
      `preferred-working-hours/${data.employeeId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }
}
