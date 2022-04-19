const { validationResult } = require('express-validator/check');

var validations = {
    validationCheck : function (req) {
        var errors = validationResult(req);
        var validationResp = {};
        validationResp.missedFields = errors.array();
        validationResp.missedFieldLength = errors.array().length;
        return validationResp;
      }
};
module.exports = validations;

