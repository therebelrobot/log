const ldna = require('logdna')
const winston = require('winston')
const ecs = require('ecs-logs-js')

module.exports = function log({ name = 'log', level = 'info', env = 'production', logdna }) {
  let logger
  if (env !== 'development') {
    logger = new winston.Logger({
      level,
      levels: winston.config.syslog.levels,
      transports: [
        new ecs.Transport({ level, name })
      ]
    })
    if (logdna) {
      logdna = Object.assign({}, {
        index_meta: true, // Defaults to false, when true ensures meta object will be searchable
        handleExceptions: true // Only add this line in order to track exceptions
      }, logdna)
      logger.add(winston.transports.Logdna, logdna)
    }
    return logger
  }
  logger = new winston.Logger({
    level,
    levels: winston.config.syslog.levels
  })
  const toYAML = require('winston-console-formatter')
  logger.add(winston.transports.Console, toYAML.config())
  return logger
}
