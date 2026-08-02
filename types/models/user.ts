export interface GetMeResponse {
  id: string;
  email: string;
  role: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
  department: {
    id: string;
    name: string;
  } | null;
  username: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateMeResponse {
  id: string;
  email: string;
  role: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetUsersByRoleResponse {
  users: {
    id: string;
    email: string;
    role: {
      id: string;
      name: string;
      createdAt: Date;
      updatedAt: Date;
    };
    department: {
      id: string;
      name: string;
    } | null;
    username: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}
