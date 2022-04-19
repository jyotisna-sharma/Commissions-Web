var ListObjectType = require('../../ControlObjects/ListObjectControl')
module.exports = function (responseObject) {
    this.policyNumber = new ListObjectType(responseObject.PolicyNumber, '', 'AnchorTag');
    this.Carrier = responseObject.Carrier
    this.OrignalEffectiveDate = responseObject.Effective
    this.Insured = responseObject.Insured
    this.CDPolicyID = responseObject.CDPolicyID
    this.PolicyPlanID = responseObject.PolicyPlanID
    this.ImportPolicyID= responseObject.ImportPolicyID
    this.Payor = responseObject.Payor
    this.PayType = responseObject.PayType
    this.PolicyId = responseObject.PolicyId
    this.PolicyNumber = responseObject.PolicyNumber
    this.PAC = responseObject.PAC
    this.Product = responseObject.product
    if (responseObject.ClientName) {
        this.ClientName = responseObject.ClientName;
    }
    if (responseObject.ClientId) {
        this.ClientId = responseObject.ClientId;
    }
    if (responseObject.Status === 'Active') {
        this.Status = new ListObjectType(responseObject.Status, 'active-state', 'class')
    }
    else if (responseObject.Status === 'Pending') {
        this.Status = new ListObjectType(responseObject.Status, 'pending-state', 'class')
    }
    else if (responseObject.Status === 'Terminated') {
        this.Status = new ListObjectType(responseObject.Status, ' terminated-state', 'class')
    }

    this.Type = responseObject.Type
    this.Action = 'action'
}