var express = require('express')
var router = express.Router()
var callAPI = require('../CallAPI')
var config = require('../../../config')

router.post('/commissionScheduleListing', function(req, res, next) {
    var postData = {
        'licenseeId': req.body.LicenseeId,
        'listParams': {
            'pageSize': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageSize : req.body.PageSize,
            'pageIndex': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageIndex : req.body.PageIndex,
            'sortBy': req.body.SortBy,
            'sortType': req.body.SortType,
            'filterBy': req.body.FilterBy === '' ? '' : req.body.FilterBy,
        }
    }
    callAPI.postToAPI(APIBaseURl + config.Settings.CommissionScheduleList, req, postData, function(responseObject) {
        var responseObj = {};
        responseObj.ResponseCode = responseObject.ResponseCode
        if (responseObj.ResponseCode === 200) {
            responseObj.TotalRecords = responseObject.SettingList;
            responseObj.TotalLength = responseObject.SettingList !== null ? responseObject.listCount : 0
        } else {
            responseObject.TotalRecords = null;
            responseObj.TotalLength = responseObject.SettingList !== null ? responseObject.listCount : 0
        }
        res.send(responseObj)
    })
});
router.post('/namedScheduleList', function(req, res, next) {
    var postData = {
        'licenseeId': req.body.LicenseeId,
        'listParams': {
            'pageSize': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageSize : req.body.PageSize,
            'pageIndex': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageIndex : req.body.PageIndex,
            'sortBy': req.body.SortBy,
            'sortType': req.body.SortType,
            'filterBy': req.body.FilterBy === '' ? '' : req.body.FilterBy,
        }
    }
    callAPI.postToAPI(APIBaseURl + config.Settings.NamedScheduleList, req, postData, function(responseObject) {
        var responseObj = {};
        responseObj.ResponseCode = responseObject.ResponseCode
        responseObj.TotalRecords = responseObj.ResponseCode === 200 ? responseObject.SettingList : null;
        responseObj.TotalLength = responseObj.ResponseCode === 200 && responseObject.SettingList !== null ? responseObject.listCount : 0
        res.send(responseObj)
    })
});

router.post('/addUpdatecommissionSchedule', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.Settings.AddUpdateCommissionSchedule, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/addUpdateNamedSchedule', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.Settings.AddUpdateNamedSchedule, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});


router.post('/GetSegmentsList', function(req, res, next) {
    appLogger.debug('getSegmentsList: processing begins');
    var postData = {
      
        'listParams': {
            'pageSize': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageSize : req.body.PageSize,
            'pageIndex': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageIndex : req.body.PageIndex,
            'sortBy': req.body.SortBy,
            'sortType': req.body.SortType,
            'filterBy': req.body.FilterBy === '' ? '' : req.body.FilterBy,
        } , 
            'LicenseeId': req.body.LicenseeId
    }
    callAPI.postToAPI(APIBaseURl + config.Settings.GetSegmentsListing, req, postData, function (Responsebody) {

        var responseObj = {}
        responseObj.ResponseCode = Responsebody.ResponseCode
        responseObj.TotalRecords = Responsebody.SegmentList
        responseObj.TotalLength = Responsebody.SegmentsCount;
        appLogger.debug('getSegmentsList: processing Ends!!!!!')
        res.send(responseObj);
    });
});
router.post('/GetProductsSegmentsForUpdate', function (req, res, next) {
    appLogger.debug('getProductsSegmentsForUpdate: processing begins');

    var postData = {
        'segmentId':req.body.segmentId,
        'LicenseeId': req.body.LicenseeId
    }

    callAPI.postToAPI(APIBaseURl + config.Settings.GetProductsSegmentsForUpdate, req, postData, function (Responsebody) {
        var responseObj = {}
        responseObj.ResponseCode = Responsebody.ResponseCode

        if(responseObj.ResponseCode === 200) {
            responseObj.TotalRecords = Responsebody.ProductListWithoutSegment;
            responseObj.TotalLength = Responsebody.RecordCount;
        }
        appLogger.debug('getSegmentsList: processing Ends!!!!!')
        res.send(responseObj);
    });
})
router.post('/GetProductsSegmentsForUpdate', function (req, res, next) {
    appLogger.debug('getProductsSegmentsForUpdate: processing begins');

    var postData = {
        'LicenseeId': req.body.LicenseeId
    }

    callAPI.postToAPI(APIBaseURl + config.Settings.GetProductsSegmentsForUpdate, req, postData, function (Responsebody) {
        res.send(Responsebody);
    });
})
router.post('/GetProductsWithoutSegments', function (req, res, next) {
    var postData = {
        'LicenseeId': req.body.LicenseeId
    }
    callAPI.postToAPI(APIBaseURl + config.Settings.GetProductsWithoutSegments, req, postData, function (Responsebody) {
        var responseObj = {}
         responseObj.ResponseCode = Responsebody.ResponseCode;

         if (responseObj.ResponseCode === 200) 
         {
            responseObj.TotalRecords = (Responsebody).ProductListWithoutSegment;
            responseObj.TotalLength = (Responsebody).RecordCount;
        }
         else
         {
             responseObject.TotalRecords = null;
             responseObj.TotalLength = JSON.parse(Responsebody).ProductListWithoutSegment !== null ? JSON.parse(Responsebody).RecordCount : 0
         }
        res.send(responseObj);
    });
})

router.post('/saveDeleteSegment', function (req, res, next) {
  callAPI.postToAPI(APIBaseURl + config.Settings.SaveDeleteSegment, req, req.body, function (ResponseBody) {
      res.send(ResponseBody)
  });
})
router.post('/checkNamedScheduleExist', function(req, res, next) {
    var postData = {
        'segmentId':req.body.segmentId,
        'LicenseeId': req.body.LicenseeId
    }

    callAPI.postToAPI(APIBaseURl + config.Settings.CheckedNamedScheduleExist, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});

router.post('/checkNamedScheduleExist', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.Settings.CheckedNamedScheduleExist, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/checkScheduleList', function(req, res, next) {

    callAPI.postToAPI(APIBaseURl + config.Settings.NamedScheduleList, req, req.body, function(responseObject) {
        var responseObj = {};
        responseObj.ResponseCode = responseObject.ResponseCode
        responseObj.TotalRecords = responseObj.ResponseCode === 200 ? responseObject.SettingList : null;
        responseObj.TotalLength = responseObj.ResponseCode === 200 && responseObject.SettingList !== null ? responseObject.listCount : 0
        res.send(responseObj)
    })
});

router.post('/isNamedScheduleExist', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.Settings.IsNamedScheduleExist, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});

router.post('/deleteCommScheduleSetting', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.Settings.DeleteCommScheduleSttng, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/gettingCommScheduleSettings', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.Settings.GettingCommScheduleSttngDetails, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/updateReportSettings', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.Settings.UpdateReportSettings, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/isScheduleExist', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.Settings.IsScheduleExist, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});

router.post('/reportSettingListing', function(req, res, next) {
    var postData = {
        'licenseeId': req.body.licenseeId,
        'reportId': req.body.reportId
    }
    callAPI.postToAPI(APIBaseURl + config.Settings.ReportSettingListing, req, postData, function(responseObject) {
        var responseObj = {};
        responseObj.ResponseCode = responseObject.ResponseCode
        if (responseObj.ResponseCode === 200) {
            responseObj.TotalRecords = responseObject.ReportSettingList;
            responseObj.TotalLength = responseObject.RecordCount
        } else {
            responseObject.TotalRecords = null;
            responseObj.TotalLength = responseObject.ReportSettingList !== null ? responseObject.RecordCount : 0
        }
        res.send(responseObj)
    })
});
router.post('/getScheduleList', function(req, res, next) {
    var ResponseCode = {
        'ResponseCode': 200,
        'Message': 'Authenticate successfully.'
    }
    res.send(ResponseCode)
})
module.exports = router