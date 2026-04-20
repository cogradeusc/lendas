# LENDAS

**LENDAS (Language for ENvironmental DAta Specification)** is a Domain-Specific Modeling Language (DSML) designed to simplify the specification, design, and deployment of environmental data models.

Environmental datasets are inherently complex, combining spatio-temporal observations, heterogeneous data types, sampling strategies, and rich contextual metadata. LENDAS provides a domain-oriented abstraction layer that allows environmental data experts to define data structures using familiar concepts—such as *features of interest, observations, processes, and sampling features*—without requiring deep expertise in database design.

---

## 🚀 Features

- **Domain-oriented modeling**  
  Model environmental data using concepts aligned with the OGC/ISO *Observations and Measurements (O&M)* standard.

- **Model-Driven Engineering (MDE)**  
  Automatically transform high-level specifications into deployable data structures.

- **YAML-based DSL**  
  Define data models in a concise, readable, and versionable format.

- **Automatic schema generation**  
  Generate PostgreSQL/PostGIS schemas, including tables, constraints, and indexes.

- **Flexible type system**
  - Built-in support for geospatial, temporal, and range types  
  - User-defined types (enumerations and complex structures)  
  - Schema versioning  
  - Optional schemaless JSON support

- **Support for complex environmental data**
  - Time series, profiles, trajectories  
  - Spatial and vertical sampling  
  - Specimens and sampling methods  
  - Raster and coverage-like data

- **Metadata integration**  
  Automatic generation of a metadata catalog aligned with ISO standards.

---

## 🧠 Motivation

Environmental data modeling typically suffers from a trade-off:

- Flexible approaches → poor performance  
- Efficient approaches → high development complexity  

LENDAS bridges this gap by enabling:
- **low-effort model definition**
- **high-performance data storage**
- **standardized and interoperable structures**

---

## 🧩 Core Concepts

LENDAS is built around key environmental data modeling elements:

- **Feature Types** – entities representing real-world objects  
- **Sampling Features** – spatial/temporal sampling definitions  
- **Specimens** – physical samples extracted from features  
- **Processes** – data generation mechanisms  
- **Observed Properties** – measured or simulated variables  
- **Observations** – results linked to time and context  

---

## 📦 Example (YAML)

```yaml
schema: example

feature_types:
  - name: WeatherStation
    description: Meteorological station
    properties:
      - name: name
        data_type: text
        repeated: false
        scope: feature

process_types:
  - name: TemperatureMeasurement
    result_time_type: instant
    phenomenon_time_type: instant
    observed_properties:
      - name: temperature
        data_type: measure(°C)
        temporal_scope: observation