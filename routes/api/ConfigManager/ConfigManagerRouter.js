var express = require('express')
var router = express.Router()
var callAPI = require('../CallAPI')
var config = require('../../../config')
var appLogger = require('../../../utilities/logger')
router.post('/getPayorsList', function (req, res, next) {
    appLogger.debug('getPayorsList: processing begins');
    var postData = {
      
        'listParams': {
            'pageSize': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageSize : req.body.PageSize,
            'pageIndex': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageIndex : req.body.PageIndex,
            'sortBy': req.body.SortBy,
            'sortType': req.body.SortType,
            'filterBy': req.body.FilterBy === '' ? '' : req.body.FilterBy,
        }
    }
    callAPI.postToAPI(APIBaseURl + config.ConfigManager.GetPayorsList, req, postData, function (Responsebody) {

        var responseObj = {}
        responseObj.ResponseCode = Responsebody.ResponseCode
        responseObj.TotalRecords = Responsebody.PayorList
        responseObj.TotalLength = Responsebody.PayorsCount;
        appLogger.debug('getPayorsList: processing Ends!!!!!')
        res.send(responseObj);
    });
})
router.post('/getCarrierList', function (req, res, next) {
    var postData = {
        'payorId': req.body.payorId,
        'listParams': {
            'pageSize': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageSize : req.body.PageSize,
            'pageIndex': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageIndex : req.body.PageIndex,
            'sortBy': req.body.SortBy,
            'sortType': req.body.SortType,
            'filterBy': req.body.FilterBy === '' ? '' : req.body.FilterBy,
        }
    }

    callAPI.postToAPI(APIBaseURl + config.ConfigManager.GetCarrierList, req, postData, function (Responsebody) {
        var responseObj = {}
        responseObj.ResponseCode = Responsebody.ResponseCode;
        responseObj.TotalRecords = Responsebody.CarrierList;
        responseObj.TotalLength = Responsebody.CarrierList !== null ? Responsebody.TotalCount : 0

        res.send(responseObj)
    });
})
router.post('/addUpdateCarrier', function (req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.ConfigManager.AddUpdateCarrier, req, req.body, function (Responsebody) {
        res.send(Responsebody)
    });
})
router.post('/deleteCarrier', function (req, res, next) {

    callAPI.postToAPI(APIBaseURl + config.ConfigManager.DeleteCarrier, req, req.body, function (Responsebody) {
        res.send(Responsebody)
    });
})

router.post('/getPayorContacts', function (req, res, next) {
    var postData = {
        'PayorId': req.body.PayorId,
        'listParams': {
            'pageSize': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageSize : req.body.PageSize,
            'pageIndex': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageIndex : req.body.PageIndex,
            'sortBy': req.body.SortBy,
            'sortType': req.body.SortType,
            'filterBy': req.body.FilterBy === '' ? '' : req.body.FilterBy,
        }
    }

    callAPI.postToAPI(APIBaseURl + config.ConfigManager.GetPayorContacts, req, postData, function (Responsebody) {
        //if (Responsebody.ResponseCode === 200) {
        var responseObj = {}
        responseObj.ResponseCode = Responsebody.ResponseCode;
        responseObj.TotalRecords = Responsebody.ContactList;
        responseObj.TotalLength = Responsebody.ContactList != null ? Responsebody.ContactsCount : 0;
        //  }
        res.send(responseObj);
    });
})

router.post('/saveDeletePayor', function (req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.ConfigManager.SaveDeletePayor, req, req.body, function (ResponseBody) {
        res.send(ResponseBody)
    });
})

router.post('/deletePayorContact', function (req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.ConfigManager.DeletePayorContact, req, req.body, function (ResponseBody) {
        res.send(ResponseBody)
    });
})
router.post('/addUpdatePayorContact', function (req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.ConfigManager.AddUpdatePayorContact, req, req.body, function (ResponseBody) {
        res.send(ResponseBody)
    });
})
router.post('/getPayorContactDetails', function (req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.ConfigManager.GetConatctPayorDetails, req, req.body, function (ResponseBody) {
        res.send(ResponseBody)
    });
})
router.post('/addUpdateCoverageDetails', function (req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.ConfigManager.AddUpdateCoverage, req, req.body, function (ResponseBody) {
        res.send(ResponseBody)
    });
})
router.post('/addUpdateCoverageTypeDetails', function (req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.ConfigManager.AddUpdateCoverageType, req, req.body, function (ResponseBody) {
        res.send(ResponseBody)
    });
})
router.post('/deleteCoverages', function (req, res, next) {
    
    callAPI.postToAPI(APIBaseURl + config.ConfigManager.DeleteCoverages, req, req.body, function (ResponseBody) {
        res.send(ResponseBody)
    });
})

router.post('/addUpdateCompTypedetails', function (req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.ConfigManager.AddUpdateCompTypeDetails, req, req.body, function (ResponseBody) {
        res.send(ResponseBody)
    });
})
router.post('/deleteCompType', function (req, res, next) {

    callAPI.postToAPI(APIBaseURl + config.ConfigManager.DeleteComptype, req, req.body, function (ResponseBody) {
        res.send(ResponseBody)
    });
})
router.post('/deleteProductType', function (req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.ConfigManager.DeleteProductType, req, req.body, function (ResponseBody) {
        res.send(ResponseBody)
    });
})
router.post('/updateFollowUpSetting', function (req, res, next) {
        callAPI.postToAPI(APIBaseURl + config.ConfigManager.UpdateFollowUpSettingService, req, req.body, function (ResponseBody) {
            res.send(ResponseBody)
        });
    })
    router.post('/getFollowUpSettingDetails', function (req, res, next) {
        callAPI.postToAPI(APIBaseURl + config.ConfigManager.GetFollowUpSettingService, req, req.body, function (ResponseBody) {
            res.send(ResponseBody)
        });
    })
router.post('/getProductList', function (req, res, next) {

    var postData = {
        'payorId': req.body.payorId,
        'carrierId': req.body.carrierId,
        'coverageId': req.body.coverageId,
        'listParams': {
            'pageSize': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageSize : req.body.PageSize,
            'pageIndex': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageIndex : req.body.PageIndex,
            'sortBy': req.body.SortBy,
            'sortType': req.body.SortType,
            'filterBy': req.body.FilterBy === '' ? '' : req.body.FilterBy,
        }
    }

    callAPI.postToAPI(APIBaseURl + config.ConfigManager.GetCoverageNickNameList, req, postData, function (Responsebody) {
        //if (Responsebody.ResponseCode === 200) {
        var responseObj = {}
        responseObj.ResponseCode = Responsebody.ResponseCode;
        responseObj.TotalRecords = Responsebody.CoverageNickNameList;
        responseObj.TotalLength = Responsebody.CoverageNickNameList != null ? Responsebody.recordCount : 0;

        res.send(responseObj);
    });
})
router.post('/getCoverageTypeListing', function (req, res, next) {

    var postData = {
        'incomingPaymentTypeId': req.body.incomingPaymentTypeId,
        'paymentTypeName': req.body.paymentTypeName,
        'listParams': {
            'pageSize': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageSize : req.body.PageSize,
            'pageIndex': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageIndex : req.body.PageIndex,
            'sortBy': req.body.SortBy,
            'sortType': req.body.SortType,
            'filterBy': req.body.FilterBy === '' ? '' : req.body.FilterBy,
        }
    }
    callAPI.postToAPI(APIBaseURl + config.ConfigManager.GetCompTypeListing, req, postData, function (Responsebody) {
        //if (Responsebody.ResponseCode === 200) {
        var responseObj = {}
        responseObj.ResponseCode = Responsebody.ResponseCode;
        responseObj.TotalRecords = Responsebody.CompTypeList;
        responseObj.TotalLength = Responsebody.CompTypeList != null ? Responsebody.recordCount : 0;

        res.send(responseObj);
    });
})
router.post('/getProdctListing', function (req, res, next) {
    var postData = {
        'licenseeId': req.body.licenseeId,
        'listParams': {
            'pageSize': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageSize : req.body.PageSize,
            'pageIndex': (req.body.redirectToPageSize && req.body.redirectToPageIndex) ? req.body.redirectToPageIndex : req.body.PageIndex,
            'sortBy': req.body.SortBy,
            'sortType': req.body.SortType,
            'filterBy': req.body.FilterBy === '' ? '' : req.body.FilterBy,
        }
    }
    callAPI.postToAPI(APIBaseURl + config.ConfigManager.GetProductListingService, req, postData, function (Responsebody) {
        //if (Responsebody.ResponseCode === 200) {
        var responseObj = {}
        responseObj.ResponseCode = Responsebody.ResponseCode;
        responseObj.TotalRecords = Responsebody.CoverageList;
        responseObj.TotalLength = Responsebody.CoverageList != null ? Responsebody.recordCount : 0;

        res.send(responseObj);
    });
})







module.exports = router;