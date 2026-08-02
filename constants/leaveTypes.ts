export enum LeaveTypes {
  VACATION = 'Urlop wypoczynkowy',
  BEREAVEMENT = 'Urlop okolicznościowy',
  PARENTAL = 'Urlop opiekuńczy kp 188 (2 dni)',
}

export const LeaveTypesLabels = {
  [LeaveTypes.VACATION]: 'Urlop wypoczynkowy',
  [LeaveTypes.BEREAVEMENT]: 'Urlop okolicznościowy',
  [LeaveTypes.PARENTAL]: 'Urlop opiekuńczy',
};

export const LeaveTypesValues = Object.values(LeaveTypes).map((type) => ({
  label: LeaveTypesLabels[type],
  value: type as string,
}));
