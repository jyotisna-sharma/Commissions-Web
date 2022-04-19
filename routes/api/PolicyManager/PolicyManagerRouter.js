var express = require('express')
var router = express.Router()
var callAPI = require('../CallAPI')
var config = require('../../../config')
var policyListObj = require('./DataObject/PolicyListObject')
    // var commonValidations = require('../../../utilities/commonValidations')
var commanData = require('../../../utilities/Commonfunction');
var logger = require('../../../utilities/logger');
router.post('/getPoliciesListing', function(req, res, next) {
    var datatopost = {
        'licenseeId': req.body.licenseeId,
        'clientId': req.body.clientId,
        'userID': req.body.userID,
        'role': req.body.role,
        'isHouseAccount': req.body.isHouse,
        'isAdmin': req.body.isAdmin,
        'listParams': {
            'pageSize': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageSize : req.body.PageSize,
            'pageIndex': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageIndex : req.body.PageIndex,
            'sortBy': req.body.SortBy,
            'sortType': req.body.SortType,
            'filterBy': req.body.FilterBy === '' ? '' : req.body.FilterBy,
            'statusId': req.body.statusId
        }
    }
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.PoliciesListing, req, datatopost, function(Responsebody) {
        var responseObj = {}
        responseObj.ResponseCode = Responsebody.ResponseCode
        responseObj.TotalRecords = []
        responseObj.PoliciesCount = Responsebody.PoliciesCount
        responseObj.TotalCount = (responseObj.PoliciesCount) ? responseObj.PoliciesCount.TotalPoliciesCount : 0
        responseObj.ActiveCount = (responseObj.PoliciesCount) ? responseObj.PoliciesCount.ActivePoliciesCount : 0
        responseObj.PendingCount = (responseObj.PoliciesCount) ? responseObj.PoliciesCount.PendingPoliciesCount : 0
        responseObj.TerminateCount = (responseObj.PoliciesCount) ? responseObj.PoliciesCount.TerminatePoliciesCount : 0
            //POpulate total length => if search param, then search result count, else  clients count
        responseObj.TotalLength = (responseObj.PoliciesCount.SelectedCount) ? responseObj.PoliciesCount.SelectedCount : 0
        if (Responsebody.ResponseCode === 200) {
            for (var policyDetail = 0; policyDetail < Responsebody.PolicyList.length; policyDetail++) {
                var policyDetails = Responsebody.PolicyList[policyDetail]
                var policyDetailobj = new policyListObj(policyDetails)
                responseObj.TotalRecords.push(policyDetailobj)
            }
        }
        res.send(responseObj);
    })
})

router.post('/getAdvanceSearchPolicies', function(req, res, next) {
    var datatopost = {
        'searchingData': req.body.searchingData,
        'listParams': {
            'pageSize': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageSize : req.body.PageSize,
            'pageIndex': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageIndex : req.body.PageIndex,
            'sortBy': req.body.SortBy,
            'sortType': req.body.SortType
        }
    }
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.GetAdvanceSearchedPolicies, req, datatopost, function(Responsebody) {
        var responseObj = {}
        responseObj.ResponseCode = Responsebody.ResponseCode
        responseObj.TotalRecords = [];
        responseObj.TotalLength = Responsebody.RecordCount;
        if (Responsebody.ResponseCode === 200 && Responsebody.PolicyList) {
            for (var policyDetail = 0; policyDetail < Responsebody.PolicyList.length; policyDetail++) {
                var policyDetails = Responsebody.PolicyList[policyDetail]
                var policyDetailobj = new policyListObj(policyDetails)
                responseObj.TotalRecords.push(policyDetailobj)
            }
        }
        res.send(responseObj);
    })
})

router.post('/getAllClientName', function(req, res, next) {
    logger.debug('getAllClientName:Processing begins ' + JSON.stringify(req.body));
    callAPI.postToAPI(APIBaseURl + config.ClientManager.GetClientName, req, req.body, function(responseObject) {
        logger.debug('getAllClientName:Processing success ' + responseObject);
        res.send(responseObject)
    })
})

router.post('/getSelectedClientName', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.ClientManager.GetClientDetails, req, req.body, function(responseObject) {
        res.send(responseObject);
    })
})

router.post('/getClientName', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.ClientManager.GetSingleClientName, req, req.body, function(responseObject) {
        res.send(responseObject);
    })
})

router.post('/getSearchedClientName', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.ClientManager.GetSearchedClients, req, req.body, function(responseObject) {
        res.send(responseObject);
    })
})

router.post('/GetSegmentsForPolicies', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.GetSegmentsForPolicies, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});

  router.post('/GetSegmentsOnCoverageId', function (req, res, next) {
    var postData = {
        'CoverageId': req.body.CoverageId,
        'PolicyId': req.body.PolicyId,
        'LicenseeId': req.body.LicenseeId
    }
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.GetSegmentsOnCoverageId, req, postData, function (ResponseBody) {
        res.send(ResponseBody);
    });
})

router.post('/CheckProductSegmentAssociation', function (req, res, next) {
    appLogger.debug('CheckProductSegmentAssociation: processing begins');
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.CheckProductSegmentAssociation, req, req.body, function (Responsebody) {
        res.send(Responsebody);
        console.log(Responsebody);

    });
})

router.post('/getPolicyDetails', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.PolicyDetails, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
})

router.post('/getPolicyType', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.PolicyType, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
})

router.post('/addUpdateDetails', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.AddUpdatePolicy, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
})
router.post('/deletePolicy', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.DeletePolicy, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
})
router.post('/getOutgoingSchedules', function(req, res, next) {
    var ResponseCode = {
        'ResponseCode': 200,
        'Message': 'Authenticate successfully.'
    }
    res.send(ResponseCode)
})
router.post('/getReplacedPolicyList', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.GetReplacedPolicyList, req, req.body, function(responseObject) {
        var responseObj = {};
        responseObj.ResponseCode = responseObject.ResponseCode
        if (responseObj.ResponseCode === 200) {
            responseObj.TotalRecords = responseObject.PolicyList;
            responseObj.TotalLength = responseObject.PolicyList !== null ? responseObject.PolicyList.length : 0
        } else {
            responseObj.TotalRecords = null;
            responseObj.TotalLength = responseObject.PolicyList !== null ? responseObject.PolicyList.length : 0
        }
        res.send(responseObj)
    })
})
router.post('/addUpdatePolicyNotes', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.AddUpdatePolicyNotes, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
})
router.post('/getpolicyNotesList', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.GetPolicyNotesList, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/deletepolicyNote', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.DeletePolicyNotes, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/getSmartFieldDetails', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.GetPolicySmartFields, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/updatePolicySmartFields', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.UpdatePolicySmartFields, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/getIncomingPaymentList', function(req, res, next) {
    var postData = {
        'policyId': req.body.policyId,
    }
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.GetIncomingPaymentList, req, postData, function(responseObject) {
        responseObject.TotalRecords = commanData.AddExtraParamter(responseObject.TotalRecords, false, true)
        res.send(responseObject)
    })
});
router.post('/getOutgoingPaymentList', function(req, res, next) {
    var postData = {
        'policyPaymentEntryId': req.body.policyPaymentEntryId,
        'listParams': {
            'sortBy': req.body.SortBy,
            'sortType': req.body.SortType
        }
    }
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.GetOutgoingPaymentList, req, postData, function(responseObject) {
        var responseObj = {};
        responseObj.ResponseCode = responseObject.ResponseCode;
        if (responseObj.ResponseCode === 200) {
            responseObj.TotalRecords = responseObject.OutgoingList;
            responseObj.TotalLength = responseObject.OutgoingList !== null ? responseObject.OutgoingList.length : 0
        } else {
            responseObj.TotalRecords = null;
            responseObj.TotalLength = responseObject.OutgoingList !== null ? responseObject.OutgoingList.length : 0
        }
        res.send(responseObj)
    })
});
router.post('/getFollowupIssueslist', function(req, res, next) {
    //console.log("req.body.PageSize="+req.body.PageSize);
    //console.log("req.body.PageIndex="+req.body.PageIndex);
    //console.log("req.body.SortBy="+req.body.SortBy);
    //console.log("req.body.SortType="+req.body.SortType);
    var postData = {
        'PolicyId': req.body.PolicyId,
        'listParams': {
             'pageSize': req.body.PageSize,
             'pageIndex': req.body.PageIndex,
             'sortBy': req.body.SortBy,
             'sortType': req.body.SortType,
             'statusId': req.body.StatusId
        }
    }
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.GetFollowupIssuesList, req, postData, function(responseObject) {
        var responseObj = {};
        responseObj.ResponseCode = responseObject.ResponseCode;
        if (responseObj.ResponseCode === 200) {
            responseObj.TotalRecords = responseObject.FollowupIssueList;
            //responseObj.TotalLength = responseObject.FollowupIssueList !== null ? responseObject.FollowupIssueList.length : 0
            responseObj.TotalLength = responseObject.TotalLength;
        } else {
            responseObj.TotalRecords = null;
            //responseObj.TotalLength = responseObject.FollowupIssueList !== null ? responseObject.FollowupIssueList.length : 0
            responseObj.TotalLength = responseObject.TotalLength;
        }
        res.send(responseObj)
    })
});

router.post('/addUpdateFollowUpIssues', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.AddUpdateFollowUpIssues, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/followUpIssueClosed', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.RemoveFollowUpIssue, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/updateLastRefresh', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.UpdateLastRefresh, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/getFollowupPolicyDetails', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.GetFolowupPolicyDetails, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/addUpdateIncomingPayment', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.AddUpdateIncomingPayment, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/removeIncomingPayment', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.RemoveIncomingPayment, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/unLinkIncomingPayment', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.UnLinkIncomingPayment, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/updateOutgoingPayment', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.UpdateOutgoingPayments, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/reversePaymentUserList', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.ReversePaymentUserList, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/reverseOutgoingPayment', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.ReverseOutgoingPayment, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/removeOutgoingPayment', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.RemoveOutgoingPayment, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/checkIncomingScheduleExist', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.Settings.CheckIncomingScheduleExist, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/batchStatusUpdate', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.UpdateBatchStatus, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/importPolicyDetails', function(req, res, next) {
    logger.debug('import policy file processing starts:' + JSON.stringify(req.body));
    callAPI.postToAPI(APIBaseURl + config.PolicyManager.ImportPolicyDetails, req, req.body, function(responseObject, err, err1) {
        logger.debug('import policy file processing completes:' + responseObject);
        res.send(responseObject)
    })
});
router.post('/getcachedList', function(req, res, next) {
    var ResponseCode = {
        'ResponseCode': 200,
        'Message': 'Authenticate successfully.'
    }
    res.send(ResponseCode)
})
router.post('/importPolicyFileUpload', function(req, res, next) {

    var moveFile = req.files.uploadData;
    var fileName = req.files.fileName.name;
    var fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
    var path = config.ImportPolicyFileUpload;
    commanData.FileUpload(moveFile, path, fileName, function(response) {
        res.send(response);
    })
})
module.exports = router