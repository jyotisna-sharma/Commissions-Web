export class LearnedFieldsDetails {
    MapTextToLearnedField(value: any, policyLearnedField: any): any {
        let fieldValue = '';
        if (value) {
            switch (value) {
                case 'Insured':
                    fieldValue = policyLearnedField.Insured;
                    break;
                case 'PolicyNumber':
                    fieldValue = policyLearnedField.PolicyNumber;
                    break;
                case 'Effective':
                    fieldValue = policyLearnedField.OriginDateString;
                    break;
                case 'Renewal':
                    fieldValue = policyLearnedField.Renewal;
                    break;
                case 'Carrier':
                    fieldValue = policyLearnedField.CarrierNickName;
                    break;
                case 'Product':
                    fieldValue = policyLearnedField.CoverageNickName;
                    break;
                case 'ModelAvgPremium':
                    fieldValue = policyLearnedField.ModalAvgPremium.ToString();
                    break;
                case 'PolicyMode':
                    fieldValue = this.GetPolicyMode(policyLearnedField.PolicyModeId);
                    break;
                case 'Enrolled':
                    fieldValue = policyLearnedField.Enrolled;
                    break;
                case 'Eligible':
                    fieldValue = policyLearnedField.Eligible;
                    break;
                case 'Link1':
                    fieldValue = policyLearnedField.Link1;
                    break;
                case 'SplitPer':
                    fieldValue = policyLearnedField.Link2.ToString();
                    break;
                case 'Client':
                    fieldValue = policyLearnedField.ClientName;
                    break;
                case 'CompType':
                    fieldValue = this.GetCompType(policyLearnedField.CompTypeId.Value);
                    break;
                default:
                    break;
            }
            return fieldValue;
        }
    }

     MapLearnedFieldToText(value: any): any {
        let fieldValue = value;
        if (value) {
            switch (value) {
                case 'OriginDateString':
                    fieldValue = 'Effective';
                    break;
                case 'Carrier':
                    fieldValue = 'CarrierNickName';
                    break;
                case 'Product':
                    fieldValue = 'CoverageNickName';
                    break;
                
                case 'SplitPer':
                    fieldValue = 'Link2';
                    break;
                case 'Client':
                    fieldValue = 'ClientName';
                    break;
                case 'CompType':
                    fieldValue = 'CompTypeId';
                    break;
                case 'PolicyMode':
                    fieldValue = 'PolicyModeId';
                    break;
                default:
                    break;
            }
            return fieldValue;
        }
    }


    GetPolicyMode(modeId: any): any {
        let PolicyMode = '';
        switch (modeId as any) {
            case 0:
                PolicyMode = 'M';
                break;
            case 1:
                PolicyMode = 'Q';
                break;
            case 2:
                PolicyMode = 'S';
                break;
            case 3:
                PolicyMode = 'A';
                break;
            case 4:
                PolicyMode = '0';
                break;
            case 0:
                PolicyMode = 'M';
                break;
            default:
                PolicyMode = '';
                break;
        }
        return PolicyMode;
    }
    public GetCompType(value: Number): string {
        let CompType:any = value;
        switch (CompType as any) {
            case 1:
                CompType = 'C';
                break;
            case 2:
                CompType = 'O';
                break;
            case 3:
                CompType = 'B';
                break;
            case 4:
                CompType = 'F';
                break;
            default:
                CompType = '';
                break;
        }
        return CompType;
    }

    public GetPolicyModeID(modeId: any): Number {
        let PolicyMode = 0;
        switch (modeId as any) {
            case 'M':
                PolicyMode = 0;
                break;
            case  'Q':
                PolicyMode = 1 ;
                break;
            case 'S':
                PolicyMode = 2 ;
                break;
            case 'A':
                PolicyMode = 3;
                break;
           
            default:
                PolicyMode = 0;
                break;
        }
        return PolicyMode;
    }

    public GetCompTypeID(value: any): Number {
        let CompType:any = 1;
        switch (value as any) {
            case 'C':
                CompType = 1;
                break;
            case 'O':
                CompType = 2;
                break;
            case 'B':
                CompType = 3;
                break;
            case 'F':
                CompType = 4;
                break;
            default:
                CompType = 1;
                break;
        }
        return CompType;
    }
}
