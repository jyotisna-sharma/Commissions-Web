export class PostedFieldCollection {
    DEUENtryID: any = undefined;
    PolicyNumber: any = undefined;
    ClientName: any = undefined;
    Insured: any = undefined;
    CarrierNickName: any = undefined;
    CoverageNickName: any = undefined;
    PaymentRecived: any = 0;
    Units: any = 0;
    CommissionTotal: any = 0;
    Fee: any = 0;
    SplitPercentage: any = 100;
    CommissionPercentage: any = 0;
    InvoiceDate: any = undefined;
    CreatedDate: any = undefined;
    PostStatus: any = undefined;
    CarrierName: any = undefined;
    ProductName: any = undefined;
    EntryDate: any = new Date();
    UnlinkClientName: any = undefined;
    GuidCarrierID: any = undefined;
    OnCreatingDEUFieldFObject(deuFieldDetails: any): any {
        let columnName = '';
        switch (deuFieldDetails.EquivalentDeuField) {
            /*case 'PolicyNumber':
                {
                    columnName = 'PolicyNumber';
                    break;
                }
            case 'Insured':
                {
                    columnName = 'Insured';
                    break;
                }
            case 'InvoiceDate':
                {
                    columnName = 'InvoiceDate';
                    break;
                } */
                case 'PaymentReceived':
                {
                    columnName = 'PaymentRecived';
                    break;
                } 
                /*case 'CommissionPercentage':
                {
                    columnName = 'CommissionPercentage';
                    break;
                } case 'SplitPercentage':
                {
                    columnName = 'SplitPercentage';
                    break;
                } case 'Carrier':
                {
                    columnName = 'CarrierNickName';
                    break;
                } case 'Product':
                {
                    columnName = 'CoverageNickName';
                    break;
                } case 'Client':
                {
                    columnName = 'ClientName';
                    break;
                } case 'NumberOfUnits':
                {
                    columnName = 'Units';
                    break;
                } case 'Fee':
                {
                    columnName = 'Fee';
                    break;
                } case 'CommissionTotal':
                {
                    columnName = 'CommissionTotal';
                    break;
                }*/
            default:
                columnName = deuFieldDetails.EquivalentDeuField;
                break;
        }
        return columnName;
    }
}


export class DeuFieldsName {
    PolicyNumber: any = undefined;
    Insured: any = undefined;
    InvoiceDate: any = undefined;
    PaymentReceived: any = undefined;
    CommissionPercentage: any = undefined;
    SplitPercentage: any = undefined;
    Carrier: any = undefined;
    Product: any = undefined;
    Fee: any = undefined;
    Client: any = undefined;
    NumberOfUnits: any = undefined;
    CommissionTotal: any = undefined;


}
