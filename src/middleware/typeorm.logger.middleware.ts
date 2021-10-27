import { Logger, QueryRunner } from 'typeorm';
import { logger, QueryDBDebugFormatter } from '../logger';

export class TypeORMLogger implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    logger.log({
      level: 'debug',
      message: 'Database query',
      query,
      formatter: QueryDBDebugFormatter,
    });
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {}

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {}

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {}

  logMigration(message: string, queryRunner?: QueryRunner) {}

  log(
    level: 'log' | 'info' | 'warn',
    message: any,
    queryRunner?: QueryRunner
  ) {}
}
