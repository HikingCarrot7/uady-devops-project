import winston from 'winston';

const BaseLog = (info: winston.Logform.TransformableInfo) => {
  return `[${info.timestamp}] [${info.level.toUpperCase()}] [${
    info.message
  }] |`;
};

const BaseRequestLog = (info: winston.Logform.TransformableInfo) => {
  return `${BaseLog(info)} ${info.httpMethod} | ROUTE: ${info.route} |`;
};

export function RequestMethodInfoFormatter(
  this: winston.Logform.TransformableInfo
) {
  return `${BaseRequestLog(this)} QUERY_PARAMS: ${JSON.stringify(
    this.queryParams
  )} | HEADERS: ${JSON.stringify(this.headers)}`;
}

export function RequestMethodDebugFormatter(
  this: winston.Logform.TransformableInfo
) {
  return `${BaseRequestLog(this)} BODY: ${JSON.stringify(this.reqBody)}`;
}

export function RequestMethodParamsDebugFormatter(
  this: winston.Logform.TransformableInfo
) {
  return `${BaseRequestLog(this)} | METHOD_NAME: ${
    this.methodName
  } | PARAMS: ${JSON.stringify(this.reqParams)}`;
}

export function QueryDBDebugFormatter(this: winston.Logform.TransformableInfo) {
  return `${BaseLog(this)} QUERY: ${this.query}`;
}

export function ErrorFormatter(this: winston.Logform.TransformableInfo) {
  return `${BaseRequestLog(this)} STATUS_CODE: ${
    this.statusCode
  } | ERROR: ${JSON.stringify(this.error)}`;
}

export function WarningFormatter(this: winston.Logform.TransformableInfo) {
  return `${BaseRequestLog(this)} WARNING_ERRORS: ${JSON.stringify(
    this.error
  )}`;
}

const logger = winston.createLogger({
  level: 'debug',
  transports: [
    new winston.transports.File({
      filename: 'logs/api.log',
      maxsize: 100_000_000, // 100 MB
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.printf((info) => {
      return info.formatter();
    })
  ),
});

export { logger };
