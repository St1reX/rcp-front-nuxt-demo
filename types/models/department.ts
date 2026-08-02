export interface GetAllDepartmentsResponse {
  departments: {
    id: string;
    name: string;
    user: {
      id: string;
      email: string;
      username: string;
    } | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export interface CreateDepartmentResponse {
  id: string;
  name: string;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UpdateDepartmentResponse {
  id: string;
  name: string;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface DeleteDepartmentResponse {
  message: string;
}

export interface GetDepartmentDetailsResponse {
  id: string;
  name: string;
  user: {
    id: string;
    email: string;
    username: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}
