import BaseApi from '../common/BaseApi';
import type {
  CreateAdjustmentResponse,
  GetAllAdjustmentsResponse,
  GetAdjustmentsByMonthResponse,
  DeleteAdjustmentResponse,
  GetAdjustmentByIdResponse,
} from '../../types/models/workdayAdjustment';
import type {
  CreateAdjustmentRequest,
  GetAdjustmentsByMonthRequest,
  DeleteAdjustmentRequest,
  GetAdjustmentByIdRequest,
} from '../../types/schemas/workdayAdjustment';
import type { GetAllAdjusmentsRequest } from '~/types/schemas/workdayAdjustment';

export default class WorkdayAdjustmentApi extends BaseApi {
  create(data: CreateAdjustmentRequest) {
    return this._restClient.clientSideFetch<CreateAdjustmentResponse>('', {
      method: 'POST',
      credentials: 'include',
      body: data,
    });
  }

  getByMonth(data: GetAdjustmentsByMonthRequest) {
    return this._restClient.clientSideFetch<GetAdjustmentsByMonthResponse>(
      `${data.year}/${data.month}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }

  getAll(data: GetAllAdjusmentsRequest) {
    return this._restClient.clientSideFetch<GetAllAdjustmentsResponse>('', {
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

  getById(data: GetAdjustmentByIdRequest) {
    return this._restClient.clientSideFetch<GetAdjustmentByIdResponse>(
      `${data.adjustmentId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }

  delete(data: DeleteAdjustmentRequest) {
    return this._restClient.clientSideFetch<DeleteAdjustmentResponse>(`${data.id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  }
}
