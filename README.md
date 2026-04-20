# LENDAS: Language for ENvironmental DAta Specification

**LENDAS** is a Domain-Specific Modeling Language (DSML) designed to simplify the specification, design, and deployment of environmental data models.

Environmental datasets are inherently complex, combining spatio-temporal observations, heterogeneous data types, and sampling strategies with rich contextual metadata. **LENDAS** provides a domain-oriented abstraction layer that allows environmental data experts to define data structures using familiar concepts—such as *features of interest, observations, processes, and sampling features*—without requiring deep expertise in database design.

---

## 🚀 Key Features

### 🏗️ Domain-Oriented Modeling
Aligned with **OGC/ISO Observations and Measurements (O&M)** standards, ensuring the model speaks the same language as environmental scientists.

### ⚙️ Model-Driven Engineering (MDE)
Automatically transforms high-level specifications into production-ready, deployable data structures.

### 📝 YAML-based DSL
Define data models in a concise, human-readable, and version-controlled format (ideal for Git workflows).

### 🗄️ Automatic Schema Generation
Automatically generates **PostgreSQL/PostGIS** schemas, including:
* Tables and relationships.
* Integrity constraints.
* Optimized spatial and temporal indexes.

---

## 🛠️ Technical Capabilities

| Area | Support & Functionalities |
| :--- | :--- |
| **Type System** | Built-in support for geospatial, temporal, and range types. |
| **Flexibility** | User-defined types (enums and complex structures) and optional schemaless JSON support. |
| **Complex Data** | Support for time series, profiles, trajectories, and raster-like coverage data. |
| **Sampling** | Management of spatial and vertical sampling, specimens, and sampling methods. |
| **Metadata** | Automatic generation of metadata catalogs aligned with **ISO** standards. |

---

## 📊 Data Availability

To reproduce the experiments undertaken during the evaluation of this framework, CSV files adapted to the schemas of all approaches may be provided upon request.

> **Important Note:** To request access to the data, please contact the authors at: **jrr.viqueira@usc.es**.
