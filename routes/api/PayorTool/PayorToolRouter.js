var express = require('express')
var router = express.Router()
var callAPI = require('../CallAPI')
var config = require('../../../config')
var commfunction = require('../../../utilities/Commonfunction');


router.post('/getPayorTemplateList', function(req, res, next) {
    var postdata = {};
    postdata = req.body,
        postdata['listParams'] = {
            'pageSize': req.body.PageSize,
            'pageIndex': req.body.PageIndex,
            'sortBy': req.body.SortBy,
            'sortType': req.body.SortType,
            'filterBy': req.body.FilterBy
        }

    callAPI.postToAPI(APIBaseURl + config.PayorTool.GetPayorTemplateList, req, postdata, function(response) {
        res.send(response)

    })
});
router.post('/getFieldList', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PayorTool.GetFieldList, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/addField', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PayorTool.AddField, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/deleteField', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PayorTool.DeleteField, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/getTemplateData', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PayorTool.GetTemplateData, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/savePayorToolData', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PayorTool.SavePayorToolData, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/addTemplate', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PayorTool.AddTemplate, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});

router.post('/DeleteTemplate', function(req, res, next) {

    callAPI.postToAPI(APIBaseURl + config.PayorTool.DeleteTemplate, req, req.body, function(responseObject) {
        res.send(responseObject)
    })

});
router.post('/duplicateTemplate', function(req, res, next) {

    callAPI.postToAPI(APIBaseURl + config.PayorTool.DuplicateTemplate, req, req.body, function(responseObject) {
        res.send(responseObject)
    })

});
router.post('/GetMaskFieldList', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PayorTool.GetMaskFieldList, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/fileUpload', function(req, res, next) {
    var moveFile = req.files.uploadData;
    var fileName = req.files.fileName.name;
    var path = config.PayorToolImage;
    commfunction.FileUpload(moveFile, path, fileName, function(response) {
        res.send(response);
    })
})
router.post('/checkIfTemplateHasFields', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PayorTool.IfPayorTemplateHasValue, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/fetchTestFormulaResult', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PayorTool.FetchTestFormulaResult, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});
router.post('/DeleteImportPayorTemplate', function(req, res, next) {
    callAPI.postToAPI(APIBaseURl + config.PayorTool.DeleteImportToolTemplate, req, req.body, function(responseObject) {
        res.send(responseObject)
    })
});




module.exports = router