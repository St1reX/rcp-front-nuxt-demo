import BaseApi from '../common/BaseApi';
import type {
  GetAttendanceForDateResponse,
  GetUnregisteredCardReadsResponse,
  RegisterAttendanceResponse,
  GetMonthlyAttendanceForEmployeeResponse,
  CalculateWorkHoursResponse,
  CalculateDailyNormResponse,
  CalculateMonthlyNormResponse,
  DownloadMonthlyReportResponse,
  GenerateMonthlyReportResponse,
} from '~/types/models/attendance';
import type {
  DeleteAttendanceRequest,
  GetAttendanceForDateRequest,
  RegisterAttendanceRequest,
  GetMonthlyAttendanceForEmployeeRequest,
  CalculateWorkHoursRequest,
  CalculateDailyNormRequest,
  GetMonthlyNormRequest,
  GenerateMonthlyReportRequest,
} from '~/types/schemas/attendance';

export default class AttendanceApi extends BaseApi {
  registerEmployeeAttendance(attendanceData: RegisterAttendanceRequest) {
    return this._restClient.clientSideFetch<RegisterAttendanceResponse>(`/read`, {
      method: 'POST',
      credentials: 'include',
      body: attendanceData,
    });
  }

  deleteEmployeeAttendance(attendanceData: DeleteAttendanceRequest) {
    return this._restClient.clientSideFetch<RegisterAttendanceResponse>(
      `/${attendanceData.attendanceId}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );
  }

  getMonthlyAttendanceForEmployee(data: GetMonthlyAttendanceForEmployeeRequest) {
    return this._restClient.clientSideFetch<GetMonthlyAttendanceForEmployeeResponse>(
      `/monthly/${data.employeeId}/${data.year}/${data.month}`,
      {
        method: 'GET',
        credentials: 'include',
        query: {
          limit: data.limit,
          offset: data.offset,
          orderBy: data.orderBy,
          sort: data.sort,
        },
      }
    );
  }

  calculateEmployeeWorkHoursForDate(data: CalculateWorkHoursRequest) {
    return this._restClient.clientSideFetch<CalculateWorkHoursResponse>(
      `work-hours/${data.employeeId}/${data.date}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }

  calculateEmployeeDailyNormForDate(data: CalculateDailyNormRequest) {
    return this._restClient.clientSideFetch<CalculateDailyNormResponse>(
      `daily-norm/${data.employeeId}/${data.date}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }

  calculateEmployeeMonthlyNorm(data: GetMonthlyNormRequest) {
    return this._restClient.clientSideFetch<CalculateMonthlyNormResponse>(
      `monthly-norm/${data.employeeId}/${data.year}/${data.month}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }

  generateMonthlyReportForEmployee(data: GenerateMonthlyReportRequest) {
    return this._restClient.clientSideFetch<GenerateMonthlyReportResponse>(
      `monthly-report/${data.employeeId}/${data.year}/${data.month}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }

  downloadMonthlyCsvReportForEmployee(data: GenerateMonthlyReportRequest) {
    return this._restClient.clientSideFetch<DownloadMonthlyReportResponse>(
      `monthly-report/csv/${data.employeeId}/${data.year}/${data.month}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/csv',
        },
      }
    );
  }

  downloadMonthlyPdfReportForEmployee(data: GenerateMonthlyReportRequest) {
    return this._restClient.clientSideFetch<DownloadMonthlyReportResponse>(
      `monthly-report/pdf/${data.employeeId}/${data.year}/${data.month}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }

  getUnregisteredCardReads() {
    return this._restClient.clientSideFetch<GetUnregisteredCardReadsResponse[]>(
      `unregistered`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );
  }

  getAttendanceForDate(data: GetAttendanceForDateRequest) {
    return this._restClient.clientSideFetch<GetAttendanceForDateResponse>(`daily`, {
      method: 'GET',
      credentials: 'include',
      query: {
        date: data.date,
      },
    });
  }
}
