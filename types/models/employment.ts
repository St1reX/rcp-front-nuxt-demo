export interface CreateEmploymentTypeResponse {
  id: string;
  name: string;
  workingHours: number;
  breakTimeMinutes: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeleteEmploymentTypeResponse {
  message: string;
}

export interface GetAllEmploymentTypesResponse {
  employmentTypes: {
    id: string;
    name: string;
    workingHours: number;
    breakTimeMinutes: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }[];
  count: number;
  offset: number;
  limit: number;
}

export interface GetEmploymentTypeByIdResponse {
  id: string;
  name: string;
  workingHours: number;
  breakTimeMinutes: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignEmploymentResponse {
  id: string;
  employmentType: {
    id: string;
    name: string;
    workingHours: number;
    breakTimeMinutes: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  };
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    metadata?: Record<string, any>;
  };
  startDate: Date;
  endDate: Date | null;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UnassignEmploymentResponse {
  message: string;
}

export interface GetEmployeeEmploymentResponse {
  id: string;
  employmentType: {
    id: string;
    name: string;
    workingHours: number;
    breakTimeMinutes: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  };
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    metadata?: Record<string, any>;
  };
  startDate: Date;
  endDate: Date | null;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SetPreferredWorkingHoursResponse {
  id: string;
  startTime: string;
  startDate: Date;
  endDate: Date | null;
  metadata?: Record<string, any>;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    metadata?: Record<string, any>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface GetPreferredWorkingHoursResponse {
  id: string;
  startTime: string;
  startDate: Date;
  endDate: Date | null;
  metadata?: Record<string, any>;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    metadata?: Record<string, any>;
  };
  createdAt: Date;
  updatedAt: Date;
}
