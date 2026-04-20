import express from 'express';
import { DbConnectionService } from '../services/dbConnectionService.js';
import { DbManagementService } from '../services/dbManagementService.js';
import { SqlExecutionService } from '../services/sqlExecutionService.js'; // Added import statement
import { FunctionScriptsService } from '../services/functionScriptsService.js';
import { CatalogScriptsService } from '../services/catalogScriptsService.js';
import { LendasDeployService } from '../services/lendasDeployService.js';
import multer from 'multer';

const router = express.Router();
const upload = multer();

const dbConnectionService = new DbConnectionService();

router.post('/connect', async (req, res) => {
  const params = req.body;
  const result = await dbConnectionService.connect(params);
  res.status(result.success ? 200 : 400).json(result);
});

router.post('/createdb', async (req, res) => {
  const { databaseName } = req.body;
  if (!databaseName) {
    return res.status(400).json({ success: false, message: 'Missing databaseName in request body.' });
  }
  const dbManagementService = new DbManagementService(dbConnectionService);
  const result = await dbManagementService.createDatabaseIfNotExists(databaseName);
  res.status(result.success ? 200 : 400).json(result);
});

router.post('/catalog', async (req, res) => {
  const { database, host, port, user, password } = req.body;
  if (!database || !host || !port || !user || !password) {
    return res.status(400).json({ success: false, message: 'Missing required database connection parameters.' });
  }
  const dbParams = { database, host, port, user, password };
  try {
    const results = await CatalogScriptsService.executeAll(dbParams);
    if (CatalogScriptsService.allSuccess(results)) {
      res.status(200).json({
        success: true,
        message: 'Catalog SQL script executed successfully on the database.',
        details: results[0]
      });
    } else {
      res.status(400).json({
        success: false,
        message: `Failed to execute Catalog SQL script on the database: ${results[0].message}`,
        error: results[0].error || results[0].details || null
      });
    }
  } catch (error) {
    console.error('Unexpected error executing catalog SQL:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unexpected error executing catalog SQL.',
      error: error.message
    });
  }
});

router.post('/functions', async (req, res) => {
  const { database, host, port, user, password } = req.body;
  if (!database || !host || !port || !user || !password) {
    return res.status(400).json({ success: false, message: 'Missing required database connection parameters.' });
  }
  const dbParams = { database, host, port, user, password };
  try {
    const results = await FunctionScriptsService.executeAll(dbParams);
    if (FunctionScriptsService.allSuccess(results)) {
      res.status(200).json({
        success: true,
        message: 'All functions SQL scripts executed successfully on the database.',
        details: results
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'One or more SQL scripts failed to execute.',
        details: results
      });
    }
  } catch (error) {
    console.error('Unexpected error executing functions SQL:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unexpected error executing functions SQL.',
      error: error.message
    });
  }
});

router.post('/deploy-dsl', async (req, res) => {
  const { database, host, port, user, password, dsl } = req.body;
  if (!database || !host || !port || !user || !password || !dsl) {
    return res.status(400).json({ success: false, message: 'Missing required parameters or DSL JSON.' });
  }
  const dbParams = { database, host, port, user, password };
  try {
    const result = await LendasDeployService.executeDeploy(dbParams, dsl);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error executing lendas_deploy:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error executing lendas_deploy.',
      error: error.message
    });
  }
});

router.post('/undeploy-dsl', async (req, res) => {
  const { database, host, port, user, password, dsl } = req.body;
  if (!database || !host || !port || !user || !password || !dsl) {
    return res.status(400).json({ success: false, message: 'Missing required parameters or DSL JSON.' });
  }
  const dbParams = { database, host, port, user, password };
  try {
    const result = await LendasDeployService.executeUndeploy(dbParams, dsl);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error executing lendas_undeploy:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error executing lendas_undeploy.',
      error: error.message
    });
  }
});

router.post('/validate', async (req, res) => {
  const json = req.body;
  if (!json || typeof json !== 'object') {
    return res.status(400).json({
      success: false,
      message: 'No JSON data provided.',
      details: ['No JSON data provided.']
    });
  }
  try {
    const { valid, errors } = await (await import('../services/JsonValidationService.js')).default.validate(json);
    if (valid) {
      res.status(200).json({
        success: true,
        message: 'JSON is valid against schema.'
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'Validation failed.',
        details: errors
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error validating JSON.',
      error: err.message
    });
  }
});

export default router;
