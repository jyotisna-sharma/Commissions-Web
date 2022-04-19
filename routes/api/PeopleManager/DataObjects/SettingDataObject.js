var ListObjectType = require('../../ControlObjects/ListObjectControl')

module.exports = function(responseObject, formType) {
        // -------------------------------------------- for  adding a new properties in  Radio buttons -----------------------------------------------
        this.Module = responseObject.Module
        if (formType === 'Get list') {
            this.ReadRadioButton = new ListObjectType(false, 'RadioButton', 'radio-button-setting', 'Read')
            this.WriteRadioButton = new ListObjectType(false, 'RadioButton', 'radio-button-setting', 'Write')
            this.NoAccessRadioButton = new ListObjectType(false, 'RadioButton', 'radio-button-setting', 'NoAccess')
            this.UserPermissionId = responseObject.UserPermissionId
            this.UserCredentialId = responseObject.UserCredentialId
            if (responseObject.Permission === 1) {
                this.PermissionName = 'ReadRadioButton'
                this.ReadRadioButton = new ListObjectType(true, 'RadioButton', 'radio-button-setting', 'Read')
            } else if (responseObject.Permission === 2) {
                this.PermissionName = 'WriteRadioButton'
                this.WriteRadioButton = new ListObjectType(true, 'RadioButton', 'radio-button-setting', 'Write')
            } else {
                this.PermissionName = 'NoAccessRadioButton'
                this.NoAccessRadioButton = new ListObjectType(true, 'RadioButton', 'radio-button-setting', 'NoAccess')
            }
            // #############################################################################################################################################

            // -------------------------------------------- for  showing Modules from ModuleId -----------------------------------------------
            if (this.Module === 1) {
                this.ModuleName = 'People Manager'
            }
            if (this.Module === 2) {
                this.ModuleName = 'Policy Manager'
            }
            if (this.Module === 3) {
                this.ModuleName = 'Setting'
            }
            if (this.Module === 4) {
                this.ModuleName = 'Follow Up Manager'
            }
            if (this.Module === 5) {
                this.ModuleName = 'Help/Update'
            }
            if (this.Module === 6) {
                this.ModuleName = 'Comp Manager'
            }
            if (this.Module === 7) {
                this.ModuleName = 'Report Manager'
            }
            if (this.Module === 13) {
                this.ModuleName = 'Dashboard'
            }
        }

        // #############################################################################################################################################
        // -------------------------------------------- for  updating list of user permissions -----------------------------------------------
        else {
            if (responseObject.PermissionName === 'ReadRadioButton') {
                this.Permission = 1
            } else if (responseObject.PermissionName === 'WriteRadioButton') {
                this.Permission = 2
            } else if (responseObject.PermissionName === 'NoAccessRadioButton') {
                this.Permission = 3
            }
            this.UserPermissionId = responseObject.UserPermissionId
            this.UserCredentialId = responseObject.UserCredentialId
        }
    }
    // #############################################################################################################################################