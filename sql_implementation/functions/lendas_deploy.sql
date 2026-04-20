
DROP FUNCTION IF EXISTS lendas_process_qualified_name (IN qualified_name TEXT, OUT schema_name TEXT, OUT unqualified_name text) CASCADE;

CREATE OR REPLACE FUNCTION lendas_process_qualified_name (IN qualified_name TEXT, OUT schema_name TEXT, OUT unqualified_name text)
AS 
$$
BEGIN
  IF split_part(qualified_name,'.',3)<>'' OR qualified_name='' OR qualified_name IS NULL THEN -- at least two dots or empty qualified name
    RAISE EXCEPTION 'Invalid qualified name "%"',qualified_name;
  ELSEIF split_part(qualified_name,'.',2)='' THEN -- we do not have dots
    schema_name:=NULL;
    unqualified_name:=qualified_name;
  ELSE -- we have exactly two dots
    schema_name:=split_part(qualified_name,'.',1);
    unqualified_name:=split_part(qualified_name,'.',2);
  END IF;
  
END;
$$
LANGUAGE  plpgsql;

--SELECT lendas_process_qualified_name('pepe');
--SELECT lendas_process_qualified_name('pepe.juan');
--SELECT lendas_process_qualified_name('');
--SELECT lendas_process_qualified_name(null);
--SELECT lendas_process_qualified_name('pepe.juan.otero');





DROP FUNCTION IF EXISTS  lendas_deploy(lendas json) CASCADE;

CREATE OR REPLACE FUNCTION lendas_deploy(lendas json)
RETURNS void
AS 
$$
DECLARE 
  schema_name TEXT;
  vocabulary record;
BEGIN
 --obtain the name of the schema.
 schema_name:=lower(lendas->>'schema');

 --Process the vocabularies
 IF lendas->'vocabularies' IS NOT NULL AND json_array_length(lendas->'vocabularies')>0 THEN 
	 FOR vocabulary IN
	  SELECT lower(v->>'name') AS name, 
	         v->>'description' AS description,
	         (v->>'date')::date AS date,
	         v->>'date_type' AS date_type,
	         (lower(v->>'language'))::char(3) AS language
	  FROM json_array_elements(lendas->'vocabularies') voc(v)
	 LOOP
	   INSERT INTO lendas_catalog.vocabularies 
	   VALUES (schema_name,
	           vocabulary.name, 
	           vocabulary.description,
	           vocabulary.date,
	           vocabulary.date_type,
	           vocabulary.language);
	 END LOOP;
 END IF;

 -- process the enumeration data types
 IF lendas->'enumeration_data_types' IS NOT NULL AND json_array_length(lendas->'enumeration_data_types')>0  THEN 
    PERFORM  process_enumeration_data_types(lendas->'enumeration_data_types', schema_name);
 END IF;
 
 --process the complex data types
 IF lendas->'complex_data_types' IS NOT NULL AND json_array_length(lendas->'complex_data_types')>0  THEN 
   PERFORM  process_complex_data_types(lendas->'complex_data_types', schema_name);
 END IF;

 --process the feature types
 IF lendas->'feature_types' IS NOT NULL AND json_array_length(lendas->'feature_types')>0 THEN 
   PERFORM  process_feature_types(lendas->'feature_types', schema_name);
 END IF;

 --process the spatial sampling feature types
 IF lendas->'spatial_sampling_feature_types' IS NOT NULL AND json_array_length(lendas->'spatial_sampling_feature_types')>0 THEN 
   PERFORM  process_spatial_sampling_feature_types(lendas->'spatial_sampling_feature_types', schema_name);
 END IF;

 --process the specimen feature types
 IF lendas->'specimen_feature_types' IS NOT NULL AND json_array_length(lendas->'specimen_feature_types')>0 THEN 
   PERFORM  process_specimen_feature_types(lendas->'specimen_feature_types', schema_name);
 END IF;

 --process the process types
 IF lendas->'process_types' IS NOT NULL AND json_array_length(lendas->'process_types')>0 THEN 
   PERFORM  process_process_types(lendas->'process_types', schema_name);
 END IF;

END;
$$
LANGUAGE  plpgsql;

