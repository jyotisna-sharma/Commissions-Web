var ListObjectType = require('../../ControlObjects/ListObjectControl')

module.exports = function (responseObject) {
  this.FirstName = responseObject.FirstName
  this.LastName = responseObject.LastName
  this.NickName = responseObject.NickName
  this.UserCredentialID = responseObject.UserCredentialID
  this.IsConnected = responseObject.IsConnected
  this.CheckBox = new ListObjectType(responseObject.IsConnected, 'checkBox', 'check-box')
  this.FirstYearDefault = responseObject.FirstYearDefault
  this.RenewalDefault = responseObject.RenewalDefault
}
