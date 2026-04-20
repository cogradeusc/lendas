DROP FUNCTION IF EXISTS  process_complex_data_types(complex_data_types JSON, schema_name text) CASCADE;

CREATE OR REPLACE FUNCTION process_complex_data_types(complex_data_types JSON, schema_name text)
RETURNS void
AS 
$$
DECLARE 
  complex_data_type record;
  complex_data_type_version record;
  undefined_vocabularies text[];
  complex_data_type_names JSON;
  complex_data_type_version_fields json;
  complex_data_type_json_schema json;
  undefined_data_types text[];
BEGIN
	--process complex_data_types
 FOR complex_data_type IN 
   SELECT lower(c->>'name') AS name,
          c->>'description' AS description,
          c->'names' AS names,
          c->'versions' AS versions
   FROM json_array_elements(complex_data_types) compdt(c)
 LOOP 
     
     --check that all vocabularies of names exist
    SELECT array_agg(coalesce((lendas_process_qualified_name(lower(n->>'vocabulary'))).schema_name,schema_name)||'.'||
                              (lendas_process_qualified_name(lower(n->>'vocabulary'))).unqualified_name)
    INTO undefined_vocabularies
    FROM json_array_elements(complex_data_type.names) AS names(n)
    WHERE NOT EXISTS (SELECT *
                      FROM lendas_catalog.vocabularies voc
                      WHERE voc.schema = coalesce((lendas_process_qualified_name(lower(n->>'vocabulary'))).schema_name,schema_name)
                        AND voc.name = (lendas_process_qualified_name(lower(n->>'vocabulary'))).unqualified_name);
     
     IF array_length(undefined_vocabularies,1)>0 THEN
        RAISE EXCEPTION 'The following vocabularies have not been defined: %',undefined_vocabularies;
     END IF;
     
    -- obtain the list of names with processed vocabularies
     SELECT json_agg(json_build_object('term', n->'term',
                                       'vocabulary',json_build_object('schema',coalesce((lendas_process_qualified_name(lower(n->>'vocabulary'))).schema_name,schema_name),
                                                                      'name', (lendas_process_qualified_name(lower(n->>'vocabulary'))).unqualified_name)
                                ) 
                     )
      INTO complex_data_type_names
      FROM json_array_elements(complex_data_type.names) AS names(n);
 
 
    -- insert the tuple for the complex data type
    INSERT INTO lendas_catalog.complex_data_types 
    VALUES (schema_name,
           complex_data_type.name, 
           complex_data_type.description,
           complex_data_type_names);
          
    --process the versions
    FOR complex_data_type_version IN
      SELECT lower(c->>'version') AS VERSION,
             c->'fields' AS fields
      FROM json_array_elements(complex_data_type.versions) AS complexdt(c)
    LOOP
      
      -- check if the data types of the fields are already defined
      SELECT array_agg(coalesce((lendas_process_qualified_name(lower(f->>'data_type'))).schema_name,schema_name)||'.'||
                               (lendas_process_qualified_name(lower(f->>'data_type'))).unqualified_name)
      INTO undefined_data_types
      FROM json_array_elements(complex_data_type_version.fields) AS fields(f)
      WHERE lower(f->>'data_type') NOT IN ('integer', 'real', 'text', 'bytea', 'date', 'timestamp', 'time', 'interval', 'boolean', 
                                           'intrange', 'intmultirange', 'numrange', 'nummultirange', 'tsrange', 'tsmultirange', 'daterange',
                                           'datemultirange', 'json')
       AND lower(f->>'data_type') NOT LIKE 'geometry%'
       AND lower(f->>'data_type') NOT LIKE 'measure%'
       AND lower(f->>'data_type') NOT LIKE 'category%'
       AND (coalesce((lendas_process_qualified_name(lower(f->>'data_type'))).schema_name,schema_name),
            (lendas_process_qualified_name(lower(f->>'data_type'))).unqualified_name
           ) NOT IN (SELECT SCHEMA,name 
                     FROM lendas_catalog.enumeration_data_types
                     UNION 
                     SELECT SCHEMA, name
                     FROM lendas_catalog.complex_data_types
                     );
       
       IF array_length(undefined_data_types,1)>0 THEN
        RAISE EXCEPTION 'The following data types have not been defined: %',undefined_data_types;
       END IF;
       
      -- generate the json schema for the type
      SELECT json_build_object('type', 'object', 'properties', 
                               ('{'||string_agg(format('"%s":%s',
                                           lower(f->>'name'),
                                           CASE
                                             WHEN (NOT (f->>'repeated')::boolean) AND (lower(f->>'data_type') IN 
                                                      ('integer', 'real', 'text', 'bytea', 'date', 'timestamp', 'time', 'interval', 'boolean', 
                                                        'intrange', 'intmultirange', 'numrange', 'nummultirange', 'tsrange', 'tsmultirange', 'daterange',
                                                         'datemultirange', 'json')
                                                   OR lower(f->>'data_type') LIKE 'geometry%'
                                                   OR lower(f->>'data_type')  LIKE 'measure%'
                                                   OR lower(f->>'data_type')  LIKE 'category%')
                                              THEN lendas_to_schema_type(lower(f->>'data_type'))::TEXT
                                              WHEN ((f->>'repeated')::boolean) AND (lower(f->>'data_type') IN 
                                                      ('integer', 'real', 'text', 'bytea', 'date', 'timestamp', 'time', 'interval', 'boolean', 
                                                        'intrange', 'intmultirange', 'numrange', 'nummultirange', 'tsrange', 'tsmultirange', 'daterange',
                                                         'datemultirange', 'json')
                                                   OR lower(f->>'data_type') LIKE 'geometry%'
                                                   OR lower(f->>'data_type')  LIKE 'measure%'
                                                   OR lower(f->>'data_type')  LIKE 'category%')
                                              THEN format('{"type":"array", "items": %s}',lendas_to_schema_type(lower(f->>'data_type'))::TEXT)
                                              ELSE '{}' --if the data type is user defined, then any version may be used, thus, it is not validated here
                                           END 
                                              ),
                                          ',')||'}')::json
                              )
      INTO complex_data_type_json_schema
      FROM json_array_elements(complex_data_type_version.fields) AS fields(f);
      
      -- generate fields for the type
      SELECT json_build_object('name',lower(f->>'name'),
                               'description', f->>'description',
                               'data_type', CASE 
                                             WHEN (lower(f->>'data_type') IN 
                                                      ('integer', 'real', 'text', 'bytea', 'date', 'timestamp', 'time', 'interval', 'boolean', 
                                                        'intrange', 'intmultirange', 'numrange', 'nummultirange', 'tsrange', 'tsmultirange', 'daterange',
                                                         'datemultirange', 'json')
                                                   OR lower(f->>'data_type') LIKE 'geometry%'
                                                   OR lower(f->>'data_type')  LIKE 'measure%'
                                                   OR lower(f->>'data_type')  LIKE 'category%')  
                                             THEN json_build_object('schema',NULL,'name',lower(f->>'data_type')) 
                                            ELSE json_build_object('schema',coalesce((lendas_process_qualified_name(lower(f->>'data_type'))).schema_name,schema_name),
                                                                   'name', (lendas_process_qualified_name(lower(f->>'data_type'))).unqualified_name
                                                                  )
                                            END,
                                'repeated',(f->>'repeated')::boolean
                               ) 
      INTO complex_data_type_version_fields
      FROM json_array_elements(complex_data_type_version.fields) AS fields(f);
      
      -- insert the version
      INSERT INTO lendas_catalog.complex_data_type_versions 
      VALUES (schema_name,
           complex_data_type.name, 
           complex_data_type_version.VERSION,
           complex_data_type_version_fields,
           complex_data_type_json_schema);

    END LOOP;

 END LOOP;
	
END;
$$
LANGUAGE  plpgsql;