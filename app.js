var createError = require('http-errors')
var express = require('express')
var path = require('path')
redis = require('redis')
    //  ; var client = redis.createClient()
var session = require('express-session')
var redisStore = require('connect-redis')(session)
var cookieParser = require('cookie-parser')
var logger = require('morgan')
    // var codeCoverageTool = require('istanbul-middleware')
var jwt = require('jsonwebtoken')
var authRouter = require('./routes/API/Authentication/AuthenticationRouter') // Route for Authentication
var peopleManagerRouter = require('./routes/API/PeopleManager/PeopleManagerRouter') // Route for Authentication
var dashboardRouter = require('./routes/api/Dashboard/DashboardRouter') // Route for dahboard
    //var commonRouter = require('./routes/api/Common/CommonRouter') //common router
var clientRouter = require('./routes/api/Client/ClientRouter') //client router
var policyManagerRouter = require('./routes/api/PolicyManager/PolicyManagerRouter') //policy router
var commonDataRouter = require('./routes/api/CommonData/CommonDataRouter')
var settingRouter = require('./routes/api/Settings/SettingsRouter')
var ReportManager = require('./routes/api/ReportManager/ReportManagerRouter');
var CompManagerRouter = require('./routes/api/CompManager/CompManagerRouter');
var ConfigManagerRouter = require('./routes/api/ConfigManager/ConfigManagerRouter');
var PayorToolRouter = require('./routes/api/PayorTool/PayorToolRouter');
appLogger = require('./utilities/logger')
var config = require('config')
var bodyParser = require('body-parser')
var requestresponsetimeout = require('connect-timeout');
var fileupload = require("express-fileupload");
var cors = require('cors');
// codeCoverageTool.hookLoader(__dirname)
// Create redis client
redisClient = redis.createClient()
redisClient.set("a", "123456");

app = express()
app.use(bodyParser.json({ limit: '500mb' }))
app.use(bodyParser.urlencoded({
    limit:  '500mb',
    extended: true,
    parameterLimit: 50000
}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
    // Intialize redis session
app.use(session({
    secret: "eg[isfd-8yF9-7w2315df'{}+Ijslito8",
    store: new redisStore({
        host: 'localhost',
        port: 6379,
        client: redisClient
    }),

    cookie: {
        path: '/',
        secure: false
    },
    saveUninitialized: true, // don't create session until something stored,
    resave: false // don't save session if unmodified
}))
app.use(logger('dev'))
app.use(express.json({limit: '500mb', extended: true}))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Uncomment the line below in production environment.
app.use(express.static(path.join(__dirname, 'client/dist')))
app.use(fileupload());
//app.use(express.static(path.join(__dirname, 'public')))
// app.use('/coverage', `codeCoverageTool`.createHandler())

// This is the middleware responsible to check the validity of token
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});
var publicUrl = ['/api/authentication/login',
    '/api/authentication/forgot',
    '/api/authentication/reset',
    '/api/authentication/checkupdatepasswordexpiretime',
    '/api/authentication/getsecurityquestion',
    '/api/authentication/forgotusername',
    '/api/authentication/logindetails',
    '/api/authentication/registeremailid',
    '/api/authentication/logout', '/reset', '/login', '/dashboard', '/forgot', '/forgot-username'
]
var validateUser = function(req, res, next) {

    if (req._parsedUrl.pathname.indexOf('api') != -1 && publicUrl.indexOf(req._parsedUrl.pathname.toLowerCase()) != -1) {
        appLogger.debug(req._parsedUrl)
        next()
    } else {
        try {

            if (req.session && (!req.session.User && publicUrl.indexOf(req._parsedUrl.pathname.toLowerCase()) <= -1)) {
                return res.send(401, 'Not found ')
            } else {
                if (req.session.rememberMe === 'false') {
                    var miliseconds = 7500000;
                    req.session.cookie.expires = miliseconds;
                }
                next()
            }
        } catch (err) { // Error will happen when user is not valid user

            res.send(401, 'Invalid User')
        }
    }
}

APIBaseURl = config.get('API.BaseURL')
app.use(validateUser)

app.use(function(req, res, next) {
    req.setTimeout(9000 * 60 * 50);
    res.setTimeout(9000 * 60 * 50);
    next();
});
// Router Authentication Module.
app.use('/api/authentication/', authRouter)
app.use('/api/Peoplemanager/', peopleManagerRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/client', clientRouter)
app.use('/api/PolicyManager', policyManagerRouter)
app.use('/api/CommonData', commonDataRouter)
app.use('/api/Setting', settingRouter)
app.use('/api/ReportManager', ReportManager)
app.use('/api/CompManager', CompManagerRouter)
app.use('/api/ConfigManager', ConfigManagerRouter)
app.use('/api/PayorTool', PayorToolRouter)


app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'))
})
app.use(cors())
    // catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404))
})
app.use(requestresponsetimeout(4000 * 60 * 10));
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app