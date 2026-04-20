function generateAndShowJSON() {
  const output = {
    schema: schemaNameInput.value.trim(),
    vocabularies: vocabularies,
    enumeration_data_types: enumerationDataTypes,
    complex_data_types: complexDataTypes,
    feature_types: featureTypes,
    spatial_sampling_feature_types: spatialSamplingFeatureTypes,
    specimen_feature_types: specimenFeatureTypes,
    process_types: processTypes
  };

  const jsonStr = JSON.stringify(output, null, 2);
  const jsonContentEl = document.getElementById("jsonContent");
  jsonContentEl.textContent = jsonStr;
  hljs.highlightElement(jsonContentEl);
  const modalJSON = new bootstrap.Modal(document.getElementById("modalJSONPreview"));
  modalJSON.show();
}

function downloadGeneratedJSON() {
  const content = document.getElementById("jsonContent").textContent;
  let filename = document.getElementById("jsonFilename").value.trim() || "model.json";
  if (!filename.toLowerCase().endsWith(".json")) {
    filename += ".json";
  }
  if (content === "") {
    showNotification("No JSON content available for download.");
    return;
  }
  const blob = new Blob([content], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
