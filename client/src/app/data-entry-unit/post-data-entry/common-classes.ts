import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
export class DeuFieldDataCollection {
    DeuFieldName: any = undefined;
    DeuFieldType: any = undefined;
    DeuFieldValue: any = undefined;
    ExtensionData: any = undefined;
    DeuFieldMaskType: any = undefined;
}

export class DEUFormField {
    BatchId: any;
    BatchIdField: any;
    CurrentUser: any;
    CurrentUserField: any;
    DeuData: any;
    DeuDataField: any;
    DeuEntryId: any;
    DeuEntryIdField: any;
    DeuFieldDataCollection: any;
    DeuFieldDataCollectionField: any;
    ExtensionData: any;
    LicenseeId: any;
    LicenseeIdField: any;
    PayorId: any;
    PayorIdField: any;
    ReferenceNo: any;
    ReferenceNoField: any;
    SearchedPolicyList: any;
    SearchedPolicyListField: any;
    SelectedPolicy: any;
    SelectedPolicyField: any;
    StatementId: any;
    StatementIdField: any;
    TemplateID: any;
    TemplateIDField: any;
    extensionDataField: any;
}

// tslint:disable-next-line:max-classes-per-file
export class CommonVariables {
    statementListDisplayColumns: ['StatementNumber', 'StatusName',
        'CheckAmountString', 'CreatedDateString', 'CreatedByDEU', 'LastModifiedDateString'];
    statementColumnLabels: ['Statement', 'Status', 'Check Amt', 'Entered', 'DEU', 'Last Edit'];
    statementcolumnDataTypes: [['StatementNumber', 'number'],
        ['CheckAmountString', 'number'], ['CreatedDateString', 'date'], ['LastModifiedDateString', 'date']];
    statementcolumnIsSortable: string[] = ['true', 'true', 'true', 'true', 'true', 'true', 'true', 'true', 'true', 'true', 'true'];

    batchDisplaycolumnLabels: ['BatchNumber', 'EntryStatusString', 'AssignedDeuUserName',
        'CreatedDateString', 'LicenseeName', 'LastModifiedDateString'];
    batchcolumnDataType: [['BatchNumber', 'number'],
        ['CreatedDateString', 'date'],
        ['LastModifiedDateString', 'date']];
    batchcolumnLabels: ['Batch #', 'Status', 'Entry User', 'Created', 'Agency', 'Last Edit'];
}
