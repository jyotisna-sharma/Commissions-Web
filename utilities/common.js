var request = require('request')
var config = require('../config')
// var PlaceDetailsRequest = require("./PlaceDetailsRequest");
var common = {
  //const  authToken : any

  getAuthToken: function (username, callback) {
    try {
      request({
        url: APIBaseURl + config.AuthenticationManager.GetAuthTokenService,
        method: 'POST',
        json: { "username": username },
        timeout: 1000 * 60 * 20
      }, function (error, response, result) {
        if (error) {
          callback({
            'ResponseCode': '500',
            'exceptionMessage': 'Error while fetching data from API server : ' + error.message,
            'message': '',
            'data': ''
          })
        } else if (result) {
          //var body = JSON.stringify(result)
          callback(result)
        }
        else {
          callback({
            'ResponseCode': '444',
            'exceptionMessage': "Unknown Error Occured : No reponse from API or maybe response is 'false'",
            'message': '',
            'data': ''
          })
        }
      })
    } catch (e) {
      callback({
        'ResponseCode': '500',
        'exceptionMessage': 'Exception while fetching data from API server : ' + e.message,
        'message': '',
        'data': ''
      })
    }

  },

  requestToAPI: function (url, data, reqMethod, headerOptions, callback) {
    var requestMethod = reqMethod && reqMethod === 'GET' ? 'GET' : 'POST'
    let username = headerOptions.userName
    let authToken = headerOptions.AuthToken
    var header = { 'AuthToken': authToken }
    try {
      request({
        url: url,
        method: requestMethod,
        json: data,
        headers: header,
        timeout: 9000 * 60 * 50
      }, function (error, response, result) {
        if (error) {
          callback({
            'ResponseCode': '500',
            'exceptionMessage': 'Error while fetching data from API server : ' + error.message,
            'message': '',
            'data': ''
          })
        } else if (result) {
          //Check API response - if found , proceed, else return to get token 
          if (response) {

            let tokenStatus = response.headers["tokenstatus"]
            //Token status returned - meaning something wrong 
            if (tokenStatus == "timeout") {
              //Call to obtain token
              common.getAuthToken(username, function (response) {
                headerOptions.AuthToken = response.StringValue
                common.requestToAPI(url, data, reqMethod, headerOptions, callback)
              })
            }
            else if (tokenStatus == "invalid") {
              callback({
                'ResponseCode': '401',
                'exceptionMessage': 'Request authentication failed on server.',
                'message': '',
                'data': ''
              })
            }
            else { //No token status - all well
              var response = {}
              response.body = (result)
              response.AuthToken = headerOptions.AuthToken
              // var response = JSON.stringify(result)
              // response["AuthToken"] = headerOptions.AuthToken
              callback(response)
            }
          }
        } else {
          callback({
            'ResponseCode': '444',
            'exceptionMessage': "Unknown Error Occured : No reponse from API or maybe response is 'false'",
            'message': '',
            'data': ''
          })
        }
      })
    } catch (e) {
      callback({
        'ResponseCode': '500',
        'exceptionMessage': 'Exception while fetching data from API server : ' + e.message,
        'message': '',
        'data': ''
      })
    }
  },
  // AddExtraParamter(listdata, callback) {
  //   const list = [];
  //   if (listdata && listdata.length > 0) {
  //     for (data of listdata) {
  //       data.Checked = false;
  //       list.push(data);
  //     }
  //   }
  //   return callback(list);
  // }
//   generateResponseObject = function (resCode, exceptionMessage, message, data, callback) {
//     var resObject = new bResponse();
//     resObject.responseCode = resCode;
//     resObject.data = data;

//     if (typeof callback === "function") {
//       if (resCode != responseCodes.SUCCESS) {
//         resObject.exceptionMessage = exceptionMessage;
//         appLogger.error(exceptionMessage);
//       }
//       else {
//         resObject.message = message;
//         //if the data is too long, the log will not be shown in some log viewing tool (like log expert, works in notepad++)
//         appLogger.debug(util.format(message, (data && data != "") ? JSON.stringify(data) : ""));
//       }
//       callback(resObject);
//     }
//     else {
//       if (resCode != responseCodes.SUCCESS)
//         resObject.exceptionMessage = exceptionMessage;
//       else
//         resObject.message = message;

//       return resObject;
//     }
//   }
 }
// Module Exports
module.exports = common
