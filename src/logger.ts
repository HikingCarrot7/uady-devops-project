import winston from 'winston';

export interface Log {
  level: string;
  message: string;
  httpMethod: string;
  methodName: string;
  route: string;
  statusCode: number;
  errors: any;
  formatter: any;
}

const SEPARATOR = '|';

const BaseLog = (info: winston.Logform.TransformableInfo) => {
  return `[${info.timestamp}] [${info.level.toUpperCase()}] [${
    info.message
  }] ${SEPARATOR}`;
};

const BaseRequestLog = (info: winston.Logform.TransformableInfo) => {
  return `${BaseLog(info)} ${info.httpMethod} ${SEPARATOR} ROUTE: ${
    info.route
  } ${SEPARATOR}`;
};

export function RequestMethodInfoFormatter(
  this: winston.Logform.TransformableInfo
) {
  return `${BaseRequestLog(this)} QUERY_PARAMS: ${JSON.stringify(
    this.queryParams
  )} ${SEPARATOR} HEADERS: ${JSON.stringify(this.headers)}`;
}

export function RequestMethodDebugFormatter(
  this: winston.Logform.TransformableInfo
) {
  return `${BaseRequestLog(this)} PARAMS: ${JSON.stringify(
    this.reqParams
  )} ${SEPARATOR} BODY: ${JSON.stringify(this.reqBody)}`;
}

export function QueryDBDebugFormatter(this: winston.Logform.TransformableInfo) {
  return `${BaseLog(this)} QUERY: ${this.query}`;
}

export function ErrorFormatter(this: winston.Logform.TransformableInfo) {
  return `${BaseRequestLog(this)} STATUS_CODE: ${
    this.statusCode
  } ${SEPARATOR} ERROR: ${JSON.stringify(this.error)}`;
}

export function WarningFormatter(this: winston.Logform.TransformableInfo) {
  return `${BaseRequestLog(this)} WARNING_ERRORS: ${JSON.stringify(
    this.errors
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
