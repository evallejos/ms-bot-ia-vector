const winston = require('winston')
const { format, transports } = winston
const path = require('path')

const getLabel = function(callingModule) {
  const parts = callingModule.filename.split(path.sep);
  return path.join(parts[parts.length - 2], parts.pop());
};

const logFormat = format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)



module.exports = function(callingModule){
  return new winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: format.combine(
      format.label({ label: getLabel(callingModule) }),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
    ),
    transports: [
      new transports.Console({
        format: format.combine(
          format.colorize(),
          logFormat
        )
      }),
      new transports.File({
        filename: 'logs/mock.log',
        format: format.combine(
          format.json()
        )
      })
    ],
    exitOnError: false
  })
};