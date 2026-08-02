import { LeaveTypes } from './leaveTypes';

export const calendarColors = {
  [LeaveTypes.BEREAVEMENT]: {
    colorName: 'yellow',
    lightColors: {
      main: '#facc15',
      container: '#fef9c3',
      onContainer: '#713f12',
    },
    darkColors: {
      main: '#fde68a',
      container: '#713f12',
      onContainer: '#fef9c3',
    },
  },
  red: {
    colorName: 'red',
    lightColors: {
      main: '#ef4444',
      container: '#fecaca',
      onContainer: '#660000',
    },
    darkColors: {
      main: '#fca5a5',
      container: '#660000',
      onContainer: '#fecaca',
    },
  },
  [LeaveTypes.PARENTAL]: {
    colorName: 'blue',
    lightColors: {
      main: '#3b82f6',
      container: '#bfdbfe',
      onContainer: '#002663',
    },
    darkColors: {
      main: '#93c5fd',
      container: '#002663',
      onContainer: '#bfdbfe',
    },
  },
  [LeaveTypes.VACATION]: {
    colorName: 'green',
    lightColors: {
      main: '#10b981',
      container: '#d1fae5',
      onContainer: '#064e3b',
    },
    darkColors: {
      main: '#86efac',
      container: '#064e3b',
      onContainer: '#d1fae5',
    },
  },
  orange: {
    colorName: 'orange',
    lightColors: {
      main: '#f97316',
      container: '#ffe5d0',
      onContainer: '#5a2000',
    },
    darkColors: {
      main: '#fdba74',
      container: '#5a2000',
      onContainer: '#ffe5d0',
    },
  },
};
