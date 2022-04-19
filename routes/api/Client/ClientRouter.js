/**
 * @author: Jyotisna.
 * @Name: ClientRouter.
 * @description: Main router file for clients module.
 * @Routes Methods:
 *  router.post('/login')
 *  router.post('/forgot')
 *  router.post('/reset')
 *  router.post('/logout')
 * @dated: 28 Jan, 2019.
 **/
var express = require('express')
var router = express.Router()
var callAPI = require('../CallAPI')
var config = require('../../../config')
var ChangeClientListObjects = require('../Client/DataObjects/ClientListDataObject')
var appLogger = require('../../../utilities/logger')
router.post('/getClientList', function (req, res, next) {
  appLogger.debug('getClientList:Processing begins with licenseeId' + ' ' + req.body.LicenseeId)
  var datatopost = {
    'licenseeId': req.body.LicenseeId,
    'statusId': req.body.statusId,
    'loggedInUserId': req.body.loggedInUserId,
    'listParams': {
      'pageSize': req.body.PageSize,
      'pageIndex': req.body.PageIndex,
      'sortBy': req.body.SortBy === undefined ? '' : req.body.SortBy,
      'sortType': req.body.SortType === undefined ? '' : req.body.SortType,
      'filterBy': req.body.FilterBy === '' ? '' : req.body.FilterBy
    }
  }
  callAPI.postToAPI(APIBaseURl + config.ClientManager.ClientsListing, req, datatopost, function (response) {
    var responseObj = {}
    responseObj.ResponseCode = response.ResponseCode
    responseObj.TotalRecords = []
    responseObj.TotalCount = (response.ClientsCount) ? response.ClientsCount.TotalClientCount : 0
    responseObj.ActiveCount = (response.ClientsCount) ? response.ClientsCount.ActivePolicyClientCount : 0
    responseObj.PendingCount = (response.ClientsCount) ? response.ClientsCount.PendingPolicyClientCount : 0
    responseObj.InactiveCount = (response.ClientsCount) ? response.ClientsCount.TerminatePolicyClientCount : 0
    responseObj.ZeroCount = (response.ClientsCount) ? response.ClientsCount.WithoutPolicyClientCount : 0
    //POpulate total length => if search param, then search result count, else  clients count
    responseObj.TotalLength = (response.ClientsCount) ? response.ClientsCount.SelectedClientCount : 0
    if (responseObj.ResponseCode === 200) {
      for (var clientlist = 0; clientlist < response.ClientList.length; clientlist++) {
        var clientlisting = response.ClientList[clientlist]
        var userlistobj = new ChangeClientListObjects(clientlisting)
        responseObj.TotalRecords.push(userlistobj)
      }
      appLogger.debug('getClientList:Processing success  with licenseeId' + JSON.stringify(response.ClientsCount));
      res.send(responseObj)
    }
  })
})
router.post('/addupdateClientDetails', function (req, res, next) {
  callAPI.postToAPI(APIBaseURl + config.ClientManager.AddUpdateDetails, req, req.body,
    function (ResponseBody) {
      res.send(ResponseBody)
    })
})
router.post('/getClientDetails', function (req, res, next) {
  callAPI.postToAPI(APIBaseURl + config.ClientManager.GetClientDetails, req, req.body,
    function (ResponseBody) {
      res.send(ResponseBody);
    })
})

router.post('/deleteClient', function (req, res, next) {
  callAPI.postToAPI(APIBaseURl + config.ClientManager.DeleteClient, req, req.body,
    function (ResponseBody) {
      res.send(ResponseBody);
    })
})

module.exports = router