/**
 * @author: Ankit.
 * @Name: AuthenticationRouter.
 * @description: Main router file for authentication module.
 * @Router count: 2.
 * @Routes Methods:
 *  router.post('/login')
 *  router.post('/forgot')
 *  router.post('/reset')
 *  router.post('/logout')
 * @dated: 17 Aug, 2018.
 * @modified: 28 Aug, 2018
 * @modified: Jan 15, 2019 by Jyotisna - to remove helper layer 
**/
// Add Requires
var express = require('express')
var router = express.Router()
var helper = require('./AuthenticationHelper')
var validations = require('./AuthenticationValidations')
var commonValidations = require('../../../utilities/commonValidations')
var callAPI = require('../CallAPI')
var config = require('../../../config')

router.post('/login', function (req, res, next) {
  // We are here calling the common method which will check the required fields
  var response = commonValidations.validationCheck(req)
  if (response.missedFieldLength > 0) {
    res.send(response)
  } else {
    helper.login(req, function (responseObject) {
      res.send(responseObject)
    })
    // callAPI.postToAPI(APIBaseURl + config.AuthenticationManager.AuthenticateUser, req, req.body,function (Responsebody) {
    //  // Responsebody = JSON.parse(Responsebody)
    //   if (Responsebody.ResponseCode === 200) {
        
    //     if (req.body.rememberMe === 'true' || req.body.rememberMe === true) {
    //       req.session.rememberMe = 'true'
    //       // set session cookie
    //       var hour = 365 * 24 * 60 * 60 * 1000
    //       req.session.cookie.expires = new Date(Date.now() + hour)
    //       req.session.cookie.maxAge = hour
    //      // req.sessionStore.ttl = 1000000;
    //     }
    //     else {
    //       req.session.rememberMe = 'false';
    //      // req.session.ttl = 30;
    //     }
    //     req.session.User = Responsebody.UserDetails
    //     req.session.AuthToken = Responsebody.UserToken
    //     Responsebody.loggedUser = { 'User': req.session.User }

    //     //Call to get payor list
        
    //     // router.post('/getPayorsList', function (req, res, next) { // 
    //     //   const postData = {
    //     //       'licenseeId': req.session.User.LicenseeID,
    //     //       'payerfillInfo':{
    //     //           'IsCarriersRequired':true,
    //     //           'IsCoveragesRequired': false,
    //     //           'IsWebsiteLoginsRequired':false,
    //     //           'IsCon tactsRequired':false,
    //     //           'PayorStatus' :'3'
    //     //           }

    //     //       }

    //     //   callAPI.postToAPI(APIBaseURl + config.CommonData.GetPayorsList, req, postData,
    //     //     function (ResponseBody) {
    //     //       //res.send(ResponseBody)
    //     //       redisClient.set('payorList', ResponseBody.body);
    //     //     })
    //     // })
    // }
    //   appLogger.debug('Session user details: ' + JSON.stringify(req.session.User))
    //   appLogger.debug('Session user details: ' + JSON.stringify(Responsebody))
    //   res.send(Responsebody)
    // })

  }
})

router.post('/logout', function (req, res, next) {
  appLogger.debug('Log out user.')
  req.body.loginParams.ClientIP = req.ip
//  req.session.destroy(function (err) {
    callAPI.postToAPI(APIBaseURl + config.AuthenticationManager.AddLoginLogoutTimeService, req,req.body,
      function (responseObject){
        req.session.destroy(function (err) {
          appLogger.debug('Logout - User Session killed' + err)
          res.send('200')
        })
    })
  })


router.post('/logindetails', function (req, res, next) {
  var response = commonValidations.validationCheck(req)
  req.body.loginParams.ClientIP = req.ip
  if (response.missedFieldLength > 0) {
    res.send(response)
  } else {
      callAPI.postToAPI(APIBaseURl + config.AuthenticationManager.AddLoginLogoutTimeService, req,req.body,function (responseObject) {
      res.send(responseObject)
    })
  }
})


router.post('/RegisterEmailId', function (req, res, next) {
  var response = commonValidations.validationCheck(req)
  if (response.missedFieldLength > 0) {
    res.send(response)
  } else {
    callAPI.postToAPI(APIBaseURl + config.AuthenticationManager.RegisterEmailService, req,req.body,function (responseObject) {
      res.send(responseObject)
    })
  }
})

router.post('/forgot', validations.forgot, function (req, res, next) {
  var response = commonValidations.validationCheck(req)
  if (response.missedFieldLength > 0) {
    res.send(response)
  } else {
    callAPI.postToAPI(APIBaseURl + config.AuthenticationManager.ForgotPassword, req,{ 'userName': req.body.userName },function (responseObject) {
      res.send(responseObject)
    })
  }
})

router.post('/reset', function (req, res, next) {
  // helper.reset(req.body.password, req.body.passwordKey, function (response) {
  //   res.send(response)
  // })
  callAPI.postToAPI(APIBaseURl + config.AuthenticationManager.ResetPassword, req, { 'passwordKey': req.body.passwordKey, 'password': req.body.password }, function (response) {
      res.send(response)
    })
})

router.post('/CheckUpdatePasswordExpireTime', function (req, res, next) {
  // helper.CheckUpdatePasswordExpireTime(req.body.key, function (response) {
  //   res.send(response)
  // })
  callAPI.postToAPI(APIBaseURl + config.AuthenticationManager.CheckUpdatePasswordExpireTime, req, { 'key': req.body.key }, function (response) {
    res.send(response)
  })
})

router.post('/resetusername', function (req, res, next) {
  callAPI.postToAPI(APIBaseURl + config.AuthenticationManager.ResetUserName, req, { 'email': req.body.email, 'password': req.body.password, 'userId': req.body.userId }, function (response) {
    res.send(response)
  })
})
router.post('/getSecurityQuestion', function (req, res, next) {
  callAPI.postToAPI(APIBaseURl + config.AuthenticationManager.GetSecurityQuestion, req, { 'email': req.body.email}, function (response) {
    res.send(response)
  })
})

router.post('/forgotusername', function (req, res, next) {
  callAPI.postToAPI(APIBaseURl + config.AuthenticationManager.ForgotUsername, req,{ 'email': req.body.email, 'securityQuestion': req.body.securityQuestion, 'securityAnswer': req.body.securityAnswer }, function (response) {
    res.send(response)
  })
})

module.exports = router
