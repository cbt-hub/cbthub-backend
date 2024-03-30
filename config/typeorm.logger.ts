import { Logger as NestJsLogger } from '@nestjs/common';
import { Logger } from 'typeorm';

/**
 * @description 쿼리 로깅 시 줄바꿈 커스텀
 *
 * 1. query가 'SELECT 1'인지 판단
 * 2. 그렇지 않다면 쿼리 줄바꿈 및 SQL 예약어 색 추가
 */
export class TypeormLogger implements Logger {
  private readonly logger = new NestJsLogger(TypeormLogger.name, {
    timestamp: true,
  });
  private readonly GREEN = `\x1b[32m`;
  private readonly SKY_BLUE = `\x1b[36m`;
  private readonly RESET = `\x1b[0m`;

  logQuery(query: string, parameters?: any[]) {
    if (query.trim() === 'SELECT 1') {
      this.logger.log(`Query: ${query}`);
    } else {
      const formattedQuery = query
        .replace(/(\r\n|\n|\r)/gm, ' ')
        .replace(/ +(?= )/g, '')
        .replace(/`, /g, '`,\n        ') // 콤마 줄바꿈 및 들여쓰기 추가
        .replace(
          /\b(SELECT|FROM|WHERE|LIMIT|ORDER BY|LEFT JOIN|INSERT INTO|VALUES)\b/gi,
          `\n    ${this.GREEN}$1${this.RESET}\n       `,
        )
        .replace(
          /\b(ON)\b/gi,
          `\n               ${this.SKY_BLUE}$1${this.RESET}`,
        )
        .replace(/\b(AS|DESC|ASC)\b/gi, `${this.SKY_BLUE}$1${this.RESET}`)
        .trim();

      this.logger.log(`Query:\n    ${formattedQuery}`);
    }

    if (parameters && parameters.length) {
      this.logger.log(`Parameters: ${this.RESET}[${parameters.toString()}]`);
    }
  }

  // 이 이후 함수는 인터페이스를 단순 채워주기 위함
  logQueryError(error: string | Error, query: string, parameters?: any[]) {
    this.logger.error(`Query Error: ${error.toString()}`);
    this.logger.error(`Query: ${query}`);
    if (parameters && parameters.length) {
      this.logger.error(`Parameters: ${this.RESET}[${parameters.toString()}]`);
    }
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.logger.warn(`Slow Query: ${time}ms`);
    this.logger.warn(`Query: ${query}`);
    if (parameters && parameters.length) {
      this.logger.warn(`Parameters:`, parameters);
    }
  }

  logSchemaBuild(message: string) {
    this.logger.log(`Schema Build: ${message}`);
  }

  logMigration(message: string) {
    this.logger.log(`Migration: ${message}`);
  }

  log(level: 'log' | 'warn', message: any) {
    switch (level) {
      case 'log':
        this.logger.log(`Log: ${message}`);
        break;
      case 'warn':
        this.logger.warn(`Warn: ${message}`);
        break;
    }
  }
}
