var ListObjectType = require('../../ControlObjects/ListObjectControl')
module.exports = function (responseObject) {
    this.CreatedDate = responseObject.CreatedDate
    this.Email = responseObject.Email
    this.DOB = responseObject.DOBString
    this.SSN = responseObject.SSN
    this.Name = new ListObjectType(responseObject.Name,'','AnchorTag')
    this.ClientId = responseObject.ClientId
    this.Phone = responseObject.Phone
    this.Action = responseObject.Action
  }
  