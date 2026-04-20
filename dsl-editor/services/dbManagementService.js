import { buildResponse } from '../utils/responseBuilder.js';

export class DbManagementService {
  constructor(dbConnectionService) {
    this.dbConnectionService = dbConnectionService;
  }

  async createDatabaseIfNotExists(databaseName) {
    const client = this.dbConnectionService.getClient();
    if (!client) {
      return buildResponse(false, 'No database connection available.', {});
    }
    try {
      const checkQuery = 'SELECT 1 FROM pg_database WHERE datname = $1';
      const checkResult = await client.query(checkQuery, [databaseName]);
      if (checkResult.rowCount > 0) {
        return buildResponse(true, 'Database already exists.', { exists: true });
      }
      const createQuery = `CREATE DATABASE "${databaseName}"`;
      await client.query(createQuery);
      return buildResponse(true, 'Database created successfully.', { created: true });
    } catch (error) {
      return buildResponse(false, 'Error creating database.', { error: error.message });
    }
  }
}
