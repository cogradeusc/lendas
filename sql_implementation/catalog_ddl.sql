CREATE EXTENSION IF NOT EXISTS POSTGIS;
CREATE EXTENSION IF NOT EXISTS btree_gist;

DROP SCHEMA IF EXISTS lendas_catalog CASCADE;

CREATE SCHEMA IF NOT EXISTS lendas_catalog;

CREATE TABLE lendas_catalog.vocabularies (
  schema TEXT NOT null,
  name TEXT NOT null,
  description TEXT NOT null,
  date date,
  date_type TEXT,
  LANGUAGE char(3),
  PRIMARY KEY (SCHEMA,name)
);

CREATE TABLE lendas_catalog.enumeration_data_types (
  SCHEMA TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  names JSON, -- [{term: ..., vocabulary:{schema:..., name:...}}, ...]
  PRIMARY KEY (SCHEMA, name)
);

CREATE TABLE lendas_catalog.enumeration_data_type_versions (
  SCHEMA TEXT NOT NULL,
  name TEXT NOT NULL,
  VERSION TEXT NOT NULL,
  num_values integer,
  VALUES JSON, -- [{vocabulary: {schema: ..., name: ...}, terms: [...]}, {vocabulary: {schema: ..., name: ...}, terms: [...]}, ...]
  json_schema json,
  PRIMARY KEY (SCHEMA, name, version),
  FOREIGN KEY (SCHEMA, name) REFERENCES lendas_catalog.enumeration_data_types (SCHEMA, name)
);

CREATE TABLE lendas_catalog.complex_data_types (
  SCHEMA TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  names JSON, -- [{term: ..., vocabulary:{schema:..., name:...}}, ...]
  PRIMARY KEY (SCHEMA, name)
);

CREATE TABLE lendas_catalog.complex_data_type_versions (
  SCHEMA TEXT NOT NULL,
  name TEXT NOT NULL,
  VERSION TEXT NOT NULL,
  fields JSON, --[{name: ..., description: ..., names: [...], data_type: {schema: ..., name: ...}, repeated: ...}, {}, ...]
  json_schema json,
  PRIMARY KEY (SCHEMA, name, version),
  FOREIGN KEY (SCHEMA, name) REFERENCES lendas_catalog.complex_data_types(SCHEMA, name)
);

CREATE TABLE lendas_catalog.feature_types (
  SCHEMA TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  names JSON, -- [{term: ..., vocabulary:{schema:..., name:...}}, ...] 
  feature_properties JSON, --[{name: ..., description: ..., names:[...], data_type: ..., repeated:..., scope: ...}, ...]
  feature_references JSON, --[{name: ..., description: ..., names:[...], referenced_type: {schema: ..., name: ...}, repeated:..., scope: ...}, ...]
  PRIMARY KEY (SCHEMA, name)
);

CREATE TABLE lendas_catalog.spatial_sampling_feature_types (
  SCHEMA TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  names JSON, -- [{term: ..., vocabulary:{schema:..., name:...}}, ...]
  feature_properties JSON, --[{name: ..., description: ..., names:[...], data_type: ..., repeated:..., scope: ...}, ...]
  feature_references JSON, --[{name: ..., description: ..., names:[...], referenced_type: ..., repeated:..., scope: ...}, ...]
  sampled_feature_type JSON, --{schema: ...., name: ...}
  shape_type TEXT NOT NULL, -- point, line, surface
  shape_crs TEXT NOT NULL,
  height_type TEXT, --point, range
  height_crs TEXT,
  PRIMARY KEY (SCHEMA,name)
);

CREATE TABLE lendas_catalog.specimen_feature_types (
  SCHEMA TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  names JSON, -- [{term: ..., vocabulary:{schema:..., name:...}}, ...]
  feature_properties JSON, --[{name: ..., description: ..., names:[...], data_type: ..., repeated:..., scope: ...}, ...]
  feature_references JSON, --[{name: ..., description: ..., names:[...], referenced_type: ..., repeated:..., scope: ...}, ...]
  sampled_feature_type JSON, --{schema: ..., name: ...}
  sampling_time_extension TEXT, --instant, period
  shared_sampling_location_type JSON, --{schema: ..., name: ...}
  generated_sampling_location_type_shape_type TEXT, --point, line, surface
  generated_sampling_location_type_shape_crs TEXT, 
  generated_sampling_location_type_height_type TEXT, --point, range
  generated_sampling_location_type_height_crs TEXT,
  sampling_method_type_name TEXT,
  sampling_method_type_description TEXT,
  sampling_method_type_names JSON, -- [{term: ..., vocabulary:{schema:..., name:...}}, ...]
  sampling_method_type_properties JSON, --[{name: ..., description: ..., names:[...], data_type: ..., repeated:..., scope: ...}, ...]
  sampling_method_type_references JSON, --[{name: ..., description: ..., names:[...], referenced_type: ..., repeated:..., scope: ...}, ...]
  PRIMARY KEY (SCHEMA, name) 
);

CREATE TABLE lendas_catalog.process_types (
  SCHEMA TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  names JSON, -- [{term: ..., vocabulary:{schema:..., name:...}}, ...]
  feature_properties JSON, --[{name: ..., description: ..., names:[...], data_type: ..., repeated:..., scope: ...}, ...]
  feature_references JSON, --[{name: ..., description: ..., names:[...], referenced_type: ..., repeated:..., scope: ...}, ...]
  metadata_language JSON, --[spa, eng, ...]
  metadata_contact JSON, --[{organisation_name: ..., electronic_mail_address: ..., role: ...},...]
  metadata_date_stamp timestamp,
  title text,
  abstract text,
  identifier text,
  point_of_contact JSON, --[{organisation_name: ..., electronic_mail_address: ..., role: ...},...]
  keywords JSON, --[{keyword: ..., vocabulary: ...}, ...]
  specific_usage TEXT,
  user_contact JSON, --[{organisation_name: ..., electronic_mail_address: ..., role: ...},...]
  use_limitation TEXT,
  spatial_representation_type TEXT,
  spatial_resolution JSON, --[234,34346,...]
  language JSON , --[spa, eng, ...]
  topic_category JSON, --[farming, biota, health]
  result_time_type TEXT,
  phenomenon_time_type TEXT,
  platform JSON, --{feature_type: {schema: ..., name: ...}, scope: ....}
  shared_feature_of_interest_type JSON, --{schema: ..., name: ...}
  generated_feature_of_interest_type JSON, --{shape_type: ..., shape_crs:..., height_type:..., height_crs: ..., sampled_feature_type: ...}
  observation_results JSON, 
         /* [
          * {name: ..., --root for the results not corresponding to subsamples. 
          *  sampling_dimensions: {
          *          time: [discrete, period],
          *          space: [continuos, polygon],
          *          height: [discrete, point]
          *       },
          *  sampling_parameters: {
          *          sampling_time: point,
          *          sampling_geometry: linestring,
          *          sampling_height: range
          *  }
          *  observed_properties: [
          *     {name: ..., description: ..., names:[...], data_type: ..., repeated:...},
          *     {name: ..., description: ..., names:[...], data_type: ..., repeated:...},
          *     . . .
          *  ],
		  *  json_schema: ...
          *  },
          * ....
          * ]
          */
  PRIMARY KEY (SCHEMA, name)
);
