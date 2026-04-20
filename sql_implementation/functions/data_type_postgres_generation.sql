DROP FUNCTION IF EXISTS  lendas_to_postgres_type(lendas_type text) CASCADE;

CREATE OR REPLACE FUNCTION lendas_to_postgres_type(lendas_type text)
RETURNS text
AS 
$$
BEGIN

	IF lower(lendas_type)='integer' THEN RETURN 'integer';
	ELSEIF lower(lendas_type)='real' THEN RETURN  'double precision';
	ELSEIF lower(lendas_type)='text' THEN RETURN  'text';
	ELSEIF lower(lendas_type)='bytea' THEN RETURN  'bytea'; 
	ELSEIF lower(lendas_type)='date' THEN RETURN  'date';
	ELSEIF lower(lendas_type)='timestamp' THEN RETURN  'timestamp';
	ELSEIF lower(lendas_type)='time' THEN RETURN  'time';
	ELSEIF lower(lendas_type)='interval' THEN RETURN  'interval'; 
	ELSEIF lower(lendas_type)='boolean' THEN RETURN  'boolean';
	ELSEIF lower(lendas_type) LIKE 'geometry%' THEN RETURN lendas_type; 
	ELSEIF lower(lendas_type)='intrange' THEN RETURN  'int8range';
	ELSEIF lower(lendas_type)='intmultirange' THEN RETURN  'int8multirange';
	ELSEIF lower(lendas_type)='numrange' THEN RETURN  'numrange';
	ELSEIF lower(lendas_type)='nummultirange' THEN RETURN  'nummultirange';
	ELSEIF lower(lendas_type)='tsrange' THEN RETURN  'tsrange';
	ELSEIF lower(lendas_type)='tsmultirange' THEN RETURN  'tsmultirange';
	ELSEIF lower(lendas_type)='daterange' THEN RETURN  'daterange';
	ELSEIF lower(lendas_type)='datemultirange' THEN RETURN  'datemultirange';
	ELSEIF lower(lendas_type)='json' THEN RETURN  'json';
	ELSEIF lower(lendas_type) = 'measure' THEN RETURN  'json';
	ELSEIF lower(lendas_type) like 'measure(%)' THEN RETURN  'double precision';
	ELSEIF lower(lendas_type) = 'category' THEN RETURN  'json';
	ELSEIF lower(lendas_type) like 'category(%)' THEN RETURN  'text';
	ELSE RAISE EXCEPTION 'Lendas data type % not supported in function lendas_to_schema_type', lower(lendas_type);
	END IF;
END;
$$
LANGUAGE  plpgsql;
