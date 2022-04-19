var apiObject = require('../../utilities/common')
var appLogger = require('../../utilities/logger')


var callAPI = {

    postToAPI: function(url, req, data, callback) {
        var header = {}
        header.AuthToken = '';
        header.userName = '';
        header.origin = '*'
        if (req.session && req.session.User) {
            header.AuthToken = req.session.AuthToken;
            header.userName = req.session.User.UserName;
        }

        apiObject.requestToAPI(url, data, 'POST', header, function(Responsebody) {
            //Reset auth token in session as returned by API
            if (Responsebody.AuthToken) {
                req.session.AuthToken = Responsebody.AuthToken
            }
            callback(Responsebody.body)
        })

    },
    postToAPIWithoutRequest: function(url, header, data, callback) {
        apiObject.requestToAPI(url, data, 'POST', header, function(Responsebody) {
            callback(Responsebody.body)
        })
    }
}

module.exports = callAPI