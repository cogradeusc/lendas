import { SqlExecutionService } from './sqlExecutionService.js';

export class LendasDeployService {
  
  static async executeDeploy(dbParams, dsl) {
    const { Client } = await import('pg');
    const client = new Client(dbParams);
    try {
      await client.connect();
      const jsonStr = JSON.stringify(dsl);
      const sql = `SELECT public.lendas_deploy($1)`;
      const result = await client.query(sql, [jsonStr]);
      await client.end();
      return {
        success: true,
        message: 'lendas_deploy executed successfully.',
        details: result.rows
      };
    } catch (error) {
      if (client) try { await client.end(); } catch {}
      return {
        success: false,
        message: 'Error executing lendas_deploy.',
        error: error.message
      };
    }
  }

  static async executeUndeploy(dbParams, dsl) {
    const { Client } = await import('pg');
    const client = new Client(dbParams);
    try {
      await client.connect();
      const jsonStr = JSON.stringify(dsl);
      const sql = `SELECT public.lendas_undeploy($1)`;
      const result = await client.query(sql, [jsonStr]);
      await client.end();
      return {
        success: true,
        message: 'lendas_undeploy executed successfully.',
        details: result.rows
      };
    } catch (error) {
      if (client) try { await client.end(); } catch {}
      return {
        success: false,
        message: 'Error executing lendas_undeploy.',
        error: error.message
      };
    }
  }
}
