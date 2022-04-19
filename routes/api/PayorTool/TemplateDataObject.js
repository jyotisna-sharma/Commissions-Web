var ListObjectType = require('../ControlObjects/ListObjectControl')
module.exports = function (responseObject) {
    this.TemplateID = responseObject.ID
    this.Name = new ListObjectType(responseObject.TemplateName,'','AnchorTag')
    this.Action = 'action'
  }
  