export interface AddHolidayResponse {
  id: string;
  name: string;
  isFixed: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetHolidaysForYearResponse {
  name: string;
  date: string;
  id?: string;
  isFixed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DeleteHolidayResponse {
  message: string;
}
