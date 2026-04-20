-- GLOBAL
SELECT lendas_deploy('{
  "schema": "ccmm_global",
  "vocabularies": [
    {
      "name": "castellano",
      "description": "Vocabulario utilizado para anotar los textos escritos en castellano",
      "language": "spa"
    },
    {
      "name": "galego",
      "description": "Vocabulario utilizado para anotar textos escritos en galego",
      "language": "glg"
    },
    {
      "name": "english",
      "description": "Vocabulary used to tag texts written in english",
      "language": "eng"
    },
    {
      "name": "cf_standard_names",
      "description": "CF Standard Name Table, version 89. URL: https://cfconventions.org/Data/cf-standard-names/current/build/cf-standard-name-table.html>",
      "date": "2025-01-21T00:00:00.000Z",
      "date_type": "publication",
      "language": "eng"
    }
  ]
}');

-- CTD INTECMAR
SELECT lendas_deploy('{
  "schema": "ctd_intecmar",
  "enumeration_data_types": [
    {
      "name": "validation_flag_type",
      "description": "Defined los posibles valores de los flags de validación",
      "versions": [
        {
          "version": "default",
          "values": [
            {
              "vocabulary": "ccmm_global.castellano",
              "terms": [
                "No control de Calidad",
                "Valor bueno",
                "Probablemente valor bueno",
                "Probablemente valor malo",
                "Valor malo",
                "Valor cambiado",
                "Valor bueno sin recalibración",
                "Valor perdido"
              ]
            },
            {
              "vocabulary": "ccmm_global.galego",
              "terms": [
                "Non control de Calidade",
                "Valor bo",
                "Probablemente valor bo",
                "Probablemente valor malo",
                "Valor malo",
                "Valor cambiado",
                "Valor bo sen recalibración",
                "Valor perdido"
              ]
            },
            {
              "vocabulary": "ccmm_global.english",
              "terms": [
                "NoQualityControl",
                "GoodValue",
                "ProbablyGoodValue",
                "ProbablyBadValue",
                "ChangedValue",
                "BadValue",
                "GoodValueWithoutRecalibration",
                "LostValue"
              ]
            }
          ]
        }
      ]
    }
  ],
  "complex_data_types": [
    {
      "name": "validation_flags_type",
      "description": "Flags de validación para todas las propiedades.",
      "versions": [
        {
          "version": "default",
          "fields": [
            {
              "name": "temperatura_ITS90",
              "description": "Flag de la temperatura del agua",
              "names": [
                {
                  "term": "temperatura",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "temperatura",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "temperature",
                  "vocabulary": "ccmm_global.english"
                },
                {
                  "term": "sea_water_temperature",
                  "vocabulary": "ccmm_global.cf_standard_names"
                }
              ],
              "data_type": "validation_flag_type",
              "repeated": false
            },
            {
              "name": "salinidad",
              "description": "Flag de la salinidad del agua",
              "names": [
                {
                  "term": "salinidad",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "salinidade",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "salinity",
                  "vocabulary": "ccmm_global.english"
                },
                {
                  "term": "sea_water_salinity",
                  "vocabulary": "ccmm_global.cf_standard_names"
                }
              ],
              "data_type": "validation_flag_type",
              "repeated": false
            },
            {
              "name": "presion",
              "description": "Flag de la presión de la columna de agua",
              "names": [
                {
                  "term": "presión",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "presión",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "pressure",
                  "vocabulary": "ccmm_global.english"
                },
                {
                  "term": "sea_water_pressure",
                  "vocabulary": "ccmm_global.cf_standard_names"
                }
              ],
              "data_type": "validation_flag_type",
              "repeated": false
            },
            {
              "name": "ph",
              "description": "Flag del nivel de ph",
              "names": [
                {
                  "term": "ph",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "ph",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "ph",
                  "vocabulary": "ccmm_global.english"
                },
                {
                  "term": "sea_water_ph_reported_on_total_scale",
                  "vocabulary": "ccmm_global.cf_standard_names"
                }
              ],
              "data_type": "validation_flag_type",
              "repeated": false
            },
            {
              "name": "oxigeno",
              "description": "Flag del nivel de oxígueno",
              "names": [
                {
                  "term": "oxígeno",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "oxíxeno",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "oxygen",
                  "vocabulary": "ccmm_global.english"
                },
                {
                  "term": "volume_fraction_of_oxygen_in_sea_water",
                  "vocabulary": "ccmm_global.cf_standard_names"
                }
              ],
              "data_type": "validation_flag_type",
              "repeated": false
            },
            {
              "name": "transmitancia",
              "description": "Flag de la transmitacia",
              "names": [
                {
                  "term": "transmitacia",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "transmitacia",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "transmittance",
                  "vocabulary": "ccmm_global.english"
                }
              ],
              "data_type": "validation_flag_type",
              "repeated": false
            },
            {
              "name": "irradiancia",
              "description": "Flag de la irradiancia",
              "names": [
                {
                  "term": "irradiancia",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "irradiancia",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "irradiance",
                  "vocabulary": "ccmm_global.english"
                }
              ],
              "data_type": "validation_flag_type",
              "repeated": false
            },
            {
              "name": "flourescencia_uv",
              "description": "Flag de la flourescencia_uv",
              "names": [
                {
                  "term": "flourescencia_uv",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "flourescencia_uv",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "fluorescence_uv",
                  "vocabulary": "ccmm_global.english"
                }
              ],
              "data_type": "validation_flag_type",
              "repeated": false
            },
            {
              "name": "flourescencia",
              "description": "Flag de la flourescencia",
              "names": [
                {
                  "term": "flourescencia",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "flourescencia",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "fluorescence",
                  "vocabulary": "ccmm_global.english"
                }
              ],
              "data_type": "validation_flag_type",
              "repeated": false
            },
            {
              "name": "densidad",
              "description": "Flag de la densidad",
              "names": [
                {
                  "term": "densidad",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "densidade",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "density",
                  "vocabulary": "ccmm_global.english"
                },
                {
                  "term": "sea_water_density",
                  "vocabulary": "ccmm_global.cf_standard_names"
                }
              ],
              "data_type": "validation_flag_type",
              "repeated": false
            },
            {
              "name": "profundidad",
              "description": "Flag de la profundidad",
              "names": [
                {
                  "term": "profundidad",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "profundidade",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "depth",
                  "vocabulary": "ccmm_global.english"
                },
                {
                  "term": "depth",
                  "vocabulary": "ccmm_global.cf_standard_names"
                }
              ],
              "data_type": "validation_flag_type",
              "repeated": false
            },
            {
              "name": "temperatura_ITS68",
              "description": "Flag de la temperatura ITS68",
              "names": [
                {
                  "term": "temperatura_ITS68",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "temperatura_ITS68",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "temperature_ITS68",
                  "vocabulary": "ccmm_global.english"
                },
                {
                  "term": "sea_water_temperature",
                  "vocabulary": "ccmm_global.cf_standard_names"
                }
              ],
              "data_type": "validation_flag_type",
              "repeated": false
            },
            {
              "name": "conductividad",
              "description": "Flag de la conductividad",
              "names": [
                {
                  "term": "conductividad",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "conductividade",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "conductivity",
                  "vocabulary": "ccmm_global.english"
                },
                {
                  "term": "sea_water_electrical_conductivity",
                  "vocabulary": "ccmm_global.cf_standard_names"
                }
              ],
              "data_type": "validation_flag_type",
              "repeated": false
            }
          ]
        }
      ]
    },
    {
      "name": "sensor",
      "description": "Metadatos almacenados para cada uno de los sensores.",
      "versions": [
        {
          "version": "default",
          "fields": [
            {
              "name": "id",
              "description": "Identificador del sensor",
              "data_type": "text",
              "repeated": false
            },
            {
              "name": "nombre",
              "description": "Nombre del sensor",
              "data_type": "text",
              "repeated": false
            },
            {
              "name": "numero_serie",
              "description": "Número de serie del sensor",
              "data_type": "text",
              "repeated": false
            },
            {
              "name": "fabricante",
              "description": "Fabricante del sensor",
              "data_type": "text",
              "repeated": false
            },
            {
              "name": "fecha_recepcion",
              "description": "Fecha de recepción del sensor",
              "data_type": "date",
              "repeated": false
            },
            {
              "name": "fecha_servicio",
              "description": "Fecha de puesta en servicio del sensor",
              "data_type": "date",
              "repeated": false
            },
            {
              "name": "periodo_calibracion",
              "description": "Período entre calibraciones",
              "data_type": "integer",
              "repeated": false
            },
            {
              "name": "periodo_mantenimiento",
              "description": "Período entre mantenimientos",
              "data_type": "integer",
              "repeated": false
            },
            {
              "name": "rango_medida",
              "description": "Rango de medida",
              "data_type": "text",
              "repeated": false
            },
            {
              "name": "rango_calibracion",
              "description": "Rango de calibración",
              "data_type": "text",
              "repeated": false
            },
            {
              "name": "division_escala",
              "description": "Escala de la medida",
              "data_type": "text",
              "repeated": false
            },
            {
              "name": "pnt_calibracion",
              "description": "Punto de calibración",
              "data_type": "text",
              "repeated": false
            },
            {
              "name": "pnt_mantenimiento",
              "description": "Punto de mantenimiento",
              "data_type": "text",
              "repeated": false
            }
          ]
        }
      ]
    },
    {
      "name": "equipo",
      "description": "Metadatos asociados al hardware de dispositivo ctd",
      "versions": [
        {
          "version": "default",
          "fields": [
            {
              "name": "id",
              "description": "Identificador del dispositivo",
              "data_type": "text",
              "repeated": false
            },
            {
              "name": "nombre",
              "description": "Nombre del dispositivo",
              "data_type": "text",
              "repeated": false
            },
            {
              "name": "fabricante",
              "description": "Fabricante del dispositivo",
              "data_type": "text",
              "repeated": false
            },
            {
              "name": "fecha_recepcion",
              "description": "Fecha de recepción",
              "data_type": "date",
              "repeated": false
            },
            {
              "name": "fecha_servicio",
              "description": "Fecha de puesta en servicio",
              "data_type": "date",
              "repeated": false
            },
            {
              "name": "periodo_mantenimiento",
              "description": "Período de mantenimiento",
              "data_type": "integer",
              "repeated": false
            },
            {
              "name": "pnt_mantenimiento",
              "description": "Punto de mantenimiento",
              "data_type": "text",
              "repeated": false
            },
            {
              "name": "responsable",
              "description": "responsable",
              "data_type": "text",
              "repeated": false
            }
          ]
        }
      ]
    }
  ],
  "feature_types": [
    {
      "name": "ria",
      "description": "Representa a cada ría en la que se toman medidas.",
      "names": [
        {
          "term": "Ría",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "Ría",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "Estuary",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "nombre",
          "description": "Nombre de la ría",
          "names": [
            {
              "term": "nombre",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nome",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "name",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "nombre_corto",
          "description": "Nombre corto de la ría",
          "names": [
            {
              "term": "nombre corto",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nome curto",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "short name",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "geo",
          "description": "Geometría de la ría",
          "names": [
            {
              "term": "geometría",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "xeometría",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "geometry",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "geometry(Polygon,4326)",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "zona",
          "description": "Zona a la que pertenece la ría",
          "names": [
            {
              "term": "zona",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "zona",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "zone",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        }
      ]
    }
  ],
  "spatial_sampling_feature_types": [
    {
      "name": "estacion",
      "description": "Punto dentro de la ría en el que se realizan perfiles",
      "names": [
        {
          "term": "estación",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "estación",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "station",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "codigo",
          "description": "Código de la estación",
          "names": [
            {
              "term": "codigo",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "codigo",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "code",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "nombre",
          "description": "Nombre de la estación",
          "names": [
            {
              "term": "nombre",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nome",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "name",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "descripcion",
          "description": "Descripción de la estación",
          "names": [
            {
              "term": "descripción",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "descrición",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "description",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        }
      ],
      "sampled_feature_type": "ria",
      "shape_type": "point",
      "shape_crs": "EPSG:4326",
      "height_type": "range",
      "height_crs": "EPSG:5831"
    }
  ],
  "process_types": [
    {
      "name": "configuracion_ctd",
      "description": "Proceso que genera perfiles ctd en puntos concretos dentro de las rías gallegas.",
      "names": [
        {
          "term": "configuración ctd",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "configuración ctd",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "ctd configuration",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "nombre",
          "description": "Nombre del dispositivo ctd",
          "names": [
            {
              "term": "nombre",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nome",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "name",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "equipo",
          "description": "Metadatos del hardware del ctd",
          "names": [
            {
              "term": "equipo",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "equipo",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "equipment",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "equipo",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "sensores",
          "description": "Metadatos de los sensores montados en el ctd",
          "names": [
            {
              "term": "sensores",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "sensores",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "sensors",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "sensor",
          "repeated": true,
          "scope": "valid_time_period"
        },
        {
          "name": "barco",
          "description": "Nombre del barco en el que se instala el ctd",
          "names": [
            {
              "term": "barco",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "barco",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "ship",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "valid_time_period"
        },
        {
          "name": "observaciones",
          "description": "Comentarios sobre el ctd en un determinado período",
          "names": [
            {
              "term": "observaciones",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "observacións",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "comments",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "valid_time_period"
        }
      ],
      "metadata_language": [
        "spa"
      ],
      "metadata_contact": [
        {
          "organisation_name": "Intecmar",
          "electronic_mail_address": "intecmar@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "metadata_date_stamp": "2025-03-19T00:00:00.000Z",
      "title": "Perfiles CTD generados por las camapañas de observación de Intecmar",
      "abstract": "En este conjunto de datos se almacenan los datos de los perfiles CTD que genera intecmar en las principales rías gallegas. Con una periodicidad aproximadamente semanal, salen barcos a las rías para realizar perfiles CTD en un conjunto específico de localizaciones (estaciones).",
      "identifier": "Intecmar-ctd",
      "point_of_contact": [
        {
          "organisation_name": "Intecmar",
          "electronic_mail_address": "intecmar@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "keywords": [
        {
          "keyword": "perfiles ctd",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "perfiles ctd",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "ctd profiles",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "galicia"
        },
        {
          "keyword": "oceano",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "ocean",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "mar",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "sea",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "specific_usage": "Not reported.",
      "user_contact": [
        {
          "organisation_name": "intecmar",
          "electronic_mail_address": "intecmar@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "use_limitation": "No se identifican limitaciones en el uso de estos datos.",
      "spatial_representation_type": "vector",
      "spatial_resolution": [
        5000
      ],
      "language": [
        "spa"
      ],
      "topic_category": [
        "environment",
        "geoscientificInformation",
        "oceans"
      ],
      "result_time_type": "instant",
      "phenomenon_time_type": "result_time",
      "shared_feature_of_interest_type": "estacion",
      "observed_properties": [
        {
          "name": "temperatura_ITS90",
          "description": "Temperatura del agua",
          "names": [
            {
              "term": "temperatura",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "temperatura",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "temperature",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "sea_water_temperature",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(ºC)",
          "repeated": false,
          "temporal_scope": "observation",
          "geospatial_scope": "observation",
          "height_scope": "discrete_coverage",
          "sampling_height_type": "point"
        },
        {
          "name": "salinidad",
          "description": "Salinidad del agua",
          "names": [
            {
              "term": "salinidad",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "salinidade",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "salinity",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "sea_water_salinity",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(null)",
          "repeated": false,
          "temporal_scope": "observation",
          "geospatial_scope": "observation",
          "height_scope": "discrete_coverage",
          "sampling_height_type": "point"
        },
        {
          "name": "presion",
          "description": "Presión del agua",
          "names": [
            {
              "term": "presión",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "presión",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "pressure",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "sea_water_pressure",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(db)",
          "repeated": false,
          "temporal_scope": "observation",
          "geospatial_scope": "observation",
          "height_scope": "discrete_coverage",
          "sampling_height_type": "point"
        },
        {
          "name": "ph",
          "description": "Ph del agua",
          "names": [
            {
              "term": "ph",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "ph",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "ph",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "sea_water_ph_reported_on_total_scale",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(null)",
          "repeated": false,
          "temporal_scope": "observation",
          "geospatial_scope": "observation",
          "height_scope": "discrete_coverage",
          "sampling_height_type": "point"
        },
        {
          "name": "oxigeno",
          "description": "Nivel de oxígeno del agua",
          "names": [
            {
              "term": "oxígeno",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "oxíxeno",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "oxygen",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "volume_fraction_of_oxygen_in_sea_water",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(ml/l)",
          "repeated": false,
          "temporal_scope": "observation",
          "geospatial_scope": "observation",
          "height_scope": "discrete_coverage",
          "sampling_height_type": "point"
        },
        {
          "name": "transmitancia",
          "description": "transmitacia del agua",
          "names": [
            {
              "term": "transmitacia",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "transmitacia",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "transmittance",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(%)",
          "repeated": false,
          "temporal_scope": "observation",
          "geospatial_scope": "observation",
          "height_scope": "discrete_coverage",
          "sampling_height_type": "point"
        },
        {
          "name": "irradiancia",
          "description": "Irradiancia del agua",
          "names": [
            {
              "term": "irradiancia",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "irradiancia",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "irradiance",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(quanta/cm2sec)",
          "repeated": false,
          "temporal_scope": "observation",
          "geospatial_scope": "observation",
          "height_scope": "discrete_coverage",
          "sampling_height_type": "point"
        },
        {
          "name": "flourescencia_uv",
          "description": "flourescencia_uv del agua",
          "names": [
            {
              "term": "flourescencia_uv",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flourescencia_uv",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "fluorescence_uv",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ug/l)",
          "repeated": false,
          "temporal_scope": "observation",
          "geospatial_scope": "observation",
          "height_scope": "discrete_coverage",
          "sampling_height_type": "point"
        },
        {
          "name": "flourescencia",
          "description": "flourescencia del agua",
          "names": [
            {
              "term": "flourescencia",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flourescencia",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "fluorescence",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(mg/m3)",
          "repeated": false,
          "temporal_scope": "observation",
          "geospatial_scope": "observation",
          "height_scope": "discrete_coverage",
          "sampling_height_type": "point"
        },
        {
          "name": "densidad",
          "description": "Densidad del agua",
          "names": [
            {
              "term": "densidad",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "densidad",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "density",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "sea_water_density",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(kg/m3)",
          "repeated": false,
          "temporal_scope": "observation",
          "geospatial_scope": "observation",
          "height_scope": "discrete_coverage",
          "sampling_height_type": "point"
        },
        {
          "name": "profundidad",
          "description": "Profundidad en la columna de agua",
          "names": [
            {
              "term": "profundidad",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "profundidad",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "depth",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "depth",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(m)",
          "repeated": false,
          "temporal_scope": "observation",
          "geospatial_scope": "observation",
          "height_scope": "discrete_coverage",
          "sampling_height_type": "point"
        },
        {
          "name": "temperatura_ITS68",
          "description": "temperatura ITS68",
          "names": [
            {
              "term": "temperatura_ITS68",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "temperatura_ITS68",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "temperature_ITS68",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "sea_water_temperature",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(ºC)",
          "repeated": false,
          "temporal_scope": "observation",
          "geospatial_scope": "observation",
          "height_scope": "discrete_coverage",
          "sampling_height_type": "point"
        },
        {
          "name": "conductividad",
          "description": "conductividad del agua",
          "names": [
            {
              "term": "conductividad",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "conductividad",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "conductivity",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "sea_water_electrical_conductivity",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(Siemens/m)",
          "repeated": false,
          "temporal_scope": "observation",
          "geospatial_scope": "observation",
          "height_scope": "discrete_coverage",
          "sampling_height_type": "point"
        },
        {
          "name": "validacion",
          "description": "Flags de validación de las propiedades medidas",
          "names": [
            {
              "term": "flags de validación",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flags de validación",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "validation flags",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "validation_flags_type",
          "repeated": false,
          "temporal_scope": "observation",
          "geospatial_scope": "observation",
          "height_scope": "discrete_coverage",
          "sampling_height_type": "point"
        }
      ]
    }
  ]
}');

-- VESSEL
SELECT lendas_deploy('{
  "schema": "vessel_sampling_ieo",
  "feature_types": [
    {
      "name": "observed_area",
      "description": "Zona del océano objeto de muestreo por las trayectorias de los barcos.",
      "names": [
        {
          "term": "area observada",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "área observada",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "observed area",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "nombre",
          "description": "nombre del área observada",
          "names": [
            {
              "term": "nombre",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nome",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "name",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "descripcion",
          "description": "Descripción de la zona observada",
          "names": [
            {
              "term": "descripción",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "descrición",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "description",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "geo",
          "description": "Geometría de la zona observada",
          "names": [
            {
              "term": "geometría",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "xeometría",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "geometry",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "geometry(Polygon,4326)",
          "repeated": false,
          "scope": "feature"
        }
      ]
    }
  ],
  "process_types": [
    {
      "name": "vessel",
      "description": "Embarcación equipada con dispositivos para capturar trayectorias de mediciones de temperatura, salinidad, fluorescencia, materia orgánica disuelta y turbidez. La velocidad y la aceleración de la embarcación también se registran en cada punto de la trayectoria.",
      "names": [
        {
          "term": "barco",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "barco",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "vessel",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "name",
          "description": "Nombre del buque",
          "names": [
            {
              "term": "nombre",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nome",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "name",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "equipment",
          "description": "Descripción textual del equipamiento de sensorizacion a bordo del buque",
          "names": [
            {
              "term": "equipamiento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "equipamento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "equipment",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "valid_time_period"
        }
      ],
      "metadata_language": [
        "spa"
      ],
      "metadata_contact": [
        {
          "organisation_name": "Instituto Español de Oceanografía (IEO).",
          "electronic_mail_address": "ieo.coruna@ieo.csic.es",
          "role": "resourceProvider"
        }
      ],
      "metadata_date_stamp": "2025-07-08T00:00:00.000Z",
      "title": "Muestreo a bordo de buque",
      "abstract": "Conjunto de datos con muestreos a bordo de buques que proporciona el Centro Oceanográfico de A Coruña del Instituto Español de Oceanografría. Se muestrea temperatura del agua, salinidad, materia orgánica disuelta y turbidez.",
      "identifier": "muestreo_busques_termosalinografos.",
      "point_of_contact": [
        {
          "organisation_name": "Instituto Español de Oceanografía (IEO)",
          "electronic_mail_address": "ieo.coruna@ieo.csic.es",
          "role": "resourceProvider"
        }
      ],
      "keywords": [
        {
          "keyword": "temperatura",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "temperatura",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "temperature",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "salinidad",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "salinidade",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "salinity",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "materia orgánica disuelta",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "materia orgánica disolta",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "dissolved organic matter",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "turbidez",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "turbidez",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "turbidity",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "oceano",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "oceano",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "ocean",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "agua de mar",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "auga de mar",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "sea water",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "trayectoria",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "traxectoria",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "trayectory",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "specific_usage": "Usado en general para labores de investigación por el IEO y por colaboradores.",
      "user_contact": [
        {
          "organisation_name": "Instituto Español de Oceanografía (IEO)",
          "electronic_mail_address": "ieo.coruna@ieo.csic.es",
          "role": "resourceProvider"
        }
      ],
      "use_limitation": "No se han definido limitaciones de forma específica. Se recomienda de todas formas contactar antes con el IEO.",
      "spatial_representation_type": "vector",
      "spatial_resolution": [
        25000
      ],
      "language": [
        "spa"
      ],
      "topic_category": [
        "climatorologyMeteorologyAtmosphere",
        "environment",
        "geoscientificInformation",
        "oceans"
      ],
      "result_time_type": "period",
      "phenomenon_time_type": "result_time",
      "generated_feature_of_interest_type": {
        "shape_type": "line",
        "shape_crs": "EPSG:4326",
        "sampled_feature_type": "observed_area"
      },
      "observed_properties": [
        {
          "name": "temperatura_090c",
          "description": "temperatura del agua",
          "names": [
            {
              "term": "temperatura",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "temperatura",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "temperature",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "sea_water_temperature",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(ºC)",
          "repeated": false,
          "temporal_scope": "discrete_coverage",
          "sampling_time_type": "instant",
          "geospatial_scope": "sample",
          "sampling_geometry_type": "point"
        },
        {
          "name": "salinidad",
          "description": "salinidad del agua",
          "names": [
            {
              "term": "salinidad",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "salinidade",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "salinity",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "sea_water_salinity",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(null)",
          "repeated": false,
          "temporal_scope": "discrete_coverage",
          "sampling_time_type": "instant",
          "geospatial_scope": "sample",
          "sampling_geometry_type": "point"
        },
        {
          "name": "flourescencia",
          "description": "flourescencia del agua",
          "names": [
            {
              "term": "flourescencia",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flourescencia",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "fluorescence",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(mg/m3)",
          "repeated": false,
          "temporal_scope": "discrete_coverage",
          "sampling_time_type": "instant",
          "geospatial_scope": "sample",
          "sampling_geometry_type": "point"
        },
        {
          "name": "materia_organica_disuelta",
          "description": "Cantidad de materia orgánica disuelta en el água (Chromophoric Dissolved Organic Matter - CDOM)",
          "names": [
            {
              "term": "materia orgánica disuelta cromófora",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "materia orgánica disolta cromófora",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "Chromophoric Dissolved Organic Matter",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "concentration_of_colored_dissolved_organic_matter_in_sea_water_expressed_as_equivalent_mass_fraction_of_quinine_sulfate_dihydrate",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(null)",
          "repeated": false,
          "temporal_scope": "discrete_coverage",
          "sampling_time_type": "instant",
          "geospatial_scope": "sample",
          "sampling_geometry_type": "point"
        },
        {
          "name": "turbidez",
          "description": "Turbidez del agua",
          "names": [
            {
              "term": "turbidez",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "turbidez",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "turbidity",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "sea_water_turbidity",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(null)",
          "repeated": false,
          "temporal_scope": "discrete_coverage",
          "sampling_time_type": "instant",
          "geospatial_scope": "sample",
          "sampling_geometry_type": "point"
        },
        {
          "name": "velocidad_buque",
          "description": "Velocidad del buque",
          "names": [
            {
              "term": "velocidad del buque",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "velocidade do buque",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "vessel speed",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(m s-1)",
          "repeated": false,
          "temporal_scope": "discrete_coverage",
          "sampling_time_type": "instant",
          "geospatial_scope": "sample",
          "sampling_geometry_type": "point"
        },
        {
          "name": "aceleracion_buque",
          "description": "Aceleración del buque",
          "names": [
            {
              "term": "aceleración del buque",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "aceleración do buque",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "vessel acceleration",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(m s-2)",
          "repeated": false,
          "temporal_scope": "discrete_coverage",
          "sampling_time_type": "instant",
          "geospatial_scope": "sample",
          "sampling_geometry_type": "point"
        }
      ]
    }
  ]
}');

-- ROMs
SELECT lendas_deploy('{
  "schema": "roms_meteogalicia",
  "complex_data_types": [
    {
      "name": "sea_water_velocity",
      "description": "Vector que representa las componentes de la corriente.",
      "names": [
        {
          "term": "Velocidad de la corriente",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "Velocidade da corrente",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "sea water velocity",
          "vocabulary": "ccmm_global.english"
        },
        {
          "term": "sea_water_velocity",
          "vocabulary": "ccmm_global.cf_standard_names"
        }
      ],
      "versions": [
        {
          "version": "default",
          "fields": [
            {
              "name": "u_momentum_component",
              "description": "Componente u del vector de corriente.",
              "names": [
                {
                  "term": "Componente u de la corriente",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "Componente u da corrente",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "sea water velocity u component",
                  "vocabulary": "ccmm_global.english"
                },
                {
                  "term": "eastward_sea_water_velocity",
                  "vocabulary": "ccmm_global.cf_standard_names"
                }
              ],
              "data_type": "measure(m/s)",
              "repeated": false
            },
            {
              "name": "v_momentum_component",
              "description": "Componente v de la corriente.",
              "names": [
                {
                  "term": "Componente v de la corriente",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "Componente v da corrente",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "sea water velocity v component",
                  "vocabulary": "ccmm_global.english"
                },
                {
                  "term": "northward_sea_water_velocity",
                  "vocabulary": "ccmm_global.cf_standard_names"
                }
              ],
              "data_type": "measure(m/s)",
              "repeated": false
            }
          ]
        }
      ]
    }
  ],
  "feature_types": [
    {
      "name": "region_interes_roms",
      "description": "Región espacial en la que se ejecuta el modelo ROMS.",
      "names": [
        {
          "term": "Región de interés ROMS",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "Rexión de interés ROMS",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "ROMS region of interest",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "nombre",
          "description": "Nombre de la región",
          "names": [
            {
              "term": "nombre",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nome",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "name",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "descripcion",
          "description": "Descripción de la región.",
          "names": [
            {
              "term": "descripcion",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "descrición",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "description",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "geo",
          "description": "Geometría de la región.",
          "names": [
            {
              "term": "descripcion",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "descrición",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "description",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        }
      ]
    }
  ],
  "spatial_sampling_feature_types": [
    {
      "name": "grid_modelo_roms",
      "description": "Grid que define el muestreo realizado por el modelo ROMS.",
      "names": [
        {
          "term": "Grid del modelo ROMS",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "Grid do modelo ROMS",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "ROMS model grid",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "sampled_feature_type": "region_interes_roms",
      "shape_type": "surface",
      "shape_crs": "EPSG:4326",
      "height_type": "range",
      "height_crs": "EPSG:5715"
    }
  ],
  "process_types": [
    {
      "name": "modelo_roms",
      "description": "Proceso del modelo ROMS",
      "names": [
        {
          "term": "modelo ROMS",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "modelo ROMS",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "ROMS model",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "nombre",
          "description": "Nombre asignado al proceso",
          "names": [
            {
              "term": "nombre",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nome",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "name",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "descripcion",
          "description": "Descripción textual del proceso.",
          "names": [
            {
              "term": "descripción",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "descrición",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "description",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        }
      ],
      "metadata_language": [
        "spa"
      ],
      "metadata_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "metadata_date_stamp": "2025-03-19T00:00:00.000Z",
      "title": "Resultados de la ejecución del modelo ROMS",
      "abstract": "En este conjunto de datos se almacenanan los resultados de la ejecución del modelo ROMS.",
      "identifier": "meteogalicia-roms",
      "point_of_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "keywords": [
        {
          "keyword": "modelo roms",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "modelo roms",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "roms model",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "galicia"
        },
        {
          "keyword": "oceano",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "ocean",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "mar",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "sea",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "specific_usage": "Not reported.",
      "user_contact": [
        {
          "organisation_name": "meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "use_limitation": "No se especifican limitaciones en el uso de estos datos.",
      "spatial_representation_type": "vector",
      "spatial_resolution": [
        1000
      ],
      "language": [
        "spa"
      ],
      "topic_category": [
        "environment",
        "geoscientificInformation",
        "oceans"
      ],
      "result_time_type": "instant",
      "phenomenon_time_type": "period",
      "shared_feature_of_interest_type": "grid_modelo_roms",
      "observed_properties": [
        {
          "name": "salinity",
          "description": "Salinidad del agua",
          "names": [
            {
              "term": "salinidad",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "salinidade",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "salinity",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "sea_water_salinity",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(psu)",
          "repeated": false,
          "sampling_time_type": "instant",
          "temporal_scope": "continuous_coverage",
          "sampling_geometry_type": "point",
          "geospatial_scope": "continuous_coverage",
          "height_scope": "discrete_coverage",
          "sampling_height_type": "point"
        },
        {
          "name": "potential_temperature",
          "description": "Temperatura potencial del agua",
          "names": [
            {
              "term": "temperatura potencial",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "temperatura potencial",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "potential temperature",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "sea_water_potential_temperature",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(ºC)",
          "repeated": false,
          "sampling_time_type": "instant",
          "temporal_scope": "continuous_coverage",
          "sampling_geometry_type": "point",
          "geospatial_scope": "continuous_coverage",
          "height_scope": "discrete_coverage",
          "sampling_height_type": "point"
        },
        {
          "name": "sea_water_velocity",
          "description": "Velocidad de la corriente del agua.",
          "names": [
            {
              "term": "velocidad de la corriente",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "velocidade da corriente",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "potential temperature",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "sea_water_velocity",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "sea_water_velocity",
          "repeated": false,
          "sampling_time_type": "instant",
          "temporal_scope": "continuous_coverage",
          "sampling_geometry_type": "point",
          "geospatial_scope": "continuous_coverage",
          "height_scope": "discrete_coverage",
          "sampling_height_type": "point"
        },
        {
          "name": "free_surface",
          "description": "Altura del nivel del mar sobre el geoide.",
          "names": [
            {
              "term": "Nivel del mar",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "Nivel do mar",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "Sea water elevation",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "sea_surface_height_above_geoid",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(m)",
          "repeated": false,
          "sampling_time_type": "instant",
          "temporal_scope": "continuous_coverage",
          "sampling_geometry_type": "point",
          "geospatial_scope": "continuous_coverage",
          "height_scope": "discrete_coverage",
          "sampling_height_type": "point"
        }
      ]
    }
  ]
}');

-- WRF
SELECT lendas_deploy('{
  "schema": "wrf_meteogalicia",
  "feature_types": [
    {
      "name": "region_interes_wrf",
      "description": "Región espacial en la que se ejecuta el modelo WRF.",
      "names": [
        {
          "term": "Región de interés WRF",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "Rexión de interés WRF",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "WRF region of interest",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "nombre",
          "description": "Nombre de la región",
          "names": [
            {
              "term": "nombre",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nome",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "name",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "descripcion",
          "description": "Descripción de la región.",
          "names": [
            {
              "term": "descripcion",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "descrición",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "description",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "geo",
          "description": "Geometría de la región.",
          "names": [
            {
              "term": "descripcion",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "descrición",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "description",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        }
      ]
    }
  ],
  "spatial_sampling_feature_types": [
    {
      "name": "grid_modelo_wrf",
      "description": "Grid que define el muestreo realizado por el modelo wrf.",
      "names": [
        {
          "term": "Grid del modelo WRF",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "Grid do modelo WRF",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "WRF model grid",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "sampled_feature_type": "region_interes_wrf",
      "shape_type": "surface",
      "shape_crs": "EPSG:4326"
    }
  ],
  "process_types": [
    {
      "name": "modelo_wrf",
      "description": "Proceso del modelo WRF",
      "names": [
        {
          "term": "modelo WRF",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "modelo WRF",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "WRF model",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "nombre",
          "description": "Nombre asignado al proceso",
          "names": [
            {
              "term": "nombre",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nome",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "name",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "descripcion",
          "description": "Descripción textual del proceso.",
          "names": [
            {
              "term": "descripción",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "descrición",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "description",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        }
      ],
      "metadata_language": [
        "spa"
      ],
      "metadata_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "metadata_date_stamp": "2025-03-19T00:00:00.000Z",
      "title": "Resultados de la ejecución del modelo WRF",
      "abstract": "En este conjunto de datos se almacenanan los resultados de la ejecución del modelo WRF.",
      "identifier": "meteogalicia-wrf",
      "point_of_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "keywords": [
        {
          "keyword": "modelo wrf",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "modelo wrf",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "wrf model",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "galicia"
        },
        {
          "keyword": "meteorología",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "meteorology",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "atmósfera",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "atmosphere",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "specific_usage": "Not reported.",
      "user_contact": [
        {
          "organisation_name": "meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "use_limitation": "No se especifican limitaciones en el uso de estos datos.",
      "spatial_representation_type": "vector",
      "spatial_resolution": [
        1000
      ],
      "language": [
        "spa"
      ],
      "topic_category": [
        "environment",
        "geoscientificInformation",
        "climatorologyMeteorologyAtmosphere"
      ],
      "result_time_type": "instant",
      "phenomenon_time_type": "period",
      "shared_feature_of_interest_type": "grid_modelo_wrf",
      "observed_properties": [
        {
          "name": "wind_direction",
          "description": "Dirección del viento",
          "names": [
            {
              "term": "dirección del viento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "dirección do vento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "wind direction",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "wind_from_direction",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(degrees)",
          "repeated": false,
          "sampling_time_type": "instant",
          "temporal_scope": "continuous_coverage",
          "sampling_geometry_type": "point",
          "geospatial_scope": "continuous_coverage"
        },
        {
          "name": "wind_speed",
          "description": "Velocidad del viento",
          "names": [
            {
              "term": "velocidad del viento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "velocidade do vento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "wind speed",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "wind_speed",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(m/s)",
          "repeated": false,
          "sampling_time_type": "instant",
          "temporal_scope": "continuous_coverage",
          "sampling_geometry_type": "point",
          "geospatial_scope": "continuous_coverage"
        },
        {
          "name": "air_pressure_at_sea_level",
          "description": "Presión atmosférica al nivel del mar",
          "names": [
            {
              "term": "presión a nivel del mar",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "presión a nivel do mar",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "Pressure at sea level",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "air_pressure_at_mean_sea_level",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(Pa)",
          "repeated": false,
          "sampling_time_type": "instant",
          "temporal_scope": "continuous_coverage",
          "sampling_geometry_type": "point",
          "geospatial_scope": "continuous_coverage"
        },
        {
          "name": "rainfall",
          "description": "Cantidad de precipitación",
          "names": [
            {
              "term": "precipitación",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "precipitación",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "Precipitation",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "precipitation_amount",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(kg/m2)",
          "repeated": false,
          "sampling_time_type": "instant",
          "temporal_scope": "continuous_coverage",
          "sampling_geometry_type": "point",
          "geospatial_scope": "continuous_coverage"
        },
        {
          "name": "relative_humidity",
          "description": "Humedad relativa",
          "names": [
            {
              "term": "humedad relativa",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "humidade relativa",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "relative humidity",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "relative_humidity",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(%)",
          "repeated": false,
          "sampling_time_type": "instant",
          "temporal_scope": "continuous_coverage",
          "sampling_geometry_type": "point",
          "geospatial_scope": "continuous_coverage"
        },
        {
          "name": "snowfall_amount",
          "description": "Cantidad de nieve caída",
          "names": [
            {
              "term": "nieve",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "neve",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "Snoowfall",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "stratiform_snowfall_amount",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(kg/m2)",
          "repeated": false,
          "sampling_time_type": "instant",
          "temporal_scope": "continuous_coverage",
          "sampling_geometry_type": "point",
          "geospatial_scope": "continuous_coverage"
        },
        {
          "name": "snow_level",
          "description": "Grosor del nivel de nieve",
          "names": [
            {
              "term": "grosor de la nieve",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "grosor da neve",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "Snow level",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "surface_snow_thickness",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(m)",
          "repeated": false,
          "sampling_time_type": "instant",
          "temporal_scope": "continuous_coverage",
          "sampling_geometry_type": "point",
          "geospatial_scope": "continuous_coverage"
        },
        {
          "name": "sea_surface_temperature",
          "description": "Temperatura de la superficie del mar",
          "names": [
            {
              "term": "temperatura del mar",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "temperatura do mar",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "Sea surface temperature",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "sea_surface_temperature",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(K)",
          "repeated": false,
          "sampling_time_type": "instant",
          "temporal_scope": "continuous_coverage",
          "sampling_geometry_type": "point",
          "geospatial_scope": "continuous_coverage"
        },
        {
          "name": "air_temperature",
          "description": "Temperatura del aire",
          "names": [
            {
              "term": "temperatura del aire",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "temperatura do aire",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "Air temperature",
              "vocabulary": "ccmm_global.english"
            },
            {
              "term": "air_temperature",
              "vocabulary": "ccmm_global.cf_standard_names"
            }
          ],
          "data_type": "measure(K)",
          "repeated": false,
          "sampling_time_type": "instant",
          "temporal_scope": "continuous_coverage",
          "sampling_geometry_type": "point",
          "geospatial_scope": "continuous_coverage"
        }
      ]
    }
  ]
}');

-- METEOSTATIONS
SELECT lendas_deploy('{
  "schema": "meteostations_meteogalicia",
  "enumeration_data_types": [
    {
      "name": "validation_flag_type",
      "description": "Data type that defines values for validation flags",
      "versions": [
        {
          "version": "default",
          "values": [
            {
              "vocabulary": "ccmm_global.castellano",
              "terms": [
                "Dato no validado",
                "Dato válido",
                "Dato dudoso",
                "Dato erróneo",
                "Dato acumulado",
                "Dato válido interpolado",
                "Dato no registrado"
              ]
            },
            {
              "vocabulary": "ccmm_global.galego",
              "terms": [
                "Dato non validado",
                "Dato válido",
                "Dato dubidoso",
                "Dato erróneo",
                "Dato acumulado",
                "Dato válido interpolado",
                "Dato non rexistrado"
              ]
            },
            {
              "vocabulary": "ccmm_global.english",
              "terms": [
                "Not validated data",
                "Valid data",
                "Dubious data",
                "Erroneous data",
                "Accumulated data",
                "Valid interpolated data",
                "Not registered data"
              ]
            }
          ]
        }
      ]
    }
  ],
  "feature_types": [
    {
      "name": "meteostations_region_of_interest",
      "description": "Region of the earth that is being sampled by the set of meteorological stations.",
      "names": [
        {
          "term": "region_de_interés_estaciones_meteorológicas",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "rexión_de_interese_estacións_meteorolóxicas",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "meteostations_region_of_interest",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "name",
          "description": "Name of the region of interest",
          "names": [
            {
              "term": "nombre",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nome",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "name",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "geo",
          "description": "Geometry of the region of interest",
          "names": [
            {
              "term": "geometría",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "xeometría",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "geometry",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "geometry(MULTIPOLYGON,4326)",
          "repeated": false,
          "scope": "feature"
        }
      ]
    },
    {
      "name": "meteostation",
      "description": "Metadata common to all the locations of sensors located in the same meteorológical station",
      "names": [
        {
          "term": "estación_meteorológica",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "estación_meteorolóxica",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "meteorological_station",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "code",
          "description": "Alphanumerical code of the meteorological station",
          "names": [
            {
              "term": "código",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "código",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "code",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "name",
          "description": "Name of the meteorológical station",
          "names": [
            {
              "term": "nombre",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nome",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "name",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "working_period",
          "description": "Period of time during which the meteorológical station was operative",
          "names": [
            {
              "term": "período_de_trabajo",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "período_de_traballo",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "working_period",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "daterange",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "location",
          "description": "Geospatial location of the meteorológical station",
          "names": [
            {
              "term": "localización",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "localización",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "location",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "geometry(point,4326)",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "location_height",
          "description": "Elevation above mean sea level at Alicante (EPSG:5782)",
          "names": [
            {
              "term": "altura_localización",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "altura_localización",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "location_height",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "real",
          "repeated": false,
          "scope": "feature"
        }
      ]
    }
  ],
  "spatial_sampling_feature_types": [
    {
      "name": "meteostation_sampling_location",
      "description": "Location of a sensor, including geospatial and vertical coordinates.",
      "names": [
        {
          "term": "localización_de_muestreo_estación_meteorológica",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "localización_de_mostraxe_estación_meteorolóxica",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "meteostation_sampling_location",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "references": [
        {
          "name": "station",
          "description": "Reference to the meteorológical station corresponding to this location.",
          "names": [
            {
              "term": "estación",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "estación",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "station",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "repeated": false,
          "referenced_type": "meteostation",
          "scope": "feature"
        }
      ],
      "sampled_feature_type": "meteostations_region_of_interest",
      "shape_type": "point",
      "shape_crs": "EPSG:4326",
      "height_type": "point",
      "height_crs": "EPSG:5782"
    }
  ],
  "process_types": [
    {
      "name": "snow_height_10minutes_process",
      "description": "Process that generates snow height measures with a temporal resolution of 10 minutes",
      "names": [
        {
          "term": "proceso_altura_nieve_10minutos",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "proceso_altura_neve_10minutos",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "snow_height_10minutes_process",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "metadata_language": [
        "eng"
      ],
      "metadata_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "metadata_date_stamp": "2025-12-16T00:00:00.000Z",
      "title": "Show height measures at stations every 10 minutes",
      "abstract": "This dataset records measures of snow height generated by meteorological sensors at the stations of meteogalicia. The temporal resolution is 10 minutes",
      "identifier": "meteogalicia_stations_snow_height_10minutes",
      "point_of_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "keywords": [
        {
          "keyword": "nieve",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "neve",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "snow",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "meteorología",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "meteoroloxía",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "meteorology",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "specific_usage": "This dataset might be used as a ground truth for snow height measures at specific points.",
      "user_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "use_limitation": "This data may only be used for technology testing at COGRADE.",
      "spatial_representation_type": "vector",
      "spatial_resolution": [
        500
      ],
      "language": [
        "eng"
      ],
      "topic_category": [
        "environment",
        "geoscientificInformation",
        "climatorologyMeteorologyAtmosphere"
      ],
      "result_time_type": "instant",
      "phenomenon_time_type": "result_time",
      "platform": {
        "feature_type": "meteostation_sampling_location",
        "scope": "feature"
      },
      "shared_feature_of_interest_type": "meteostation_sampling_location",
      "observed_properties": [
        {
          "name": "snow_height",
          "description": "Snow height",
          "names": [
            {
              "term": "altura_nieve",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "altura_neve",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "snow_height",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(cm)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "snow_height_validation_flag",
          "description": "Validation flag for snow height",
          "names": [
            {
              "term": "flag_validación_altura_nieve",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flag_validación_altura_neve",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "snow_height_validation_flag",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "validation_flag_type",
          "repeated": false,
          "temporal_scope": "observation"
        }
      ]
    },
    {
      "name": "wind_10minutes_process",
      "description": "Process that generates wind measures with a temporal resolution of 10 minutes",
      "names": [
        {
          "term": "proceso_viento_10minutos",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "proceso_vento_10minutos",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "wind_10minutes_process",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "metadata_language": [
        "eng"
      ],
      "metadata_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "metadata_date_stamp": "2025-12-16T00:00:00.000Z",
      "title": "Wind measures at stations every 10 minutes",
      "abstract": "This dataset records measures of wind generated by meteorological sensors at the stations of meteogalicia. The temporal resolution is 10 minutes",
      "identifier": "meteogalicia_stations_wind_10minutes",
      "point_of_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "keywords": [
        {
          "keyword": "viento",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "vento",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "wind",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "meteorología",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "meteoroloxía",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "meteorology",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "specific_usage": "This dataset might be used as a ground truth for wind measures at specific points.",
      "user_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "use_limitation": "This data may only be used for technology testing at COGRADE.",
      "spatial_representation_type": "vector",
      "spatial_resolution": [
        500
      ],
      "language": [
        "eng"
      ],
      "topic_category": [
        "environment",
        "geoscientificInformation",
        "climatorologyMeteorologyAtmosphere"
      ],
      "result_time_type": "instant",
      "phenomenon_time_type": "result_time",
      "platform": {
        "feature_type": "meteostation_sampling_location",
        "scope": "feature"
      },
      "shared_feature_of_interest_type": "meteostation_sampling_location",
      "observed_properties": [
        {
          "name": "wind_direction",
          "description": "Wind direction",
          "names": [
            {
              "term": "dirección_viento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "dirección_vento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "wind_direction",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(degrees)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "wind_direction_validation_flag",
          "description": "Validation flag for wind direction",
          "names": [
            {
              "term": "flag_validación_dirección_viento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flag_validación_dirección_vento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "wind_direction_validation_flag",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "validation_flag_type",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "wind_speed",
          "description": "Wind speed",
          "names": [
            {
              "term": "velocidad_viento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "velocidade_vento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "wind_speed",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(m/s)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "wind_speed_validation_flag",
          "description": "Validation flag for wind speed",
          "names": [
            {
              "term": "flag_validación_velocidad_viento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flag_validación_velocidade_vento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "wind_speed_validation_flag",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "validation_flag_type",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "wind_gust_direction",
          "description": "Wind gust direction",
          "names": [
            {
              "term": "dirección_ráfaga_viento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "dirección_refacho_vento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "wind_gust_direction",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(degrees)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "wind_gust_direction_validation_flag",
          "description": "Validation flag for wind gust direction",
          "names": [
            {
              "term": "flag_validación_dirección_ráfaga_viento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flag_validación_dirección_refacho_vento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "wind_gust_direction_validation_flag",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "validation_flag_type",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "wind_gust_speed",
          "description": "Wind gust speed",
          "names": [
            {
              "term": "velocidad_ráfaga_viento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "velocidade_refacho_vento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "wind_gust_speed",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(m/s)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "wind_gust_speed_validation_flag",
          "description": "Validation flag for wind gust speed",
          "names": [
            {
              "term": "flag_validación_velocidad_ráfaga_viento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flag_validación_velocidade_refacho_vento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "wind_gust_speed_validation_flag",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "validation_flag_type",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "wind_direction_standard_deviation",
          "description": "Standard deviation of the wind direction during the 10 minutes period",
          "names": [
            {
              "term": "desviación_estándar_dirección_viento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "desviacion_estándar_dirección_vento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "wind_direction_standard_deviation",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(degrees)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "wind_direction_standard_deviation_validation_flag",
          "description": "Validation flag for wind direction standard deviation",
          "names": [
            {
              "term": "flag_validación_desviación_estándar_dirección_viento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flag_validación_desviación_estándar_dirección_vento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "wind_direction_standard_deviation_validation_flag",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "validation_flag_type",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "wind_speed_standard_deviation",
          "description": "Standard deviation of the wind speed during the 10 minutes period",
          "names": [
            {
              "term": "desviación_estándar_velocidad_viento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "desviacion_estándar_velocidade_vento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "wind_speed_standard_deviation",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(m/s)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "wind_speed_standard_deviation_validation_flag",
          "description": "Validation flag for wind speed standard deviation",
          "names": [
            {
              "term": "flag_validación_desviación_estándar_velocidad_viento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flag_validación_desviación_estándar_velocidade_vento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "wind_speed_standard_deviation_validation_flag",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "validation_flag_type",
          "repeated": false,
          "temporal_scope": "observation"
        }
      ]
    },
    {
      "name": "precipitation_10minutes_process",
      "description": "Process that generates precipitation measures with a temporal resolution of 10 minutes",
      "names": [
        {
          "term": "proceso_precipitación_10minutos",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "proceso_precipitación_10minutos",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "precipitation_10minutes_process",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "metadata_language": [
        "eng"
      ],
      "metadata_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "metadata_date_stamp": "2025-12-16T00:00:00.000Z",
      "title": "Precipitation measures at stations every 10 minutes",
      "abstract": "This dataset records measures of precipitation generated by meteorological sensors at the stations of meteogalicia. The temporal resolution is 10 minutes",
      "identifier": "meteogalicia_stations_precipitation_10minutes",
      "point_of_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "keywords": [
        {
          "keyword": "precipitación",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "precipitación",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "precipitation",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "lluvia",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "choiva",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "rain",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "meteorología",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "meteoroloxía",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "meteorology",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "specific_usage": "This dataset might be used as a ground truth for precipitación measures at specific points.",
      "user_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "use_limitation": "This data may only be used for technology testing at COGRADE.",
      "spatial_representation_type": "vector",
      "spatial_resolution": [
        500
      ],
      "language": [
        "eng"
      ],
      "topic_category": [
        "environment",
        "geoscientificInformation",
        "climatorologyMeteorologyAtmosphere"
      ],
      "result_time_type": "instant",
      "phenomenon_time_type": "result_time",
      "platform": {
        "feature_type": "meteostation_sampling_location",
        "scope": "feature"
      },
      "shared_feature_of_interest_type": "meteostation_sampling_location",
      "observed_properties": [
        {
          "name": "rainfall",
          "description": "Rainfall accumulated during the 10 minutes period",
          "names": [
            {
              "term": "lluvia",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "choiva",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "rainfall",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(L/m2)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "rainfall_validation_flag",
          "description": "Validation flag for rainfall",
          "names": [
            {
              "term": "flag_validación_lluvia",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flag_validación_lluvia",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "rainfall_validation_flag",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "validation_flag_type",
          "repeated": false,
          "temporal_scope": "observation"
        }
      ]
    },
    {
      "name": "pressure_10minutes_process",
      "description": "Process that generates pressure measures with a temporal resolution of 10 minutes",
      "names": [
        {
          "term": "proceso_presión_10minutos",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "proceso_presión_10minutos",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "pressure_10minutes_process",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "metadata_language": [
        "eng"
      ],
      "metadata_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "metadata_date_stamp": "2025-12-16T00:00:00.000Z",
      "title": "Pressure measures at stations every 10 minutes",
      "abstract": "This dataset records measures of pressure generated by meteorological sensors at the stations of meteogalicia. The temporal resolution is 10 minutes",
      "identifier": "meteogalicia_stations_pressure_10minutes",
      "point_of_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "keywords": [
        {
          "keyword": "presión",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "presión",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "pressure",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "meteorología",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "meteoroloxía",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "meteorology",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "specific_usage": "This dataset might be used as a ground truth for pressure measures at specific points.",
      "user_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "use_limitation": "This data may only be used for technology testing at COGRADE.",
      "spatial_representation_type": "vector",
      "spatial_resolution": [
        500
      ],
      "language": [
        "eng"
      ],
      "topic_category": [
        "environment",
        "geoscientificInformation",
        "climatorologyMeteorologyAtmosphere"
      ],
      "result_time_type": "instant",
      "phenomenon_time_type": "result_time",
      "platform": {
        "feature_type": "meteostation_sampling_location",
        "scope": "feature"
      },
      "shared_feature_of_interest_type": "meteostation_sampling_location",
      "observed_properties": [
        {
          "name": "barometric_pressure",
          "description": "Barometric pressure during the 10 minutes period",
          "names": [
            {
              "term": "presión_barométrica",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "presión_barométrica",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "barometric_pressure",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(hPa)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "barometric_pressure_validation_flag",
          "description": "Validation flag for barometric pressure",
          "names": [
            {
              "term": "flag_validación_presión_barométrica",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flag_validación_presión_barométrica",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "barometric_pressure_validation_flag",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "validation_flag_type",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "sea_level_reduced_pressure",
          "description": "Sea level reduced pressure during the 10 minutes period",
          "names": [
            {
              "term": "presión_reducida_a_nivel_del_mar",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "presión_reducida_ao_nivel_do_mar",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "sea_level_reduced_pressure",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(hPa)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "sea_level_reduced_pressure_validation_flag",
          "description": "Validation flag for sea level reduced pressure",
          "names": [
            {
              "term": "flag_validación_presión_reducida_al_nivel_del_mar",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flag_validación_presión_reducida_ao_nivel_do_mar",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "sea_level_reduced_pressure_validation_flag",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "validation_flag_type",
          "repeated": false,
          "temporal_scope": "observation"
        }
      ]
    },
    {
      "name": "solar_radiation_10minutes_process",
      "description": "Process that generates solar radiation measures with a temporal resolution of 10 minutes",
      "names": [
        {
          "term": "proceso_radiación_solar_10minutos",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "proceso_radiación_solar_10minutos",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "solar_radiation_10minutes_process",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "metadata_language": [
        "eng"
      ],
      "metadata_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "metadata_date_stamp": "2025-12-16T00:00:00.000Z",
      "title": "Solar radiation measures at stations every 10 minutes",
      "abstract": "This dataset records measures of solar radiation generated by meteorological sensors at the stations of meteogalicia. The temporal resolution is 10 minutes",
      "identifier": "meteogalicia_stations_solar_radiation_10minutes",
      "point_of_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "keywords": [
        {
          "keyword": "radiación solar",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "radiación solar",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "solar radiation",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "meteorología",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "meteoroloxía",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "meteorology",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "specific_usage": "This dataset might be used as a ground truth for solar radiation measures at specific points.",
      "user_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "use_limitation": "This data may only be used for technology testing at COGRADE.",
      "spatial_representation_type": "vector",
      "spatial_resolution": [
        500
      ],
      "language": [
        "eng"
      ],
      "topic_category": [
        "environment",
        "geoscientificInformation",
        "climatorologyMeteorologyAtmosphere"
      ],
      "result_time_type": "instant",
      "phenomenon_time_type": "result_time",
      "platform": {
        "feature_type": "meteostation_sampling_location",
        "scope": "feature"
      },
      "shared_feature_of_interest_type": "meteostation_sampling_location",
      "observed_properties": [
        {
          "name": "sunshine_duration",
          "description": "Sunshine duration during the 10 minutes period",
          "names": [
            {
              "term": "horas_de_sol",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "horas_de_sol",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "sunshine_duration",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(h)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "sunshine_duration_validation_flag",
          "description": "Validation flag for sunshine duration",
          "names": [
            {
              "term": "flag_validación_horas_de_sol",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flag_validación_horas_de_sol",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "sunshine_duration_validation_flag",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "validation_flag_type",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "global_solar_radiation",
          "description": "Global solar radiation during the 10 minutes period",
          "names": [
            {
              "term": "radiación_solar_global",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "radiación_solar_global",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "global_solar_radiation",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(W/m2)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "global_solar_radiation_validation_flag",
          "description": "Validation flag for global solar radiation",
          "names": [
            {
              "term": "flag_validación_radiación_solar_global",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flag_validación_radiación_solar_global",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "global_solar_radiation_validation_flag",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "validation_flag_type",
          "repeated": false,
          "temporal_scope": "observation"
        }
      ]
    },
    {
      "name": "temperature_humidity_10minutes_process",
      "description": "Process that generates temperature and humidity measures with a temporal resolution of 10 minutes",
      "names": [
        {
          "term": "proceso_temperatura_humedad_10minutos",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "proceso_temperatura_humidade_10minutos",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "temperature_humidity_10minutes_process",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "metadata_language": [
        "eng"
      ],
      "metadata_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "metadata_date_stamp": "2025-12-16T00:00:00.000Z",
      "title": "Temperature and humidity measures at stations every 10 minutes",
      "abstract": "This dataset records measures of temperature and humidity generated by meteorological sensors at the stations of meteogalicia. The temporal resolution is 10 minutes",
      "identifier": "meteogalicia_stations_temperature_humidity_10minutes",
      "point_of_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "keywords": [
        {
          "keyword": "temperatura",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "temperatura",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "temperature",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "humedad",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "humidade",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "humidity",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "meteorología",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "meteoroloxía",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "meteorology",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "specific_usage": "This dataset might be used as a ground truth for temperature and humidity measures at specific points.",
      "user_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "use_limitation": "This data may only be used for technology testing at COGRADE.",
      "spatial_representation_type": "vector",
      "spatial_resolution": [
        500
      ],
      "language": [
        "eng"
      ],
      "topic_category": [
        "environment",
        "geoscientificInformation",
        "climatorologyMeteorologyAtmosphere"
      ],
      "result_time_type": "instant",
      "phenomenon_time_type": "result_time",
      "platform": {
        "feature_type": "meteostation_sampling_location",
        "scope": "feature"
      },
      "shared_feature_of_interest_type": "meteostation_sampling_location",
      "observed_properties": [
        {
          "name": "relative_humidity",
          "description": "Relative humidity during the 10 minutes period",
          "names": [
            {
              "term": "humedad_relativa",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "humidade_relativa",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "relative_humidity",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(%)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "relative_humidity_validation_flag",
          "description": "Validation flag for relative humidity",
          "names": [
            {
              "term": "flag_validación_humedad_relativa",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flag_validación_humidade_relativa",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "relative_humidity_validation_flag",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "validation_flag_type",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "mean_air_temperature",
          "description": "Mean air temperature during the 10 minutes period",
          "names": [
            {
              "term": "temperatura_del_aire_media",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "temperatura_do_aire_media",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "mean_air_temperature",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ºC)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "mean_air_temperature_validation_flag",
          "description": "Validation flag for mean air temperature",
          "names": [
            {
              "term": "flag_validación_temperatura_media_aire",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flag_validación_temperatura_media_aire",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "mean_air_temperature_validation_flag",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "validation_flag_type",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "dew_temperature",
          "description": "Dew temperature during the 10 minutes period",
          "names": [
            {
              "term": "temperatura_del_rocío",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "temperatura_do_orballo",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "dew_temperature",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ºC)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "dew_temperature_validation_flag",
          "description": "Validation flag for dew temperature",
          "names": [
            {
              "term": "flag_validación_temperatura_del_rocío",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flag_validación_temperatura_do_orballo",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "dew_temperature_validation_flag",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "validation_flag_type",
          "repeated": false,
          "temporal_scope": "observation"
        }
      ]
    },
    {
      "name": "surface_temperature_10minutes_process",
      "description": "Process that generates surface temperature measures with a temporal resolution of 10 minutes",
      "names": [
        {
          "term": "proceso_temperatura_superficie_10minutos",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "proceso_temperatura_superficie_10minutos",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "surface_temperature_10minutes_process",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "metadata_language": [
        "eng"
      ],
      "metadata_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "metadata_date_stamp": "2025-12-16T00:00:00.000Z",
      "title": "Surface temperature measures at stations every 10 minutes",
      "abstract": "This dataset records measures of surface temperature generated by meteorological sensors at the stations of meteogalicia. The temporal resolution is 10 minutes",
      "identifier": "meteogalicia_stations_surface_temperature_10minutes",
      "point_of_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "keywords": [
        {
          "keyword": "temperatura",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "temperatura",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "temperature",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "suelo",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "chan",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "soil",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "meteorología",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "meteoroloxía",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "meteorology",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "specific_usage": "This dataset might be used as a ground truth for surface temperature measures at specific points.",
      "user_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "use_limitation": "This data may only be used for technology testing at COGRADE.",
      "spatial_representation_type": "vector",
      "spatial_resolution": [
        500
      ],
      "language": [
        "eng"
      ],
      "topic_category": [
        "environment",
        "geoscientificInformation",
        "climatorologyMeteorologyAtmosphere"
      ],
      "result_time_type": "instant",
      "phenomenon_time_type": "result_time",
      "platform": {
        "feature_type": "meteostation_sampling_location",
        "scope": "feature"
      },
      "shared_feature_of_interest_type": "meteostation_sampling_location",
      "observed_properties": [
        {
          "name": "mean_air_temperature",
          "description": "Mean air temperature during the 10 minutes period",
          "names": [
            {
              "term": "temperatura_del_aire_media",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "temperatura_do_aire_media",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "mean_air_temperature",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ºC)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "mean_air_temperature_validation_flag",
          "description": "Validation flag for mean air temperature",
          "names": [
            {
              "term": "flag_validación_temperatura_media_aire",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flag_validación_temperatura_media_aire",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "mean_air_temperature_validation_flag",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "validation_flag_type",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "soil_temperature",
          "description": "Soil temperature during the 10 minutes period",
          "names": [
            {
              "term": "temperatura_del_suelo",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "temperatura_do_chan",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "soil_temperature",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ºC)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "soil_temperature_validation_flag",
          "description": "Validation flag for soil temperature",
          "names": [
            {
              "term": "flag_validación_temperatura_del_suelo",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "flag_validación_temperatura_do_chan",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "soil_temperature_validation_flag",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "validation_flag_type",
          "repeated": false,
          "temporal_scope": "observation"
        }
      ]
    }
  ]
}');

-- AIR_QUALITY
SELECT lendas_deploy('{
  "schema": "air_quality",
  "enumeration_data_types": [
    {
      "name": "sensor_low_cost_status",
      "description": "Status that may have a low cost sensor",
      "names": [
        {
          "term": "estado_sensor_bajo_coste",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "estado_sensor_baixo_custo",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "sensor_low_cost_status",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "versions": [
        {
          "version": "default",
          "values": [
            {
              "vocabulary": "ccmm_global.castellano",
              "terms": [
                "desconectado",
                "calibración",
                "funcionando"
              ]
            },
            {
              "vocabulary": "ccmm_global.galego",
              "terms": [
                "desconectado",
                "calibración",
                "funcionando"
              ]
            },
            {
              "vocabulary": "ccmm_global.english",
              "terms": [
                "offline",
                "calibration",
                "running"
              ]
            }
          ]
        }
      ]
    }
  ],
  "complex_data_types": [
    {
      "name": "sensor_calibration_algorithm",
      "description": "Metadata that describes an algorithm or method used to transform raw measures of sensors to result air quality concentrations",
      "names": [
        {
          "term": "algoritmo_calibración_sensor",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "algoritmo_calibración_sensor",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "sensor_calibration_algorithm",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "versions": [
        {
          "version": "default",
          "fields": [
            {
              "name": "model_name",
              "description": "Name of the model used for the calibration",
              "names": [
                {
                  "term": "nombre_modelo",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "nome_modelo",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "model_name",
                  "vocabulary": "ccmm_global.english"
                }
              ],
              "data_type": "text",
              "repeated": false
            },
            {
              "name": "training_start",
              "description": "Start of the period during which the model was trainned",
              "names": [
                {
                  "term": "inicio_entrenamiento",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "inicio_entrenamento",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "training_start",
                  "vocabulary": "ccmm_global.english"
                }
              ],
              "data_type": "timestamp",
              "repeated": false
            },
            {
              "name": "training_end",
              "description": "End of the period during which the model was trainned",
              "names": [
                {
                  "term": "fin_entrenamiento",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "fin_entrenamento",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "training_end",
                  "vocabulary": "ccmm_global.english"
                }
              ],
              "data_type": "timestamp",
              "repeated": false
            },
            {
              "name": "regression_variables",
              "description": "Names of variables used for the regression",
              "names": [
                {
                  "term": "varibales_regresión",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "variables_regresión",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "regression_variables",
                  "vocabulary": "ccmm_global.english"
                }
              ],
              "data_type": "text",
              "repeated": false
            },
            {
              "name": "note",
              "description": "Comments added to define additional semantics related to the calibration model",
              "names": [
                {
                  "term": "notas",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "notas",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "note",
                  "vocabulary": "ccmm_global.english"
                }
              ],
              "data_type": "text",
              "repeated": false
            },
            {
              "name": "python_library",
              "description": "Name of the python library used to implement the model",
              "names": [
                {
                  "term": "biblioteca_python",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "biblioteca_python",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "python_library",
                  "vocabulary": "ccmm_global.english"
                }
              ],
              "data_type": "text",
              "repeated": false
            },
            {
              "name": "legal_station",
              "description": "Identifier of the legal station that generated the input for the trainning",
              "names": [
                {
                  "term": "estación_legal",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "estación_legal",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "legal_station",
                  "vocabulary": "ccmm_global.english"
                }
              ],
              "data_type": "integer",
              "repeated": false
            },
            {
              "name": "info",
              "description": "Additional information and parameters used to implement the calibratio method",
              "names": [
                {
                  "term": "info",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "info",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "info",
                  "vocabulary": "ccmm_global.english"
                }
              ],
              "data_type": "json",
              "repeated": false
            }
          ]
        }
      ]
    },
    {
      "name": "2d_integer_vector",
      "description": "Data type used to represent vectors with integer coordinates in a discrete 2d space.",
      "names": [
        {
          "term": "vector_enteros_2d",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "vector_enteiros_2d",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "2d_integer_vector",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "versions": [
        {
          "version": "default",
          "fields": [
            {
              "name": "x",
              "description": "Coordinate in the x axis.",
              "names": [
                {
                  "term": "coordenada_x",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "coordenada_x",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "x_coordinate",
                  "vocabulary": "ccmm_global.english"
                }
              ],
              "data_type": "integer",
              "repeated": false
            },
            {
              "name": "y",
              "description": "Coordinate in the y axis.",
              "names": [
                {
                  "term": "coordenada_y",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "coordenada_y",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "y_coordinate",
                  "vocabulary": "ccmm_global.english"
                }
              ],
              "data_type": "integer",
              "repeated": false
            }
          ]
        }
      ]
    },
    {
      "name": "2d_real_vector",
      "description": "Data type used to represent vectors with real coordinates in a continuous 2d space.",
      "names": [
        {
          "term": "vector_reales_2d",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "vector_reais_2d",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "2d_real_vector",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "versions": [
        {
          "version": "default",
          "fields": [
            {
              "name": "x",
              "description": "Coordinate in the x axis.",
              "names": [
                {
                  "term": "coordenada_x",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "coordenada_x",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "x_coordinate",
                  "vocabulary": "ccmm_global.english"
                }
              ],
              "data_type": "real",
              "repeated": false
            },
            {
              "name": "y",
              "description": "Coordinate in the y axis.",
              "names": [
                {
                  "term": "coordenada_y",
                  "vocabulary": "ccmm_global.castellano"
                },
                {
                  "term": "coordenada_y",
                  "vocabulary": "ccmm_global.galego"
                },
                {
                  "term": "y_coordinate",
                  "vocabulary": "ccmm_global.english"
                }
              ],
              "data_type": "real",
              "repeated": false
            }
          ]
        }
      ]
    }
  ],
  "feature_types": [
    {
      "name": "city",
      "description": "City where traffic and air quality is monitored and predicted",
      "names": [
        {
          "term": "ciudad",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "cidade",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "city",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "name",
          "description": "Name of the city",
          "names": [
            {
              "term": "nombre",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nome",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "name",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "geo",
          "description": "Geometry of the city",
          "names": [
            {
              "term": "geometría",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "xeometría",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "geometry",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "geometry(POLYGON,4326)",
          "repeated": false,
          "scope": "feature"
        }
      ]
    }
  ],
  "spatial_sampling_feature_types": [
    {
      "name": "aq_legal_station",
      "description": "Air quality station compliant with ISO standards that enble the legal use of the measures.",
      "names": [
        {
          "term": "estacion_calidade_aire_legal",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "estacion_calidade_aire_legal",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "air_quality_legal_station",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "name",
          "description": "Name of the air quality station",
          "names": [
            {
              "term": "nombre",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nome",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "name",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "description",
          "description": "description of the air quality station",
          "names": [
            {
              "term": "descripción",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "descrición",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "description",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        }
      ],
      "sampled_feature_type": "city",
      "shape_type": "point",
      "shape_crs": "EPSG:4326"
    },
    {
      "name": "sensor_low_cost_feature",
      "description": "Location defined to place low cost sensors to achive a sampling of the city.",
      "names": [
        {
          "term": "entidad_sensor_bajo_coste",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "entidade_sensor_baixo_custo",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "sensor_low_cost_feature",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "code",
          "description": "Textual code assigned to the feature.",
          "names": [
            {
              "term": "codigo",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "codigo",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "code",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "note",
          "description": "Comments that provide additional semantics about the feature location.",
          "names": [
            {
              "term": "anotaciones",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "anotacións",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "annotations",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "location",
          "description": "Textual description of the feature location.",
          "names": [
            {
              "term": "localización",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "localización",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "location",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        }
      ],
      "references": [
        {
          "name": "legal_station",
          "description": "References the air quality legal station that which is in the same location",
          "repeated": false,
          "referenced_type": "aq_legal_station",
          "scope": "feature"
        }
      ],
      "sampled_feature_type": "city",
      "shape_type": "point",
      "shape_crs": "EPSG:4326"
    },
    {
      "name": "air_quality_model_grid",
      "description": "Grid used for the generation of air quality model outputs",
      "names": [
        {
          "term": "grid_modelo_calidad_aire",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "grid_modelo_calidade_aire",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "air_quality_model_grid",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "grid_origin",
          "description": "Point that defines the bottom left corner of the grid.",
          "names": [
            {
              "term": "origen_grid",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "orixe_grid",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "grid_origin",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "geometry(point,32629)",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "grid_res",
          "description": "Vector of resolutions",
          "names": [
            {
              "term": "resolución_grid",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "resolución_grid",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "grid_resolution",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "2d_real_vector",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "grid_size",
          "description": "Vector of grid sizes in number of cells.",
          "names": [
            {
              "term": "tamaño_grid",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "tamaño_grid",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "grid_size",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "2d_integer_vector",
          "repeated": false,
          "scope": "feature"
        }
      ],
      "sampled_feature_type": "city",
      "shape_type": "surface",
      "shape_crs": "EPSG:4326"
    }
  ],
  "process_types": [
    {
      "name": "aq_legal_station_process",
      "description": "Process that generates air quality measures at the location of an aq_legal_station",
      "names": [
        {
          "term": "proceso_estacion_legal_calidad_aire",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "proceso_estacion_legal_calidade_aire",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "air_quality_legal_station_process",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "metadata_language": [
        "eng"
      ],
      "metadata_contact": [
        {
          "organisation_name": "Universidade de Santiago de Compostela",
          "electronic_mail_address": "jrr.viqueira@usc.es",
          "role": "principalInvestigator"
        }
      ],
      "metadata_date_stamp": "2025-12-16T00:00:00.000Z",
      "title": "Legal air quality measures obtained from air quality stations during the TRAFAIR project",
      "abstract": "This dataset records all the data obtained from air quality stations collected during the TRAFAIR project at the involved cities. The data was used to train machine learning models that generated air quality measures from low cost sensor raw data.",
      "identifier": "trafair_air_quality_legal_station_data",
      "point_of_contact": [
        {
          "organisation_name": "Universidade de Santiago de Compostela",
          "electronic_mail_address": "jrr.viqueira@usc.es",
          "role": "principalInvestigator"
        }
      ],
      "keywords": [
        {
          "keyword": "calidad aire",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "calidade aire",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "air quality",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "polución",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "polución",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "pollution",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "specific_usage": "This dataset might be used as a ground truth for air quality measures at specific points.",
      "user_contact": [
        {
          "organisation_name": "Universidade de Santiago de Compostela",
          "electronic_mail_address": "jrr.viqueira@usc.es",
          "role": "principalInvestigator"
        }
      ],
      "use_limitation": "This data may only be used for scientific purposes.",
      "spatial_representation_type": "vector",
      "spatial_resolution": [
        500
      ],
      "language": [
        "eng"
      ],
      "topic_category": [
        "environment",
        "geoscientificInformation",
        "climatorologyMeteorologyAtmosphere"
      ],
      "result_time_type": "instant",
      "phenomenon_time_type": "result_time",
      "platform": {
        "feature_type": "aq_legal_station",
        "scope": "feature"
      },
      "shared_feature_of_interest_type": "aq_legal_station",
      "observed_properties": [
        {
          "name": "co",
          "description": "Concentration of co",
          "names": [
            {
              "term": "monoxido_carbono",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "monoxido_carbono",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "carbon_monoxide",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(mg/m3)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "no",
          "description": "Concentration of no",
          "names": [
            {
              "term": "monoxido_nitrogeno",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "monoxido_nitrogeno",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "nitrogen_monoxide",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ug/m3)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "no2",
          "description": "Concentration of no2",
          "names": [
            {
              "term": "dioxido_nitrogeno",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "dioxido_nitrogeno",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "nitrogen_dioxide",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ug/m3)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "o3",
          "description": "Concentration of o3",
          "names": [
            {
              "term": "ozono",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "ozono",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "ozone",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ug/m3)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "nox",
          "description": "Concentration of nox = no + no2",
          "names": [
            {
              "term": "oxidos_nitrogeno",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "oxidos_nitrogeno",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "nitrogen_oxides",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ug/m3)",
          "repeated": false,
          "temporal_scope": "observation"
        }
      ]
    },
    {
      "name": "sensor_low_cost_process",
      "description": "Process that generates raw measures from electrochemical sensors installed in low cost devices.",
      "names": [
        {
          "term": "proceso_sensor_bajo_coste",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "proceso_sensor_baixo_custo",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "sensor_low_cost_process",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "model",
          "description": "Model of the low cost sensor device.",
          "names": [
            {
              "term": "modelo",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "modelo",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "model",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "trademark",
          "description": "Trademark of the low cost sensor device.",
          "names": [
            {
              "term": "marca",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "marca",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "trademark",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "note",
          "description": "Annotations recorded for a low cost sensor device",
          "names": [
            {
              "term": "notas",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "notas",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "note",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "sensor_box_code",
          "description": "Code stamped in the device box",
          "names": [
            {
              "term": "codigo_caja_sensor",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "codigo_caixa_sensor",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "sensor_box_code",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "status",
          "description": "Status of the sensor in the period",
          "names": [
            {
              "term": "estado",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "estado",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "status",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "sensor_low_cost_status",
          "repeated": false,
          "scope": "valid_time_period"
        },
        {
          "name": "status_note",
          "description": "Annotations that provide additional semantics related to the sensor status",
          "names": [
            {
              "term": "notas_estado",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "notas_estado",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "status_note",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "valid_time_period"
        },
        {
          "name": "operator",
          "description": "Name of the operator that updated the status of the sensor in the period.",
          "names": [
            {
              "term": "operador",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "operador",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "operator",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "valid_time_period"
        }
      ],
      "metadata_language": [
        "eng"
      ],
      "metadata_contact": [
        {
          "organisation_name": "Universidade de Santiago de Compostela",
          "electronic_mail_address": "jrr.viqueira@usc.es",
          "role": "principalInvestigator"
        }
      ],
      "metadata_date_stamp": "2025-12-16T00:00:00.000Z",
      "title": "Low cost sensor measures generated during the TRAFAIR project",
      "abstract": "This dataset records all the data obtained from air quality low cost sensors collected during the TRAFAIR project at the involved cities. The data was used to enhace the observation network of air quality.",
      "identifier": "trafair_air_quality_low_cost_sensor_data",
      "point_of_contact": [
        {
          "organisation_name": "Universidade de Santiago de Compostela",
          "electronic_mail_address": "jrr.viqueira@usc.es",
          "role": "principalInvestigator"
        }
      ],
      "keywords": [
        {
          "keyword": "calidad aire",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "calidade aire",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "air quality",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "polución",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "polución",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "pollution",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "specific_usage": "This dataset might be used as estimations of air quality at specific points produced by a scientific work.",
      "user_contact": [
        {
          "organisation_name": "Universidade de Santiago de Compostela",
          "electronic_mail_address": "jrr.viqueira@usc.es",
          "role": "principalInvestigator"
        }
      ],
      "use_limitation": "This data may only be used for scientific purposes.",
      "spatial_representation_type": "vector",
      "spatial_resolution": [
        500
      ],
      "language": [
        "eng"
      ],
      "topic_category": [
        "environment",
        "geoscientificInformation",
        "climatorologyMeteorologyAtmosphere"
      ],
      "result_time_type": "instant",
      "phenomenon_time_type": "result_time",
      "platform": {
        "feature_type": "sensor_low_cost_feature",
        "scope": "valid_time_period"
      },
      "shared_feature_of_interest_type": "sensor_low_cost_feature",
      "observed_properties": [
        {
          "name": "battery_voltage",
          "description": "Voltage of the battery of the sensor.",
          "names": [
            {
              "term": "voltage_batería",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "voltaxe_batareía",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "battery_voltage",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(V)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "humidity",
          "description": "humidity measured by the low cost sensor",
          "names": [
            {
              "term": "humedad",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "humidade",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "humidity",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(%)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "temperature",
          "description": "Temperature measured by the low cost sensor",
          "names": [
            {
              "term": "temperatura",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "temperatura",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "temperature",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ºC)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "no_we",
          "description": "Current generated by the working electrode of no, which is exposed to the gases",
          "names": [
            {
              "term": "electrodo_trabajo_no",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "electrodo_traballo_no",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "no_working_electrode",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(mv)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "no_aux",
          "description": "Current generated by the auxiliary electrode of no, which is not exposed to the gases",
          "names": [
            {
              "term": "electrodo_auxiliar_no",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "electrodo_auxiliar_no",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "no_auxiliary_electrode",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(mV)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "no2_we",
          "description": "Current generated by the working electrode of no2, which is exposed to the gases",
          "names": [
            {
              "term": "electrodo_trabajo_no",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "electrodo_traballo_no",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "no_working_electrode",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(mv)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "no2_aux",
          "description": "Current generated by the auxiliary electrode no2, which is not exposed to the gases",
          "names": [
            {
              "term": "electrodo_auxiliar_no2",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "electrodo_auxiliar_no2",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "no2_auxiliary_electrode",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(mV)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "ox_we",
          "description": "Current generated by the working electrode of ox, which is exposed to the gases",
          "names": [
            {
              "term": "electrodo_trabajo_ox",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "electrodo_traballo_ox",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "ox_working_electrode",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(mv)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "ox_aux",
          "description": "Current generated by the auxiliary electrode ox, which is not exposed to the gases",
          "names": [
            {
              "term": "electrodo_auxiliar_ox",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "electrodo_auxiliar_ox",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "ox_auxiliary_electrode",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(mV)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "co_we",
          "description": "Current generated by the working electrode of co, which is exposed to the gases",
          "names": [
            {
              "term": "electrodo_trabajo_co",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "electrodo_traballo_co",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "co_working_electrode",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(mv)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "co_aux",
          "description": "Current generated by the auxiliary electrode co, which is not exposed to the gases",
          "names": [
            {
              "term": "electrodo_auxiliar_co",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "electrodo_auxiliar_co",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "co_auxiliary_electrode",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(mV)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "co_concentration",
          "description": "Concentration of co estimated directly by the low cost sensor, applying the calibration defined by the manufacturer",
          "names": [
            {
              "term": "concentración_co",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "concentración_co",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "co_concentration",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(mg/m3)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "no_concentration",
          "description": "Concentration of no estimated directly by the low cost sensor, applying the calibration defined by the manufacturer",
          "names": [
            {
              "term": "concentración_no",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "concentración_no",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "no_concentration",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ug/m3)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "no2_concentration",
          "description": "Concentration of no2 estimated directly by the low cost sensor, applying the calibration defined by the manufacturer",
          "names": [
            {
              "term": "concentración_no2",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "concentración_no2",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "no2_concentration",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ug/m3)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "ox_concentration",
          "description": "Concentration of ox estimated directly by the low cost sensor, applying the calibration defined by the manufacturer. Oxidants (ox) use to match the concentration of ox=no2+o3",
          "names": [
            {
              "term": "concentración_ox",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "concentración_ox",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "ox_concentration",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ug/m3)",
          "repeated": false,
          "temporal_scope": "observation"
        }
      ]
    },
    {
      "name": "sensor_calibration_process",
      "description": "Process that transforms the outputs generated by the low cost sensor into gas concentrations, using regression.",
      "names": [
        {
          "term": "proceso_calibracion_sensor",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "proceso_calibracion_sensor",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "sensor_calibration_process",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "note",
          "description": "Annotations that provide additional semantics to the calibration process.",
          "names": [
            {
              "term": "notas",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "notas",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "note",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "co_algorithm",
          "description": "Metadata of the algorithm used to generate co measures.",
          "names": [
            {
              "term": "algoritmo_co",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "algoritmo_co",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "co_algorithm",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "sensor_calibration_algorithm",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "no_algorithm",
          "description": "Metadata of the algorithm used to generate no measures.",
          "names": [
            {
              "term": "algoritmo_no",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "algoritmo_no",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "no_algorithm",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "sensor_calibration_algorithm",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "no2_algorithm",
          "description": "Metadata of the algorithm used to generate no2 measures.",
          "names": [
            {
              "term": "algoritmo_no2",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "algoritmo_no2",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "no2_algorithm",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "sensor_calibration_algorithm",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "o3_algorithm",
          "description": "Metadata of the algorithm used to generate o3 measures.",
          "names": [
            {
              "term": "algoritmo_o3",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "algoritmo_o3",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "o3_algorithm",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "sensor_calibration_algorithm",
          "repeated": false,
          "scope": "feature"
        }
      ],
      "references": [
        {
          "name": "sensor",
          "description": "References the low cost sensor whose data is used as input to the process.",
          "repeated": false,
          "referenced_type": "sensor_low_cost_process",
          "scope": "feature"
        }
      ],
      "metadata_language": [
        "eng"
      ],
      "metadata_contact": [
        {
          "organisation_name": "Universidade de Santiago de Compostela",
          "electronic_mail_address": "jrr.viqueira@usc.es",
          "role": "principalInvestigator"
        }
      ],
      "metadata_date_stamp": "2025-12-16T00:00:00.000Z",
      "title": "Calibrated concentrations obtained by regression from low cost sensors, generated during the TRAFAIR project",
      "abstract": "This dataset records all the data calibrated using as input air quality low cost sensor measures collected during the TRAFAIR project at the involved cities. The data was used to enhace the observation network of air quality.",
      "identifier": "trafair_air_quality_calibrated_data",
      "point_of_contact": [
        {
          "organisation_name": "Universidade de Santiago de Compostela",
          "electronic_mail_address": "jrr.viqueira@usc.es",
          "role": "principalInvestigator"
        }
      ],
      "keywords": [
        {
          "keyword": "calidad aire",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "calidade aire",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "air quality",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "polución",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "polución",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "pollution",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "specific_usage": "This dataset might be used as estimations of air quality at specific points produced by a scientific work.",
      "user_contact": [
        {
          "organisation_name": "Universidade de Santiago de Compostela",
          "electronic_mail_address": "jrr.viqueira@usc.es",
          "role": "principalInvestigator"
        }
      ],
      "use_limitation": "This data may only be used for scientific purposes.",
      "spatial_representation_type": "vector",
      "spatial_resolution": [
        500
      ],
      "language": [
        "eng"
      ],
      "topic_category": [
        "environment",
        "geoscientificInformation",
        "climatorologyMeteorologyAtmosphere"
      ],
      "result_time_type": "instant",
      "phenomenon_time_type": "instant",
      "shared_feature_of_interest_type": "sensor_low_cost_feature",
      "observed_properties": [
        {
          "name": "co",
          "description": "Concentration of co estimated applying the calibration method.",
          "names": [
            {
              "term": "concentración_co",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "concentración_co",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "co_concentration",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(mg/m3)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "no",
          "description": "Concentration of no estimated applying the calibration method.",
          "names": [
            {
              "term": "concentración_no",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "concentración_no",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "no_concentration",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ug/m3)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "no2",
          "description": "Concentration of no2 estimated applying the calibration method.",
          "names": [
            {
              "term": "concentración_no2",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "concentración_no2",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "no2_concentration",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ug/m3)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "o3",
          "description": "Concentration of o3 estimated applying the calibration method.",
          "names": [
            {
              "term": "concentración_o3",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "concentración_o3",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "o3_concentration",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ug/m3)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "co_out_of_range",
          "description": "When this boolean flag has a tru value, the co concentration is out of range, according to a method applied to identify outlier.",
          "names": [
            {
              "term": "co_fuera_de_rango",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "co_fora_de_rango",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "co_out_of_range",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "boolean",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "no_out_of_range",
          "description": "When this boolean flag has a tru value, the no concentration is out of range, according to a method applied to identify outlier.",
          "names": [
            {
              "term": "no_fuera_de_rango",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "no_fora_de_rango",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "no_out_of_range",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "boolean",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "no2_out_of_range",
          "description": "When this boolean flag has a tru value, the no2 concentration is out of range, according to a method applied to identify outlier.",
          "names": [
            {
              "term": "no2_fuera_de_rango",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "no2_fora_de_rango",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "no2_out_of_range",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "boolean",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "o3_out_of_range",
          "description": "When this boolean flag has a tru value, the co concentration is out of range, according to a method applied to identify outlier.",
          "names": [
            {
              "term": "o3_fuera_de_rango",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "o3_fora_de_rango",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "o3_out_of_range",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "boolean",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "coverage",
          "description": "Percentage of the expected measures that have been collected in the input data during the period corresponding to the output resolution.",
          "names": [
            {
              "term": "cobertura",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "cobertura",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "coverage",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(%)",
          "repeated": false,
          "temporal_scope": "observation"
        }
      ]
    },
    {
      "name": "air_quality_model",
      "description": "Process that estimates the nox concentration at each point of the city (4 meters of spatial resolution) taking into account pollution emissions (mainly from traffic) and weather conditions (mainly wind). It uses the GRAL model (Graz Lagrangian Model), available at https://gral.tugraz.at/.",
      "names": [
        {
          "term": "modelo_calidad_aire",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "modelo_calidade_aire",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "air_quality_model",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "description",
          "description": "Textual description of the air quality model implementation.",
          "names": [
            {
              "term": "descripción",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "descrición",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "description",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        }
      ],
      "metadata_language": [
        "eng"
      ],
      "metadata_contact": [
        {
          "organisation_name": "Universidade de Santiago de Compostela",
          "electronic_mail_address": "jrr.viqueira@usc.es",
          "role": "principalInvestigator"
        }
      ],
      "metadata_date_stamp": "2025-12-16T00:00:00.000Z",
      "title": "Outputs of the air quality model generated during the TRAFAIR project",
      "abstract": "This dataset records all the outputs generated by the air quality model implemented for the TRAFAIR project.",
      "identifier": "trafair_air_quality_model_outputs",
      "point_of_contact": [
        {
          "organisation_name": "Universidade de Santiago de Compostela",
          "electronic_mail_address": "jrr.viqueira@usc.es",
          "role": "principalInvestigator"
        }
      ],
      "keywords": [
        {
          "keyword": "calidad aire",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "calidade aire",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "air quality",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "polución",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "polución",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "pollution",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "specific_usage": "This dataset might be used as estimations of air quality in the whole city produced by a scientific work.",
      "user_contact": [
        {
          "organisation_name": "Universidade de Santiago de Compostela",
          "electronic_mail_address": "jrr.viqueira@usc.es",
          "role": "principalInvestigator"
        }
      ],
      "use_limitation": "This data may only be used for scientific purposes.",
      "spatial_representation_type": "grid",
      "spatial_resolution": [
        4
      ],
      "language": [
        "eng"
      ],
      "topic_category": [
        "environment",
        "geoscientificInformation",
        "climatorologyMeteorologyAtmosphere"
      ],
      "result_time_type": "instant",
      "phenomenon_time_type": "period",
      "shared_feature_of_interest_type": "air_quality_model_grid",
      "observed_properties": [
        {
          "name": "nox",
          "description": "Concentration of nox estimated by the model at each location. nox = no + no2.",
          "names": [
            {
              "term": "concentracion_nox",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "concentración_nox",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "nox_concentration",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ug/m3)",
          "repeated": false,
          "sampling_time_type": "instant",
          "temporal_scope": "continuous_coverage",
          "sampling_geometry_type": "point",
          "geospatial_scope": "continuous_coverage"
        }
      ]
    }
  ]
}');

-- RADIOSOUNDING
SELECT lendas_deploy('{
  "schema": "radiosounding",
  "feature_types": [
    {
      "name": "region_of_interest",
      "description": "Region of the earth surface that is being sampled by the radiosounding devices",
      "names": [
        {
          "term": "region_de_interes",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "rexion_de_interes",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "region_of_interest",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "name",
          "description": "Name of the region of interest",
          "names": [
            {
              "term": "nombre",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nome",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "name",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "maximum_height",
          "description": "Maximum height that any device might reach in the region.",
          "names": [
            {
              "term": "altura_maxima",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "altura_maxima",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "maximum_height",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "real",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "geo",
          "description": "Geometry of the region of interest.",
          "names": [
            {
              "term": "geometria",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "xeometria",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "geometry",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "geometry(MULTIPOLYGON,4326)",
          "repeated": false,
          "scope": "feature"
        }
      ]
    }
  ],
  "process_types": [
    {
      "name": "radiosounding_process",
      "description": "Process that generates 3D trajectories of atmospheric measures using radiosounding devices.",
      "names": [
        {
          "term": "proceso_de_radiosondage",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "proces_de_radiosondaxe",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "radiosounding_process",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "base_station_name",
          "description": "Name of the base station from which the soundes are released.",
          "names": [
            {
              "term": "nombre_estacion_base",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nome_estacion_base",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "base_station_name",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "release_location",
          "description": "Location of the base station from which the soundes are released.",
          "names": [
            {
              "term": "localizacion_de_lanzamiento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "localizacion_de_lanzamento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "release_location",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "geometry(POINT,4326)",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "release_location_height",
          "description": "Height above sea level of the base station from which the soundes are released.",
          "names": [
            {
              "term": "altura_de_la_localizacion_de_lanzamiento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "altura_da_localizacion_de_lanzamento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "release_location_height",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "real",
          "repeated": false,
          "scope": "feature"
        }
      ],
      "metadata_language": [
        "eng"
      ],
      "metadata_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "metadata_date_stamp": "2025-12-16T00:00:00.000Z",
      "title": "Radiosounding trajectories",
      "abstract": "Trajectories generated by radiosounding devices released by MeteoGalicia.",
      "identifier": "radiosounding_trajectories",
      "point_of_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "keywords": [
        {
          "keyword": "viento",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "vento",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "wind",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "temperatura",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "temperatura",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "temperature",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "presion",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "presion",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "pressure",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "humedad",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "humidade",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "humidity",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "radiosonda",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "radiosonda",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "radiosounde",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "meteorología",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "meteoroloxía",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "meteorology",
          "vocabulary": "ccmm_global.english"
        },
        {
          "keyword": "atmófera",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "atmosfera",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "atmosphere",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "specific_usage": "This dataset might be used as a ground truth for atmospheric properties at specific 3D locations.",
      "user_contact": [
        {
          "organisation_name": "Meteogalicia",
          "electronic_mail_address": "meteogalicia@xunta.gal",
          "role": "resourceProvider"
        }
      ],
      "use_limitation": "This data may only be used for technology testing at COGRADE.",
      "spatial_representation_type": "vector",
      "spatial_resolution": [
        500
      ],
      "language": [
        "eng"
      ],
      "topic_category": [
        "environment",
        "geoscientificInformation",
        "climatorologyMeteorologyAtmosphere"
      ],
      "result_time_type": "period",
      "phenomenon_time_type": "result_time",
      "generated_feature_of_interest_type": {
        "shape_type": "line",
        "shape_crs": "EPSG:4326",
        "sampled_feature_type": "region_of_interest"
      },
      "observed_properties": [
        {
          "name": "pressure",
          "description": "atmospheric pressure measured by the device",
          "names": [
            {
              "term": "presion_atmosferica",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "presion_atmosferica",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "atmospheric_pressure",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(mbar)",
          "repeated": false,
          "temporal_scope": "discrete_coverage",
          "sampling_time_type": "instant",
          "sampling_geometry_type": "point",
          "geospatial_scope": "sample",
          "height_scope": "sample",
          "sampling_height_type": "point"
        },
        {
          "name": "temperature",
          "description": "Temperature measured by the device",
          "names": [
            {
              "term": "temperatura",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "temperatura",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "temperature",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ºC)",
          "repeated": false,
          "temporal_scope": "discrete_coverage",
          "sampling_time_type": "instant",
          "sampling_geometry_type": "point",
          "geospatial_scope": "sample",
          "height_scope": "sample",
          "sampling_height_type": "point"
        },
        {
          "name": "dew_point_temperature",
          "description": "Temperature of the dew point measured by the device",
          "names": [
            {
              "term": "temperatura_del_rocio",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "temperatura_do_orballo",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "dew_point_temperature",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(ºC)",
          "repeated": false,
          "temporal_scope": "discrete_coverage",
          "sampling_time_type": "instant",
          "sampling_geometry_type": "point",
          "geospatial_scope": "sample",
          "height_scope": "sample",
          "sampling_height_type": "point"
        },
        {
          "name": "humidity",
          "description": "Humidity measured by the device",
          "names": [
            {
              "term": "humedad",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "humidade",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "humidity",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(%)",
          "repeated": false,
          "temporal_scope": "discrete_coverage",
          "sampling_time_type": "instant",
          "sampling_geometry_type": "point",
          "geospatial_scope": "sample",
          "height_scope": "sample",
          "sampling_height_type": "point"
        },
        {
          "name": "wind_direction",
          "description": "Wind direction measured by the device",
          "names": [
            {
              "term": "dirección_del_viento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "dirección_do_vento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "wind_direction",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(degree)",
          "repeated": false,
          "temporal_scope": "discrete_coverage",
          "sampling_time_type": "instant",
          "sampling_geometry_type": "point",
          "geospatial_scope": "sample",
          "height_scope": "sample",
          "sampling_height_type": "point"
        },
        {
          "name": "wind_speed",
          "description": "Wind speed measured by the device",
          "names": [
            {
              "term": "velocidad_del_viento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "velocidade_do_vento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "wind_speed",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(m/s)",
          "repeated": false,
          "temporal_scope": "discrete_coverage",
          "sampling_time_type": "instant",
          "sampling_geometry_type": "point",
          "geospatial_scope": "sample",
          "height_scope": "sample",
          "sampling_height_type": "point"
        }
      ]
    }
  ]
}');

-- TRAFFIC
SELECT lendas_deploy('{
  "schema": "traffic",
  "feature_types": [
    {
      "name": "road",
      "description": "It represents a road that belongs to some road network",
      "names": [
        {
          "term": "carretera",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "estrada",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "road",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "name",
          "description": "Name of the road",
          "names": [
            {
              "term": "nombre",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nome",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "name",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        }
      ]
    },
    {
      "name": "road_section",
      "description": "It represents a section of a specific road, that connects various segments, that in turn connect road nodes.",
      "names": [
        {
          "term": "sección_carretera",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "sección_estrada",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "road_section",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "geo",
          "description": "Geometry of the road section of a polyline data type.",
          "names": [
            {
              "term": "geometría",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "xeometría",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "geometry",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "geometry(linestring,4326)",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "speed_limit",
          "description": "Máximum speed allowed in the road section.",
          "names": [
            {
              "term": "límite_velocidad",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "límite_velocidade",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "speed_limit",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "integer",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "oneway",
          "description": "Boolean flag that specifies whether the road section may be traverse in one or two directions.",
          "names": [
            {
              "term": "un_sentido",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "un_sentido",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "oneway",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "Boolean",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "num_lanes",
          "description": "Number of lanes of the road section.",
          "names": [
            {
              "term": "número_carriles",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "número_carrís",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "number_lanes",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "Integer",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "type",
          "description": "Type of road section of those defined by Openstreetmap.",
          "names": [
            {
              "term": "tipo",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "tipo",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "type",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        }
      ],
      "references": [
        {
          "name": "road",
          "description": "References the road to which this section belongs to.",
          "names": [
            {
              "term": "carretera",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "estrada",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "road",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "referenced_type": "road",
          "repeated": false,
          "scope": "feature"
        }
      ]
    },
    {
      "name": "road_arc",
      "description": "An directed arc of the graph defined in the road network",
      "names": [
        {
          "term": "arco_carretera",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "arco_estrada",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "road_arc",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "geo",
          "description": "Geometry of the road arc of linestring type.",
          "names": [
            {
              "term": "geometría",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "xeometría",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "geometry",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "geometry(linestring,4326)",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "code",
          "description": "Textual code of the arc.",
          "names": [
            {
              "term": "código",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "código",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "code",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "inverted",
          "description": "True if the traffic direction of the arc is inverted with respect to the sequence of point of its linestring geometry.",
          "names": [
            {
              "term": "invertido",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "invertido",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "inverted",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "Boolean",
          "repeated": false,
          "scope": "feature"
        }
      ]
    },
    {
      "name": "road_node",
      "description": "Node of the road network",
      "names": [
        {
          "term": "nodo_carretera",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "nodo_estrada",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "road_node",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "geo",
          "description": "Geometry of the road node of point type.",
          "names": [
            {
              "term": "geometría",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "xeometría",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "geometry",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "geometry(point,4326)",
          "repeated": false,
          "scope": "feature"
        }
      ]
    },
    {
      "name": "road_segment",
      "description": "Segment of a road that links two consecutive nodes",
      "names": [
        {
          "term": "segmento_carretera",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "segmento_estrada",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "road_segment",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "segment_number",
          "description": "Number of segment in its road section",
          "names": [
            {
              "term": "número_segmento",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "número_segmento",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "segment_number",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "integer",
          "repeated": false,
          "scope": "feature"
        }
      ],
      "references": [
        {
          "name": "road_section",
          "description": "References the road_section that the segment belongs to.",
          "names": [
            {
              "term": "sección_carretera",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "sección_estrada",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "road_section",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "referenced_type": "road_section",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "node_start",
          "description": "Start node of the segment.",
          "names": [
            {
              "term": "nodo_inicio",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nodo_inicio",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "node_start",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "referenced_type": "road_node",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "node_end",
          "description": "End node of the segment.",
          "names": [
            {
              "term": "nodo_fin",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nodo_fin",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "node_end",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "referenced_type": "road_node",
          "repeated": false,
          "scope": "feature"
        }
      ]
    }
  ],
  "spatial_sampling_feature_types": [
    {
      "name": "traffic_sensor_feature",
      "description": "Fixed location of a traffic sensor in the city.",
      "names": [
        {
          "term": "entidad_sensor_tráfico",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "entidade_sensor_tráfico",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "traffic_sensor_feature",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "direction",
          "description": "True if the sensor location measures traffic in the same direction of the associated road segment.",
          "names": [
            {
              "term": "dirección",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "dirección",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "direction",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "boolean",
          "repeated": false,
          "scope": "feature"
        }
      ],
      "references": [
        {
          "name": "road_segment",
          "description": "Road segment where the traffic sensor is located.",
          "names": [
            {
              "term": "segmento_carretera",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "segmento_estrada",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "road_segment",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "referenced_type": "road_segment",
          "repeated": false,
          "scope": "feature"
        },
        {
          "name": "nearest_node",
          "description": "Nearest road node.",
          "names": [
            {
              "term": "nodo_mas_cercano",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "nodo_mais_cercano",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "nearest_node",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "referenced_type": "road_node",
          "repeated": false,
          "scope": "feature"
        }
      ],
      "sampled_feature_type": "road_section",
      "shape_type": "point",
      "shape_crs": "EPSG:4326"
    }
  ],
  "process_types": [
    {
      "name": "traffic_sensor",
      "description": "Process that generates measures of traffic.",
      "names": [
        {
          "term": "sensor_tráfico",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "sensor_tráfico",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "traffic_sensor",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "id",
          "description": "textual identifier of the sensor",
          "names": [
            {
              "term": "identificador",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "identificador",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "identifier",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        }
      ],
      "metadata_language": [
        "eng"
      ],
      "metadata_contact": [
        {
          "organisation_name": "Universidade de Santiago de Compostela",
          "electronic_mail_address": "jrr.viqueira@usc.es",
          "role": "principalInvestigator"
        }
      ],
      "metadata_date_stamp": "2025-12-16T00:00:00.000Z",
      "title": "Traffic measures obtained by the traffic monitoring infrastructure used in the TRAFAIR project",
      "abstract": "This dataset records all the data obtained from traffic sensors collected during the TRAFAIR project at the involved cities. The data was used as input for a traffic model that estimated the traffic flows that were used to further estimate emissions for air quality modelling.",
      "identifier": "trafair_traffic_sensor_measures",
      "point_of_contact": [
        {
          "organisation_name": "Universidade de Santiago de Compostela",
          "electronic_mail_address": "jrr.viqueira@usc.es",
          "role": "principalInvestigator"
        }
      ],
      "keywords": [
        {
          "keyword": "tráfico",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "tráfico",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "traffic",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "specific_usage": "This dataset might be used as a ground truth for traffic flow at specific points.",
      "user_contact": [
        {
          "organisation_name": "Universidade de Santiago de Compostela",
          "electronic_mail_address": "jrr.viqueira@usc.es",
          "role": "principalInvestigator"
        }
      ],
      "use_limitation": "This data may only be used for scientific purposes.",
      "spatial_representation_type": "vector",
      "spatial_resolution": [
        500
      ],
      "language": [
        "eng"
      ],
      "topic_category": [
        "environment",
        "geoscientificInformation",
        "climatorologyMeteorologyAtmosphere"
      ],
      "result_time_type": "instant",
      "phenomenon_time_type": "result_time",
      "platform": {
        "feature_type": "traffic_sensor_feature",
        "scope": "feature"
      },
      "shared_feature_of_interest_type": "traffic_sensor_feature",
      "observed_properties": [
        {
          "name": "flow",
          "description": "Number of vehicles per hour traversing the traffic sensor.",
          "names": [
            {
              "term": "flujo_tráfico",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "fluxo_tráfico",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "traffic_flow",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(vehicles/hour)",
          "repeated": false,
          "temporal_scope": "observation"
        },
        {
          "name": "occupancy",
          "description": "Percentaje of the time that the traffic sensor is occupied at each temporal resolution period (5 minutes).",
          "names": [
            {
              "term": "ocupación",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "ocupación",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "occupancy",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(%)",
          "repeated": false,
          "temporal_scope": "observation"
        }
      ]
    },
    {
      "name": "traffic_flow_model",
      "description": "Model used to estimate the traffic at each road arc of the city based on the measures obtained from the traffic sensors.",
      "names": [
        {
          "term": "modelo_flujo_tráfico",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "term": "modelo_flluxo_tráfico",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "term": "traffic_flow_model",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "properties": [
        {
          "name": "description",
          "description": "Description of the model used to generate traffic flow estimations",
          "names": [
            {
              "term": "descripción",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "descrición",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "description",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "text",
          "repeated": false,
          "scope": "feature"
        }
      ],
      "metadata_language": [
        "eng"
      ],
      "metadata_contact": [
        {
          "organisation_name": "Universidade de Santiago de Compostela",
          "electronic_mail_address": "jrr.viqueira@usc.es",
          "role": "principalInvestigator"
        }
      ],
      "metadata_date_stamp": "2025-12-16T00:00:00.000Z",
      "title": "Traffic flow estsimations at each road arc of the city generated during the TRAFAIR project",
      "abstract": "This dataset records all the data generated by the traffic flow model used in the TRAFAIR project. The data was used as input for the estimation of nox emissions, that were in turn used as input for a air quality estimation model.",
      "identifier": "trafair_traffic_flow_estimations",
      "point_of_contact": [
        {
          "organisation_name": "Universidade de Santiago de Compostela",
          "electronic_mail_address": "jrr.viqueira@usc.es",
          "role": "principalInvestigator"
        }
      ],
      "keywords": [
        {
          "keyword": "tráfico",
          "vocabulary": "ccmm_global.castellano"
        },
        {
          "keyword": "tráfico",
          "vocabulary": "ccmm_global.galego"
        },
        {
          "keyword": "traffic",
          "vocabulary": "ccmm_global.english"
        }
      ],
      "specific_usage": "This dataset might be used as an estimation of traffic flow at road arcs of the city.",
      "user_contact": [
        {
          "organisation_name": "Universidade de Santiago de Compostela",
          "electronic_mail_address": "jrr.viqueira@usc.es",
          "role": "principalInvestigator"
        }
      ],
      "use_limitation": "This data may only be used for scientific purposes.",
      "spatial_representation_type": "vector",
      "spatial_resolution": [
        500
      ],
      "language": [
        "eng"
      ],
      "topic_category": [
        "environment",
        "geoscientificInformation",
        "climatorologyMeteorologyAtmosphere"
      ],
      "result_time_type": "instant",
      "phenomenon_time_type": "instant",
      "shared_feature_of_interest_type": "road_arc",
      "observed_properties": [
        {
          "name": "flow",
          "description": "Number of vehicles per hour traversing the traffic sensor.",
          "names": [
            {
              "term": "flujo_tráfico",
              "vocabulary": "ccmm_global.castellano"
            },
            {
              "term": "fluxo_tráfico",
              "vocabulary": "ccmm_global.galego"
            },
            {
              "term": "traffic_flow",
              "vocabulary": "ccmm_global.english"
            }
          ],
          "data_type": "measure(vehicles/hour)",
          "repeated": false,
          "temporal_scope": "observation"
        }
      ]
    }
  ]
}');


