async function loadAllData() {
  schemaNameInput.value = localStorage.getItem("schemaName") || "schema";

  async function fetchDefaults() {
    try {
      const response = await fetch("data/template.json");
      if (!response.ok) {
        throw new Error("Failed to load template.json");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching default JSON:", error);
      return {};
    }
  }
  const defaults = await fetchDefaults();

  if (localStorage.getItem("vocabularies")) {
    vocabularies = JSON.parse(localStorage.getItem("vocabularies")) || [];
  } else {
    vocabularies = defaults.vocabularies || [];
  }
  if (localStorage.getItem("enumerationDataTypes")) {
    enumerationDataTypes =
      JSON.parse(localStorage.getItem("enumerationDataTypes")) || [];
  } else {
    enumerationDataTypes = defaults.enumeration_data_types || [];
  }
  if (localStorage.getItem("complexDataTypes")) {
    complexDataTypes =
      JSON.parse(localStorage.getItem("complexDataTypes")) || [];
  } else {
    complexDataTypes = defaults.complex_data_types || [];
  }
  if (localStorage.getItem("featureTypes")) {
    featureTypes = JSON.parse(localStorage.getItem("featureTypes")) || [];
  } else {
    featureTypes = defaults.feature_types || [];
  }
  if (localStorage.getItem("spatialSamplingFeatureTypes")) {
    spatialSamplingFeatureTypes =
      JSON.parse(localStorage.getItem("spatialSamplingFeatureTypes")) || [];
  } else {
    spatialSamplingFeatureTypes = defaults.spatial_sampling_feature_types || [];
  }
  if (localStorage.getItem("specimenFeatureTypes")) {
    specimenFeatureTypes =
      JSON.parse(localStorage.getItem("specimenFeatureTypes")) || [];
  } else {
    specimenFeatureTypes = defaults.specimen_feature_types || [];
  }
  if (localStorage.getItem("processTypes")) {
    processTypes = JSON.parse(localStorage.getItem("processTypes")) || [];
  } else {
    processTypes = defaults.process_types || [];
  }
}

function saveAllData() {
  localStorage.setItem("schemaName", schemaNameInput.value.trim());
  localStorage.setItem(
    "vocabularies",
    JSON.stringify(vocabularies, getCircularReplacer())
  );
  localStorage.setItem(
    "enumerationDataTypes",
    JSON.stringify(enumerationDataTypes, getCircularReplacer())
  );
  localStorage.setItem(
    "complexDataTypes",
    JSON.stringify(complexDataTypes, getCircularReplacer())
  );
  localStorage.setItem(
    "featureTypes",
    JSON.stringify(featureTypes, getCircularReplacer())
  );
  localStorage.setItem(
    "spatialSamplingFeatureTypes",
    JSON.stringify(spatialSamplingFeatureTypes, getCircularReplacer())
  );
  localStorage.setItem(
    "specimenFeatureTypes",
    JSON.stringify(specimenFeatureTypes, getCircularReplacer())
  );
  localStorage.setItem(
    "processTypes",
    JSON.stringify(processTypes, getCircularReplacer())
  );
}

function getCircularReplacer() {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}

function loadDiagramFromStorage() {
  const df = localStorage.getItem("diagramData");
  if (df) {
    try {
      const jsonData = JSON.parse(df);
      graph.clear();
      graph.fromJSON(jsonData);
      resetAllCellStyles();
      if (typeof fixLoadedElements === "function") {
        fixLoadedElements();
      }
      if (typeof window.normalizeDiagramLinksToHeaderPorts === "function") {
        window.normalizeDiagramLinksToHeaderPorts({ forcePorts: true });
      }
      if (typeof centerContent === "function") {
        centerContent();
      }
    } catch (e) {
      console.warn("Failed to load diagram", e);
    }
  }
}

function saveDiagramToStorage() {
  const jsonData = graph.toJSON();
  localStorage.setItem("diagramData", JSON.stringify(jsonData, getCircularReplacer()));
}

function loadModelFromFile(model) {
  // Limpia el diagrama actual antes de cargar el nuevo modelo
  if (typeof graph !== 'undefined' && graph.clear) {
    graph.clear();
    localStorage.removeItem("diagramData");
    if (typeof renderNodeProperties === 'function') {
      renderNodeProperties(null);
    }
    if (typeof updateSelectedElement === 'function') {
      updateSelectedElement(null);
    }
  }
  schemaNameInput.value = model.schema || "default_schema";
  vocabularies = model.vocabularies || [];
  enumerationDataTypes = model.enumeration_data_types || [];
  complexDataTypes = model.complex_data_types || [];
  featureTypes = model.feature_types || [];
  spatialSamplingFeatureTypes = model.spatial_sampling_feature_types || [];
  specimenFeatureTypes = model.specimen_feature_types || [];
  processTypes = model.process_types || [];
  saveAllData();
}
