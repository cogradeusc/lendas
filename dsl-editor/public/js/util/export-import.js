function exportDiagramAsJSONFile() {
  try {
    const output = {
      diagram: graph.toJSON(),
      model: {
        schema: schemaNameInput.value.trim(),
        vocabularies: vocabularies,
        enumeration_data_types: enumerationDataTypes,
        complex_data_types: complexDataTypes,
        feature_types: featureTypes,
        spatial_sampling_feature_types: spatialSamplingFeatureTypes,
        specimen_feature_types: specimenFeatureTypes,
        process_types: processTypes,
      },
    };
    const jsonStr = JSON.stringify(output, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "diagram.json";
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error("Error exporting diagram to JSON:", err);
    showNotification("Failed to export the diagram as JSON.");
  }
}

function handleImportJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const jsonData = JSON.parse(e.target.result);

      // If the JSON contains both 'diagram' and 'model' parts
      if (jsonData.diagram && jsonData.model) {
        // Clear the model catalog in localStorage and global variables
        localStorage.removeItem("vocabularies");
        localStorage.removeItem("enumerationDataTypes");
        localStorage.removeItem("complexDataTypes");
        localStorage.removeItem("featureTypes");
        localStorage.removeItem("spatialSamplingFeatureTypes");
        localStorage.removeItem("specimenFeatureTypes");
        localStorage.removeItem("processTypes");
        localStorage.removeItem("diagramData");

        // Clear the current diagram
        graph.clear();

        // Load the catalog/model from the 'model' property
        loadModelFromFile(jsonData.model);

        // Update the lists in the left panel
        renderVocabulariesList();
        renderEnumerationDataTypesList();
        renderComplexTypesList();
        renderFeatureTypesList();
        renderSpatialSamplingFeatureTypesList();
        renderSpecimenFeatureTypesList();
        renderProcessTypesList();

        // Load the diagram part
        graph.fromJSON(jsonData.diagram);
        if (typeof fixLoadedElements === "function") {
          fixLoadedElements();
        }
        if (typeof window.normalizeDiagramLinksToHeaderPorts === "function") {
          window.normalizeDiagramLinksToHeaderPorts({ forcePorts: true });
        }
        if (typeof centerContent === "function") {
          centerContent();
        }
        saveDiagramToStorage();
        showNotification("Diagram and model imported successfully (JSON).");
      } else {
        // If the JSON does not have the expected structure, load only the diagram.
        graph.clear();
        graph.fromJSON(jsonData);
        if (typeof fixLoadedElements === "function") {
          fixLoadedElements();
        }
        if (typeof window.normalizeDiagramLinksToHeaderPorts === "function") {
          window.normalizeDiagramLinksToHeaderPorts({ forcePorts: true });
        }
        if (typeof centerContent === "function") {
          centerContent();
        }
        saveDiagramToStorage();
        showNotification("Diagram imported successfully (JSON).");
      }
    } catch (error) {
      console.error("Error importing diagram from JSON:", error);
      showNotification(
        "Failed to import the diagram. Please verify that the JSON file is valid."
      );
    }
  };
  reader.readAsText(file);
}

function exportDiagramImage(format, filename) {
  if (format === "svg") {
    // Busca el elemento <svg> dentro del contenedor de paper.
    const svgEl = paper.el.querySelector("svg");
    if (!svgEl) {
      console.error("SVG element not found in paper.el");
      showNotification("Failed to export SVG: SVG element not found.");
      return;
    }
    // Serializa el SVG usando XMLSerializer.
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  } else {
    html2canvas(paper.el)
      .then((canvas) => {
        let mimeType = "image/png";
        if (format === "jpg") mimeType = "image/jpeg";
        const dataUrl = canvas.toDataURL(mimeType, 1.0);
        const link = document.createElement("a");
        link.download = `${filename}.${format}`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Error exporting diagram as image:", err);
        showNotification("Failed to export the diagram as an image.");
      });
  }
}
