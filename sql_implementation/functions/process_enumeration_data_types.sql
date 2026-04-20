DROP FUNCTION IF EXISTS  process_enumeration_data_types(enumeration_data_types JSON, schema_name text) CASCADE;

CREATE OR REPLACE FUNCTION process_enumeration_data_types(enumeration_data_types JSON, schema_name text)
RETURNS void
AS 
$$
DECLARE 
  enum_data_type record;
  enum_data_type_version record;
  enum_data_type_names JSON;
  enum_num_values integer;
  undefined_vocabularies TEXT[];
  num_enumerationdt_values record;
  enum_data_type_version_values JSON;
  enum_data_type_json_schema JSON;
BEGIN
	--process enumeration_data_types
 FOR enum_data_type IN 
   SELECT lower(e->>'name') AS name,
          e->>'description' AS description,
          e->'names' AS names,
          e->'versions' AS versions
   FROM json_array_elements(enumeration_data_types) enumdt(e)
 LOOP 
 
    --check that all vocabularies of names exist
    SELECT array_agg(coalesce((lendas_process_qualified_name(lower(n->>'vocabulary'))).schema_name,schema_name)||'.'||
                              (lendas_process_qualified_name(lower(n->>'vocabulary'))).unqualified_name)
    INTO undefined_vocabularies
    FROM json_array_elements(enum_data_type.names) AS names(n)
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
      INTO enum_data_type_names
      FROM json_array_elements(enum_data_type.names) AS names(n);
 
    -- insert the tuple for the enumeration data type
    INSERT INTO lendas_catalog.enumeration_data_types 
    VALUES (schema_name,
           enum_data_type.name, 
           enum_data_type.description,
           enum_data_type_names);
          
    --process the versions
    FOR enum_data_type_version IN
      SELECT lower(v->>'version') AS VERSION,
             v->'values' AS values
      FROM json_array_elements(enum_data_type.versions) AS enumdtv(v)
    LOOP
      -- check that all vocabularies exist.
      SELECT array_agg(coalesce((lendas_process_qualified_name(lower(v->>'vocabulary'))).schema_name,schema_name)||'.'||
                       (lendas_process_qualified_name(lower(v->>'vocabulary'))).unqualified_name)
      INTO undefined_vocabularies
      FROM json_array_elements(enum_data_type_version.VALUES) AS enumdtva(v)
      WHERE NOT EXISTS (SELECT *
                        FROM lendas_catalog.vocabularies voc
                        WHERE voc.schema = coalesce((lendas_process_qualified_name(lower(v->>'vocabulary'))).schema_name,schema_name)
                          AND voc.name = (lendas_process_qualified_name(lower(v->>'vocabulary'))).unqualified_name);  
      IF array_length(undefined_vocabularies,1)>0 THEN
        RAISE EXCEPTION 'The following vocabularies have not been defined: %',undefined_vocabularies;
      END IF;

     
      -- check that all vocabularies have the same number of values and obtain the number of values
      SELECT min(num_values) AS min_v, max(num_values) AS max_v
      INTO num_enumerationdt_values
      FROM 
      (SELECT count(*) AS num_values
       FROM json_array_elements(enum_data_type_version.VALUES) AS enumdtva(v), json_array_elements(v->'terms') AS vaterms(t)
       GROUP BY lower(v->>'vocabulary')) AS tmp;
       
      IF num_enumerationdt_values.min_v <> num_enumerationdt_values.max_v THEN 
        RAISE EXCEPTION 'The enumeration data type "%" has different number of values for different vocabularies',schema_name||'.'||enum_data_type.name;
      END IF;
      --obtain the values (completing the vocabularies with their schema and name)
     
      SELECT json_agg(json_build_object('vocabulary',json_build_object('schema',coalesce((lendas_process_qualified_name(lower(v->>'vocabulary'))).schema_name,schema_name),
                                                                       'name', (lendas_process_qualified_name(lower(v->>'vocabulary'))).unqualified_name),
                                'terms',v->'terms') 
                     )
      INTO enum_data_type_version_values
      FROM json_array_elements(enum_data_type_version.VALUES) AS enumdtva(v);
     
      -- Obtain the json schema for the enumeration as an integer with values between 0 and num_values - 1
      enum_data_type_json_schema:=json_build_object('type','integer','minimum',0,'maximum',num_enumerationdt_values.min_v-1);
     
      -- insert the version
      INSERT INTO lendas_catalog.enumeration_data_type_versions 
      VALUES (schema_name,
           enum_data_type.name, 
           enum_data_type_version.VERSION,
           num_enumerationdt_values.min_v,
           enum_data_type_version_values,
           enum_data_type_json_schema);

    END LOOP;

 END LOOP;
	
END;
$$
LANGUAGE  plpgsql;