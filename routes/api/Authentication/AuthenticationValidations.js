/**
 * @author: Ankit.
 * @Name: AuthenticationValidations.js.
 * @description: Validation check for authentication router file.
 * @Method count: 2.
 * @Validation Properties:
 *  LoginParamsValidation
 *  forgot
 * @dated: 3 Sep, 2018.
 * @modified: 3 Sep, 2018
**/

const { check, checkSchema } = require('express-validator/check')

module.exports = Object.freeze({
  LoginParamsValidation: [
    check('userName', 'username is missing.').exists(),
    check('password', 'password is missing.').exists()
  ],
  forgot: [
    check('userName', 'userName is missing').exists()
  ]
})
