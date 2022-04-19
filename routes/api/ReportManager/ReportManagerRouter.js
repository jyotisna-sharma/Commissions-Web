var express = require('express')
var router = express.Router()
var callAPI = require('../CallAPI')
var config = require('../../../config')
var bodyParser = require('body-parser')
var commanData = require('../../../utilities/Commonfunction');
router.post('/getReportBatchesDetail', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.ReportManager.GetBatchDetailsList, req, req.body, function(responseObject) {
        responseObject.TotalRecords = commanData.AddExtraParamter(responseObject.TotalRecords, true)
        responseObject.TotalLength = responseObject.TotalLength;
        res.send(responseObject)

    })
});

router.post('/getReportNameListing', function(req, res, next) {
    var postdata = {
        'reportGroupName': req.body.reportGroupName
    }
    callAPI.postToAPI(APIBaseURl + config.ReportManager.GetReportNames, req, postdata, function(responseObject) {
        var responseObj = {};
        responseObj.ResponseCode = responseObject.ResponseCode;
        responseObj.TotalRecords = responseObj.ResponseCode === 200 ? responseObject.ReportsList : null;
        if (responseObj.TotalRecords && responseObj.TotalRecords.length > 0) {
            responseObj.TotalRecords = commanData.AddExtraParamter(responseObj.TotalRecords, false)
        }
        responseObj.TotalLength = responseObj.ResponseCode === 200 ? responseObject.ReportsList.length : 0
        res.send(responseObj)

    })
});
router.post('/getPayeeList', function(req, res, next) {
    var postdata = {
        'licenseeId': req.body.licenseeId
    }
    callAPI.postToAPI(APIBaseURl + config.ReportManager.GetPayeeList, req, postdata, function(responseObject) {
        var responseObj = {};
        responseObj.ResponseCode = responseObject.ResponseCode;
        responseObj.TotalRecords = responseObj.ResponseCode === 200 ? responseObject.PayeeList : null;
        if (responseObj.TotalRecords && responseObj.TotalRecords.length > 0) {
            responseObj.TotalRecords = commanData.AddExtraParamter(responseObj.TotalRecords, true)
        }
        responseObj.TotalLength = responseObj.ResponseCode === 200 ? responseObject.PayeeList.length : 0
        res.send(responseObj)

    })
});

router.post('/getSegmentList', function(req, res, next) {
    
    callAPI.postToAPI(APIBaseURl + config.ReportManager.GetSegmentList, req, req.body, function(responseObject) {
        var responseObj = {};
        responseObj.ResponseCode = responseObject.ResponseCode;
        responseObj.TotalRecords = responseObj.ResponseCode === 200 ? responseObject.SegmentList : null;
        if (responseObj.TotalRecords && responseObj.TotalRecords.length > 0) {
            responseObj.TotalRecords = commanData.AddExtraParamter(responseObj.TotalRecords, true)
        }
        responseObj.TotalLength = responseObj.ResponseCode === 200 ? responseObject.SegmentList.length : 0
        res.send(responseObj);
    })
});

router.post('/printReport', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.ReportManager.PrintReport, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/savePayeeStatementReport', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.ReportManager.SavePayeeStatementReport, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/saveAuditStatementReport', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.ReportManager.SaveAuditReport, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/saveManagementReport', bodyParser.raw({ limit : '5000mb', type : '*/*' }),function(req, res, next) {
    // 
    callAPI.postToAPI(APIBaseURl + config.ReportManager.SaveManagementReport, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/setBatchMarkedPaid', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.ReportManager.SetBatchMarkPaid, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});

router.post('/getPayorsList', function(req, res, next) {
    // let licensee = req.body.LicenseeID;
    const postData = {
        'licenseeId': req.body.LicenseeID,
        'payerfillInfo': {
            'IsCarriersRequired': true,
            'IsCoveragesRequired': false,
            'IsWebsiteLoginsRequired': false,
            'IsContactsRequired': false,
            'PayorStatus': '3'
        }
    }
    callAPI.postToAPI(APIBaseURl + config.CommonData.GetPayorsList, req, postData,
        function(ResponseBody) {
            var responseObj = {};
            responseObj.ResponseCode = ResponseBody.ResponseCode;
            responseObj.TotalRecords = responseObj.ResponseCode === 200 ? ResponseBody.PayorList : null;
            if (responseObj.TotalRecords && responseObj.TotalRecords.length > 0) {
                responseObj.TotalRecords = commanData.AddExtraParamter(responseObj.TotalRecords, true)
            }
            responseObj.TotalLength = responseObj.ResponseCode === 200 ? ResponseBody.PayorList.length : 0
            res.send(responseObj)
        });
})
router.post('/getProductsList', function(req, res, next) {
    const postData = {
        'LicenseeId': req.body.licenseeId
    }
    callAPI.postToAPI(APIBaseURl + config.CommonData.GetProductsList, req, postData, function(ResponseBody) {
        var responseObj = {};
        responseObj.ResponseCode = ResponseBody.ResponseCode;
        responseObj.TotalRecords = responseObj.ResponseCode === 200 ? ResponseBody.DisplayCoverageList : null;
        if (responseObj.TotalRecords && responseObj.TotalRecords.length > 0) {
            responseObj.TotalRecords = commanData.AddExtraParamter(responseObj.TotalRecords, true)
        }
        responseObj.TotalLength = responseObj.ResponseCode === 200 ? ResponseBody.DisplayCoverageList.length : 0
        res.send(responseObj)
    })
})
router.post('/getCarrierList', function(req, res, next) {
    const postData = {
        'licenseeId': req.body.licenseeId
    }

    callAPI.postToAPI(APIBaseURl + config.ReportManager.GetCarrierList, req, postData, function(ResponseBody) {
        var responseObj = {};
        responseObj.ResponseCode = ResponseBody.ResponseCode;
        responseObj.TotalRecords = responseObj.ResponseCode === 200 ? ResponseBody.CarrierList : null;
        if (responseObj.TotalRecords && responseObj.TotalRecords.length > 0) {
            responseObj.TotalRecords = commanData.AddExtraParamter(responseObj.TotalRecords, true)
                // responseObj.TotalRecords=   responseObj.TotalRecords.sort()
        }
        responseObj.TotalLength = responseObj.ResponseCode === 200 ? ResponseBody.CarrierList.length : 0
        res.send(responseObj)
    })
})
module.exports = router