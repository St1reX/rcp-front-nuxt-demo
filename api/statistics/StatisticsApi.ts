import BaseApi from '../common/BaseApi';
import type {
  GetSummaryResponse,
  GetAttendanceChartDataResponse,
} from '../../types/models/statiscitcs';

export default class StatisticsApi extends BaseApi {
  getSummary() {
    return this._restClient.clientSideFetch<GetSummaryResponse>('summary', {
      method: 'GET',
      credentials: 'include',
    });
  }

  getAttendanceChartData() {
    return this._restClient.clientSideFetch<GetAttendanceChartDataResponse>(
      'attendance-chart-data',
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }
}
