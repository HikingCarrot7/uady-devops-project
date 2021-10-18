import { Logger, QueryRunner } from 'typeorm';
import { logger, QueryDBDebugFormatter } from '../logger';

export class TypeORMLogger implements Logger {
  buildingDB = true;

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    if (!this.buildingDB) {
      logger.log({
        level: 'debug',
        message: 'Database query',
        query,
        formatter: QueryDBDebugFormatter,
      });
    }

    // Workaround cutre para evitar las 900 líneas de log que se generan al construir la db.
    if (query.includes('START TRANSACTION')) {
      this.buildingDB = true;
    }

    if (query.includes('COMMIT')) {
      this.buildingDB = false;
    }
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
