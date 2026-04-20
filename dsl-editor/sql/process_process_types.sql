DROP FUNCTION IF EXISTS  process_process_types(process_types JSON, schema_name text) CASCADE;

CREATE OR REPLACE FUNCTION process_process_types(process_types JSON, schema_name text)
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
  platform_type JSON;
  create_table_query TEXT;
  sql_properties TEXT;
  sql_references TEXT;
  observation_results JSON;
  continuous_dimension_template TEXT;
  discrete_point_dimension_template TEXT;
  discrete_range_dimension_template TEXT;
  point_parameter_template TEXT;
  range_parameter_template TEXT;
  spatial_type TEXT;
  spatial_crs integer;
  height_type TEXT;
  root_columns TEXT;
  subsample_columns TEXT;
  shared_foi JSON;
  generated_foi JSON;
BEGIN
	
  -- create the schema if it has not been created
  EXECUTE FORMAT('CREATE SCHEMA IF NOT EXISTS %s',schema_name);	
	
	--process feature_types
 FOR feature_type IN 
   SELECT lower(f->>'name') AS name,
          f->>'description' AS description,
          f->'names' AS names,
          f->'properties' AS properties,
          f->'references' AS references,
          f->'metadata_language' as metadata_language,
          f->'metadata_contact' as metadata_contact,
          (f->>'metadata_date_stamp')::timestamp as metadata_date_stamp,
          f->>'title' as title,
          f->>'abstract' as abstract,
          f->>'identifier' as identifier,
          f->'point_of_contact' as point_of_contact,
          f->'keywords' as keywords,
          f->>'specific_usage' as specific_usage,
          f->'user_contact' as user_contact,
          f->>'use_limitation' as use_limitation,
          lower(f->>'spatial_representation_type') as spatial_representation_type,
          f->'spatial_resolution' as spatial_resolution,
          f->'language' as language,
          f->'topic_category' as topic_category,
          lower(f->>'result_time_type') as result_time_type,
          lower(f->>'phenomenon_time_type') as phenomenon_time_type,
          f->'platform' as platform,
          lower(f->>'shared_feature_of_interest_type') as shared_feature_of_interest_type,
          f->'generated_feature_of_interest_type' as generated_feature_of_interest_type,
          f->'observed_properties' as observed_properties
   FROM json_array_elements(process_types) ft(f)
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

    
    
    -- Generate the platform_type
    IF feature_type.platform IS NOT NULL THEN 
       platform_type:= json_build_object('feature_type',
                       			json_build_object(
                                     'schema', coalesce((lendas_process_qualified_name(lower((feature_type.platform)->>'feature_type'))).schema_name,schema_name),
                                      'name', (lendas_process_qualified_name(lower((feature_type.platform)->>'feature_type'))).unqualified_name
                                       ),
                                'scope', lower(feature_type.platform->>'scope')
                       );
    ELSE platform_type := NULL;
    END IF; 
 
    
    -- Generate the table to record the instances of the feature type
    create_table_query:=FORMAT('create table %s.%s (fid bigserial primary key',schema_name,feature_type.name);
   
    IF platform_type IS NOT NULL AND (platform_type->>'scope') = 'feature' THEN
      create_table_query:= create_table_query || format(', platform bigint REFERENCES %s.%s (fid)',platform_type->'feature_type'->>'schema',platform_type->'feature_type'->>'name');
    END IF;
   
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
   

    -- Generate the table to record the properties with valid_time_period scope
   
    IF (NOT feature_type_properties_valid_time_period_scope IS NULL AND json_array_length(feature_type_properties_valid_time_period_scope)>0) OR 
       (NOT feature_type_references_valid_time_period_scope IS NULL AND json_array_length(feature_type_references_valid_time_period_scope)>0) THEN 
       
	    create_table_query:=FORMAT('create table %s.%s_valid_time (fid bigint REFERENCES %s.%s (fid), valid_time tsrange ',
	                        schema_name,feature_type.name,schema_name,feature_type.name);
	                       
	    IF platform_type IS NOT NULL AND (platform_type->>'scope') = 'valid_time_period' THEN
            create_table_query:= create_table_query || format(', platform bigint REFERENCES %s.%s (fid)',platform_type->'feature_type'->>'schema',platform_type->'feature_type'->>'name');
        END IF;
	   
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

    
    -- check names of observed properties
    SELECT array_agg(coalesce((lendas_process_qualified_name(lower(n->>'vocabulary'))).schema_name,schema_name)||'.'||
                              (lendas_process_qualified_name(lower(n->>'vocabulary'))).unqualified_name)
    INTO undefined_vocabularies
    FROM json_array_elements(feature_type.observed_properties) AS op(p), json_array_elements(p->'names') AS names(n)
    WHERE NOT EXISTS (SELECT *
                      FROM lendas_catalog.vocabularies voc
                      WHERE voc.schema = coalesce((lendas_process_qualified_name(lower(n->>'vocabulary'))).schema_name,schema_name)
                        AND voc.name = (lendas_process_qualified_name(lower(n->>'vocabulary'))).unqualified_name);
     
     IF array_length(undefined_vocabularies,1)>0 THEN
        RAISE EXCEPTION 'The following vocabularies have not been defined: %',undefined_vocabularies;
     END IF;  
    
      -- check data types of observed properties
      SELECT array_agg(coalesce((lendas_process_qualified_name(lower(p->>'data_type'))).schema_name,schema_name)||'.'||
                               (lendas_process_qualified_name(lower(p->>'data_type'))).unqualified_name)
      INTO undefined_data_types
      FROM json_array_elements(feature_type.observed_properties) AS op(p)
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
       
   continuous_dimension_template:=
      '"%s": {
		 "type": "object",
		 "properties": {
			 "size": {
				 "type":"integer"
				 },
			 "resolution": {
				 "type":"string"
				 }
		 },
         "required":["size", "resolution"],
		 "additionalProperties":false
	 }';
	discrete_point_dimension_template:=
     '"%s": {
		 "type": "object",
		 "properties": {
			 "size": {
				 "type":"integer"
				 },
			 "values": {
				 "type":"array",
				 "items":{
					%s
				 },
				 "minItems":1
		     }
		 },
         "required":["size", "values"],
		 "additionalProperties":false
	 }';
	discrete_range_dimension_template:=
	'"%s": {
		 "type": "object",
		 "properties": {
			 "size": {
				 "type":"integer"
				 },
			 "values": {
				 "type":"array",
				 "items":{
					"type":"array",
					"items":{
						%s
					},
					"minItems":2,
					"maxItems":2
				 },
				 "minItems":1
		     }
		 },
         "required":["size", "values"],
		 "additionalProperties":false
	 }';
	point_parameter_template:='"%s":{"type":"array","items":{%s}}';
    range_parameter_template:=
     '"%s":{"type": "array", 
            "items": { 
				 "type":"array",
			     "items":{
				    %s
				  },
				 "minItems":2,
				 "maxItems":2
			 }
           }';
	
    -- Group observed properties into observation results
    WITH obs_properties AS (
    SELECT 
         CASE 
           WHEN lower(op->>'temporal_scope') = 'discrete_coverage' THEN FORMAT('"time" : ["discrete", "%s"]',lower(op->>'sampling_time_type'))
           WHEN lower(op->>'temporal_scope') = 'continuous_coverage' THEN FORMAT('"time" : ["continuous", "%s"]',lower(op->>'sampling_time_type'))
           ELSE null
         END AS time_dimension,
         CASE  
	        WHEN lower(op->>'temporal_scope') = 'sample' THEN FORMAT ('"sampling_time": "%s"',lower(op->>'sampling_time_type'))
	        ELSE null
         END AS time_parameter,
         CASE 
           WHEN lower(op->>'geospatial_scope') = 'discrete_coverage' THEN FORMAT('"space" : ["discrete", "%s"]',lower(op->>'sampling_geometry_type'))
           WHEN lower(op->>'geospatial_scope') = 'continuous_coverage' THEN FORMAT('"space" : ["continuous", "%s"]',lower(op->>'sampling_geometry_type'))
           ELSE null
         END AS geo_dimension,
         CASE  
	        WHEN lower(op->>'geospatial_scope') = 'sample' THEN FORMAT ('"sampling_geometry": "%s"',lower(op->>'sampling_geometry_type'))
	        ELSE null
         END AS geo_parameter,
         CASE 
           WHEN lower(op->>'height_scope') = 'discrete_coverage' THEN FORMAT('"height" : ["discrete", "%s"]',lower(op->>'sampling_height_type'))
           WHEN lower(op->>'height_scope') = 'continuous_coverage' THEN FORMAT('"height" : ["continuous", "%s"]',lower(op->>'sampling_height_type'))
           ELSE null
         END AS height_dimension,
         CASE  
	        WHEN lower(op->>'height_scope') = 'sample' THEN FORMAT ('"sampling_height": "%s"',lower(op->>'sampling_height_type'))
	        ELSE null
         END AS height_parameter,
         json_build_object('name', lower(op->>'name'),
                                'description', op->>'description',
                                'names', (SELECT json_agg(
                                                   json_build_object('term', n->'term',
                                                                      'vocabulary',
                                                                        json_build_object('schema',coalesce((lendas_process_qualified_name(lower(n->>'vocabulary'))).schema_name,schema_name),
                                                                                          'name', (lendas_process_qualified_name(lower(n->>'vocabulary'))).unqualified_name)
                                                                     ) 
                                                           )
                                          FROM json_array_elements(op->'names') AS names(n)),
                                 'data_type', CASE 
                                                WHEN (lower(op->>'data_type') IN 
                                                      ('integer', 'real', 'text', 'bytea', 'date', 'timestamp', 'time', 'interval', 'boolean', 
                                                        'intrange', 'intmultirange', 'numrange', 'nummultirange', 'tsrange', 'tsmultirange', 'daterange',
                                                         'datemultirange', 'json')
                                                     OR lower(op->>'data_type') LIKE 'geometry%'
                                                     OR lower(op->>'data_type')  LIKE 'measure%'
                                                     OR lower(op->>'data_type')  LIKE 'category%')  
                                                THEN json_build_object('schema',NULL,'name',lower(op->>'data_type'))
                                                ELSE json_build_object('schema',coalesce((lendas_process_qualified_name(lower(op->>'data_type'))).schema_name,schema_name),
                                                                       'name', (lendas_process_qualified_name(lower(op->>'data_type'))).unqualified_name
                                                                       )
                                                END,
                                  'repeated', (op->>'repeated')::boolean
                               ) AS property
    FROM json_array_elements(feature_type.observed_properties) obs_props(op)
   ), 
   observation_result AS (
	   SELECT json_build_object(
	              'name',
	              CASE 
		             WHEN time_dimension IS NULL AND geo_dimension IS NULL AND height_dimension IS NULL THEN 'root'
		             ELSE 
		                 concat_ws('_',
		                           CASE WHEN time_dimension IS NULL THEN NULL ELSE 'temporal' END,
		                           CASE WHEN geo_dimension IS NULL THEN NULL ELSE 'spatial' END,
		                           CASE WHEN height_dimension IS NULL THEN NULL ELSE 'vertical' END,
		                           'subsamples'
		                          )
		          END,
	              'sampling_dimensions', concat('{',concat_ws(',',time_dimension, geo_dimension, height_dimension),'}')::JSON,
	              'sampling_parameters', concat('{',concat_ws(',',time_parameter, geo_parameter, height_parameter),'}')::JSON,
	              'observed_properties',json_agg(property),
	              'json_schema',
	               CASE 
		               WHEN time_dimension IS NULL AND geo_dimension IS NULL AND height_dimension IS NULL THEN NULL 
		               WHEN geo_dimension LIKE '%discrete%' THEN 
		                   '{"type":"object", "properties":{"wfs_url": {"type":"string"}, "feature_type": {"type":"string"}},"required":["wfs_url","feature_type"],"additionalProperties":false}'::JSON 
		               WHEN geo_dimension LIKE '%continuous%' THEN 
		                   '{"type":"object", "properties":{"wcs_url": {"type":"string"}, "coverage_name": {"type":"string"}},"required":["wcs_url","coverage_name"],"additionalProperties":false}'::JSON
		               ELSE 
		                 ('{"type": "object", "properties":{'||
		                 concat_ws(',',
		                   CASE 
			                   WHEN time_dimension LIKE '%continuous%' THEN FORMAT(continuous_dimension_template,'sampling_time')
			                   WHEN time_dimension LIKE '%discrete%' AND time_dimension LIKE '%instant%' THEN FORMAT(discrete_point_dimension_template,'sampling_time','"type":"string","format":"date-time"')
			                   WHEN time_dimension LIKE '%discrete%' AND time_dimension LIKE '%period%' THEN FORMAT(discrete_range_dimension_template,'sampling_time','"type":"string","format":"date-time"')
			                   ELSE NULL
			               END,
			               CASE 
			                   WHEN height_dimension LIKE '%continuous%' THEN FORMAT(continuous_dimension_template,'sampling_height')
			                   WHEN height_dimension LIKE '%discrete%' AND height_dimension LIKE '%point%' THEN FORMAT(discrete_point_dimension_template,'sampling_height','"type":"number"')
			                   WHEN height_dimension LIKE '%discrete%' AND height_dimension LIKE '%range%' THEN FORMAT(discrete_range_dimension_template,'sampling_height','"type":"number"')
			                   ELSE NULL
			               END
			               ) ||
			               ',"measures":{"type":"object","properties":{' ||
			               concat_ws(',',
			                CASE 
				               WHEN time_parameter LIKE '%instant%' THEN format(point_parameter_template,'sampling_time','"type":"string","format":"date-time"')
				               WHEN time_parameter LIKE '%period%' THEN format(range_parameter_template,'sampling_time','"type":"string","format":"date-time"')
				               ELSE NULL 
			                END,
			                CASE 
				                WHEN geo_parameter IS NULL THEN NULL 
				                ELSE '"sampling_geometry":{"type":"array",
                                                           "items": {
                                                               "type":"string"
                                                              }
                                                          }'
				            END,
			                CASE 
				               WHEN height_parameter LIKE '%point%' THEN format(point_parameter_template,'sampling_height','"type":"number"')
				               WHEN height_parameter LIKE '%range%' THEN format(range_parameter_template,'sampling_height','"type":"number"')
				               ELSE NULL 
			                END,
				               string_agg(
				                   format('"%s": {"type":"array", "items": %s}',
	                                           lower(property->>'name'),
	                                           CASE
	                                             WHEN (NOT (property->>'repeated')::boolean) AND (lower(property->'data_type'->>'name') IN 
	                                                      ('integer', 'real', 'text', 'bytea', 'date', 'timestamp', 'time', 'interval', 'boolean', 
	                                                        'intrange', 'intmultirange', 'numrange', 'nummultirange', 'tsrange', 'tsmultirange', 'daterange',
	                                                         'datemultirange', 'json')
	                                                   OR lower(property->'data_type'->>'name') LIKE 'geometry%'
	                                                   OR lower(property->'data_type'->>'name')  LIKE 'measure%'
	                                                   OR lower(property->'data_type'->>'name')  LIKE 'category%')
	                                              THEN lendas_to_schema_type(lower(property->'data_type'->>'name'))::TEXT
	                                              WHEN ((property->>'repeated')::boolean) AND (lower(property->'data_type'->>'name') IN 
	                                                      ('integer', 'real', 'text', 'bytea', 'date', 'timestamp', 'time', 'interval', 'boolean', 
	                                                        'intrange', 'intmultirange', 'numrange', 'nummultirange', 'tsrange', 'tsmultirange', 'daterange',
	                                                         'datemultirange', 'json')
	                                                   OR lower(property->'data_type'->>'name') LIKE 'geometry%'
	                                                   OR lower(property->'data_type'->>'name')  LIKE 'measure%'
	                                                   OR lower(property->'data_type'->>'name')  LIKE 'category%')
	                                              THEN format('{"type":"array", "items": %s}',lendas_to_schema_type(lower(property->'data_type'->>'name'))::TEXT)
	                                              ELSE '{}' --if the data type is user defined, then any version may be used, thus, it is not validated here
	                                           END 
	                                              )
				               ,',')
			                 )|| 
			               '},"additionalProperties":false}'||
		                 '}, "additionalProperties":false}')::JSON 
		           END  
	         ) AS obs_result
	   FROM obs_properties
	   GROUP BY time_dimension, time_parameter, geo_dimension, geo_parameter, height_dimension, height_parameter
   )
   SELECT json_agg(obs_result)
   INTO observation_results
   FROM observation_result;
  
    -- Generate table for the recording of observations
  
    create_table_query:=FORMAT('create table %s.observation_%s (procedure bigint REFERENCES %s.%s (fid)',
	                        schema_name,feature_type.name,schema_name,feature_type.name);
    
	IF feature_type.result_time_type = 'instant' THEN
	  create_table_query:=create_table_query || ', result_time timestamp';
	ELSE
	   create_table_query:=create_table_query || ', result_time tsrange';
	END IF;
	 
    IF feature_type.phenomenon_time_type = 'instant' THEN
	  create_table_query:=create_table_query || ', phenomenon_time timestamp';
	ELSEIF feature_type.phenomenon_time_type = 'period' THEN 
	   create_table_query:=create_table_query || ', phenomenon_time tsrange';
	END IF; 

    IF feature_type.shared_feature_of_interest_type IS NOT NULL THEN 
      generated_foi:=NULL;
      shared_foi:= json_build_object(
                              'schema', coalesce((lendas_process_qualified_name(feature_type.shared_feature_of_interest_type)).schema_name,schema_name),
                              'name', (lendas_process_qualified_name(feature_type.shared_feature_of_interest_type)).unqualified_name
                                            );
      create_table_query:=create_table_query || FORMAT(', feature_of_interest bigint REFERENCES %s.%s (fid) ',shared_foi->>'schema', shared_foi->>'name');
    ELSE
      shared_foi:=NULL;
      generated_foi:= json_build_object('shape_type', lower(feature_type.generated_feature_of_interest_type->>'shape_type'),
                                        'shape_crs', lower(feature_type.generated_feature_of_interest_type->>'shape_crs'),
                                        'height_type', lower(feature_type.generated_feature_of_interest_type->>'height_type'),
                                        'height_crs', lower(feature_type.generated_feature_of_interest_type->>'height_crs'),
                                        'sampled_feature_type', 
                                            json_build_object(
                                               'schema', coalesce((lendas_process_qualified_name(lower(feature_type.generated_feature_of_interest_type->>'sampled_feature_type'))).schema_name,schema_name),
                                               'name', (lendas_process_qualified_name(lower(feature_type.generated_feature_of_interest_type->>'sampled_feature_type'))).unqualified_name)
                                         );
        IF (generated_foi->>'shape_type') = 'point' THEN 
	      spatial_type:='point';
	    ELSEIF (generated_foi->>'shape_type') = 'line' THEN 
	      spatial_type:='linestring';
	    ELSEIF (generated_foi->>'shape_type') = 'surface' THEN 
	      spatial_type:='polygon';
	    ELSE
	      RAISE EXCEPTION 'Not valid geometric data type %',(generated_foi->>'shape_type');
	    END IF;
	   
	    IF (generated_foi->>'shape_crs') IS NULL OR (generated_foi->>'shape_crs')='' OR 
	       split_part(generated_foi->>'shape_crs',':',2)='' THEN 
	       RAISE EXCEPTION 'Shape CRS % not valid',(generated_foi->>'shape_crs');
	    ELSE
	       spatial_crs:= split_part(generated_foi->>'shape_crs',':',2)::integer;
	    END IF;
	   
	    IF (generated_foi->>'height_type') IS NULL THEN 
	      height_type:=NULL;
	    ELSE 
		    IF (generated_foi->>'height_type') = 'point' THEN 
		      height_type:='double precision';
		    ELSEIF (generated_foi->>'height_type')  = 'range' THEN 
		      height_type:='numrange';
		    ELSE
		      RAISE EXCEPTION 'Not valid height data type %',(generated_foi->>'height_type');
		    END IF;
	    END IF;
	   
	    create_table_query:= create_table_query || ', fid bigserial';
         
	    create_table_query:= create_table_query || FORMAT(', shape geometry(%s,%s)',spatial_type, spatial_crs);
    
         IF height_type IS NOT NULL THEN 
            create_table_query:= create_table_query || FORMAT(', height %s',height_type);
         END IF;
   
         create_table_query:= create_table_query || 
                         FORMAT(', sampled_feature bigint REFERENCES %s.%s (fid)',
                                generated_foi->'sampled_feature_type'->>'schema',generated_foi->'sampled_feature_type'->>'name');
       END IF;
        
        SELECT string_agg(p->>'name' || ' ' ||
              CASE 
		         WHEN (p->'data_type'->>'schema') IS NULL THEN lendas_to_postgres_type(lower(p->'data_type'->>'name'))
		         ELSE 'json'
		      END, ', ')
        INTO root_columns
        FROM json_array_elements(observation_results) AS obr(r), json_array_elements(r->'observed_properties') AS obp(p)
        WHERE (r->>'name')='root';
       
        IF root_columns IS NOT NULL AND root_columns <> '' THEN
          create_table_query:= create_table_query || ', ' || root_columns; 
        END IF; 
        
        SELECT string_agg(r->>'name' || ' ' || 'json',', ') 
        INTO subsample_columns
        FROM json_array_elements(observation_results) AS obr(r)
        WHERE (r->>'name')<>'root';
       
        IF subsample_columns IS NOT NULL AND subsample_columns <> '' THEN
          create_table_query:= create_table_query || ', ' || subsample_columns; 
        END IF; 
         
        IF feature_type.result_time_type = 'instant' THEN
		  create_table_query:=create_table_query || ', primary key (procedure, result_time)';
		ELSE
		   create_table_query:=create_table_query || ', exclude using GIST (procedure with =, result_time with &&)';
		END IF;
	
	    IF feature_type.generated_feature_of_interest_type IS NOT NULL THEN
	       create_table_query:=create_table_query || ', unique(fid)';
	    END IF; 
	    
	    create_table_query := create_table_query || ')';
	    
        EXECUTE create_table_query;
   
        IF feature_type.generated_feature_of_interest_type IS NOT NULL THEN
		    EXECUTE FORMAT('CREATE INDEX ON %s.observation_%s USING GIST(shape)',schema_name,feature_type.name);
		   
		    IF height_type IS NOT NULL THEN 
		      IF height_type='numrange' THEN
		        EXECUTE FORMAT('CREATE INDEX ON %s.observation_%s USING GIST(height)',schema_name,feature_type.name);
		      ELSE 
		        EXECUTE FORMAT('CREATE INDEX ON %s.observation_%s (height)',schema_name,feature_type.name);
		      END IF; 
		    END IF;
		END IF;    
    
    -- insert the metadata of the process type
      INSERT INTO lendas_catalog.process_types
      VALUES (schema_name,
           feature_type.name, 
           feature_type.description,
           feature_type_names,
           feature_type_properties,
           feature_type_references,
           feature_type.metadata_language,
           feature_type.metadata_contact,
           feature_type.metadata_date_stamp,
           feature_type.title,
           feature_type.abstract,
           feature_type.identifier,
           feature_type.point_of_contact,
           feature_type.keywords,
           feature_type.specific_usage,
           feature_type.user_contact,
           feature_type.use_limitation,
           feature_type.spatial_representation_type,
           feature_type.spatial_resolution,
           feature_type.LANGUAGE,
           feature_type.topic_category,
           feature_type.result_time_type,
           feature_type.phenomenon_time_type,
           platform_type,
           shared_foi,
           generated_foi,
           observation_results
           );

 END LOOP;
	
END;
$$
LANGUAGE  plpgsql;