var ListObjectType = require('../../ControlObjects/ListObjectControl')

module.exports = function(responseObject, roleIdToView = null) {
    if (roleIdToView === '2') {
        this.CreatedDate = responseObject.CreatedDate
        this.UserName = new ListObjectType(responseObject.UserName, '', 'AnchorTag')
        this.Email = responseObject.Email
        this.FirstName = responseObject.FirstName
        this.LastName = responseObject.LastName
        this.NickName = responseObject.NickName
        this.UserCredentialID = responseObject.UserCredentialID
        this.Action = responseObject.Action
        this.ToggleButton = new ListObjectType(responseObject.IsAdmin, 'ToggleButton', 'toggle-button')
        this.Admin = responseObject.IsAdmin
    } else if (roleIdToView === '3') {
        this.CreatedDate = responseObject.CreatedDate
        this.UserName = new ListObjectType(responseObject.UserName, '', 'AnchorTag')
        this.Email = responseObject.Email
        this.FirstName = responseObject.FirstName
        this.LastName = responseObject.LastName
        this.NickName = responseObject.NickName
        this.UserCredentialID = responseObject.UserCredentialID
        this.Action = responseObject.Action
        this.RadioButton = new ListObjectType(responseObject.IsHouseAccount, 'RadioButton', 'radio-button')
        this.IsHouseAccount = responseObject.IsHouseAccount
    } else if (roleIdToView === '4') {
        this.CreatedDate = responseObject.CreatedDate
        this.UserName = new ListObjectType(responseObject.UserName, '', 'AnchorTag')
        this.FirstName = responseObject.FirstName
        this.LastName = responseObject.LastName
        this.UserCredentialID = responseObject.UserCredentialID
    }
}