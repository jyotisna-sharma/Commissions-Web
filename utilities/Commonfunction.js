var commonFunction = {
    AddExtraParamter: function(listdata, checkedAll, isfirstrecordSelected = false) {
        const list = [];
        var isfirstrecord = true
        if (listdata && listdata.length > 0) {
            for (data of listdata) {
                data.Checked = checkedAll;
                if (isfirstrecordSelected) {
                    if (isfirstrecord) {
                        data.firstrow = true;
                        isfirstrecord = false;
                    } else {
                        data.firstrow = false;
                    }
                }
                list.push(data);
            }
        }
        return list;
    },
    DatesortFunction: function(firstDate, seconddate) {
        const dateA = new Date(firstDate.CreatedDateString);
        const dateB = new Date(seconddate.CreatedDateString);
        // const aDay = dateA.getDate();
        // const aMonth = dateA.getMonth() + 1;
        // const aYear = dateA.getFullYear();
        // const dateB = new Date(seconddate.CreatedDateString);
        // const bDay = dateB.getDate();
        // const bMonth = dateB.getMonth() + 1;
        // const bYear = dateB.getFullYear();
        // if(aYear > bYear) {

        // }
        return dateA.getTime() > dateB.getTime() ? -1 : 1;
    },
    NumbersortFunction: function(firstNumber, secondNumber) {
        return firstNumber.BatchNumber > secondNumber.BatchNumber ? -1 : 1;
    },
    AddParamterForShowHide: function(listdata, shown) {
        const list = [];
        if (listdata && listdata.length > 0) {
            for (data of listdata) {
                data.show = shown;
                list.push(data);
            }
        }
        return list;
    },
    FileUpload: function(moveFile, path, fileName, callback) {
        moveFile.mv(path + '/' + fileName, function(err) {
            if (err) {
                var ResponseCode = {
                    'ResponseCode': 200,
                    'Message': 'Authenticate failure.'
                }
            } else {
                var ResponseCode = {
                    'ResponseCode': 200,
                    'Message': 'Authenticate successfully.'
                }
            }
            callback(ResponseCode)
        })
    },
    // AddListingParameter: function (req) {
    //       const listParameters = {
    //     'listParams': {
    //       'pageSize': req.body.PageSize,
    //       'pageIndex': req.body.PageIndex,
    //       'sortBy': req.body.SortBy === undefined ? '' : req.body.SortBy,
    //       'sortType': req.body.SortType === undefined ? '' : req.body.SortType,
    //       'filterBy': req.body.filterBy=== undefined ? '': req.body.FilterBy
    //     }
    //   }
    //   return listParameters;
    // }
}
module.exports = commonFunction;