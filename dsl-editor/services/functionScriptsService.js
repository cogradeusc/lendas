import { SqlExecutionService } from './sqlExecutionService.js';

export class FunctionScriptsService {
  static scripts = [
    'sql/data_type_postgres_generation.sql',
    'sql/data_type_schema_generation.sql',
    'sql/process_complex_data_types.sql',
    'sql/process_enumeration_data_types.sql',
    'sql/process_feature_types.sql',
    'sql/process_process_types.sql',
    'sql/process_spatial_sampling_feature_types.sql',
    'sql/process_specimen_feature_types.sql',
    'sql/process_specimen_sampling_method.sql',
    'sql/lendas_deploy.sql',
    'sql/lendas_undeploy.sql',
  ];

  static async executeAll(dbParams) {
    const results = [];
    for (const script of FunctionScriptsService.scripts) {
      const result = await SqlExecutionService.executeSqlFileOnDatabase(script, dbParams);
      results.push(result);
    }
    return results;
  }

  static allSuccess(results) {
    return results.every(r => r.success);
  }
}
