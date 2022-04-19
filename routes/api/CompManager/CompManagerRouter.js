var express = require('express')
var router = express.Router()
var callAPI = require('../CallAPI')
var config = require('../../../config')
var commanData = require('../../../utilities/Commonfunction');
var fs = require('fs');

router.post('/getBatchList', function(req, res, next) {
    var postData = {
        'licenseeId': req.body.licenseeId,
        'createdOn': req.body.createdOn,
        'selectedMonths': req.body.monthFilter,
        'listParams': {
            'pageSize': req.body.PageSize,
            'pageIndex': req.body.PageIndex,
            'sortBy': req.body.SortBy === undefined ? '' : req.body.SortBy,
            'sortType': req.body.SortType === undefined ? '' : req.body.SortType,
            'filterBy': req.body.FilterBy === '' ? '' : req.body.FilterBy
        },
    };
    callAPI.postToAPI(APIBaseURl + config.CompManager.GetBatchList, req, postData, function(ResponseBody) {
        res.send(ResponseBody)
    });
})
router.post('/getStatementList', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.CompManager.GetStatementList, req, req.body, function(ResponseBody) {
        res.send(ResponseBody)
    });
})
router.post('/saveBatchNotes', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.CompManager.SaveBatchNote, req, req.body, function(ResponseBody) {
        res.send(ResponseBody)
    });
})
router.post('/getInsuredPayment', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.CompManager.GetInsuredPaymentData, req, req.body, function(ResponseBody) {
        var responseObj = {};
        responseObj.ResponseCode = ResponseBody.ResponseCode;
        responseObj.TotalRecords = responseObj.ResponseCode === 200 ? ResponseBody.InsuredPaymentsList : null;
        responseObj.TotalLength = responseObj.ResponseCode === 200 ? ResponseBody.InsuredPaymentsList.length : 0
        res.send(responseObj)
    });
})
router.post('/batchDelete', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.CompManager.BatchDelete, req, req.body, function(ResponseBody) {
        res.send(ResponseBody)
    });
})
router.post('/updateBatchFileName', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.CompManager.UpdateBatchFileName, req, req.body, function(ResponseBody) {
        res.send(ResponseBody)
    });
})

router.post('/getUploadBatchNumber', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.CompManager.AddUpdateBatch, req, req.body, function(ResponseBody) {
        res.send(ResponseBody)
    });
})

router.post('/deleteStatement', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.CompManager.DeleteStatement, req, req.body, function(ResponseBody) {
        res.send(ResponseBody)
    });
})

router.post('/getLinkedPolicyPayments', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.CompManager.GetLinkedPolicyPayments, req, req.body, function(ResponseBody) {
        var responseObj = {};
        responseObj.ResponseCode = ResponseBody.ResponseCode;
        responseObj.TotalRecords = responseObj.ResponseCode === 200 ? ResponseBody.PolicyDetail : null;
        responseObj.TotalLength = responseObj.ResponseCode === 200 ? ResponseBody.PolicyDetail.length : 0
        if (responseObj.TotalRecords && responseObj.TotalRecords.length > 0) {
            responseObj.TotalRecords = commanData.AddParamterForShowHide(responseObj.TotalRecords, false)
            responseObj.TotalRecords = commanData.AddExtraParamter(responseObj.TotalRecords, false)
        }
        responseObj.LinkPaymentList = ResponseBody.LinkPaymentsList
        if (responseObj.LinkPaymentList && responseObj.LinkPaymentList.length > 0) {
            responseObj.LinkPaymentList = commanData.AddExtraParamter(responseObj.LinkPaymentList, true)
        }
        res.send(responseObj)
    });
})
router.post('/getPendingPoliciesList', function(req, res, next) {
    var datatopost = {
        'licenseeId': req.body.licenseeId,
        'listParams': {
            'pageSize': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageSize : req.body.PageSize,
            'pageIndex': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageIndex : req.body.PageIndex,
            'sortBy': req.body.SortBy,
            'sortType': req.body.SortType,
            'filterBy': req.body.FilterBy === '' ? '' : req.body.FilterBy
        }
    }
    callAPI.postToAPI(APIBaseURl + config.CompManager.GetPendingPoliciesList, req, datatopost, function(ResponseBody) {
        var responseObj = {};
        responseObj.ResponseCode = ResponseBody.ResponseCode;
        responseObj.TotalRecords = responseObj.ResponseCode === 200 ? ResponseBody.LinkPaymentsList : null;
        if (responseObj.TotalRecords && responseObj.TotalRecords.length > 0) {
            responseObj.TotalRecords = commanData.AddParamterForShowHide(responseObj.TotalRecords, false)
            responseObj.TotalRecords = commanData.AddExtraParamter(responseObj.TotalRecords, false)
        }
        responseObj.TotalLength = responseObj.ResponseCode === 200 ? ResponseBody.RecordCount : 0
        res.send(responseObj)
    });
})

router.post('/getDataToExport', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.CompManager.GetDataToExport, req, req.body, function(ResponseBody) {
        res.send(ResponseBody)
    });
})
router.post('/getActivePoliciesList', function(req, res, next) {
    var datatopost = {
        'licenseeId': req.body.licenseeId,
        'PayorID': req.body.PayorID,
        'ClientID': req.body.ClientID,
        'listParams': {
            'pageSize': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageSize : req.body.PageSize,
            'pageIndex': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageIndex : req.body.PageIndex,
            'sortBy': req.body.SortBy,
            'sortType': req.body.SortType
        }
    }
    callAPI.postToAPI(APIBaseURl + config.CompManager.GetActivePolicyList, req, datatopost, function(ResponseBody) {
        var responseObj = {};
        responseObj.ResponseCode = ResponseBody.ResponseCode;
        responseObj.AllRecords = responseObj.ResponseCode === 200 ? ResponseBody.LinkPaymentsList : null;
        const list = [];
        const payor = req.body.payorID;
        // responseObj.TotalRecords = responseObj.ResponseCode === 200 ? ResponseBody.LinkPaymentsList : null;
        if (responseObj.AllRecords && responseObj.AllRecords.length > 0) {
            responseObj.AllRecords = commanData.AddParamterForShowHide(responseObj.AllRecords, false);

            //fill filtered data
            //     for(let i = 0; i < responseObj.AllRecords.length ; i++){
            //         if(responseObj.AllRecords[i].PayorId === payor) {
            //              list.push(responseObj.AllRecords[i]);
            //         }
            //   }
        }
        // if(responseObj.AllRecords){
        //     const payor = req.body.payorID;
        //     for(let i = 0; i < responseObj.AllRecords.length ; i++){
        //            if(responseObj.AllRecords[i].PayorId === payor) {
        //                 list.push(responseObj.AllRecords[i]);
        //            }
        //      }
        // }
        // if(list.length > 0){
        //  list = commanData.AddParamterForShowHide(list, false)
        // }
        responseObj.TotalRecords = responseObj.AllRecords;


        responseObj.TotalLength = responseObj.ResponseCode === 200 ? ResponseBody.RecordCount : 0
        res.send(responseObj)
    });
})
router.post('/activatePolicy', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.CompManager.ActivatePolicy, req, req.body, function(ResponseBody) {
        res.send(ResponseBody)
    });
})
router.post('/activatePolicy', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.CompManager.ActivatePolicy, req, req.body, function(ResponseBody) {
        res.send(ResponseBody)
    });
})
router.post('/getStatementList', function(req, res, next) {
    var ResponseCode = {
        'ResponseCode': 200,
        'Message': 'Authenticate successfully.'
    }
    res.send(ResponseCode)
})
router.post('/getConditionsForLink', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.CompManager.GetConditionsForLink, req, req.body, function(ResponseBody) {
        res.send(ResponseBody)
    });
})

router.post('/doLinkPolicy', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.CompManager.DoLinkPolicy, req, req.body, function(ResponseBody) {
        res.send(ResponseBody)
    });
})
router.post('/scheduleMatches', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.CompManager.ScheduleMatches, req, req.body, function(ResponseBody) {
        res.send(ResponseBody)
    });
})

router.post('/isMarkedPaid', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.CompManager.IsMarkedPaid, req, req.body, function(ResponseBody) {
        res.send(ResponseBody)
    });
})

router.post('/getAgencyVersion', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.CompManager.IsAgencyVersion, req, req.body, function(ResponseBody) {
        res.send(ResponseBody)
    });
})

router.post('/validatePaymentsForLinking', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.CompManager.ValidatePaymentsForLinking, req, req.body, function(ResponseBody) {
        res.send(ResponseBody)
    });
})

router.post('/updateStatementDate', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.CompManager.updateStatementDate, req, req.body, function(ResponseBody) {
        res.send(ResponseBody)
    });
})

module.exports = router;