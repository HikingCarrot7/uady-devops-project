import winston from 'winston';

const BaseLog = (info: winston.Logform.TransformableInfo) => {
  return `[${info.timestamp}] [${info.level.toUpperCase()}] [${
    info.message
  }] |`;
};

const BaseRequestLog = (info: winston.Logform.TransformableInfo) => {
  return `${BaseLog(info)} ${info.httpMethod} | route: ${info.route} |`;
};

export function RequestMethodInfoFormatter(
  this: winston.Logform.TransformableInfo
) {
  return `${BaseRequestLog(this)} query_params: ${JSON.stringify(
    this.queryParams
  )} | headers: ${JSON.stringify(this.headers)}`;
}

export function RequestMethodDebugFormatter(
  this: winston.Logform.TransformableInfo
) {
  return `${BaseRequestLog(this)} body: ${JSON.stringify(this.reqBody)}`;
}

export function RequestMethodParamsDebugFormatter(
  this: winston.Logform.TransformableInfo
) {
  return `${BaseRequestLog(this)} | method_name: ${
    this.methodName
  } | params: ${JSON.stringify(this.reqParams)}`;
}

export function QueryDBDebugFormatter(this: winston.Logform.TransformableInfo) {
  return `${BaseLog(this)} query: ${this.query}`;
}

export function ErrorFormatter(this: winston.Logform.TransformableInfo) {
  return `${BaseRequestLog(this)} status_code: ${this.statusCode} | error: ${
    this.error
  }`;
}

export function ValidationErrorsFormatter(
  this: winston.Logform.TransformableInfo
) {
  return `${BaseRequestLog(this)} validation_errors: ${JSON.stringify(
    this.validationErrors
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
