module.exports = function (_formattedValue, _cssClass, _type) {
  this.FormattedValue = _formattedValue
  this.CssClass = _cssClass.toLowerCase()
  this.Type = _type
}
module.exports = function (_formattedValue, _cssClass, _type, _access) {
  this.FormattedValue = _formattedValue
  this.CssClass = _cssClass.toLowerCase()
  this.Type = _type
  this.Access = _access
}
