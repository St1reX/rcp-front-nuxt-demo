import type { JsonValue } from "@prisma/client/runtime/library";

export interface CreateCardReaderResponse {
  id: string;
  name: string;
  type: string;
  readerIp: string | null;
  metadata?: JsonValue;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface GetAllCardReadersResponse {
  readers: {
    id: string;
    name: string;
    type: string;
    readerIp: string | null;
    metadata?: JsonValue;
    createdAt: Date;
  }[];
  count: number;
  offset: number;
  limit: number;
}

export interface GetCardReaderByIdResponse {
  id: string;
  name: string;
  type: string;
  readerIp: string | null;
  metadata?: JsonValue;
  createdAt: Date;
}

export interface UpdateCardReaderResponse {
  id: string;
  name: string;
  type: string;
  readerIp: string | null;
  metadata?: JsonValue;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface DeleteCardReaderResponse {
  message: string;
}

export interface RestartCardReaderResponse {
  message: string;
  readerIp: string;
}
