DROP FUNCTION IF EXISTS  process_spatial_sampling_feature_types(spatial_sampling_feature_types JSON, schema_name text) CASCADE;

CREATE OR REPLACE FUNCTION process_spatial_sampling_feature_types(spatial_sampling_feature_types JSON, schema_name text)
RETURNS void
AS 
$$
DECLARE 
  feature_type record;
  undefined_vocabularies text[];
  feature_type_names JSON;
  undefined_data_types text[];
  feature_type_properties json;
  feature_type_properties_feature_scope JSON;
  feature_type_properties_valid_time_period_scope JSON;
  undefined_referenced_feature_types text[];
  feature_type_references json;
  feature_type_references_feature_scope JSON;
  feature_type_references_valid_time_period_scope JSON;
  create_table_query TEXT;
  sql_properties TEXT;
  sql_references TEXT;
  sampled_feature_type JSON;
  spatial_type TEXT;
  spatial_crs integer;
  height_type TEXT;
BEGIN
	
  -- create the schema if it has not been created
  EXECUTE FORMAT('CREATE SCHEMA IF NOT EXISTS %s',schema_name);	
	
	--process feature_types
 FOR feature_type IN 
   SELECT lower(f->>'name') AS name,
          f->>'description' AS description,
          f->'names' AS names,
          f->'properties' AS properties,
          f->'references' AS REFERENCES,
          lower(f->>'sampled_feature_type') AS sampled_feature_type,
          lower(f->>'shape_type') AS shape_type,
          lower(f->>'shape_crs') AS shape_crs,
          lower(f->>'height_type') AS height_type,
          lower(f->>'height_crs') AS height_crs
   FROM json_array_elements(spatial_sampling_feature_types) ft(f)
 LOOP 
     
     --check that all vocabularies of names exist
    SELECT array_agg(coalesce((lendas_process_qualified_name(lower(n->>'vocabulary'))).schema_name,schema_name)||'.'||
                              (lendas_process_qualified_name(lower(n->>'vocabulary'))).unqualified_name)
    INTO undefined_vocabularies
    FROM json_array_elements(feature_type.names) AS names(n)
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
      INTO feature_type_names
      FROM json_array_elements(feature_type.names) AS names(n);
          
    -- check names of properties
    SELECT array_agg(coalesce((lendas_process_qualified_name(lower(n->>'vocabulary'))).schema_name,schema_name)||'.'||
                              (lendas_process_qualified_name(lower(n->>'vocabulary'))).unqualified_name)
    INTO undefined_vocabularies
    FROM json_array_elements(feature_type.properties) AS ftp(p), json_array_elements(p->'names') AS names(n)
    WHERE NOT EXISTS (SELECT *
                      FROM lendas_catalog.vocabularies voc
                      WHERE voc.schema = coalesce((lendas_process_qualified_name(lower(n->>'vocabulary'))).schema_name,schema_name)
                        AND voc.name = (lendas_process_qualified_name(lower(n->>'vocabulary'))).unqualified_name);
     
     IF array_length(undefined_vocabularies,1)>0 THEN
        RAISE EXCEPTION 'The following vocabularies have not been defined: %',undefined_vocabularies;
     END IF;  
    
      -- check data types of properties
      SELECT array_agg(coalesce((lendas_process_qualified_name(lower(p->>'data_type'))).schema_name,schema_name)||'.'||
                               (lendas_process_qualified_name(lower(p->>'data_type'))).unqualified_name)
      INTO undefined_data_types
      FROM json_array_elements(feature_type.properties) AS ftp(p)
      WHERE lower(p->>'data_type') NOT IN ('integer', 'real', 'text', 'bytea', 'date', 'timestamp', 'time', 'interval', 'boolean', 
                                           'intrange', 'intmultirange', 'numrange', 'nummultirange', 'tsrange', 'tsmultirange', 'daterange',
                                           'datemultirange', 'json')
       AND lower(p->>'data_type') NOT LIKE 'geometry%'
       AND lower(p->>'data_type') NOT LIKE 'measure%'
       AND lower(p->>'data_type') NOT LIKE 'category%'
       AND (coalesce((lendas_process_qualified_name(lower(p->>'data_type'))).schema_name,schema_name),
            (lendas_process_qualified_name(lower(p->>'data_type'))).unqualified_name
           ) NOT IN (SELECT SCHEMA,name 
                     FROM lendas_catalog.enumeration_data_types
                     UNION 
                     SELECT SCHEMA, name
                     FROM lendas_catalog.complex_data_types
                     );
       
       IF array_length(undefined_data_types,1)>0 THEN
        RAISE EXCEPTION 'The following data types have not been defined: %',undefined_data_types;
       END IF;
      
     -- obtain all the properties to record in the metadata
     SELECT json_agg(
              json_build_object('name', lower(p->>'name'),
                                'description', p->>'description',
                                'names', (SELECT json_agg(
                                                   json_build_object('term', n->'term',
                                                                      'vocabulary',
                                                                        json_build_object('schema',coalesce((lendas_process_qualified_name(lower(n->>'vocabulary'))).schema_name,schema_name),
                                                                                          'name', (lendas_process_qualified_name(lower(n->>'vocabulary'))).unqualified_name)
                                                                     ) 
                                                           )
                                          FROM json_array_elements(p->'names') AS names(n)),
                                 'data_type', CASE 
                                                WHEN (lower(p->>'data_type') IN 
                                                      ('integer', 'real', 'text', 'bytea', 'date', 'timestamp', 'time', 'interval', 'boolean', 
                                                        'intrange', 'intmultirange', 'numrange', 'nummultirange', 'tsrange', 'tsmultirange', 'daterange',
                                                         'datemultirange', 'json')
                                                     OR lower(p->>'data_type') LIKE 'geometry%'
                                                     OR lower(p->>'data_type')  LIKE 'measure%'
                                                     OR lower(p->>'data_type')  LIKE 'category%')  
                                                THEN json_build_object('schema',NULL,'name',lower(p->>'data_type'))
                                                ELSE json_build_object('schema',coalesce((lendas_process_qualified_name(lower(p->>'data_type'))).schema_name,schema_name),
                                                                       'name', (lendas_process_qualified_name(lower(p->>'data_type'))).unqualified_name
                                                                       )
                                                END,
                                  'repeated', (p->>'repeated')::boolean,
                                  'scope', p->>'scope'
                               )
                     )
     INTO feature_type_properties
     FROM json_array_elements(feature_type.properties) AS ftp(p);

     -- obtain the names and data types of properties with feature scope
     SELECT json_agg(json_build_object('name',lower(p->>'name'),'data_type',
                              CASE 
                                 WHEN (lower(p->>'data_type') IN 
                                        ('integer', 'real', 'text', 'bytea', 'date', 'timestamp', 'time', 'interval', 'boolean', 
                                         'intrange', 'intmultirange', 'numrange', 'nummultirange', 'tsrange', 'tsmultirange', 'daterange',
                                          'datemultirange', 'json')
                                     OR lower(p->>'data_type') LIKE 'geometry%'
                                     OR lower(p->>'data_type')  LIKE 'measure%'
                                     OR lower(p->>'data_type')  LIKE 'category%')  
                                 THEN lendas_to_postgres_type(lower(p->>'data_type'))
                              ELSE 'json'
                              END)
                     )
     INTO feature_type_properties_feature_scope
     FROM json_array_elements(feature_type.properties) AS ftp(p)
     WHERE lower(p->>'scope')='feature';
    
     -- obtain the names and data types of properties with valid_time_period scope
     SELECT jsonb_agg(json_build_object('name',lower(p->>'name'),'data_type',
                              CASE 
                                 WHEN (lower(p->>'data_type') IN 
                                        ('integer', 'real', 'text', 'bytea', 'date', 'timestamp', 'time', 'interval', 'boolean', 
                                         'intrange', 'intmultirange', 'numrange', 'nummultirange', 'tsrange', 'tsmultirange', 'daterange',
                                          'datemultirange', 'json')
                                     OR lower(p->>'data_type') LIKE 'geometry%'
                                     OR lower(p->>'data_type')  LIKE 'measure%'
                                     OR lower(p->>'data_type')  LIKE 'category%')  
                                 THEN lendas_to_postgres_type(lower(p->>'data_type'))
                              ELSE 'json'
                              END)
                       )
     INTO feature_type_properties_valid_time_period_scope
     FROM json_array_elements(feature_type.properties) AS ftp(p)
     WHERE lower(p->>'scope')='valid_time_period';

     -- check names of references
    SELECT array_agg(coalesce((lendas_process_qualified_name(lower(n->>'vocabulary'))).schema_name,schema_name)||'.'||
                              (lendas_process_qualified_name(lower(n->>'vocabulary'))).unqualified_name)
    INTO undefined_vocabularies
    FROM json_array_elements(feature_type.references) AS ftr(r), json_array_elements(r->'names') AS names(n)
    WHERE NOT EXISTS (SELECT *
                      FROM lendas_catalog.vocabularies voc
                      WHERE voc.schema = coalesce((lendas_process_qualified_name(lower(n->>'vocabulary'))).schema_name,schema_name)
                        AND voc.name = (lendas_process_qualified_name(lower(n->>'vocabulary'))).unqualified_name);
     
     IF array_length(undefined_vocabularies,1)>0 THEN
        RAISE EXCEPTION 'The following vocabularies have not been defined: %',undefined_vocabularies;
     END IF;  
    
     --check referenced feature types
     SELECT array_agg(coalesce((lendas_process_qualified_name(lower(r->>'referenced_type'))).schema_name,schema_name)||'.'||
                              (lendas_process_qualified_name(lower(r->>'referenced_type'))).unqualified_name)
     INTO undefined_referenced_feature_types
     FROM json_array_elements(feature_type.references) AS ftr(r)
     WHERE NOT EXISTS (SELECT f.schema, f.name 
                       FROM lendas_catalog.feature_types f
                       WHERE f.schema = coalesce((lendas_process_qualified_name(lower(r->>'referenced_type'))).schema_name,schema_name)
                         AND f.name = (lendas_process_qualified_name(lower(r->>'referenced_type'))).unqualified_name
                       UNION 
                       SELECT f.schema, f.name 
                       FROM lendas_catalog.spatial_sampling_feature_types f
                       WHERE f.schema = coalesce((lendas_process_qualified_name(lower(r->>'referenced_type'))).schema_name,schema_name)
                         AND f.name = (lendas_process_qualified_name(lower(r->>'referenced_type'))).unqualified_name
                       UNION 
                       SELECT f.schema, f.name 
                       FROM lendas_catalog.specimen_feature_types f
                       WHERE f.schema = coalesce((lendas_process_qualified_name(lower(r->>'referenced_type'))).schema_name,schema_name)
                         AND f.name = (lendas_process_qualified_name(lower(r->>'referenced_type'))).unqualified_name
                       UNION 
                       SELECT f.schema, f.name 
                       FROM lendas_catalog.process_types f
                       WHERE f.schema = coalesce((lendas_process_qualified_name(lower(r->>'referenced_type'))).schema_name,schema_name)
                         AND f.name = (lendas_process_qualified_name(lower(r->>'referenced_type'))).unqualified_name);
    
     IF array_length(undefined_referenced_feature_types,1)>0 THEN
        RAISE EXCEPTION 'The following feature types have not been defined: %',undefined_referenced_feature_types;
     END IF;
    
     --generate all feature type references to record them in the catalog
     SELECT json_agg(
              json_build_object('name', lower(r->>'name'),
                                'description', r->>'description',
                                'names', (SELECT json_agg(
                                                   json_build_object('term', n->'term',
                                                                      'vocabulary',
                                                                        json_build_object('schema',coalesce((lendas_process_qualified_name(lower(n->>'vocabulary'))).schema_name,schema_name),
                                                                                          'name', (lendas_process_qualified_name(lower(n->>'vocabulary'))).unqualified_name)
                                                                     ) 
                                                           )
                                          FROM json_array_elements(r->'names') AS names(n)),
                                 'referenced_type', json_build_object('schema',coalesce((lendas_process_qualified_name(lower(r->>'referenced_type'))).schema_name,schema_name),
                                                                       'name', (lendas_process_qualified_name(lower(r->>'referenced_type'))).unqualified_name
                                                                       ),
                                 'repeated', (r->>'repeated')::boolean,
                                 'scope', r->>'scope'
                               )
                     )
     INTO feature_type_references
     FROM json_array_elements(feature_type.references) AS ftr(r); 
    
     -- obtain the names of references with feature scope
     SELECT json_agg(json_build_object('name',lower(r->>'name'),
                                       'referenced_type',
                                         coalesce((lendas_process_qualified_name(lower(r->>'referenced_type'))).schema_name,schema_name)||'.'||
                                         (lendas_process_qualified_name(lower(r->>'referenced_type'))).unqualified_name
                             )
                      )
     INTO feature_type_references_feature_scope
     FROM json_array_elements(feature_type.references) AS ftr(r)
     WHERE lower(r->>'scope')='feature';
    
     -- obtain the names of references with valid_time_period scope
     SELECT json_agg(json_build_object('name',lower(r->>'name'),
                                       'referenced_type',
                                         coalesce((lendas_process_qualified_name(lower(r->>'referenced_type'))).schema_name,schema_name)||'.'||
                                         (lendas_process_qualified_name(lower(r->>'referenced_type'))).unqualified_name
                             )
                      )
     INTO feature_type_references_valid_time_period_scope
     FROM json_array_elements(feature_type.references) AS ftr(r)
     WHERE lower(r->>'scope')='valid_time_period';
    
    -- Generate the sampled_feature_type
    
    sampled_feature_type:= json_build_object(
                              'schema', coalesce((lendas_process_qualified_name(feature_type.sampled_feature_type)).schema_name,schema_name),
                              'name', (lendas_process_qualified_name(feature_type.sampled_feature_type)).unqualified_name
                                            );

    -- Generate the table to record the instances of the feature type
    create_table_query:=FORMAT('create table %s.%s (fid bigserial primary key',schema_name,feature_type.name);
    
    IF feature_type.shape_type = 'point' THEN 
      spatial_type:='point';
    ELSEIF feature_type.shape_type = 'line' THEN 
      spatial_type:='linestring';
    ELSEIF feature_type.shape_type = 'surface' THEN 
      spatial_type:='polygon';
    ELSE
      RAISE EXCEPTION 'Not valid geometric data type %',feature_type.shape_type;
    END IF;
   
    IF feature_type.shape_crs IS NULL OR feature_type.shape_crs='' OR 
       split_part(feature_type.shape_crs,':',2)='' THEN 
       RAISE EXCEPTION 'Shape CRS % not valid',feature_type.shape_crs;
    ELSE
       spatial_crs:= split_part(feature_type.shape_crs,':',2)::integer;
    END IF;
   
    IF feature_type.height_type IS NULL THEN 
      height_type:=NULL;
    ELSE 
	    IF feature_type.height_type = 'point' THEN 
	      height_type:='double precision';
	    ELSEIF feature_type.height_type  = 'range' THEN 
	      height_type:='numrange';
	    ELSE
	      RAISE EXCEPTION 'Not valid height data type %',feature_type.height_type;
	    END IF;
    END IF;
    
    create_table_query:= create_table_query || FORMAT(', shape geometry(%s,%s)',spatial_type, spatial_crs);
    
    IF height_type IS NOT NULL THEN 
       create_table_query:= create_table_query || FORMAT(', height %s',height_type);
    END IF;
   
    create_table_query:= create_table_query || 
                         FORMAT(', sampled_feature bigint REFERENCES %s.%s (fid)',
                                sampled_feature_type->>'schema',sampled_feature_type->>'name');
   
    IF NOT feature_type_properties_feature_scope IS NULL AND json_array_length(feature_type_properties_feature_scope)>0 THEN 
      SELECT string_agg(format('%s %s', p->>'name', p->>'data_type'),', ')
      INTO sql_properties
      FROM json_array_elements(feature_type_properties_feature_scope) prop(p);
      create_table_query:=create_table_query || ', ' || sql_properties;
    END IF;
   
    IF NOT feature_type_references_feature_scope IS NULL AND json_array_length(feature_type_references_feature_scope)>0 THEN 
      SELECT string_agg(format('%s bigint REFERENCES %s (fid)',r->>'name', r->>'referenced_type'),', ')
      INTO sql_references
      FROM json_array_elements(feature_type_references_feature_scope) ref(r);
      create_table_query:=create_table_query || ', ' || sql_references;
    END IF;
   
    create_table_query:=create_table_query || ')';
   
    EXECUTE create_table_query;
   
    EXECUTE FORMAT('CREATE INDEX ON %s.%s USING GIST(shape)',schema_name,feature_type.name);
    IF height_type IS NOT NULL THEN 
      IF height_type='numrange' THEN
        EXECUTE FORMAT('CREATE INDEX ON %s.%s USING GIST(height)',schema_name,feature_type.name);
      ELSE 
        EXECUTE FORMAT('CREATE INDEX ON %s.%s (height)',schema_name,feature_type.name);
      END IF; 
    END IF;

    -- Generate the table to record the properties with valid_time_period scope
   
    IF (NOT feature_type_properties_valid_time_period_scope IS NULL AND json_array_length(feature_type_properties_valid_time_period_scope)>0) OR 
       (NOT feature_type_references_valid_time_period_scope IS NULL AND json_array_length(feature_type_references_valid_time_period_scope)>0) THEN 
       
	    create_table_query:=FORMAT('create table %s.%s_valid_time (fid bigint REFERENCES %s.%s (fid), valid_time tsrange ',
	                        schema_name,feature_type.name,schema_name,feature_type.name);
	   
	    IF NOT feature_type_properties_valid_time_period_scope IS NULL AND json_array_length(feature_type_properties_valid_time_period_scope)>0 THEN 
	      SELECT string_agg(format('%s %s', p->>'name', p->>'data_type'),', ')
	      INTO sql_properties
	      FROM json_array_elements(feature_type_properties_valid_time_period_scope) prop(p);
	      create_table_query:=create_table_query || ', ' || sql_properties;
	    END IF;
	   
	    IF NOT feature_type_references_valid_time_period_scope IS NULL AND json_array_length(feature_type_references_valid_time_period_scope)>0 THEN 
	      SELECT string_agg(format('%s bigint REFERENCES %s (fid)',r->>'name', r->>'referenced_type'),', ')
	      INTO sql_references
	      FROM json_array_elements(feature_type_references_valid_time_period_scope) ref(r);
	      create_table_query:=create_table_query || ', ' || sql_references;
	    END IF;
	   
	    create_table_query:=create_table_query || ', exclude using GIST (fid with =, valid_time with &&) )';
	   
	    EXECUTE create_table_query;
	   
     END IF;

    -- insert the metadata of the feature type
      INSERT INTO lendas_catalog.spatial_sampling_feature_types
      VALUES (schema_name,
           feature_type.name, 
           feature_type.description,
           feature_type_names,
           feature_type_properties,
           feature_type_references,
           sampled_feature_type,
           feature_type.shape_type,
           feature_type.shape_crs,
           feature_type.height_type,
           feature_type.height_crs
           );
         
          
 END LOOP;
	
END;
$$
LANGUAGE  plpgsql;