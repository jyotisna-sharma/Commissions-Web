var ListObjectType = require('../../ControlObjects/ListObjectControl')

module.exports = function (responseObject) {
  this.CreatedDate = responseObject.CreatedDate
  this.Email = responseObject.Email
  this.FirstName = responseObject.FirstName
  this.LastName = responseObject.LastName
  this.NickName = responseObject.NickName
  this.UserCredentialID = responseObject.UserCredentialId
  this.CheckBox = new ListObjectType(responseObject.IsConnected, 'checkBox', 'check-box')
  this.IsConnected = responseObject.IsConnected
}
