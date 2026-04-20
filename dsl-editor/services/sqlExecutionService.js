import { buildResponse } from '../utils/responseBuilder.js';
import { readSqlFile } from '../utils/fileUtils.js';

export class SqlExecutionService {
  constructor(dbConnectionService) {
    this.dbConnectionService = dbConnectionService;
  }

  async executeSql(sql) {
    const client = this.dbConnectionService.getClient();
    if (!client) {
      return buildResponse(false, 'No database connection available.', {});
    }
    try {
      const result = await client.query(sql);
      return buildResponse(true, 'SQL executed successfully.', { rowCount: result.rowCount, rows: result.rows });
    } catch (error) {
      return buildResponse(false, 'Error executing SQL.', { error: error.message });
    }
  }

  async executeSqlFile(filePath) {
    try {
      const sql = await readSqlFile(filePath);
      return await this.executeSql(sql);
    } catch (error) {
      return buildResponse(false, 'Error reading or executing SQL file.', { error: error.message });
    }
  }

  static async executeSqlFileOnDatabase(filePath, dbParams) {
    const { Client } = await import('pg');
    const { readSqlFile } = await import('../utils/fileUtils.js');
    const { buildResponse } = await import('../utils/responseBuilder.js');
    const client = new Client(dbParams);
    try {
      await client.connect();
      const sql = await readSqlFile(filePath);
      const result = await client.query(sql);
      await client.end();
      return buildResponse(true, 'SQL executed successfully on target database.', { rowCount: result.rowCount, rows: result.rows });
    } catch (error) {
      if (client) try { await client.end(); } catch {}
      return buildResponse(false, 'Error executing SQL file on target database.', { error: error.message });
    }
  }
}
