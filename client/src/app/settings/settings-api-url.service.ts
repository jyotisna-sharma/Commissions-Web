import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsAPIURLService {
  public SettingAPIRoutes: any = {
    'GetSegmentsListing': '/api/Setting/GetSegmentsList',
    'GetProductsSegmentsForUpdate': '/api/Setting/GetProductsSegmentsForUpdate',
    'GetSegmentListForPolicies':'/api/Setting/getSegmentsListForPolicies',
    'GetProductsWithoutSegments': '/api/Setting/GetProductsWithoutSegments',
    'SaveDeleteSegment': '/api/Setting/SaveDeleteSegment',
    'CommissionScheduleList': '/api/Setting/commissionScheduleListing',
    'AddUpdateCommissionSchedule': '/api/Setting/addUpdatecommissionSchedule',
    'DeleteCommScheduleSetting': '/api/Setting/deleteCommScheduleSetting',
    'GettingCommScheduleSettings': '/api/Setting/gettingCommScheduleSettings',
    'ReportSettingListing': '/api/Setting/reportSettingListing',
    'UpdateReportSettings': '/api/Setting/updateReportSettings',
    'IsScheduleExist': '/api/Setting/isScheduleExist',
    'AddUpdateNamedSchedule':'/api/Setting/addUpdateNamedSchedule',
    'IsNamedScheduleExist':'/api/Setting/isNamedScheduleExist',
    'NamedScheduleList':'/api/Setting/namedScheduleList',
  };
  constructor() { }
}
