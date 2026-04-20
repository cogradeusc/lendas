const btnAddVocab = document.getElementById("btnAddVocabulary");
const btnAddEnum = document.getElementById("btnAddEnumerationDataType");
const btnAddCDT = document.getElementById("btnAddComplexDataType");
const btnAddFT = document.getElementById("btnAddFeatureType");
const btnAddSSFT = document.getElementById("btnAddSpatialSamplingFeatureType");
const btnAddSFT = document.getElementById("btnAddSpecimenFeatureType");
const btnAddProcess = document.getElementById("btnAddProcessType");

function initAddItemButtons() {
  btnAddVocab.addEventListener("click", () => {
    VocabularyEditor.reset();
    VocabularyEditor.edit({}, null);
    modalVocabulary.show();
  });
  btnAddEnum.addEventListener("click", () => {
    EnumerationEditor.reset();
    EnumerationEditor.edit({}, null);
    modalEnumeration.show();
  });
  btnAddCDT.addEventListener("click", () => {
    CDTEditor.reset();
    CDTEditor.edit({}, null);
    modalCDT.show();
  });
  btnAddFT.addEventListener("click", () => {
    FeatureEditor.reset();
    FeatureEditor.edit({}, null);
    modalFeature.show();
  });
  btnAddSSFT.addEventListener("click", () => {
    SpatialSamplingEditor.reset();
    SpatialSamplingEditor.edit({}, null);
    modalSpatialSampling.show();
  });
  btnAddSFT.addEventListener("click", () => {
    SpecimenEditor.reset();
    SpecimenEditor.edit({}, null);
    modalSpecimen.show();
  });
  btnAddProcess.addEventListener("click", () => {
    ProcessEditor.reset();
    ProcessEditor.edit({}, null);
    modalProcess.show();
  });
}

function initVocabularyEditor() {
  window.VocabularyEditor.init(vocabularyEditorContainer, (result, index) => {
    if (index === null) {
      vocabularies.push(result);
    } else {
      const oldName = vocabularies[index].name;
      vocabularies[index] = result;
      updateDiagramElement("vocabulary", oldName, result);
    }
    saveAllData();
    renderVocabulariesList();
    modalVocabulary.hide();
  });
}

function initEnumerationEditor() {
  window.EnumerationEditor.init(enumerationEditorContainer, (result, index) => {
    if (index === null) {
      enumerationDataTypes.push(result);
    } else {
      const oldName = enumerationDataTypes[index].name;
      enumerationDataTypes[index] = result;
      updateDiagramElement("enumeration_data_type", oldName, result);
    }
    saveAllData();
    renderEnumerationDataTypesList();
    modalEnumeration.hide();
  });
}

function initCDTEditor() {
  window.CDTEditor.init(cdtEditorContainer, (result, index) => {
    if (index === null) {
      complexDataTypes.push(result);
    } else {
      const oldName = complexDataTypes[index].name;
      complexDataTypes[index] = result;
      updateDiagramElement("complex_data_type", oldName, result);
    }
    saveAllData();
    renderComplexTypesList();
    modalCDT.hide();
  });
}

function initFeatureEditor() {
  window.FeatureEditor.init(featureEditorContainer, (result, index) => {
    if (index === null) {
      featureTypes.push(result);
    } else {
      const oldName = featureTypes[index].name;
      featureTypes[index] = result;
      updateDiagramElement("feature_type", oldName, result);
    }
    saveAllData();
    renderFeatureTypesList();
    modalFeature.hide();
  });
}

function initSpatialSamplingEditor() {
  window.SpatialSamplingEditor.init(
    spatialSamplingEditorContainer,
    (result, index) => {
      if (index === null) {
        spatialSamplingFeatureTypes.push(result);
      } else {
        const oldName = spatialSamplingFeatureTypes[index].name;
        spatialSamplingFeatureTypes[index] = result;
        updateDiagramElement("spatial_sampling_feature_type", oldName, result);
      }
      saveAllData();
      renderSpatialSamplingFeatureTypesList();
      modalSpatialSampling.hide();
    }
  );
}

function initSpecimenEditor() {
  window.SpecimenEditor.init(specimenEditorContainer, (result, index) => {
    if (index === null) {
      specimenFeatureTypes.push(result);
    } else {
      const oldName = specimenFeatureTypes[index].name;
      specimenFeatureTypes[index] = result;
      updateDiagramElement("specimen_feature_type", oldName, result);
    }
    saveAllData();
    renderSpecimenFeatureTypesList();
    modalSpecimen.hide();
  });
}

function initProcessEditor() {
  window.ProcessEditor.init(processEditorContainer, (result, index) => {
    if (index === null) {
      processTypes.push(result);
    } else {
      const oldName = processTypes[index].name;
      processTypes[index] = result;
      updateDiagramElement("process_type", oldName, result);
    }
    saveAllData();
    renderProcessTypesList();
    modalProcess.hide();
  });
}

function editVocabulary(vocab, index) {
  VocabularyEditor.reset();
  VocabularyEditor.edit(vocab, index);
  modalVocabulary.show();
}

function editEnumerationDataType(enumDT, index) {
  EnumerationEditor.reset();
  EnumerationEditor.edit(enumDT, index);
  modalEnumeration.show();
}

function editComplexDataType(cdt, index) {
  CDTEditor.reset();
  CDTEditor.edit(cdt, index);
  modalCDT.show();
}

function editFeatureType(ft, index) {
  FeatureEditor.reset();
  FeatureEditor.edit(ft, index);
  modalFeature.show();
}

function editSpatialSampling(item, index) {
  SpatialSamplingEditor.reset();
  SpatialSamplingEditor.edit(item, index);
  modalSpatialSampling.show();
}

function editSpecimen(item, index) {
  SpecimenEditor.reset();
  SpecimenEditor.edit(item, index);
  modalSpecimen.show();
}

function editProcessType(pr, index) {
  ProcessEditor.reset();
  ProcessEditor.edit(pr, index);
  modalProcess.show();
}

function renderVocabulariesList() {
  renderList({
    container: vocabulariesList,
    items: vocabularies,
    nodeType: "vocabulary",
    editFunction: editVocabulary,
    deleteConfirmationMessage: "Vocabulary",
  });
}

function renderEnumerationDataTypesList() {
  renderList({
    container: enumerationDataTypesList,
    items: enumerationDataTypes,
    nodeType: "enumeration_data_type",
    editFunction: editEnumerationDataType,
    deleteConfirmationMessage: "Enumeration Data Type",
  });
}

function renderComplexTypesList() {
  renderList({
    container: leftPanelComplexList,
    items: complexDataTypes,
    nodeType: "complex_data_type",
    editFunction: editComplexDataType,
    deleteConfirmationMessage: "Complex Data Type",
  });
}

function renderFeatureTypesList() {
  renderList({
    container: leftPanelFeatureList,
    items: featureTypes,
    nodeType: "feature_type",
    editFunction: editFeatureType,
    deleteConfirmationMessage: "Feature Type",
  });
}

function renderSpatialSamplingFeatureTypesList() {
  renderList({
    container: leftPanelSpatialSamplingList,
    items: spatialSamplingFeatureTypes,
    nodeType: "spatial_sampling_feature_type",
    editFunction: editSpatialSampling,
    deleteConfirmationMessage: "Spatial Sampling Feature Type",
  });
}

function renderSpecimenFeatureTypesList() {
  renderList({
    container: leftPanelSpecimenList,
    items: specimenFeatureTypes,
    nodeType: "specimen_feature_type",
    editFunction: editSpecimen,
    deleteConfirmationMessage: "Specimen Feature Type",
  });
}

function renderProcessTypesList() {
  renderList({
    container: leftPanelProcessList,
    items: processTypes,
    nodeType: "process_type",
    editFunction: editProcessType,
    deleteConfirmationMessage: "Process Type",
  });
}

// ==============================
// UTILITY FUNCTIONS
// ==============================
function renderList({
  container,
  items,
  nodeType,
  editFunction,
  deleteConfirmationMessage,
}) {
  container.innerHTML = "";

  if (items.length === 0) {
    const emptyPlaceholder = document.createElement("div");
    emptyPlaceholder.className = "text-center text-muted p-2 small";
    emptyPlaceholder.innerHTML = '<i class="bi bi-info-circle me-1"></i>No items added yet';
    container.appendChild(emptyPlaceholder);
    return;
  }

  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card draggable-node mb-2 border-light";
    card.draggable = true;
    card.setAttribute("data-nodetype", nodeType);
    card.setAttribute("data-name", item.name);

    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("nodetype", nodeType);
      event.dataTransfer.setData("name", item.name);
      card.classList.add("dragging");
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
    });
    
    const cardBody = document.createElement("div");
    cardBody.className = "card-body p-2 d-flex justify-content-between align-items-center";
    
    let icon = "box";
    switch (nodeType) {
      case "vocabulary":
        icon = "book";
        break;
      case "enumeration_data_type":
        icon = "list-ul";
        break;
      case "complex_data_type":
        icon = "box";
        break;
      case "feature_type":
        icon = "geo-alt";
        break;
      case "spatial_sampling_feature_type":
        icon = "geo";
        break;
      case "specimen_feature_type":
        icon = "collection";
        break;
      case "process_type":
        icon = "gear-wide-connected";
        break;
    }
    
    const nameDiv = document.createElement("div");
    nameDiv.className = "d-flex align-items-center flex-grow-1 text-truncate";
    nameDiv.innerHTML = `<i class="bi bi-${icon} me-2 text-secondary"></i><span class="text-truncate" title="${item.name}">${item.name}</span>`;
    
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "d-flex ms-2";
    
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-sm btn-outline-primary me-1";
    editBtn.innerHTML = '<i class="bi bi-pencil-square"></i>';
    editBtn.style.padding = "0.1rem 0.4rem";
    editBtn.title = `Edit ${capitalizeWords(nodeType.replace(/_/g, " "))}`;
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      editFunction(item, index);
    });
    
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-outline-danger";
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
    deleteBtn.style.padding = "0.1rem 0.4rem";
    deleteBtn.title = `Delete ${capitalizeWords(nodeType.replace(/_/g, " "))}`;
    deleteBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      showConfirmation(
        `Are you sure you want to delete the ${deleteConfirmationMessage} "${item.name}"?`,
        () => {
          items.splice(index, 1);
          if (typeof graph !== "undefined") {
            const cells = graph.getCells();
            cells.forEach((cell) => {
              const data = cell.get("data");
              if (data && data.name === item.name && data.type === nodeType) {
                cell.remove();
              }
            });
          }

          saveAllData();
          renderList({
            container,
            items,
            nodeType,
            editFunction,
            deleteConfirmationMessage,
          });
        }
      );
    });

    buttonsContainer.appendChild(editBtn);
    buttonsContainer.appendChild(deleteBtn);

    cardBody.appendChild(nameDiv);
    cardBody.appendChild(buttonsContainer);
    
    card.appendChild(cardBody);
    container.appendChild(card);
  });
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

function createVocabularySelect(currentValue, onChangeCallback) {
  const select = document.createElement("select");
  select.className = "form-select form-select-sm";

  vocabularies.forEach((vocab) => {
    const option = document.createElement("option");
    option.value = vocab.name;
    option.textContent = vocab.name;
    select.appendChild(option);
  });

  select.value = currentValue;
  select.addEventListener("change", (ev) => {
    onChangeCallback(ev.target.value);
  });

  return select;
}
