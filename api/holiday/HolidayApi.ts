import BaseApi from '../common/BaseApi';
import type {
  AddHolidayResponse,
  GetHolidaysForYearResponse,
  DeleteHolidayResponse,
} from '../../types/models/holiday';
import type {
  AddHolidayRequest,
  GetHolidaysRequest,
  DeleteHolidayRequest,
} from '../../types/schemas/holiday';

export default class HolidayApi extends BaseApi {
  add(data: AddHolidayRequest) {
    return this._restClient.clientSideFetch<AddHolidayResponse>('add', {
      method: 'POST',
      credentials: 'include',
      body: data,
    });
  }

  getForYear(data: GetHolidaysRequest) {
    return this._restClient.clientSideFetch<GetHolidaysForYearResponse[]>(
      `${data.year}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }

  delete(data: DeleteHolidayRequest) {
    return this._restClient.clientSideFetch<DeleteHolidayResponse>(`${data.id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  }
}
