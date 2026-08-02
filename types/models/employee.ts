export interface GetAllEmployeesResponse {
  employees: {
    id: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    department: {
      id: string;
      name: string;
    } | null;
    cards: {
      id: string;
      key: string;
    }[];
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }[];
  count: number;
  offset: number;
  limit: number;
}

export interface GetEmployeesByDepartmentResponse {
  employees: {
    id: string;
    firstName: string;
    middleName: string | null;
    lastName: string;
    department: {
      id: string;
      name: string;
    } | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export interface GetOneEmployeeResponse {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  department: {
    id: string;
    name: string;
  } | null;
  cards: {
    id: string;
    key: string;
    metadata?: Record<string, any>;
  }[];
  leaves: {
    id: string;
    startDate: Date;
    endDate: Date;
    deletedAt: Date | null;
    metadata?: Record<string, any>;
  }[];
  employmentRecords: {
    id: string;
    startDate: Date;
    endDate: Date | null;
    metadata?: Record<string, any>;
    employmentType: {
      id: string;
      name: string;
      workingHours: number;
      metadata?: Record<string, any>;
    };
  }[];
  preferredWorkingHours: {
    id: string;
    startDate: Date;
    endDate: Date | null;
    startTime: string;
    metadata?: Record<string, any>;
  }[];
}

export interface CreateEmployeeResponse {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  departmentId: string | null;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateEmployeeResponse {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  departmentId: string | null;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeleteEmployeeResponse {
  message: string;
}
