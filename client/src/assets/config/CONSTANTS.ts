/**
 * @author: Ankit.
 * @Name: CONSTANTS.ts
 * @description: All the constants that will be used in whole app.
**/
const emailpattern = [
  '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|',
  '(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|',
  '(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
];
export const CONSTANTS = {
  'onlyDecimalPattern': '^[0-9]+(\.[0-9]{1,6})?$',
  'emailPattern': new RegExp(emailpattern.join('')),
  'VerionNumber': '2.0.3.0',
  'extraServiceLimit': '999',
  'passwordPattern': new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#!$])(?=.{8,})'),
  'descLimit': '40',
  'delegatePassword': '^(?=.*[a-z])(?=.*\\d)[^ #%^&*()?/.>,<;:~`+={}|_-]{8,30}$',
  'noRecordFound': 'No records found.',
  'arisonId': 'ba547e62-3812-493f-b58d-800b212a728c'
};
export const GlobalConst = {
  'sessionTimeOutTime': 2000000,
  'showTimeOutDialogbox': 10000000,
};

export const ServerURLS = {
 'PDFURL': 'https://test.commissionsdept.com/FileManager/UploadBatch/',
  'XLSURL': 'https://test.commissionsdept.com/FileManager/UploadBatch/Import/Success/',
  'ReportURL': 'https://test.commissionsdept.com/FileManager/Reports/',
  'ImportPolicyTemplate': 'https://test.commissionsdept.com/FileManager/ImportTemplate/template_web.xls',
  'PayorToolImageDownload': 'https://test.commissionsdept.com/FileManager/Images/',

  'PayorToolImageUpload': 'https://test.commissionsdept.com/FileManager/Images/',
  'PolicyNoteURL': 'https://test.commissionsdept.com/FileManager/PolicyNotes/'
};

