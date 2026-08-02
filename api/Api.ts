import BaseApi from './common/BaseApi';
import type Configuration from './common/Configuration';
import AuthApi from './auth/AuthApi';
import UserApi from './user/UserApi';
import AttendanceApi from './attendance/AttendanceApi';
import CardApi from './card/CardApi';
import CardReaderApi from './cardReader/CardReaderApi';
import EmployeeApi from './employee/EmployeeApi';
import EmploymentApi from './employment/EmploymentApi';
import HolidayApi from './holiday/HolidayApi';
import LeaveApi from './leave/LeaveApi';
import WorkdayAdjustmentApi from './workdayAdjustment/WorkdayAdjustmentApi';
import StatisticsApi from './statistics/StatisticsApi';
import DepartmentApi from './department/DepartmentApi';
import RoleApi from './roles/RoleApi';

export default class Api extends BaseApi {
  auth: AuthApi;
  user: UserApi;
  attendance: AttendanceApi;
  card: CardApi;
  cardReader: CardReaderApi;
  employee: EmployeeApi;
  employment: EmploymentApi;
  holiday: HolidayApi;
  leave: LeaveApi;
  workdayAdjustment: WorkdayAdjustmentApi;
  statistics: StatisticsApi;
  department: DepartmentApi;
  roles: RoleApi;

  constructor(configuration: Configuration) {
    super(configuration);
    this.auth = new AuthApi({ ...configuration, prefix: 'auth' });
    this.user = new UserApi({ ...configuration, prefix: 'user' });
    this.attendance = new AttendanceApi({
      ...configuration,
      prefix: 'attendance',
    });
    this.card = new CardApi({ ...configuration, prefix: 'card' });
    this.cardReader = new CardReaderApi({
      ...configuration,
      prefix: 'card-reader',
    });
    this.employee = new EmployeeApi({ ...configuration, prefix: 'employee' });
    this.employment = new EmploymentApi({
      ...configuration,
      prefix: 'employment',
    });
    this.holiday = new HolidayApi({ ...configuration, prefix: 'holiday' });
    this.leave = new LeaveApi({ ...configuration, prefix: 'leave' });
    this.workdayAdjustment = new WorkdayAdjustmentApi({
      ...configuration,
      prefix: 'workday-adjustment',
    });
    this.statistics = new StatisticsApi({
      ...configuration,
      prefix: 'statistics',
    });
    this.department = new DepartmentApi({
      ...configuration,
      prefix: 'department',
    });
    this.roles = new RoleApi({
      ...configuration,
      prefix: 'role',
    });
  }
}
