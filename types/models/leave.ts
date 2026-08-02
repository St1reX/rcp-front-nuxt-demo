import type { JsonValue } from "@prisma/client/runtime/library";

export interface RequestForLeaveResponse {
  id: string;
  startDate: Date;
  endDate: Date;
  isApproved: boolean;
  metadata?: JsonValue;
  type: string | null;
  reason: string | null;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AddLeaveResponse {
  id: string;
  startDate: Date;
  endDate: Date;
  isApproved: boolean;
  metadata?: JsonValue;
  type: string | null;
  reason: string | null;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface GetLeaveByIdResponse {
  id: string;
  startDate: Date;
  endDate: Date;
  isApproved: boolean;
  metadata?: JsonValue;
  type: string | null;
  reason: string | null;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
  rejectedAt: Date | null;
}

export interface GetAllLeavesResponse {
  leaves: {
    id: string;
    startDate: Date;
    endDate: Date;
    isApproved: boolean;
    metadata?: JsonValue;
    type: string | null;
    employee: {
      id: string;
      firstName: string;
      lastName: string;
      department: {
        id: string;
        name: string;
      } | null;
    };
    createdAt: Date;
    updatedAt: Date;
    rejectedAt: Date | null;
  }[];
}

export interface DisapproveLeaveResponse {
  message: string;
}

export interface ApproveLeaveResponse {
  id: string;
  startDate: Date;
  endDate: Date;
  isApproved: boolean;
  metadata?: JsonValue;
  type: string | null;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateLeaveAdminResponse {
  id: string;
  startDate: Date;
  endDate: Date;
  isApproved: boolean;
  metadata?: JsonValue;
  type: string | null;
  reason: string | null;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAllLeavesForMonthResponse {
  leaves: {
    id: string;
    startDate: Date;
    endDate: Date;
    isApproved: boolean;
    metadata?: JsonValue;
    type: string | null;
    employee: {
      id: string;
      firstName: string;
      lastName: string;
      department: {
        id: string;
        name: string;
      } | null;
    };
    createdAt: Date;
    updatedAt: Date;
    rejectedAt: Date | null;
  }[];
}
