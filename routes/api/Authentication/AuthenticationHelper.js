// var request = require('request')
var config = require('../../../config')
var apiObject = require('../../../utilities/common')
var appLogger = require('../../../utilities/logger')
var callAPI = require('../CallAPI')
var AuthHelper = {
  login: function (req, callback) {
    var url = APIBaseURl + config.AuthenticationManager.AuthenticateUser
    callAPI.postToAPI(url, req, req.body, function (Responsebody) {
      
      if (Responsebody.ResponseCode === 200) {
        appLogger.debug('req.body')
        appLogger.debug(JSON.stringify(req.body))
        if (req.body.rememberMe ==true && Responsebody.UserDetails.IsUserActiveOnweb== true) {
          // set session cookie
          req.session.isUserActiveOnWeb=Responsebody.UserDetails.IsUserActiveOnweb;
          req.session.rememberMe = 'true'
          var hour = 365 * 24 * 60 * 60 * 1000
          req.session.cookie.expires = new Date(Date.now() + hour)
          req.session.cookie.maxAge = hour
        }
        else {
          req.session.rememberMe = 'false' 
         // req.session.ttl = 30;
           }
       
        req.session.User = Responsebody.UserDetails
        req.session.AuthToken = Responsebody.UserToken
        Responsebody['loggedUser'] = { 'User': req.session.User }
        appLogger.debug('Session user details: ' + JSON.stringify(req.session.user))
        //get payor list
        url = APIBaseURl + config.CommonData.GetPayorsList
      }
      callback(Responsebody)
    })
  },

}

module.exports = AuthHelper
