var config = require('../../../config')
var apiObject = require('../../../utilities/common')
var appLogger = require('../../../utilities/logger')
var dashboardHelper = {
    displayDashboardData: function (req, callback) {
        var ResponseCode = {
            'ResponseCode': 200,
            'Message': 'Authenticate successfully.'
        }
        callback(ResponseCode)
    }
}
module.exports = dashboardHelper