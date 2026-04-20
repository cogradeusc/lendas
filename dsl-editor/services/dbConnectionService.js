import { Client } from 'pg';
import { buildResponse } from '../utils/responseBuilder.js';

export class DbConnectionService {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  async connect(params) {
    if (this.client) {
      await this.disconnect();
    }
    this.client = new Client(params);
    try {
      await this.client.connect();
      this.connected = true;
      return buildResponse(true, 'Database connection successful.', { connected: true });
    } catch (error) {
      this.connected = false;
      this.client = null;
      return buildResponse(false, 'Database connection failed.', { error: error.message });
    }
  }

  getClient() {
    return this.client;
  }

  async disconnect() {
    if (this.client && this.connected) {
      await this.client.end();
      this.connected = false;
      this.client = null;
      return buildResponse(true, 'Disconnected from the database.', {});
    }
    return buildResponse(false, 'Not connected to any database.', {});
  }
}
