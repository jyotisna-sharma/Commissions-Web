/*
 *
 * Configuration Settings
 */
var config = {
  //Impot payor tool template API URL
  DuplicateImportToolTemplate: {
    URL: "payorTool/DulicateImportPayorTemplateService",
    MethodType: "POST",
  },
  GetImportPayorTemplate: {
    URL: "payorTool/GetPayorToolTemplateService",
    MethodType: "POST",
  },
  GetImportTemplatePhraseList: {
    URL: "payorTool/GetImportPayorTemplatePhraseService",
    MethodType: "POST",
  },
  SaveImportToolPhrase: {
    URL: "payorTool/SaveImportPayorPhraseService",
    MethodType: "POST",
  },
  DeleteTemplatePhrase: {
    URL: "payorTool/DeleteImportPayorPhraseService",
    MethodType: "POST",
  },
  GetImportToolStatementDetails: {
    URL: "payorTool/GetImportToolStatementService",
    MethodType: "POST",
  },
  SaveImportToolStatementDetails: {
    URL: "payorTool/SaveImportToolStatementService",
    MethodType: "POST",
  },
  GetImportTemplateDetails: {
    URL: "payorTool/GetImportToolTemplateDetailsService",
    MethodType: "POST",
  },
  SavePayorTemplateDetails: {
    URL: "payorTool/SaveImportToolTemplateDetailsService",
    MethodType: "POST",
  },
  GetImportToolAvilableFieldList: {
    URL: "payorTool/GetImportToolAvilableFieldService",
    MethodType: "POST",
  },
  GetImportToolPaymentDataFieldList: {
    URL: "payorTool/GetImportPaymentDataDetailsSrvice",
    MethodType: "POST",
  },
  AddUpdateImportToolPaymentDataFields: {
    URL: "payorTool/AddUpdateImportPaymentDataService",
    MethodType: "POST",
  },
  //DEU Mpdule Api path
  GetDEUBatchList: {
    URL: "deu/GetDEUBatchLitService",
    MethodType: "POST",
  },
  GetDEUStatementList: {
    URL: "deu/GetDEUStatementListService",
    MethodType: "POST",
  },
  GetDEUPayorList: {
    URL: "deu/GetDEUPayorsService",
    MethodType: "POST",
  },
  GetDEUTemplateList: {
    URL: "deu/GetDEUTemplateListService",
    MethodType: "POST",
  },
  DEUBatchClose: {
    URL: "deu/DEUEBatchClosedService",
    MethodType: "POST",
  },
  DEUFindBatch: {
    URL: "deu/DEUFindBatchService",
    MethodType: "POST",
  },
  DEUStatementClose: {
    URL: "deu/DEUStatementClosedService",
    MethodType: "POST",
  },
  DEUBatchReOpen: {
    URL: "deu/OpenBatchService",
    MethodType: "POST",
  },
  DEUAddUpdateStatement: {
    URL: "deu/AddUpdateStatementService",
    MethodType: "POST",
  },
  DEUFindStatement: {
    URL: "deu/FindStatementDetailsService",
    MethodType: "POST",
  },
  DEUGetTemplateDetails: {
    URL: "DEU/GetTemplateDataService",
    MethodType: "POST",
  },
  DEUStatementOpen: {
    URL: "deu/DEUStatementOpenService",
    MethodType: "POST",
  },
  UpdateCheckAmount: {
    URL: "deu/UpdateCheckAmountService",
    MethodType: "POST",
  },
  FetchTestFormulaResult: {
    URL: "payorTool/GetTestFormulaResult",
    MethodType: "POST",
  },
  DEUPostStartWrapper: {
    URL: "deu/DeuPostStartWrapperService",
    MethodType: "POST",
  },
  GetUniqueIdentifierPolicyList: {
    URL: "deu/GetPoliciesListOnUniqueIdentifiers",
    MethodType: "POST",
  },
  GetPostedPaymentsList: {
    URL: "deu/GetDeuPostedPaymentsService",
    MethodType: "POST",
  },
  GettingPaymentDetails: {
    URL: "deu/GetDeuFieldsDetailsService",
    MethodType: "POST",
  },
  GetPolicyLearnedFields: {
    URL: "Policy/GetPolicySmartFieldDetailsService",
    MethodType: "POST",
  },
  ValidateDateFieldService: {
    URL: "deu/ValidateDateFieldService",
    MethodType: "POST",
  },
  GetStatementCheckAmountList: {
    URL: "deu/GetStatementCheckAmountService",
    MethodType: "POST",
  },
  PostDEUEntry: {
    URL: "deu/PostDEUEntryService",
    MethodType: "POST",
  },
  ProcessPaymentEntry: {
    URL: "deu/ProcessPaymentService",
    MethodType: "POST",
  },
  UpdateStatementPages: {
    URL: "deu/UpdateStatementPagesService",
    MethodType: "POST",
  },
  UploadNotesFile: {
    URL: "Policy/UploadPolicyNotesFile",
    MethodType: "POST",
  },
  DeletePolicyNotesFile:{
 URL: "Policy/DeletePolicyNotesFileService",
    MethodType: "POST",
}
};
// eslint-disable-next-line no-unused-expressions
config.AuthenticationManager = {
  AuthenticateUser: "user/LoginService",
  ForgotPassword: "user/ForgotPasswordService",
  Logout: "/AuthenticationManager/Logout",
  UpdatePassword: "/AuthenticationManager/UpdatePassword",
  CheckUpdatePasswordExpireTime: "/user/HasPasswordKeyExpiredService",
  ResetPassword: "/user/ResetPasswordService",
  GetSecurityQuestion: "user/GetSecurityQuesService",
  ForgotUsername: "user/ForgotUsernameService",
  ResetUserName: "user/UpdatePasswordService",
  AddLoginLogoutTimeService: "user/AddLoginLogoutTimeService",
  RegisterEmailService: "user/RegisterEmailService",
  GetAuthTokenService: "user/GetAuthTokenService",
};
config.PeopleManager = {
  PeopleManagerListing: "user/GetUsersService",
  GetAgentDetails: "user/GetUserDetailsService",
  AddupdateAgentDetails: "user/AddUpdateUserDetails",
  HouseAccountUpdate: "user/SetHouseAccountActive",
  UserMappingListing: "user/GetAllLinkedUserService",
  LinkedUserListAddUpdate: "user/SavedLinkedUserService",
  GetHouseAccountDetails: "user/GetHouseAccountDetails",
  GetGoogleLocations: "user/GetGoogleLocations",
  GetAgentSettingDetails: "user/GetCurrentPermissionService",
  DeleteAgent: "user/DeleteUserInfoService",
  GetUsercredentialIdOfUser: "user/GetUserCredentialId",
  AddUpdateUserPermissions: "user/AddUpdateUserPermissionsService",
  GetUserListing: "user/GetUsersService",
  AddupdateAdminstatus: "user/AddUpdateAdminStatusService",
};
config.DashBoard = {
  GetAgentClientCount: "dashboard/GetCountForMainDashboard",
  GetRevenueData: "dashboard/GetRevenueForGraph",
  GetTop20AgentList: "dashboard/GetAgentsData",
  GetRevenueByLOC: "dashboard/GetRevenueByLOCData",
  GetNewPolicyList: "dashboard/GetNewPolicyListService",
  GetRenewalsList: "dashboard/GetRenewableListService",
  GetReceivableList: "dashboard/GetReceivablesListService",
  GetClientsList: "dashboard/GetClientsWithMultipleProductsService",
  GetReportDetails: "dashboard/GetAgentDetailforExport",
};

config.ClientManager = {
  ClientsListing: "client/GetClientListService",
  AddUpdateDetails: "client/AddUpdateClientService",
  GetClientDetails: "client/GetClientDetailsService",
  DeleteClient: "client/DeleteClientsService",
  GetClientName: "client/GetAllClientNameService",
  GetSingleClientName:"client/GetSelectedClientNameService",
  GetSearchedClients:"client/GetSearchClientService"
};
config.PolicyManager = {
  PoliciesListing: "Policy/GetPoliciesForWebService",
  PolicyDetails: "Policy/GetPolicyDetailsService",
  PolicyType: "Policy/GetPolicyTypeService",
  AddUpdatePolicy: "Policy/SavePolicyService",
  DeletePolicy: "Policy/DeletePolicyBasedOnIdService",
  GetOutGoingSchedule: "Policy/GetOutgoingScheduleByPolicyService",
  GetReplacedPolicyList: "Policy/GetReplacedPolicyListService",
  AddUpdatePolicyNotes: "Policy/AddUpdatePolicyNotesService",
  GetPolicyNotesList: "Policy/GetListOfPolicyNotesService",
  DeletePolicyNotes: "Policy/DeletePolicyNotesService",
  GetPolicySmartFields: "Policy/GetPolicySmartFieldDetailsService",
  UpdatePolicySmartFields: "Policy/AddUpdatePolicySmartFieldsService",
  GetIncomingPaymentList: "Post/GetPaymentEntryPolicyIdWiseSrvc",
  GetOutgoingPaymentList: "Post/GetOutgoingPaymentForCommDashboardSrvc",
  GetFollowupIssuesList: "Followup/GetFewIssueForCommissionDashBoardService",
  UpdateLastRefresh: "Post/FollowUpProcedureSrvc",
  GetFolowupPolicyDetails: "Policy/GetFollowupPolicyDetailsService",
  RemoveFollowUpIssue: "Followup/RemoveCommisionIssueService",
  AddUpdateFollowUpIssues: "Followup/AddUpdateFollowUpIssuesService",
  AddUpdateIncomingPayment: "Post/CommissionDashBoardPostStartClientSrvc",
  RemoveIncomingPayment: "Post/RemoveIncomingPaymentService",
  UnLinkIncomingPayment: "Post/UnlinkIncomingPaymentService",
  UpdateOutgoingPayments: "policyComm/AddUpdateOutgoingPaymentService",
  ReversePaymentUserList: "User/GetUsersByLicenseeService",
  ReverseOutgoingPayment: "policyComm/ReverseOutgoingPaymentService",
  RemoveOutgoingPayment: "policyComm/DeleteOutGoingPaymentViaIdService",
  UpdateBatchStatus: "Batch/SetBatchToUnPaidStatusService",
  ImportPolicyDetails: "Policy/ImportPolicyService",
  GetAdvanceSearchedPolicies: "Policy/GetAllSearchedPolicies",
  GetSegmentsForPolicies: "segment/GetSegmentsForPolicies",
  GetSegmentsOnCoverageId: "segment/GetSegmentsOnCoverageId",
  CheckProductSegmentAssociation: "segment/CheckProductSegmentAssociation",
};

config.CommonData = {
  GetPayorsList: "Payor/GetPayorsService",
  GetCarrierList: "Carrier/GetCarrierListService",
  GetProductsList: "Coverage/GetDisplayedCarrierCoveragesService",
  GetProductTypes: "Coverage/GetProductTypeService",
  GetGlobalPayorCarriers: "Carrier/PayorCarrierGlobalService",
  GetTerminationReasonList: "Master/GetTerminationReasonListService",
  GetAccountExecList: "User/GetAccountExecByLicencessIDService",
  GetPrimaryAgentList: "User/GetUsersService",
  GetIncomingPayTypes: "Master/GetPolicyIncomingPaymentTypeListService",
  GetLicenseeList: "User/GetAllLicenseesService",
  GetPayorRegions: "Master/GetRegionListService",
};
config.Settings = {
  CommissionScheduleList: "setting/GetSettingsListService",
  AddUpdateCommissionSchedule: "setting/SaveSchedule",
  DeleteCommScheduleSttng: "setting/DeleteSchedule",
  GettingCommScheduleSttngDetails: "setting/GetCommissionScheduleDetail",
  CheckIncomingScheduleExist: "setting/GetPayorScheduleDetail",
  ReportSettingListing: "setting/GetReportSettingListService",
  UpdateReportSettings: "setting/SaveReportSettingListService",
  IsScheduleExist: "setting/GetPayorScheduleDetail",
  AddUpdateNamedSchedule: "setting/SaveNamedSchedule",
  IsNamedScheduleExist: "setting/isNamedScheduleExist",
  NamedScheduleList: "setting/GetNamedScheduleListService",
  CheckedNamedScheduleExist: "Policy/checkNamedscheduleExist",
  GetSegmentsListing: "segment/GetSegmentsList",
  GetProductsSegmentsForUpdate: "segment/GetProductsSegmentsForUpdate",
  SaveDeleteSegment: "segment/AddUpdateDeleteSegmentService",
  GetProductsWithoutSegments: "segment/GetProductsWithoutSegments",
};

config.ReportManager = {
  PrintReport: "report/PrintReportService",
  GetReportNames: "report/GetReportNamesService",
  GetBatchDetailsList: "Batch/GetReportManagerBatchList",
  GetPayeeList: "report/GetPayeeListService",
  SavePayeeStatementReport: "report/SavePayeeStatementReportService",
  SaveAuditReport: "report/SaveAuditReportService",
  SetBatchMarkPaid: "Batch/SetBatchesToPaidInReportsService",
  GetCarrierList: "Carrier/GetCarriersOnlyService",
  SaveManagementReport: "report/SaveManagementReportService",
  GetSegmentList: "segment/GetSegmentsForPolicies",
};
config.CompManager = {
  GetBatchList: "Batch/GetCurrentBatchService",
  GetStatementList: "statement/GetBatchStatmentService",
  SaveBatchNote: "batch/AddUpdateBatchNoteService",
  BatchDelete: "batch/DeleteBatchService",
  DeleteStatement: "statement/DeleteStatementService",
  GetLinkedPolicyPayments: "linkPayment/GetPaymentsForLinkedPolicy",
  GetPendingPoliciesList:
    "linkPayment/GetPendingPoliciesForLinkedPolicyService",
  AddUpdateBatch: "batch/AddUpdateIBatchService",
  UpdateBatchFileName: "batch/UpdateBatchFileNameService",
  GetDataToExport: "batch/ExportBatchService",
  GetActivePolicyList: "linkPayment/GetAllPoliciesForLinkedPolicyService",
  GetInsuredPaymentData: "batch/GetInsuredPaymentsService",
  ActivatePolicy: "linkPayment/MakePolicyActiveService",
  GetConditionsForLink: "linkPayment/GetConditionsToLinkService",
  DoLinkPolicy: "linkPayment/DoLinkPolicyService",
  IsAgencyVersion: "billingLine/IsAgencyVersionLicenseService",
  IsMarkedPaid: "policyComm/IsEntryMarkPaidService",
  ScheduleMatches: "linkPayment/ScheduleMatchesService",
  ValidatePaymentsForLinking: "linkPayment/ValidatePaymentsService",
  updateStatementDate: "statement/UpdateStatementDateService",
};
config.ConfigManager = {
  GetPayorsList: "payor/GetPayorsList",
  GetCarrierList: "Carrier/GetCarrierListingService",
  AddUpdateCarrier: "Carrier/AddUpdateCarrierService",
  DeleteCarrier: "Carrier/DeleteCarrierService",
  SaveDeletePayor: "payor/AddUpdateDeletePayorService",
  GetPayorContacts: "payorContacts/GetContactsService",
  DeletePayorContact: "payorContacts/DeletePayorContact",
  AddUpdatePayorContact: "payorContacts/AddUpdatePayorContactDetails",
  GetConatctPayorDetails: "payorContacts/GetPayorContactDetailsService",
  GetCoverageNickNameList: "coverage/GetAllNickNamesService",
  AddUpdateCoverageType: "coverage/AddUpdateCoverageTypeService",
  GetCompTypeListing: "compType/GetCompTypeListing",
  AddUpdateCompTypeDetails: "compType/AddUpdateCompTypeService",
  DeleteComptype: "compType/DeleteCompTypeService",
  DeleteProductType: "coverage/DeleteNickNameService",
  UpdateFollowUpSettingService: "Followup/FollowUpSettingService",
  GetFollowUpSettingService: "master/GetSystemConstantKeyValueService",
  GetProductListingService: "coverage/GetCoveragesListingService",
  AddUpdateCoverage: "coverage/AddUpdateCoverageService",
  DeleteCoverages: "coverage/DeleteCoverageService",
};
config.PayorTool = {
  GetPayorTemplateList: "payorTool/GetPayorToolTemplateService",
  GetStatementImage: "payorTool/GetPayorToolMgrWithTemplateService",
  GetFieldList: "payorTool/GetFieldListService",
  AddField: "payorTool/AddUpdatePayorToolAvailablelFieldTypeService",
  DeleteField: "payorTool/DeletePayorToolAvailablelFieldTypeService",
  GetTemplateData: "payorTool/GetPayorTemplateDataService",
  AddTemplate: "payorTool/AddTemplateService",
  GetMaskFieldList: "master/GetPayorToolMaskedFieldListService",
  DeleteTemplate: "payorTool/DeleteTemplateService",
  DuplicateTemplate: "payorTool/DulicatePayorTemplateService",
  SavePayorToolData: "payorTool/AddUpdatePayorToolService",
  IfPayorTemplateHasValue: "payorTool/IfPayorTemplateHasValue",
  FetchTestFormulaResult: "payorTool/GetTestFormulaResult",
  DeleteImportToolTemplate: "payorTool/DeleteImportPayorTemplateService",
};

config.UploadPDFFileURL = 'Z:/UploadBatch'
config.UploadExcelFileURL = 'Z:/UploadBatch/Import/Processing/'
config.ImportPolicyFileUpload='Z:/ImportPolicyFile'
config.PayorToolImage = 'Z:/Images'
config.PolicyNotePDFFile="Z:/PolicyNotes";

module.exports = config;
