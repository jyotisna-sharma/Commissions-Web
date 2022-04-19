var express = require('express')
var router = express.Router()
    // var helper = require('./PeopleManagerHelper')
var commonValidations = require('../../../utilities/commonValidations')
var callAPI = require('../CallAPI')
var config = require('../../../config')
var AgentListObject = require('./DataObjects/PeopleManagerAgentList')
var UserMappingListObject = require('./DataObjects/UserMappingListing')
var UserMappingDataListObject = require('./DataObjects/UserMappingDataObject')
var LocationDataObject = require('./DataObjects/locationObject')
var SettingDataObject = require('./DataObjects/SettingDataObject')


router.post('/getUserListing', function(req, res, next) {

    var datatopost = {
        'licenseeId': req.body.licenseeId,
        'loggedInUser': req.body.loggedInUser,
        'roleIdToView': req.body.roleIdToView,
        'listParams': {
            'pageSize': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageSize : req.body.PageSize,
            'pageIndex': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageIndex : req.body.PageIndex,
            'sortBy': req.body.SortBy === 'RadioButton' ? 'IsHouseAccount' : req.body.SortBy === 'ToggleButton' ? 'IsAdmin' : req.body.SortBy,
            'sortType': req.body.SortType === '' ? null : req.body.SortType,
            'filterBy': req.body.FilterBy === '' ? '' : req.body.FilterBy

        }
    }
    callAPI.postToAPI(APIBaseURl + config.PeopleManager.PeopleManagerListing, req, datatopost,
        function(Responsebody) {
            //   Responsebody = JSON.parse(Responsebody)
            // req.session.AuthToken = Responsebody.UserToken
            var responseObj = {}
            responseObj.ResponseCode = Responsebody.ResponseCode
            responseObj.TotalRecords = []
            responseObj.TotalLength = Responsebody.SelectedUserRecordCount; // req.body.roleIdToView === '2' ? Responsebody.UserRecordCount: Responsebody.AgentRecordCount
            responseObj.AgentCount = Responsebody.AgentRecordCount;
            responseObj.UserCount = Responsebody.UserRecordCount;
            responseObj.dataEntryUserCount = Responsebody.DataEntryUserRecordCount;


            if (responseObj.ResponseCode === 200) {
                for (var userdetail = 0; userdetail < Responsebody.UsersList.length; userdetail++) {
                    var userdetails = Responsebody.UsersList[userdetail]
                    var userlistobj = new AgentListObject(userdetails, req.body.roleIdToView)
                    responseObj.TotalRecords.push(userlistobj)
                }
            }
            res.send(responseObj)
        })
})
router.post('/getDataEntryUserList', function(req, res, next) {
    var datatopost = {
        'licenseeId': req.body.licenseeId,
        'loggedInUser': req.body.loggedInUser,
        'roleIdToView': req.body.roleIdToView,
        'listParams': {
            'pageSize': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageSize : req.body.PageSize,
            'pageIndex': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageIndex : req.body.PageIndex,
            'sortBy': req.body.SortBy,
            'sortType': req.body.SortType,
            'filterBy': req.body.FilterBy === '' ? '' : req.body.FilterBy,

        }
    }
    callAPI.postToAPI(APIBaseURl + config.PeopleManager.PeopleManagerListing, req, datatopost,
        function(Responsebody) {
            //   Responsebody = JSON.parse(Responsebody)
            // req.session.AuthToken = Responsebody.UserToken
            var responseObj = {}
            responseObj.ResponseCode = Responsebody.ResponseCode;
            responseObj.TotalRecords = [];
            responseObj.TotalLength = Responsebody.SelectedUserRecordCount;
            responseObj.AgentCount = Responsebody.AgentRecordCount;
            responseObj.UserCount = Responsebody.UserRecordCount;
            responseObj.dataEntryUserCount = Responsebody.DataEntryUserRecordCount;

            if (responseObj.ResponseCode === 200) {

                for (var userdetail = 0; userdetail < Responsebody.UsersList.length; userdetail++) {
                    var userdetails = Responsebody.UsersList[userdetail]
                    var userlistobj = new AgentListObject(userdetails, req.body.roleIdToView)
                    responseObj.TotalRecords.push(userlistobj)
                }
            }
            res.send(responseObj)
        })
})

router.post('/deleteAgent', function(req, res, next) {
        callAPI.postToAPI(APIBaseURl + config.PeopleManager.DeleteAgent, req, req.body,
            function(ResponseBody) {
                res.send(ResponseBody)
            })
    })
    //-------------------------------for addUpdateAdminStatus -----------------------------------------------
router.post('/updateAdminStatus', function(req, res, next) {
        callAPI.postToAPI(APIBaseURl + config.PeopleManager.AddupdateAdminstatus, req, req.body,
            function(ResponseBody) {
                res.send(ResponseBody)
            })
    })
    // ############################################################################################################
router.post('/getagentdetails', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PeopleManager.GetAgentDetails, req, { 'userCredentialId': req.body.userCredentialId },
        function(ResponseBody) {
            res.send(ResponseBody)
        })
})

router.post('/addUpdateAgentDetails', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PeopleManager.AddupdateAgentDetails, req, req.body,
        function(ResponseBody) {
            res.send(ResponseBody)
        })
})

router.post('/getGoogleLocations', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PeopleManager.GetGoogleLocations, req, { 'query': req.body.SearchString },
        function(Responsebody) {
            var responseObj = {}
            responseObj.ResponseCode = Responsebody.ResponseCode
            responseObj.TotalRecords = []
            if (responseObj.ResponseCode === 200) {
                for (var googleLocations = 0; googleLocations < Responsebody.Locations.length; googleLocations++) {
                    var locationDetails = Responsebody.Locations[googleLocations]
                    var userlistobj = new LocationDataObject(locationDetails)
                    responseObj.TotalRecords.push(userlistobj)
                }
            }
            res.send(responseObj)
        })
})

router.post('/houseAccountUpdate', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PeopleManager.HouseAccountUpdate, req, req.body,
        function(ResponseBody) {
            res.send(ResponseBody)
        })
})

router.post('/userMappingListing', function(req, res, next) {
    var datatopost = {
        'userCredentialId': req.body.userCredentialId,
        'listParams': {
            'pageSize': req.body.PageSize,
            'pageIndex': req.body.PageIndex,
            'sortBy': req.body.SortBy === undefined ? '' : req.body.SortBy,
            'sortType': req.body.SortType === undefined ? '' : req.body.SortType,
            'filterBy': req.body.FilterBy === '' ? '' : req.body.FilterBy
        }
    }
    callAPI.postToAPI(APIBaseURl + config.PeopleManager.UserMappingListing, req, datatopost,
        function(Responsebody) {
            var responseObj = {}
            responseObj.ResponseCode = Responsebody.ResponseCode
            responseObj.TotalRecords = []
            responseObj.TotalLength = Responsebody.RecordCount
            if (responseObj.ResponseCode === 200) {
                for (var userdetail = 0; userdetail < Responsebody.UsersList.length; userdetail++) {
                    var userdetails = Responsebody.UsersList[userdetail]
                    var userlistobj = new UserMappingListObject(userdetails)
                    responseObj.TotalRecords.push(userlistobj)
                }
            }
            res.send(responseObj)
        })
})

router.post('/addUpdateLinkedUserList', function(req, res, next) {

    var TotalRecords = []
    for (var userdetail = 0; userdetail < req.body.linkedUserList.length; userdetail++) {
        var userdetails = req.body.linkedUserList[userdetail]
        var userlistobj = new UserMappingDataListObject(userdetails)
        TotalRecords.push(userlistobj)
    }
    var datatopost = {
        'loggedInUserId': req.body.loggedInUserId,
        'linkedUserList': [TotalRecords][0]
    }
    callAPI.postToAPI(APIBaseURl + config.PeopleManager.LinkedUserListAddUpdate, req, datatopost,
        function(ResponseBody) {
            res.send(ResponseBody)
        })
})

router.post('/getHouseAccountDetails', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PeopleManager.GetHouseAccountDetails, req, req.body,
        function(ResponseBody) {
            res.send(ResponseBody)
        })
})

router.post('/addUpdateAgentSettingDetails', function(req, res, next) {
    var TotalRecords = []
    for (var userdetail = 0; userdetail < req.body.userDetails.Permissions.length; userdetail++) {
        var permissions = req.body.userDetails.Permissions[userdetail]
        var userlistobj = new SettingDataObject(permissions, 'update list')
        TotalRecords.push(userlistobj)
    }
    req.body.userDetails.Permissions = TotalRecords

    callAPI.postToAPI(APIBaseURl + config.PeopleManager.AddUpdateUserPermissions, req, req.body,
        function(ResponseBody) {
            res.send(ResponseBody)
        })
})

router.post('/getAgentSettingDetails', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PeopleManager.GetAgentSettingDetails, req, { 'UserCredentialId': req.body.userCredentialId },
        function(ResponseBody) {
            var responseObj = {}
            responseObj.ResponseCode = ResponseBody.ResponseCode
            responseObj.TotalRecords = []
            responseObj.TotalLength = ResponseBody.UsersList.length
            if (responseObj.ResponseCode === 200) {
                for (var userdetail = 0; userdetail < ResponseBody.UsersList.length; userdetail++) {
                    var userPermissions = ResponseBody.UsersList[userdetail]
                    var userPermissionObj = new SettingDataObject(userPermissions, 'Get list')
                    responseObj.TotalRecords.push(userPermissionObj)
                }
            }
            res.send(responseObj)
        })
})

router.post('/getUserCredentialId', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PeopleManager.GetUsercredentialIdOfUser, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
})

module.exports = router