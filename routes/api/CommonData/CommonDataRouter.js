var express = require("express");
var router = express.Router();
var callAPI = require("../CallAPI");
var config = require("../../../config");
var PayeeObject = require("../PeopleManager/DataObjects/PayeeObject");
var common = require("../../../utilities/common");
var commfunction = require("../../../utilities/Commonfunction");
var logger = require("../../../utilities/logger");
var request = require("request");

router.post("/getPayorsList", function (req, res, next) {
  // let licensee = req.body.LicenseeID;
  const postData = {
    licenseeId: req.body.LicenseeID,
    payerfillInfo: {
      IsCarriersRequired: true,
      IsCoveragesRequired: false,
      IsWebsiteLoginsRequired: false,
      IsContactsRequired: false,
      PayorStatus: "3",
    },
  };
  logger.debug("PayorProcessing statrts:" + JSON.stringify(req.body));
  callAPI.postToAPI(
    APIBaseURl + config.CommonData.GetPayorsList,
    req,
    postData,
    function (ResponseBody) {
      //  redisClient.set('payorList', ResponseBody);
      res.send(ResponseBody);
      logger.debug("PayorProcessing Ends:" + ResponseBody.PayorsCount);
    }
  );
  // }
  // redisClient.hgetall('payorList', function(err, result) {
  //  // console.log(JSON.stringify(result)); // {"key":"value","second key":"second value"}
  //   if(result){
  //     // get required licenseeID
  //     if(result[licensee]){
  //       let list = JSON.parse(result[licensee]);
  //       let resp = {'ResponseCode': 200,
  //       'exceptionMessage': '',
  //       'message': '',
  //       'PayorList': list}
  //       res.send(resp);
  //     }
  //     else{
  //       const postData = {
  //         'licenseeId': req.body.LicenseeID,
  //         'payerfillInfo':{
  //             'IsCarriersRequired':true,
  //             'IsCoveragesRequired': false,
  //             'IsWebsiteLoginsRequired':false,
  //             'IsContactsRequired':false,
  //             'PayorStatus' :'3'
  //             }
  //         }
  //     callAPI.postToAPI(APIBaseURl + config.CommonData.GetPayorsList, req, postData,
  //       function (ResponseBody) {
  //         redisClient.set('payorList',ResponseBody);
  //         res.send(ResponseBody)
  //       })
  //     }
  //   }
  //   else{
  //     const postData = {
  //       'licenseeId': req.body.LicenseeID,
  //       'payerfillInfo':{
  //           'IsCarriersRequired':true,
  //           'IsCoveragesRequired': false,
  //           'IsWebsiteLoginsRequired':false,
  //           'IsContactsRequired':false,
  //           'PayorStatus' :'3'
  //           }
  //       }
  //   callAPI.postToAPI(APIBaseURl + config.CommonData.GetPayorsList, req, postData,
  //     function (ResponseBody) {
  //       redisClient.set('payorList',ResponseBody);
  //       res.send(ResponseBody)
  //     })
  //   }
  // });

  // redisClient.get('payorList', function (error, result){
  //     if(error){

  //     }
  //     else{
  //       res.send(result)
  //     }
  //   })
});

router.post("/getProductTypes", function (req, res, next) {
  const postData = {
    PayorId: req.body.PayorId,
    CarrierId: req.body.CarrierId,
    CoverageId: req.body.CoverageId,
  };
  callAPI.postToAPI(
    APIBaseURl + config.CommonData.GetProductTypes,
    req,
    postData,
    function (ResponseBody) {
      res.send(ResponseBody);
    }
  );
});

router.post("/getCarrierList", function (req, res, next) {
  callAPI.postToAPI(
    APIBaseURl + config.CommonData.GetCarrierList,
    req,
    req.body,
    function (ResponseBody) {
      res.send(ResponseBody);
    }
  );
});
router.post("/getLicenseeList", function (req, res, next) {
  callAPI.postToAPI(
    APIBaseURl + config.CommonData.GetLicenseeList,
    req,
    req.body,
    function (ResponseBody) {
      res.send(ResponseBody);
    }
  );
});
router.post("/getProductsList", function (req, res, next) {
  const postData = {
    LicenseeId: req.body.LicenseeID,
  };

  callAPI.postToAPI(
    APIBaseURl + config.CommonData.GetProductsList,
    req,
    postData,
    function (ResponseBody) {
      res.send(ResponseBody);
    }
  );
});

router.post("/getGlobalPayorCarriers", function (req, res, next) {
  let licensee = req.body.LicenseeID;
  redisClient.hgetall("submittedThrough", function (err, result) {
    if (result) {
      if (result[licensee]) {
        let list = JSON.parse(result[licensee]);
        let resp = {
          ResponseCode: 200,
          exceptionMessage: "",
          message: "",
          IDList: list,
        };
        res.send(resp);
      } else {
        const postData = {
          licenseeID: req.body.LicenseeID,
          payorfillInfo: {
            IsCarriersRequired: false,
            IsCoveragesRequired: false,
            IsWebsiteLoginsRequired: false,
            IsContactsRequired: false,
            PayorStatus: "3",
          },
        };
        callAPI.postToAPI(
          APIBaseURl + config.CommonData.GetGlobalPayorCarriers,
          req,
          postData,
          function (ResponseBody) {
            res.send(ResponseBody);
          }
        );
      }
    } else {
      const postData = {
        licenseeId: req.body.LicenseeID,
        payorfillInfo: {
          IsCarriersRequired: false,
          IsCoveragesRequired: false,
          IsWebsiteLoginsRequired: false,
          IsContactsRequired: false,
          PayorStatus: "3",
        },
      };
      callAPI.postToAPI(
        APIBaseURl + config.CommonData.GetGlobalPayorCarriers,
        req,
        postData,
        function (ResponseBody) {
          res.send(ResponseBody);
        }
      );
    }
  });
});

router.post("/getTermReasonList", function (req, res, next) {
  callAPI.postToAPI(
    APIBaseURl + config.CommonData.GetTerminationReasonList,
    req,
    req.body,
    function (ResponseBody) {
      res.send(ResponseBody);
    }
  );
});
router.post("/getAccountExecByLicensee", function (req, res, next) {
  callAPI.postToAPI(
    APIBaseURl + config.CommonData.GetAccountExecList,
    req,
    req.body,
    function (ResponseBody) {
      res.send(ResponseBody);
    }
  );
});

router.post("/getPayTypes", function (req, res, next) {
  callAPI.postToAPI(
    APIBaseURl + config.CommonData.GetIncomingPayTypes,
    req,
    req.body,
    function (ResponseBody) {
      res.send(ResponseBody);
    }
  );
});
router.post("/fileUpload", function (req, res, next) {
  //
  var moveFile = req.files.uploadData;
  var fileName = req.files.fileName.name;
  var fileType = fileName.substring(fileName.lastIndexOf(".") + 1);
  if (fileType === "pdf" && !req.files.FileSavingLocation) {
    var path = config.UploadPDFFileURL;
  } else if (req.files.FileSavingLocation) {
debugger;
    var pathLocation = req.files.FileSavingLocation.name;
    var path = config[pathLocation];
  } else {
    var path = config.UploadExcelFileURL;
  }
  commfunction.FileUpload(moveFile, path, fileName, function (response) {
    res.send(response);
  });
});
router.post("/getPrimaryAgent", function (req, res, next) {
  var datatopost = {
    licenseeId: req.body.licenseeId,
    loggedInUser: req.body.loggedInUser,
    roleIdToView: req.body.roleIdToView,
    listParams: {
      sortBy: "NickName",
      sortType: "asc",
    },
  };
  callAPI.postToAPI(
    APIBaseURl + config.CommonData.GetPrimaryAgentList,
    req,
    datatopost,
    function (Responsebody) {
      //res.send(ResponseBody)
      var responseObj = {};
      responseObj.ResponseCode = Responsebody.ResponseCode;
      responseObj.TotalRecords = [];
      responseObj.TotalLength = Responsebody.SelectedUserRecordCount; // req.body.roleIdToView === '2' ? Responsebody.UserRecordCount: Responsebody.AgentRecordCount
      responseObj.AgentCount = Responsebody.AgentRecordCount;
      responseObj.UserCount = Responsebody.UserRecordCount;

      if (responseObj.ResponseCode === 200) {
        for (
          var userdetail = 0;
          userdetail < Responsebody.UsersList.length;
          userdetail++
        ) {
          var userdetails = Responsebody.UsersList[userdetail];
          var userlistobj = new PayeeObject(userdetails);
          responseObj.TotalRecords.push(userlistobj);
        }
        res.send(responseObj);
      }
    }
  );
});

router.post("/getPayorRegions", function (req, res, next) {
  callAPI.postToAPI(
    APIBaseURl + config.CommonData.GetPayorRegions,
    req,
    req.body,
    function (ResponseBody) {
      res.send(ResponseBody);
    }
  );
});

router.post("/CommRequestSendsToAPI", function (req, res, next) {
  const url = config[req.body.URL]["URL"];
  callAPI.postToAPI(APIBaseURl + url, req, req.body, function (responseObject) {
    //
    res.send(responseObject);
  });
});

router.post("/CommTableListRequestSends", function (req, res, next) {
  //
  var postdata = {};
  (postdata = req.body),
    (postdata["listParams"] = {
      pageSize: req.body.PageSize,
      pageIndex: req.body.PageIndex,
      sortBy: req.body.SortBy,
      sortType: req.body.SortType,
      filterBy: req.body.FilterBy,
    });
  const url = config[req.body.URL]["URL"];
  callAPI.postToAPI(APIBaseURl + url, req, postdata, function (responseObject) {
    //
    res.send(responseObject);
  });
});

module.exports = router;
