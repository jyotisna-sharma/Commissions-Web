const path = require('path');
const fs = require('fs');

//Create the logs folder if it does not exists.
if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
}

const {
    createLogger,
    format,
    transports,
    Transport
} = require('winston');
const {
    combine,
    timestamp,
    printf
} = format;

//Format of the log message.
const myFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

//Custom logger.
const fileLogger = function (options) {
    return (createLogger)({
        transports: [
            new(transports.File)(options),
        ]
    });
};

//Custom transport has been created to manage the debug and error messages in seperate files.
class CustomTransport extends Transport {
    constructor(options) {
        super(options);
        this.options = options;
        this.levels = options && options.levels || [this.level];
    }

    log(level, msg, meta, callback) {
        if (this.levels.indexOf(level) > -1) {
            fileLogger(this.options)[level](msg, meta);
        }
        callback(null, true);
    }
}

//adding custom transport class as a property within winston.transports.
transports.CustomTransport = CustomTransport;

//create logger which we need to use at application level.
const appLogger = createLogger({
    exitOnError: false,
    transports: [
        new transports.CustomTransport({
            filename: path.join("./logs", "error.log"),
            level: 'error',
            format: combine(
                timestamp(),
                myFormat
            )
        }),
        new transports.CustomTransport({
            filename: path.join("./logs", "debug.log"),
            level: 'debug',
            format: combine(
                timestamp(),
                myFormat
            )
        })
    ]
});

//export the logger to use in application.
module.exports = appLogger;