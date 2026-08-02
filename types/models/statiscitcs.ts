export interface GetSummaryResponse {
  employeeCount: number;
  attendanceCount: number;
  activeCardsCount: number;
  daysWithAttendance: number;
}

export interface GetAttendanceChartDataResponse {
  labels: string[];
  data: number[];
}
