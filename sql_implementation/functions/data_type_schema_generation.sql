DROP FUNCTION IF EXISTS  lendas_to_schema_type(lendas_type text) CASCADE;

CREATE OR REPLACE FUNCTION lendas_to_schema_type(lendas_type text)
RETURNS json
AS 
$$
BEGIN
	IF lower(lendas_type)='integer' THEN RETURN '{"anyOf":[{"type":"integer"},{"type":"null"}]}'::json;
	ELSEIF lower(lendas_type)='real' THEN RETURN  '{"anyOf":[{"type":"number"},{"type":"null"}]}'::json;
	ELSEIF lower(lendas_type)='text' THEN RETURN  '{"anyOf":[{"type":"string"},{"type":"null"}]}'::json;
	ELSEIF lower(lendas_type)='bytea' THEN RETURN  '{"anyOf":[{"type":"string", "pattern":"^[0-9a-f]*$"},{"type":"null"}]}'::json; -- use hexadecimal encoding and decoding
	ELSEIF lower(lendas_type)='date' THEN RETURN  '{"anyOf":[{"type":"string", "format":"date"},{"type":"null"}]}'::json;
	ELSEIF lower(lendas_type)='timestamp' THEN RETURN  '{"anyOf":[{"type":"string", "format":"date-time"},{"type":"null"}]}'::json;
	ELSEIF lower(lendas_type)='time' THEN RETURN  '{"anyOf":[{"type":"string", "format":"time"},{"type":"null"}]}'::json;
	ELSEIF lower(lendas_type)='interval' THEN RETURN  '{"anyOf":[{"type":"string", "format":"duration"},{"type":"null"}]}'::json; -- use  ISO 8601 ABNF https://datatracker.ietf.org/doc/html/rfc3339#appendix-A
	ELSEIF lower(lendas_type)='boolean' THEN RETURN  '{"anyOf":[{"type":"boolean"},{"type":"null"}]}'::json;
	ELSEIF lower(lendas_type) LIKE 'geometry%' THEN RETURN  '{"anyOf":[{"type":"string"},{"type":"null"}]}'::json; -- use EWKT
	ELSEIF lower(lendas_type)='intrange' THEN RETURN  '{"anyOf":[{"type":"array", "items":{"anyOf":[{"type":"integer"},{"type":"null"}]},"minItems":2, "maxItems":2},{"type":"null"}]}'::json;
	ELSEIF lower(lendas_type)='intmultirange' THEN RETURN  '{"anyOf":[{"type":"array", "items":{"type":"array", "items":{"anyOf":[{"type":"integer"},{"type":"null"}]}, "minItems":2, "maxItems":2}},{"type":"null"}]}'::json;
	ELSEIF lower(lendas_type)='numrange' THEN RETURN  '{"anyOf":[{"type":"array", "items":{"anyOf":[{"type":"number"},{"type":"null"}]},"minItems":2, "maxItems":2},{"type":"null"}]}'::json;
	ELSEIF lower(lendas_type)='nummultirange' THEN RETURN  '{"anyOf":[{"type":"array", "items":{"type":"array", "items":{"anyOf":[{"type":"number"},{"type":"null"}]}, "minItems":2, "maxItems":2}},{"type":"null"}]}'::json;
	ELSEIF lower(lendas_type)='tsrange' THEN RETURN  '{"anyOf":[{"type":"array", "items":{"anyOf":[{"type":"string", "format":"date-time"},{"type":"null"}]},"minItems":2, "maxItems":2},{"type":"null"}]}'::json;
	ELSEIF lower(lendas_type)='tsmultirange' THEN RETURN  '{"anyOf":[{"type":"array", "items":{"type":"array", "items":{"anyOf":[{"type":"string", "format":"date-time"},{"type":"null"}]}, "minItems":2, "maxItems":2}},{"type":"null"}]}'::json;
	ELSEIF lower(lendas_type)='daterange' THEN RETURN  '{"anyOf":[{"type":"array", "items":{"anyOf":[{"type":"string", "format":"date"},{"type":"null"}]},"minItems":2, "maxItems":2},{"type":"null"}]}'::json;
	ELSEIF lower(lendas_type)='datemultirange' THEN RETURN  '{"anyOf":[{"type":"array", "items":{"type":"array", "items":{"anyOf":[{"type":"string", "format":"date"},{"type":"null"}]}, "minItems":2, "maxItems":2}},{"type":"null"}]}'::json;
	ELSEIF lower(lendas_type)='json' THEN RETURN  '{}'::json;
	ELSEIF lower(lendas_type) = 'measure' THEN RETURN  '{"anyOf":[{"type":"object", "properties":{"value":{"type":"number"}, "uom":{"type":"string"}},"additionalProperties": false},{"type":"null"}]}'::json;
	ELSEIF lower(lendas_type) like 'measure(%)' THEN RETURN  '{"anyOf":[{"type":"number"},{"type":"null"}]}'::json;
	ELSEIF lower(lendas_type) = 'category' THEN RETURN  '{"anyOf":[{"type":"object", "properties":{"value":{"type":"string"}, "vocabulary":{"type":"string"}},"additionalProperties": false},{"type":"null"}]}'::json;
	ELSEIF lower(lendas_type) like 'category(%)' THEN RETURN  '{"anyOf":[{"type":"string"},{"type":"null"}]}'::json;
	ELSE RAISE EXCEPTION 'Lendas data type % not supported in function lendas_to_schema_type', lower(lendas_type);
	END IF;
END;
$$
LANGUAGE  plpgsql;

