import { SqlExecutionService } from './sqlExecutionService.js';

export class CatalogScriptsService {
  static scripts = [
    'sql/catalog_ddl.sql',
  ];

  static async executeAll(dbParams) {
    const results = [];
    for (const script of CatalogScriptsService.scripts) {
      const result = await SqlExecutionService.executeSqlFileOnDatabase(script, dbParams);
      results.push(result);
    }
    return results;
  }

  static allSuccess(results) {
    return results.every(r => r.success);
  }
}
