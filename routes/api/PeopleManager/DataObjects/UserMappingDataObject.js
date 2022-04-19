module.exports = function (responseObject) {
  this.CreatedDate = responseObject.CreatedDate
  this.Email = responseObject.Email
  this.FirstName = responseObject.FirstName
  this.LastName = responseObject.LastName
  this.NickName = responseObject.NickName
  this.UserCredentialId = responseObject.UserCredentialID
  this.IsConnected = responseObject.IsConnected
}
