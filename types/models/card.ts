import { JsonValue } from "@prisma/client/runtime/library";

export interface GetAllCardsResponse {
  cards: {
    id: string;
    key: string;
    employee: {
      id: string;
      firstName: string;
      lastName: string;
    };
    metadata?: JsonValue;
    createdAt: Date;
    updatedAt: Date;
  }[];
  count: number;
  offset: number;
  limit: number;
}

export interface GetCardByIdResponse {
  id: string;
  key: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
  };
  metadata?: JsonValue;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignCardResponse {
  id: string;
  key: string;
  employeeId: string;
  metadata?: JsonValue;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetEmployeeCardsResponse {
  cards: {
    id: string;
    key: string;
    createdAt: Date;
  }[];
  count: number;
  offset: number;
  limit: number;
}

export interface DeleteCardResponse {
  message: string;
}
