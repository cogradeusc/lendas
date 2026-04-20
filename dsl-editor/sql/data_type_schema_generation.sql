DROP FUNCTION IF EXISTS  lendas_to_schema_type(lendas_type text) CASCADE;

CREATE OR REPLACE FUNCTION lendas_to_schema_type(lendas_type text)
RETURNS json
AS 
$$
BEGIN

	IF lower(lendas_type)='integer' THEN RETURN '{"type":"integer"}'::json;
	ELSEIF lower(lendas_type)='real' THEN RETURN  '{"type":"number"}'::json;
	ELSEIF lower(lendas_type)='text' THEN RETURN  '{"type":"string"}'::json;
	ELSEIF lower(lendas_type)='bytea' THEN RETURN  '{"type":"string", "pattern":"^[0-9a-f]*$"}'::json; -- use hexadecimal encoding and decoding
	ELSEIF lower(lendas_type)='date' THEN RETURN  '{"type":"integer", "format":"date"}'::json;
	ELSEIF lower(lendas_type)='timestamp' THEN RETURN  '{"type":"integer", "format":"date-time"}'::json;
	ELSEIF lower(lendas_type)='time' THEN RETURN  '{"type":"integer", "format":"time"}'::json;
	ELSEIF lower(lendas_type)='interval' THEN RETURN  '{"type":"integer", "format":"duration"}'::json; -- use  ISO 8601 ABNF https://datatracker.ietf.org/doc/html/rfc3339#appendix-A
	ELSEIF lower(lendas_type)='boolean' THEN RETURN  '{"type":"boolean"}'::json;
	ELSEIF lower(lendas_type) LIKE 'geometry%' THEN RETURN  '{"type":"string"}'::json; -- use EWKT
	ELSEIF lower(lendas_type)='intrange' THEN RETURN  '{"type":"array", "items":{"type":"integer", "minItems":2, "maxItems":2}}'::json;
	ELSEIF lower(lendas_type)='intmultirange' THEN RETURN  '{"type":"array", "items":{"type":"array", "items":{"type":"integer", "minItems":2, "maxItems":2}}}'::json;
	ELSEIF lower(lendas_type)='numrange' THEN RETURN  '{"type":"array", "items":{"type":"number", "minItems":2, "maxItems":2}}'::json;
	ELSEIF lower(lendas_type)='nummultirange' THEN RETURN  '{"type":"array", "items":{"type":"array", "items":{"type":"number", "minItems":2, "maxItems":2}}}'::json;
	ELSEIF lower(lendas_type)='tsrange' THEN RETURN  '{"type":"array", "items":{"type":"string", "format":"date-time", "minItems":2, "maxItems":2}}'::json;
	ELSEIF lower(lendas_type)='tsmultirange' THEN RETURN  '{"type":"array", "items":{"type":"array", "items":{"type":"string", "format":"date-time", "minItems":2, "maxItems":2}}}'::json;
	ELSEIF lower(lendas_type)='daterange' THEN RETURN  '{"type":"array", "items":{"type":"string", "format":"date", "minItems":2, "maxItems":2}}'::json;
	ELSEIF lower(lendas_type)='datemultirange' THEN RETURN  '{"type":"array", "items":{"type":"array", "items":{"type":"string", "format":"date", "minItems":2, "maxItems":2}}}'::json;
	ELSEIF lower(lendas_type)='json' THEN RETURN  '{}'::json;
	ELSEIF lower(lendas_type) = 'measure' THEN RETURN  '{"type":"object", "properties":{"value":"number", "uom":"string"}}'::json;
	ELSEIF lower(lendas_type) like 'measure(%)' THEN RETURN  '{"type":"number"}'::json;
	ELSEIF lower(lendas_type) = 'category' THEN RETURN  '{"type":"object", "properties":{"value":"string", "vocabulary":"string"}}'::json;
	ELSEIF lower(lendas_type) like 'category(%)' THEN RETURN  '{"type":"string"}'::json;
	ELSE RAISE EXCEPTION 'Lendas data type % not supported in function lendas_to_schema_type', lower(lendas_type);
	END IF;

END;
$$
LANGUAGE  plpgsql;

