var express = require('express')
var router = express.Router()
var callAPI = require('../CallAPI')
var config = require('../../../config')
router.post('/displayDashboardData', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PeopleManager.GetHouseAccountDetails, req, req.body,
        function(ResponseBody) {
            var ResponseCode = {
                'ResponseCode': 200,
                'Message': 'Authenticate successfully.'
            }
            res.send(ResponseCode)
        })
})
router.post('/GetAgentsClientCount', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.DashBoard.GetAgentClientCount, req, req.body,
        function(ResponseBody) {
            res.send(ResponseBody)
        })
})
router.post('/GetRevenueData', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.DashBoard.GetRevenueData, req, req.body,
        function(ResponseBody) {
            res.send(ResponseBody)
        })
})
router.post('/GetTop20AgentList', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.DashBoard.GetTop20AgentList, req, req.body,
        function(ResponseBody) {
            res.send(ResponseBody)
        })
})
router.post('/GetNewPolicyList', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.DashBoard.GetNewPolicyList, req, req.body,
        function(ResponseBody) {
            res.send(ResponseBody)
        })
})

router.post('/GetRevenueByLoc', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.DashBoard.GetRevenueByLOC, req, req.body,
        function(ResponseBody) {
            res.send(ResponseBody)
        })
})
router.post('/GetRenewalsList', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.DashBoard.GetRenewalsList, req, req.body,
        function(ResponseBody) {
            res.send(ResponseBody)
        })
})
router.post('/GetReceivableList', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.DashBoard.GetReceivableList, req, req.body,
        function(ResponseBody) {
            res.send(ResponseBody)
        })
})
router.post('/GetClientsList', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.DashBoard.GetClientsList, req, req.body,
        function(ResponseBody) {
            res.send(ResponseBody)
        })
})
router.post('/GetReportDetails', function(req, res, next) {
    console.log('fkdgm');
        callAPI.postToAPI(APIBaseURl + config.DashBoard.GetReportDetails, req, req.body,
            function(ResponseBody) {
                res.send(ResponseBody)
            })
})
module.exports = router