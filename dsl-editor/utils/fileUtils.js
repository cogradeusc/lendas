import { promises as fs } from 'fs';

export async function readSqlFile(filePath) {
  try {
    const sql = await fs.readFile(filePath, 'utf-8');
    return sql;
  } catch (error) {
    throw new Error(`Failed to read SQL file: ${error.message}`);
  }
}
