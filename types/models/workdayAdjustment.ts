export interface GetAllAdjustmentsResponse {
  adjustments: {
    id: string;
    date: Date;
    time: string;
    type: string;
    reason: string | null;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }[];
  count: number;
  offset: number;
  limit: number;
}

export interface GetAdjustmentsByMonthResponse {
  id: string;
  date: Date;
  time: string;
  type: string;
  reason: string | null;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAdjustmentByIdResponse {
  id: string;
  date: Date;
  time: string;
  type: string;
  reason: string | null;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAdjustmentResponse {
  id: string;
  date: Date;
  time: string;
  type: string;
  reason: string | null;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeleteAdjustmentResponse {
  message: string;
}
