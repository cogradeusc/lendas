

DROP FUNCTION IF EXISTS  lendas_undeploy(lendas json) CASCADE;

CREATE OR REPLACE FUNCTION lendas_undeploy(lendas json)
RETURNS void
AS 
$$
DECLARE 
  schema_name TEXT;
  ft record;
  dt record;
  voc record;
BEGIN
 
 --obtain the name of the schema.
 schema_name:=lower(lendas->>'schema');

 --process the process types
 IF lendas->'process_types' IS NOT NULL AND json_array_length(lendas->'process_types')>0 THEN 
   FOR ft IN
   SELECT lower(f->>'name') AS name
   FROM json_array_elements(lendas->'process_types') AS ft(f)
   LOOP
   	--drop tables
	EXECUTE FORMAT ('DROP TABLE IF EXISTS %s.observation_%s CASCADE',schema_name,ft.name);
    EXECUTE FORMAT ('DROP TABLE IF EXISTS %s.%s_valid_time CASCADE',schema_name,ft.name);
    EXECUTE FORMAT ('DROP TABLE IF EXISTS %s.%s CASCADE',schema_name,ft.name);
    
   
   --delete tuples from catalog.
    DELETE FROM lendas_catalog.process_types WHERE SCHEMA = schema_name AND name = ft.name;
   
   END LOOP;
 END IF;


 --process the specimen feature types
 IF lendas->'specimen_feature_types' IS NOT NULL AND json_array_length(lendas->'specimen_feature_types')>0 THEN 
   FOR ft IN
   SELECT lower(f->>'name') AS name, lower(f->'sampling_method_type'->>'name') AS method_name
   FROM json_array_elements(lendas->'specimen_feature_types') AS ft(f)
   LOOP
   	--drop tables
	EXECUTE FORMAT ('DROP TABLE IF EXISTS %s.%s_valid_time CASCADE',schema_name,ft.name);
    EXECUTE FORMAT ('DROP TABLE IF EXISTS %s.%s CASCADE',schema_name,ft.name);
    EXECUTE FORMAT ('DROP TABLE IF EXISTS %s.%s CASCADE',schema_name,ft.method_name);
    
   
   --delete tuples from catalog.
    DELETE FROM lendas_catalog.specimen_feature_types WHERE SCHEMA = schema_name AND name = ft.name;
   
   END LOOP;
 END IF;

 --process the spatial sampling feature types
 IF lendas->'spatial_sampling_feature_types' IS NOT NULL AND json_array_length(lendas->'spatial_sampling_feature_types')>0 THEN 
   FOR ft IN
   SELECT lower(f->>'name') AS name
   FROM json_array_elements(lendas->'spatial_sampling_feature_types') AS ft(f)
   LOOP
   	--drop tables
	EXECUTE FORMAT ('DROP TABLE IF EXISTS %s.%s_valid_time CASCADE',schema_name,ft.name);
    EXECUTE FORMAT ('DROP TABLE IF EXISTS %s.%s CASCADE',schema_name,ft.name);
    

   --delete tuples from catalog.
    DELETE FROM lendas_catalog.spatial_sampling_feature_types WHERE SCHEMA =schema_name AND name = ft.name;
   
   END LOOP;
 END IF;

 --process the feature types
 IF lendas->'feature_types' IS NOT NULL AND json_array_length(lendas->'feature_types')>0 THEN 
   FOR ft IN
   SELECT lower(f->>'name') AS name
   FROM json_array_elements(lendas->'feature_types') AS ft(f)
   LOOP
   	--drop tables
	EXECUTE FORMAT ('DROP TABLE IF EXISTS %s.%s_valid_time CASCADE',schema_name,ft.name);
    EXECUTE FORMAT ('DROP TABLE IF EXISTS %s.%s CASCADE',schema_name,ft.name);
    

   --delete tuples from catalog.
    DELETE FROM lendas_catalog.feature_types WHERE SCHEMA = schema_name AND name = ft.name;
   
   END LOOP;
 END IF;

 --process the complex data types
 IF lendas->'complex_data_types' IS NOT NULL AND json_array_length(lendas->'complex_data_types')>0  THEN 
   FOR dt IN
   SELECT lower(d->>'name') AS name
   FROM json_array_elements(lendas->'complex_data_types') AS dt(d)
   LOOP
  
   --delete tuples from catalog.
    DELETE FROM lendas_catalog.complex_data_type_versions WHERE SCHEMA = schema_name AND name = dt.name;
    DELETE FROM lendas_catalog.complex_data_types WHERE SCHEMA = schema_name AND name = dt.name;
 
   END LOOP;
 END IF;

 -- process the enumeration data types
 IF lendas->'enumeration_data_types' IS NOT NULL AND json_array_length(lendas->'enumeration_data_types')>0  THEN 
   FOR dt IN
   SELECT lower(d->>'name') AS name
   FROM json_array_elements(lendas->'enumeration_data_types') AS dt(d)
   LOOP
  
   --delete tuples from catalog.
    DELETE FROM lendas_catalog.enumeration_data_type_versions WHERE SCHEMA = schema_name AND name = dt.name;
    DELETE FROM lendas_catalog.enumeration_data_types WHERE SCHEMA = schema_name AND name = dt.name;
 
   END LOOP;
 END IF;


 --Process the vocabularies
 IF lendas->'vocabularies' IS NOT NULL AND json_array_length(lendas->'vocabularies')>0 THEN 
	 FOR voc IN
	  SELECT lower(v->>'name') AS name
	  FROM json_array_elements(lendas->'vocabularies') voc(v)
	 LOOP
	   DELETE FROM lendas_catalog.vocabularies WHERE SCHEMA = schema_name AND name = voc.name;
	 END LOOP;
 END IF;


 --DROP the schema if it is empty
  IF NOT EXISTS (SELECT schema FROM lendas_catalog.vocabularies WHERE SCHEMA=schema_name
                 UNION 
                 SELECT schema FROM lendas_catalog.enumeration_data_types WHERE SCHEMA=schema_name
                 UNION 
                 SELECT schema FROM lendas_catalog.complex_data_type_versions WHERE SCHEMA=schema_name
                 UNION
                 SELECT schema FROM lendas_catalog.feature_types WHERE SCHEMA=schema_name
                 UNION
                 SELECT schema FROM lendas_catalog.spatial_sampling_feature_types WHERE SCHEMA=schema_name
                 UNION
                 SELECT schema FROM lendas_catalog.specimen_feature_types WHERE SCHEMA=schema_name
                 UNION
                 SELECT schema FROM lendas_catalog.process_types WHERE SCHEMA=schema_name
                ) THEN
      EXECUTE FORMAT ('DROP SCHEMA IF EXISTS %s', schema_name);
   END IF;

END;
$$
LANGUAGE  plpgsql;

