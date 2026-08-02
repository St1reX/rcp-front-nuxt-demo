export enum LeaveStatuses {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  DISAPPROVED = 'DISAPPROVED',
}

export const LeaveStatusesLabels = {
  [LeaveStatuses.APPROVED]: 'Zaakceptowany',
  [LeaveStatuses.PENDING]: 'Oczekuje na akceptację',
  [LeaveStatuses.DISAPPROVED]: 'Odrzucony',
};

export const LeaveStatusesValues = Object.values(LeaveStatuses).map((status) => ({
  label: LeaveStatusesLabels[status],
  value: status as string,
}));
