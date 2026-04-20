import Ajv from 'ajv';
import fs from 'fs';
import path from 'path';

class JsonValidationService {
  static getSchema() {
    const schemaPath = path.resolve(process.cwd(), 'spec', 'DSLjsonschema.json');
    const schemaRaw = fs.readFileSync(schemaPath, 'utf-8');
    return JSON.parse(schemaRaw);
  }

  static validate(jsonData) {
    const schema = this.getSchema();
    const ajv = new Ajv({ allErrors: true, strict: false });
    const validate = ajv.compile(schema);
    const valid = validate(jsonData);
    return {
      valid,
      errors: valid ? null : validate.errors
    };
  }
}

export default JsonValidationService;
