import { PassThrough } from "stream";

export interface RegisterAttendanceRequest {
  cardKey: string;
  readerId: string;
  dateTimeRead: number;
}

export interface RegisterAttendanceResponse {
  id: string;
  timestamp: Date;
  card: {
    id: string;
    metadata?: Record<string, any>;
    key: string;
  };
  reader: {
    id: string;
    type: string;
    metadata?: Record<string, any>;
    name: string;
  };
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    metadata?: Record<string, any>;
  } | null;
  metadata?: Record<string, any>;
}

export interface GetAttendanceForEmployeeResponse {
  attendances: {
    id: string;
    timestamp: Date;
    card: {
      id: string;
      key: string;
      metadata?: Record<string, any>;
    };
    reader: {
      id: string;
      name: string;
      type: string;
      metadata?: Record<string, any>;
    };
    metadata?: Record<string, any>;
  }[];
  count: number;
  offset: number;
  limit: number;
}

export interface GetMonthlyAttendanceForEmployeeResponse {
  attendances: {
    id: string;
    timestamp: Date;
    card: {
      id: string;
      key: string;
      metadata?: Record<string, any>;
    };
    reader: {
      id: string;
      name: string;
      type: string;
      metadata?: Record<string, any>;
    };
    metadata?: Record<string, any>;
  }[];
  count: number;
  offset: number;
  limit: number;
}

export interface CalculateWorkHoursResponse {
  entry: string;
  exit: string;
  hoursWorked: number;
  minutesWorked: number;
  shortBreakMinutes: number;
  missingMinutes: number;
  projectedExitTime: string;
  normStatus: string;
  normMessage: string;
  adjustedEndTime: string;
}

export interface CalculateDailyNormResponse {
  requiredMinutes: number;
  requiredHours: string;
  adjustedStartTime: string;
  adjustedEndTime: string;
  isHoliday: boolean;
  isWeekend: boolean;
  totalLeaveMinutes: number;
}

export interface CalculateMonthlyNormResponse {
  requiredMonthlyHours: number;
  requiredMonthlyMinutes: number;
  days: Record<string, any>;
}

export interface GetMonthlySummaryResponse {
  totalWorkedHours: number;
  totalRequiredHours: number;
  overtimeHours: number;
}

export interface GenerateMonthlyReportResponse {
  // reportData: Record<string, any>;
  reportData: {
    date: string;
    type: string;
    requiredHours: string;
    workedHours: string;
    shortBreakTime: string;
    startTime: string;
    endTime: string;
  }[];
  totalWorkedHours: number;
  totalWorkedMinutes: number;
  requiredMonthlyHours: number;
  requiredMonthlyMinutes: number;
  totalDeficitHours: number;
  totalDeficitMinutes: number;
  overtimeWeekdaysHours: number;
  overtimeWeekdaysMinutes: number;
  overtimeSaturdaysHours: number;
  overtimeSaturdaysMinutes: number;
  finalOvertimeHours: number;
  finalOvertimeMinutes: number;
  missingNormHours: number;
  missingNormMinutes: number;
}

export interface DownloadMonthlyReportResponse {
  fileName: string;
  stream: PassThrough;
}

export interface GetUnregisteredCardReadsResponse {
  cardKey: string;
  readerId: string;
  timestamp: number;
  reason: string;
}

export interface DeleteAttendanceResponse {
  message: string;
}

export interface GetAttendanceForDateResponse {
  attendances: {
    id: string;
    timestamp: Date;
    card: {
      id: string;
      key: string;
      metadata?: Record<string, any>;
    };
    employee: {
      id: string;
      firstName: string;
      lastName: string;
    };
    reader: {
      id: string;
      name: string;
      type: string;
      metadata?: Record<string, any>;
    };
    metadata?: Record<string, any>;
  }[];
}
