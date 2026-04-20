window.SpecimenEditor = (function () {
  let container = null;
  let spNameInput,
    spDescInput,
    spSampledFeatureTypeInput,
    spSamplingTimeExtensionSelect,
    spSharedSamplingLocationTypeInput,
    spShapeTypeSelect,
    spShapeCrsInput,
    spHeightTypeSelect,
    spHeightCrsInput;
  let spNames = [],
    spProperties = [],
    spReferences = [];
  let spSamplingMethod = {
    name: "",
    description: "",
    names: [],
    properties: [],
    references: [],
  };
  let editingIndex = null;
  let onSaveCallback = null;

  function init(targetElement, onSave) {
    container = targetElement;
    onSaveCallback = onSave;
    renderBaseForm();
  }

  function renderBaseForm() {
    container.innerHTML = `
<div class="position-relative">
  <div class="card shadow-sm mb-4">
    <div class="card-header bg-light py-2 px-3">
      <h6 class="card-title d-flex align-items-center mb-0">
        <i class="bi bi-collection me-2 text-primary"></i>Specimen Editor
      </h6>
    </div>
    <div class="card-body p-3">
      <!-- Campos básicos -->
      <div class="mb-3">
        <label class="form-label"><strong>Name</strong> <span class="text-danger">*</span></label>
        <input type="text" class="form-control" id="spNameInput" placeholder="Enter specimen name">
      </div>
      <div class="mb-3">
        <label class="form-label"><strong>Description</strong> <span class="text-danger">*</span></label>
        <textarea class="form-control" id="spDescInput" rows="2" placeholder="Enter specimen description"></textarea>
      </div>

      <!-- Sección Nombres -->
      <div class="card shadow-sm mb-3">
        <div class="card-header bg-light py-2 px-3 cursor-pointer d-flex justify-content-between align-items-center" id="spNamesHeader">
          <h6 class="mb-0 small fw-bold">
            <i class="bi bi-translate me-1 text-primary"></i>Names
          </h6>
          <div>
            <button type="button" class="btn btn-sm btn-outline-primary me-2" id="btnAddSPName">
              <i class="bi bi-plus-circle"></i>
            </button>                  
          </div>
        </div>
        <div class="card-body p-2" id="spNamesContent">
          <div id="spNamesContainer" class="mb-2"></div>
          <div id="spEmptyNamesPlaceholder" class="text-center text-muted p-2 small">
            <i class="bi bi-info-circle me-1"></i>No names added yet
          </div>
        </div>
      </div>

      <!-- Sección Propiedades -->
      <div class="card shadow-sm mb-3">
        <div class="card-header bg-light py-2 px-3 d-flex justify-content-between align-items-center" id="spPropertiesHeader">
          <h6 class="card-title mb-0"><i class="bi bi-list-ul me-1 text-primary"></i>Properties</h6>
          <button type="button" class="btn btn-sm btn-outline-primary" id="btnAddSPProperty">
            <i class="bi bi-plus-circle"></i>
          </button>
        </div>
        <div class="card-body p-2" id="spPropertiesContent">
          <div id="spPropertiesContainer" class="mb-2"></div>
          <div id="spEmptyPropertiesPlaceholder" class="text-center text-muted small">
            <i class="bi bi-info-circle me-1"></i>No properties added yet
          </div>
        </div>
      </div>

      <!-- Sección Referencias -->
      <div class="card shadow-sm mb-3">
        <div class="card-header bg-light py-2 px-3 d-flex justify-content-between align-items-center" id="spReferencesHeader">
          <h6 class="card-title mb-0"><i class="bi bi-link-45deg me-1 text-primary"></i>References</h6>
          <button type="button" class="btn btn-sm btn-outline-primary" id="btnAddSPReference">
            <i class="bi bi-plus-circle"></i>
          </button>
        </div>
        <div class="card-body p-2" id="spReferencesContent">
          <div id="spReferencesContainer" class="mb-2"></div>
          <div id="spEmptyReferencesPlaceholder" class="text-center text-muted small">
            <i class="bi bi-info-circle me-1"></i>No references added yet
          </div>
        </div>
      </div>

      <!-- Sección Feature Configuration -->
      <div class="card shadow-sm mb-3">
        <div class="card-header bg-light py-2 px-3 cursor-pointer d-flex justify-content-between align-items-center" id="spFeatureConfigHeader">
          <h6 class="mb-0 small fw-bold">
            <i class="bi bi-gear me-1 text-primary"></i>Feature Configuration
          </h6>
        </div>
        <div class="card-body p-3" id="spFeatureConfigContent">
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label"><strong>Sampled Feature Type</strong> <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="spSampledFeatureTypeInput" placeholder="Enter sampled feature type">
            </div>
            <div class="col-md-6">
              <label class="form-label"><strong>Sampling Time Extension</strong> <span class="text-danger">*</span></label>
              <select class="form-select" id="spSamplingTimeExtensionSelect">
                <option value="instant">instant</option>
                <option value="period">period</option>
              </select>
            </div>
          </div>
          <div class="mb-0">
            <label class="form-label"><strong>Shared Sampling Location Type</strong></label>
            <select class="form-select" id="spSharedSamplingLocationTypeInput">
              <option value="">(none)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Sección Generated Sampling Location Type -->
      <div class="card shadow-sm mb-3">
        <div class="card-header bg-light py-2 px-3 d-flex justify-content-between align-items-center" id="spGeneratedSamplingLocationHeader">
          <h6 class="card-title mb-0"><i class="bi bi-arrows-fullscreen me-2 text-primary"></i>Generated Sampling Location Type</h6>          
        </div>
        <div class="card-body p-3" id="spGeneratedSamplingLocationContent">
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label"><strong>Shape Type</strong></label>
              <select class="form-select" id="spShapeTypeSelect">
                <option value="point">point</option>
                <option value="line">line</option>
                <option value="surface">surface</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label"><strong>Shape CRS</strong></label>
              <input type="text" class="form-control" id="spShapeCrsInput" placeholder="Enter shape CRS">
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <label class="form-label"><strong>Height Type</strong></label>
              <select class="form-select" id="spHeightTypeSelect">
                <option value="">(none)</option>
                <option value="point">point</option>
                <option value="range">range</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label"><strong>Height CRS</strong></label>
              <input type="text" class="form-control" id="spHeightCrsInput" placeholder="Enter height CRS">
            </div>
          </div>
        </div>
      </div>

      <!-- Sección Sampling Method Type -->
      <div class="card shadow-sm mb-3">
        <div class="card-header bg-light py-2 px-3 d-flex justify-content-between align-items-center" id="spSamplingMethodHeader">
          <h6 class="card-title mb-0"><i class="bi bi-arrow-repeat me-2 text-primary"></i>Sampling Method Type</h6>
          <button type="button" class="btn btn-sm btn-outline-primary" id="btnAddSPMethod">
            <i class="bi bi-plus-circle"></i>
          </button>
        </div>
        <div class="card-body p-3" id="spSamplingMethodContent">
          <div class="mb-3">
            <label class="form-label"><strong>Name</strong> <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="spMethodNameInput" placeholder="Enter sampling method name">
          </div>
          <div class="mb-3">
            <label class="form-label"><strong>Description</strong> <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="spMethodDescInput" placeholder="Enter sampling method description">
          </div>

          <!-- Sección Method Names -->
          <div class="card shadow-sm mb-3">
            <div class="card-header bg-light py-2 px-3 d-flex justify-content-between align-items-center" id="spMethodNamesHeader">
              <h6 class="card-title mb-0"><i class="bi bi-translate me-1 text-primary"></i>Method Names</h6>
              <button type="button" class="btn btn-sm btn-outline-secondary" id="btnAddSPMethodNameItem">
                <i class="bi bi-plus-circle"></i>
              </button>
            </div>
            <div class="card-body p-2" id="spMethodNamesContent">
              <div id="spMethodNamesContainer" class="mb-2"></div>
              <div id="spEmptyMethodNamesPlaceholder" class="text-center text-muted small">
                <i class="bi bi-info-circle me-1"></i>No method names added yet
              </div>
            </div>
          </div>

          <!-- Sección Method Properties -->
          <div class="card shadow-sm mb-3">
            <div class="card-header bg-light py-2 px-3 d-flex justify-content-between align-items-center" id="spMethodPropertiesHeader">
              <h6 class="card-title mb-0"><i class="bi bi-list-ul me-1 text-primary"></i>Method Properties</h6>
              <button type="button" class="btn btn-sm btn-outline-secondary" id="btnAddSPMethodProperty">
                <i class="bi bi-plus-circle"></i>
              </button>
            </div>
            <div class="card-body p-2" id="spMethodPropertiesContent">
              <div id="spMethodPropertiesContainer" class="mb-2"></div>
              <div id="spEmptyMethodPropertiesPlaceholder" class="text-center text-muted small">
                <i class="bi bi-info-circle me-1"></i>No method properties added yet
              </div>
            </div>
          </div>

          <!-- Sección Method References -->
          <div class="card shadow-sm mb-3">
            <div class="card-header bg-light py-2 px-3 d-flex justify-content-between align-items-center" id="spMethodReferencesHeader">
              <h6 class="card-title mb-0"><i class="bi bi-link-45deg me-1 text-primary"></i>Method References</h6>
              <button type="button" class="btn btn-sm btn-outline-secondary" id="btnAddSPMethodReference">
                <i class="bi bi-plus-circle"></i>
              </button>
            </div>
            <div class="card-body p-2" id="spMethodReferencesContent">
              <div id="spMethodReferencesContainer" class="mb-2"></div>
              <div id="spEmptyMethodReferencesPlaceholder" class="text-center text-muted small">
                <i class="bi bi-info-circle me-1"></i>No method references added yet
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
  <div class="position-sticky bottom-0 bg-light py-2 px-3 d-flex justify-content-end border-top shadow-sm" style="z-index:1000;">
    <button type="button" class="btn btn-primary" id="btnSaveSpecimenEditor">
      <i class="bi bi-check-circle me-1"></i>Save Specimen
    </button>
  </div>
</div>
    `;

    // Inicialización de selectores
    spNameInput = container.querySelector("#spNameInput");
    spDescInput = container.querySelector("#spDescInput");
    spSampledFeatureTypeInput = container.querySelector("#spSampledFeatureTypeInput");
    spSamplingTimeExtensionSelect = container.querySelector("#spSamplingTimeExtensionSelect");
    spSharedSamplingLocationTypeInput = container.querySelector("#spSharedSamplingLocationTypeInput");
    spShapeTypeSelect = container.querySelector("#spShapeTypeSelect");
    spShapeCrsInput = container.querySelector("#spShapeCrsInput");
    spHeightTypeSelect = container.querySelector("#spHeightTypeSelect");
    spHeightCrsInput = container.querySelector("#spHeightCrsInput");

    // Populate shared sampling location select dynamically
    populateSharedSamplingLocationOptions();

    // Toggle Generated section visibility when shared is selected
    spSharedSamplingLocationTypeInput.addEventListener("change", function () {
      const generatedContent = container.querySelector("#spGeneratedSamplingLocationContent");
      const generatedHeader = container.querySelector("#spGeneratedSamplingLocationHeader");
      if (spSharedSamplingLocationTypeInput.value) {
        generatedContent.style.display = "none";
        generatedHeader.style.display = "none";
      } else {
        generatedContent.style.display = "block";
        generatedHeader.style.display = "block";
      }
    });

    // Sampling Method inputs
    let spMethodNameInput = container.querySelector("#spMethodNameInput");
    let spMethodDescInput = container.querySelector("#spMethodDescInput");

    // Botones de acción
    const btnAddSPName = container.querySelector("#btnAddSPName");
    const btnAddSPProperty = container.querySelector("#btnAddSPProperty");
    const btnAddSPReference = container.querySelector("#btnAddSPReference");
    const btnAddSPMethodNameItem = container.querySelector("#btnAddSPMethodNameItem");
    const btnAddSPMethodProperty = container.querySelector("#btnAddSPMethodProperty");
    const btnAddSPMethodReference = container.querySelector("#btnAddSPMethodReference");
    const btnSaveSpecimenEditor = container.querySelector("#btnSaveSpecimenEditor");

    btnAddSPName.addEventListener("click", function (e) {
      e.preventDefault();
      spNames.push({ term: "", vocabulary: "" });
      renderSPNames();
    });
    btnAddSPProperty.addEventListener("click", function (e) {
      e.preventDefault();
      spProperties.push({ name: "", description: "", names: [], data_type: "", repeated: false, scope: "feature" });
      renderSPProperties();
    });
    btnAddSPReference.addEventListener("click", function (e) {
      e.preventDefault();
      spReferences.push({ name: "", description: "", names: [], referenced_type: "", repeated: false, scope: "feature" });
      renderSPReferences();
    });
    btnAddSPMethodNameItem.addEventListener("click", function (e) {
      e.preventDefault();
      spSamplingMethod.names.push({ term: "", vocabulary: "" });
      renderSPMethodNames();
    });
    btnAddSPMethodProperty.addEventListener("click", function (e) {
      e.preventDefault();
      spSamplingMethod.properties.push({ name: "", description: "", names: [], data_type: "", repeated: false, scope: "feature" });
      renderSPMethodProperties();
    });
    btnAddSPMethodReference.addEventListener("click", function (e) {
      e.preventDefault();
      spSamplingMethod.references.push({ name: "", description: "", names: [], referenced_type: "", repeated: false, scope: "feature" });
      renderSPMethodReferences();
    });
    btnSaveSpecimenEditor.addEventListener("click", save);

    // Implementación de secciones plegables
    const sections = [
      { header: "spFeatureConfigHeader", content: "spFeatureConfigContent" }, // Nueva sección
      { header: "spNamesHeader", content: "spNamesContent" },
      { header: "spPropertiesHeader", content: "spPropertiesContent" },
      { header: "spReferencesHeader", content: "spReferencesContent" },
      { header: "spGeneratedSamplingLocationHeader", content: "spGeneratedSamplingLocationContent" },
      { header: "spSamplingMethodHeader", content: "spSamplingMethodContent" },
      { header: "spMethodNamesHeader", content: "spMethodNamesContent" },
      { header: "spMethodPropertiesHeader", content: "spMethodPropertiesContent" },
      { header: "spMethodReferencesHeader", content: "spMethodReferencesContent" }
    ];

    sections.forEach((section) => {
      const header = container.querySelector(`#${section.header}`);
      const content = container.querySelector(`#${section.content}`);

      if (header) {
        header.style.cursor = "pointer";
        header.addEventListener("click", (e) => {
          if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;
          toggleSectionVisibility(content);
        });       
      }
    });

    function toggleSectionVisibility(contentElement) {
      if (contentElement.style.display === "none") {
        contentElement.style.display = "block";        
      } else {
        contentElement.style.display = "none";        
      }
    }

    // Render inicial de cada sección
    renderSPNames();
    renderSPProperties();
    renderSPReferences();
    renderSPMethodNames();
    renderSPMethodProperties();
    renderSPMethodReferences();
  }

  // Funciones de renderizado
  function renderSPNames() {
    const namesContainer = container.querySelector("#spNamesContainer");
    namesContainer.innerHTML = "";
    spNames.forEach((n, index) => {
      const card = document.createElement("div");
      card.className = "card mb-2 border-light";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body p-2";

      const row = document.createElement("div");
      row.className = "row g-2 align-items-center";

      const colTerm = document.createElement("div");
      colTerm.className = "col-md-5";
      const inputGroup = document.createElement("div");
      inputGroup.className = "input-group input-group-sm";

      const inputGroupText = document.createElement("span");
      inputGroupText.className = "input-group-text";
      inputGroupText.innerHTML = '<i class="bi bi-type"></i>';

      const inputTerm = document.createElement("input");
      inputTerm.className = "form-control";
      inputTerm.placeholder = "Enter term";
      inputTerm.value = n.term;
      inputTerm.addEventListener("input", (ev) => {
        spNames[index].term = ev.target.value;
      });

      inputGroup.appendChild(inputGroupText);
      inputGroup.appendChild(inputTerm);
      colTerm.appendChild(inputGroup);

      const colVoc = document.createElement("div");
      colVoc.className = "col-md-5";
      const vocGroup = document.createElement("div");
      vocGroup.className = "input-group input-group-sm";

      const vocGroupText = document.createElement("span");
      vocGroupText.className = "input-group-text";
      vocGroupText.innerHTML = '<i class="bi bi-book"></i>';

      const selectVoc = createVocabularySelect(n.vocabulary || "", (newValue) => {
        spNames[index].vocabulary = newValue;
      });
      selectVoc.className = "form-select";

      vocGroup.appendChild(vocGroupText);
      vocGroup.appendChild(selectVoc);
      colVoc.appendChild(vocGroup);

      const colBtn = document.createElement("div");
      colBtn.className = "col-md-2 text-end";
      const btnRem = document.createElement("button");
      btnRem.className = "btn btn-outline-danger btn-sm";
      btnRem.innerHTML = '<i class="bi bi-trash"></i>';
      btnRem.title = "Remove this name";
      btnRem.addEventListener("click", () => {
        spNames.splice(index, 1);
        renderSPNames();
        updatePlaceholders();
      });
      colBtn.appendChild(btnRem);

      row.appendChild(colTerm);
      row.appendChild(colVoc);
      row.appendChild(colBtn);

      cardBody.appendChild(row);
      card.appendChild(cardBody);
      namesContainer.appendChild(card);
    });

    const placeholder = container.querySelector("#spEmptyNamesPlaceholder");
    placeholder.style.display = spNames.length === 0 ? "block" : "none";
  }

  function renderSPProperties() {
    const containerEl = container.querySelector("#spPropertiesContainer");
    containerEl.innerHTML = "";
    spProperties.forEach((prop, i) => {
      const card = document.createElement("div");
      card.className = "card mb-3 shadow-sm";
      const headerDiv = document.createElement("div");
      headerDiv.className = "card-header bg-light d-flex justify-content-between align-items-center";
      const headerLeft = document.createElement("div");
      headerLeft.className = "d-flex align-items-center flex-grow-1";
      const toggleBtn = document.createElement("button");
      toggleBtn.className = "btn btn-sm btn-outline-secondary me-2";
      toggleBtn.style.width = "30px";
      toggleBtn.innerHTML = '<i class="bi bi-dash-lg"></i>';
      toggleBtn.addEventListener("click", () => {
        const content = card.querySelector(".property-content");
        if (content.style.display === "none") {
          content.style.display = "block";
          toggleBtn.innerHTML = '<i class="bi bi-dash-lg"></i>';
        } else {
          content.style.display = "none";
          toggleBtn.innerHTML = '<i class="bi bi-plus-lg"></i>';
        }
      });
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.className = "form-control form-control-sm border-0";
      nameInput.placeholder = "Property name";
      nameInput.value = prop.name;
      nameInput.addEventListener("input", (e) => {
        spProperties[i].name = e.target.value;
      });
      headerLeft.appendChild(toggleBtn);
      headerLeft.appendChild(nameInput);
      const btnRemove = document.createElement("button");
      btnRemove.className = "btn btn-outline-danger btn-sm";
      btnRemove.innerHTML = '<i class="bi bi-trash"></i>';
      btnRemove.addEventListener("click", () => {
        spProperties.splice(i, 1);
        renderSPProperties();
      });
      headerDiv.appendChild(headerLeft);
      headerDiv.appendChild(btnRemove);

      const contentDiv = document.createElement("div");
      contentDiv.className = "card-body property-content p-3";
      contentDiv.style.display = "block";

      // Descripción
      const descGroup = document.createElement("div");
      descGroup.className = "mb-3";
      const lblDesc = document.createElement("label");
      lblDesc.className = "form-label";
      lblDesc.innerHTML = '<i class="bi bi-file-text me-1"></i> Description';
      const inpDesc = document.createElement("textarea");
      inpDesc.className = "form-control";
      inpDesc.rows = 2;
      inpDesc.placeholder = "Enter property description";
      inpDesc.value = prop.description;
      inpDesc.addEventListener("input", (e) => {
        spProperties[i].description = e.target.value;
      });
      descGroup.appendChild(lblDesc);
      descGroup.appendChild(inpDesc);

      // Row for Data Type, Repeated, Scope
      const row = document.createElement("div");
      row.className = "row mb-3";
      const colDT = document.createElement("div");
      colDT.className = "col-md-4";
      const dtLabel = document.createElement("label");
      dtLabel.className = "form-label";
      dtLabel.innerHTML = '<i class="bi bi-braces me-1"></i> Data Type';
      const inpDT = document.createElement("input");
      inpDT.type = "text";
      inpDT.className = "form-control";
      inpDT.placeholder = "e.g., string, number, Date";
      inpDT.value = prop.data_type;
      inpDT.addEventListener("input", (e) => {
        spProperties[i].data_type = e.target.value;
      });
      colDT.appendChild(dtLabel);
      colDT.appendChild(inpDT);

      const colRep = document.createElement("div");
      colRep.className = "col-md-4";
      const repLabel = document.createElement("label");
      repLabel.className = "form-label";
      repLabel.innerHTML = '<i class="bi bi-repeat me-1"></i> Repeated';
      const selRep = document.createElement("select");
      selRep.className = "form-select";
      selRep.innerHTML = `<option value="false">false</option><option value="true">true</option>`;
      selRep.value = prop.repeated.toString();
      selRep.addEventListener("change", (e) => {
        spProperties[i].repeated = e.target.value === "true";
      });
      colRep.appendChild(repLabel);
      colRep.appendChild(selRep);

      const colScope = document.createElement("div");
      colScope.className = "col-md-4";
      const scopeLabel = document.createElement("label");
      scopeLabel.className = "form-label";
      scopeLabel.innerHTML = '<i class="bi bi-layers me-1"></i> Scope';
      const selScope = document.createElement("select");
      selScope.className = "form-select";
      selScope.innerHTML = `<option value="feature">feature</option><option value="valid_time_period">valid_time_period</option>`;
      selScope.value = prop.scope;
      selScope.addEventListener("change", (e) => {
        spProperties[i].scope = e.target.value;
      });
      colScope.appendChild(scopeLabel);
      colScope.appendChild(selScope);

      row.appendChild(colDT);
      row.appendChild(colRep);
      row.appendChild(colScope);

      contentDiv.appendChild(descGroup);
      contentDiv.appendChild(row);
      card.appendChild(headerDiv);
      card.appendChild(contentDiv);
      containerEl.appendChild(card);
    });
    const placeholder = container.querySelector("#spEmptyPropertiesPlaceholder");
    placeholder.style.display = spProperties.length === 0 ? "block" : "none";
  }

  function getReferenceTypeOptions() {
  let options = '<option value="">Select a Reference Type</option>';

  // Feature Types
  if (typeof featureTypes !== "undefined" && Array.isArray(featureTypes) && featureTypes.length > 0) {
    featureTypes.forEach((ft) => {
      options += `<option value="${ft.name}">${ft.name} (Feature Type)</option>`;
    });
  }

  // Spatial Sampling Feature Types
  if (typeof spatialSamplingFeatureTypes !== "undefined" && Array.isArray(spatialSamplingFeatureTypes) && spatialSamplingFeatureTypes.length > 0) {
    spatialSamplingFeatureTypes.forEach((ssft) => {
      options += `<option value="${ssft.name}">${ssft.name} (Spatial Sampling Feature Type)</option>`;
    });
  }

  // Specimen Feature Types
  if (typeof specimenFeatureTypes !== "undefined" && Array.isArray(specimenFeatureTypes) && specimenFeatureTypes.length > 0) {
    specimenFeatureTypes.forEach((sft) => {
      options += `<option value="${sft.name}">${sft.name} (Specimen Feature Type)</option>`;
    });
  }

  // Process Types
  if (typeof processTypes !== "undefined" && Array.isArray(processTypes) && processTypes.length > 0) {
    processTypes.forEach((pt) => {
      options += `<option value="${pt.name}">${pt.name} (Process Type)</option>`;
    });
  }

  return options;
}

function renderSPReferences() {
    const containerEl = container.querySelector("#spReferencesContainer");
    containerEl.innerHTML = "";
    spReferences.forEach((ref, i) => {
      const card = document.createElement("div");
      card.className = "card mb-3 shadow-sm";
      const headerDiv = document.createElement("div");
      headerDiv.className = "card-header bg-light d-flex justify-content-between align-items-center";
      const headerLeft = document.createElement("div");
      headerLeft.className = "d-flex align-items-center flex-grow-1";
      const toggleBtn = document.createElement("button");
      toggleBtn.className = "btn btn-sm btn-outline-secondary me-2";
      toggleBtn.style.width = "30px";
      toggleBtn.innerHTML = '<i class="bi bi-dash-lg"></i>';
      toggleBtn.addEventListener("click", () => {
        const content = card.querySelector(".reference-content");
        if (content.style.display === "none") {
          content.style.display = "block";
          toggleBtn.innerHTML = '<i class="bi bi-dash-lg"></i>';
        } else {
          content.style.display = "none";
          toggleBtn.innerHTML = '<i class="bi bi-plus-lg"></i>';
        }
      });
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.className = "form-control form-control-sm border-0";
      nameInput.placeholder = "Reference name";
      nameInput.value = ref.name;
      nameInput.addEventListener("input", (e) => {
        spReferences[i].name = e.target.value;
      });
      headerLeft.appendChild(toggleBtn);
      headerLeft.appendChild(nameInput);
      const btnRemove = document.createElement("button");
      btnRemove.className = "btn btn-outline-danger btn-sm";
      btnRemove.innerHTML = '<i class="bi bi-trash"></i>';
      btnRemove.addEventListener("click", () => {
        spReferences.splice(i, 1);
        renderSPReferences();
      });
      headerDiv.appendChild(headerLeft);
      headerDiv.appendChild(btnRemove);

      const contentDiv = document.createElement("div");
      contentDiv.className = "card-body reference-content p-3";
      contentDiv.style.display = "block";
      const descInput = document.createElement("input");
      descInput.type = "text";
      descInput.className = "form-control form-control-sm mb-2";
      descInput.placeholder = "Description";
      descInput.value = ref.description;
      descInput.addEventListener("input", (e) => {
        spReferences[i].description = e.target.value;
      });
      const refTypeInput = document.createElement("input");
      refTypeInput.type = "text";
      refTypeInput.className = "form-control form-control-sm mb-2";
      refTypeInput.placeholder = "Referenced type";
      refTypeInput.value = ref.referenced_type;
      refTypeInput.addEventListener("input", (e) => {
        spReferences[i].referenced_type = e.target.value;
      });
      const selRep = document.createElement("select");
      selRep.className = "form-select form-select-sm mb-2";
      selRep.innerHTML = `<option value="false">false</option><option value="true">true</option>`;
      selRep.value = ref.repeated.toString();
      selRep.addEventListener("change", (e) => {
        spReferences[i].repeated = e.target.value === "true";
      });
      const selScope = document.createElement("select");
      selScope.className = "form-select form-select-sm mb-2";
      selScope.innerHTML = `<option value="feature">feature</option><option value="valid_time_period">valid_time_period</option>`;
      selScope.value = ref.scope;
      selScope.addEventListener("change", (e) => {
        spReferences[i].scope = e.target.value;
      });

      // Sección de nombres dentro de la referencia
      const namesSection = document.createElement("div");
      namesSection.className = "mb-2";
      const namesHeader = document.createElement("div");
      namesHeader.className = "d-flex justify-content-between align-items-center mb-1";
      namesHeader.innerHTML = '<strong>Reference Names</strong>';
      const btnAddRefName = document.createElement("button");
      btnAddRefName.className = "btn btn-sm btn-outline-secondary";
      btnAddRefName.innerHTML = '<i class="bi bi-plus-circle"></i>';
      btnAddRefName.addEventListener("click", function () {
        spReferences[i].names.push({ term: "", vocabulary: "" });
        renderSPReferences();
      });
      namesHeader.appendChild(btnAddRefName);
      const namesContainer = document.createElement("div");
      if (!ref.names || ref.names.length === 0) {
        namesContainer.innerHTML = '<div class="text-center text-muted small"><i class="bi bi-info-circle me-1"></i>No reference names added yet</div>';
      } else {
        ref.names.forEach((nm, j) => {
          const row = document.createElement("div");
          row.className = "row g-2 mb-1 align-items-center";
          const colTerm = document.createElement("div");
          colTerm.className = "col";
          const termInput = document.createElement("input");
          termInput.type = "text";
          termInput.className = "form-control form-control-sm";
          termInput.placeholder = "Term";
          termInput.value = nm.term;
          termInput.addEventListener("input", (e) => {
            spReferences[i].names[j].term = e.target.value;
          });
          colTerm.appendChild(termInput);
          const colVoc = document.createElement("div");
          colVoc.className = "col";
          const vocInput = document.createElement("input");
          vocInput.type = "text";
          vocInput.className = "form-control form-control-sm";
          vocInput.placeholder = "Vocabulary";
          vocInput.value = nm.vocabulary;
          vocInput.addEventListener("input", (e) => {
            spReferences[i].names[j].vocabulary = e.target.value;
          });
          colVoc.appendChild(vocInput);
          const colBtn = document.createElement("div");
          colBtn.className = "col-auto";
          const btnRem = document.createElement("button");
          btnRem.className = "btn btn-danger btn-sm";
          btnRem.textContent = "-";
          btnRem.addEventListener("click", function () {
            spReferences[i].names.splice(j, 1);
            renderSPReferences();
          });
          colBtn.appendChild(btnRem);
          row.appendChild(colTerm);
          row.appendChild(colVoc);
          row.appendChild(colBtn);
          namesContainer.appendChild(row);
        });
      }
      namesSection.appendChild(namesHeader);
      namesSection.appendChild(namesContainer);
      contentDiv.appendChild(descInput);
      contentDiv.appendChild(refTypeInput);
      contentDiv.appendChild(selRep);
      contentDiv.appendChild(selScope);
      contentDiv.appendChild(namesSection);
      card.appendChild(headerDiv);
      card.appendChild(contentDiv);
      containerEl.appendChild(card);
    });
    const placeholder = container.querySelector("#spEmptyReferencesPlaceholder");
    placeholder.style.display = spReferences.length === 0 ? "block" : "none";
  }

  function renderSPMethodNames() {
    const containerEl = container.querySelector("#spMethodNamesContainer");
    containerEl.innerHTML = "";
    spSamplingMethod.names.forEach((n, i) => {
      const row = document.createElement("div");
      row.className = "row g-2 mb-1 align-items-center";
      const colTerm = document.createElement("div");
      colTerm.className = "col";
      const termInput = document.createElement("input");
      termInput.type = "text";
      termInput.className = "form-control form-control-sm";
      termInput.placeholder = "Term";
      termInput.value = n.term;
      termInput.addEventListener("input", (e) => {
        spSamplingMethod.names[i].term = e.target.value;
      });
      colTerm.appendChild(termInput);
      const colVoc = document.createElement("div");
      colVoc.className = "col";
      const vocInput = document.createElement("input");
      vocInput.type = "text";
      vocInput.className = "form-control form-control-sm";
      vocInput.placeholder = "Vocabulary";
      vocInput.value = n.vocabulary;
      vocInput.addEventListener("input", (e) => {
        spSamplingMethod.names[i].vocabulary = e.target.value;
      });
      colVoc.appendChild(vocInput);
      const colBtn = document.createElement("div");
      colBtn.className = "col-auto";
      const btnRem = document.createElement("button");
      btnRem.className = "btn btn-danger btn-sm";
      btnRem.textContent = "-";
      btnRem.addEventListener("click", () => {
        spSamplingMethod.names.splice(i, 1);
        renderSPMethodNames();
      });
      colBtn.appendChild(btnRem);
      row.appendChild(colTerm);
      row.appendChild(colVoc);
      row.appendChild(colBtn);
      containerEl.appendChild(row);
    });
    const placeholder = container.querySelector("#spEmptyMethodNamesPlaceholder");
    placeholder.style.display = spSamplingMethod.names.length === 0 ? "block" : "none";
  }

  function renderSPMethodProperties() {
    const containerEl = container.querySelector("#spMethodPropertiesContainer");
    containerEl.innerHTML = "";
    spSamplingMethod.properties.forEach((prop, i) => {
      const card = document.createElement("div");
      card.className = "card mb-3 shadow-sm";
      const headerDiv = document.createElement("div");
      headerDiv.className = "card-header bg-light d-flex justify-content-between align-items-center";
      const headerLeft = document.createElement("div");
      headerLeft.className = "d-flex align-items-center flex-grow-1";
      const toggleBtn = document.createElement("button");
      toggleBtn.className = "btn btn-sm btn-outline-secondary me-2";
      toggleBtn.style.width = "30px";
      toggleBtn.innerHTML = '<i class="bi bi-dash-lg"></i>';
      toggleBtn.addEventListener("click", () => {
        const content = card.querySelector(".method-property-content");
        if (content.style.display === "none") {
          content.style.display = "block";
          toggleBtn.innerHTML = '<i class="bi bi-dash-lg"></i>';
        } else {
          content.style.display = "none";
          toggleBtn.innerHTML = '<i class="bi bi-plus-lg"></i>';
        }
      });
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.className = "form-control form-control-sm border-0";
      nameInput.placeholder = "Property name";
      nameInput.value = prop.name;
      nameInput.addEventListener("input", (e) => {
        spSamplingMethod.properties[i].name = e.target.value;
      });
      headerLeft.appendChild(toggleBtn);
      headerLeft.appendChild(nameInput);
      const btnRemove = document.createElement("button");
      btnRemove.className = "btn btn-outline-danger btn-sm";
      btnRemove.innerHTML = '<i class="bi bi-trash"></i>';
      btnRemove.addEventListener("click", () => {
        spSamplingMethod.properties.splice(i, 1);
        renderSPMethodProperties();
      });
      headerDiv.appendChild(headerLeft);
      headerDiv.appendChild(btnRemove);

      const contentDiv = document.createElement("div");
      contentDiv.className = "card-body method-property-content p-3";
      contentDiv.style.display = "block";

      // Descripción
      const descGroup = document.createElement("div");
      descGroup.className = "mb-3";
      const lblDesc = document.createElement("label");
      lblDesc.className = "form-label";
      lblDesc.innerHTML = '<i class="bi bi-file-text me-1"></i> Description';
      const inpDesc = document.createElement("textarea");
      inpDesc.className = "form-control";
      inpDesc.rows = 2;
      inpDesc.placeholder = "Enter property description";
      inpDesc.value = prop.description;
      inpDesc.addEventListener("input", (e) => {
        spSamplingMethod.properties[i].description = e.target.value;
      });
      descGroup.appendChild(lblDesc);
      descGroup.appendChild(inpDesc);

      // Row for Data Type, Repeated, Scope
      const row = document.createElement("div");
      row.className = "row mb-3";
      const colDT = document.createElement("div");
      colDT.className = "col-md-4";
      const dtLabel = document.createElement("label");
      dtLabel.className = "form-label";
      dtLabel.innerHTML = '<i class="bi bi-braces me-1"></i> Data Type';
      const inpDT = document.createElement("input");
      inpDT.type = "text";
      inpDT.className = "form-control";
      inpDT.placeholder = "e.g., string, number, Date";
      inpDT.value = prop.data_type;
      inpDT.addEventListener("input", (e) => {
        spSamplingMethod.properties[i].data_type = e.target.value;
      });
      colDT.appendChild(dtLabel);
      colDT.appendChild(inpDT);

      const colRep = document.createElement("div");
      colRep.className = "col-md-4";
      const repLabel = document.createElement("label");
      repLabel.className = "form-label";
      repLabel.innerHTML = '<i class="bi bi-repeat me-1"></i> Repeated';
      const selRep = document.createElement("select");
      selRep.className = "form-select";
      selRep.innerHTML = `<option value="false">false</option><option value="true">true</option>`;
      selRep.value = prop.repeated.toString();
      selRep.addEventListener("change", (e) => {
        spSamplingMethod.properties[i].repeated = e.target.value === "true";
      });
      colRep.appendChild(repLabel);
      colRep.appendChild(selRep);

      const colScope = document.createElement("div");
      colScope.className = "col-md-4";
      const scopeLabel = document.createElement("label");
      scopeLabel.className = "form-label";
      scopeLabel.innerHTML = '<i class="bi bi-layers me-1"></i> Scope';
      const selScope = document.createElement("select");
      selScope.className = "form-select";
      selScope.innerHTML = `<option value="feature">feature</option><option value="valid_time_period">valid_time_period</option>`;
      selScope.value = prop.scope;
      selScope.addEventListener("change", (e) => {
        spSamplingMethod.properties[i].scope = e.target.value;
      });
      colScope.appendChild(scopeLabel);
      colScope.appendChild(selScope);

      row.appendChild(colDT);
      row.appendChild(colRep);
      row.appendChild(colScope);

      contentDiv.appendChild(descGroup);
      contentDiv.appendChild(row);
      card.appendChild(headerDiv);
      card.appendChild(contentDiv);
      containerEl.appendChild(card);
    });

    const placeholder = container.querySelector("#spEmptyMethodPropertiesPlaceholder");
    placeholder.style.display = spSamplingMethod.properties.length === 0 ? "block" : "none";
  }

  function renderSPMethodReferences() {
    const containerEl = container.querySelector("#spMethodReferencesContainer");
    containerEl.innerHTML = "";
    spSamplingMethod.references.forEach((ref, i) => {
      const card = document.createElement("div");
      card.className = "card mb-3 shadow-sm";
      const headerDiv = document.createElement("div");
      headerDiv.className = "card-header bg-light d-flex justify-content-between align-items-center";
      const headerLeft = document.createElement("div");
      headerLeft.className = "d-flex align-items-center flex-grow-1";
      const toggleBtn = document.createElement("button");
      toggleBtn.className = "btn btn-sm btn-outline-secondary me-2";
      toggleBtn.style.width = "30px";
      toggleBtn.innerHTML = '<i class="bi bi-dash-lg"></i>';
      toggleBtn.addEventListener("click", () => {
        const content = card.querySelector(".method-reference-content");
        if (content.style.display === "none") {
          content.style.display = "block";
          toggleBtn.innerHTML = '<i class="bi bi-dash-lg"></i>';
        } else {
          content.style.display = "none";
          toggleBtn.innerHTML = '<i class="bi bi-plus-lg"></i>';
        }
      });
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.className = "form-control form-control-sm border-0";
      nameInput.placeholder = "Reference name";
      nameInput.value = ref.name;
      nameInput.addEventListener("input", (e) => {
        spSamplingMethod.references[i].name = e.target.value;
      });
      headerLeft.appendChild(toggleBtn);
      headerLeft.appendChild(nameInput);
      const btnRemove = document.createElement("button");
      btnRemove.className = "btn btn-outline-danger btn-sm";
      btnRemove.innerHTML = '<i class="bi bi-trash"></i>';
      btnRemove.addEventListener("click", () => {
        spSamplingMethod.references.splice(i, 1);
        renderSPMethodReferences();
      });
      headerDiv.appendChild(headerLeft);
      headerDiv.appendChild(btnRemove);

      const contentDiv = document.createElement("div");
      contentDiv.className = "card-body method-reference-content p-3";
      contentDiv.style.display = "block";

      // Descripción
      const descGroup = document.createElement("div");
      descGroup.className = "mb-3";
      const lblDesc = document.createElement("label");
      lblDesc.className = "form-label";
      lblDesc.innerHTML = '<i class="bi bi-file-text me-1"></i> Description';
      const inpDesc = document.createElement("textarea");
      inpDesc.className = "form-control";
      inpDesc.rows = 2;
      inpDesc.placeholder = "Enter reference description";
      inpDesc.value = ref.description;
      inpDesc.addEventListener("input", (e) => {
        spSamplingMethod.references[i].description = e.target.value;
      });
      descGroup.appendChild(lblDesc);
      descGroup.appendChild(inpDesc);

      // Row for Referenced Type, Repeated, Scope
      const row = document.createElement("div");
      row.className = "row mb-3";
      const colRT = document.createElement("div");
      colRT.className = "col-md-4";
      const rtLabel = document.createElement("label");
      rtLabel.className = "form-label";
      rtLabel.innerHTML = '<i class="bi bi-box-arrow-up-right me-1"></i> Referenced Type';
      const inpRT = document.createElement("input");
      inpRT.type = "text";
      inpRT.className = "form-control";
      inpRT.placeholder = "Enter referenced type";
      inpRT.value = ref.referenced_type;
      inpRT.addEventListener("input", (e) => {
        spSamplingMethod.references[i].referenced_type = e.target.value;
      });
      colRT.appendChild(rtLabel);
      colRT.appendChild(inpRT);

      const colRep = document.createElement("div");
      colRep.className = "col-md-4";
      const repLabel = document.createElement("label");
      repLabel.className = "form-label";
      repLabel.innerHTML = '<i class="bi bi-repeat me-1"></i> Repeated';
      const selRep = document.createElement("select");
      selRep.className = "form-select";
      selRep.innerHTML = `<option value="false">false</option><option value="true">true</option>`;
      selRep.value = ref.repeated.toString();
      selRep.addEventListener("change", (e) => {
        spSamplingMethod.references[i].repeated = e.target.value === "true";
      });
      colRep.appendChild(repLabel);
      colRep.appendChild(selRep);

      const colScope = document.createElement("div");
      colScope.className = "col-md-4";
      const scopeLabel = document.createElement("label");
      scopeLabel.className = "form-label";
      scopeLabel.innerHTML = '<i class="bi bi-layers me-1"></i> Scope';
      const selScope = document.createElement("select");
      selScope.className = "form-select";
      selScope.innerHTML = `<option value="feature">feature</option><option value="valid_time_period">valid_time_period</option>`;
      selScope.value = ref.scope;
      selScope.addEventListener("change", (e) => {
        spSamplingMethod.references[i].scope = e.target.value;
      });
      colScope.appendChild(scopeLabel);
      colScope.appendChild(selScope);

      row.appendChild(colRT);
      row.appendChild(colRep);
      row.appendChild(colScope);

      contentDiv.appendChild(descGroup);
      contentDiv.appendChild(row);
      card.appendChild(headerDiv);
      card.appendChild(contentDiv);
      containerEl.appendChild(card);
    });

    const placeholder = container.querySelector("#spEmptyMethodReferencesPlaceholder");
    placeholder.style.display = spSamplingMethod.references.length === 0 ? "block" : "none";
  }

  function populateSharedSamplingLocationOptions() {
    if (!spSharedSamplingLocationTypeInput) return;
    const currentValue = spSharedSamplingLocationTypeInput.value;
    spSharedSamplingLocationTypeInput.innerHTML = '<option value="">(none)</option>';
    if (typeof featureTypes !== "undefined" && Array.isArray(featureTypes)) {
      featureTypes.forEach((ft) => {
        spSharedSamplingLocationTypeInput.innerHTML += `<option value="${ft.name}">${ft.name}</option>`;
      });
    }
    if (typeof spatialSamplingFeatureTypes !== "undefined" && Array.isArray(spatialSamplingFeatureTypes)) {
      spatialSamplingFeatureTypes.forEach((ssft) => {
        spSharedSamplingLocationTypeInput.innerHTML += `<option value="${ssft.name}">${ssft.name}</option>`;
      });
    }
    spSharedSamplingLocationTypeInput.value = currentValue;
  }

  // Función save() similar a la de editor-process.js
  function save() {
    if (
      !spNameInput.value.trim() ||
      !spDescInput.value.trim() ||
      !spSampledFeatureTypeInput.value.trim() ||
      !spSamplingTimeExtensionSelect.value
    ) {
      showNotification("Please fill all required specimen fields.");
      return;
    }
    const result = {
      name: spNameInput.value.trim(),
      description: spDescInput.value.trim(),
      names: spNames,
      properties: spProperties,
      references: spReferences,
      sampled_feature_type: spSampledFeatureTypeInput.value.trim(),
      sampling_time_extension: spSamplingTimeExtensionSelect.value,
      shared_sampling_location_type: spSharedSamplingLocationTypeInput.value.trim(),
      generated_sampling_location_type: spSharedSamplingLocationTypeInput.value.trim() ? {} : {
        shape_type: spShapeTypeSelect.value,
        shape_crs: spShapeCrsInput.value.trim(),
        height_type: spHeightTypeSelect.value,
        height_crs: spHeightCrsInput.value.trim()
      },
      sampling_method_type: {
        name: container.querySelector("#spMethodNameInput").value.trim(),
        description: container.querySelector("#spMethodDescInput").value.trim(),
        names: spSamplingMethod.names,
        properties: spSamplingMethod.properties,
        references: spSamplingMethod.references
      }
    };
    if (onSaveCallback) onSaveCallback(result, editingIndex);
  }

  function edit(specimen, index) {
    editingIndex = index;
    spNameInput.value = specimen.name || "";
    spDescInput.value = specimen.description || "";
    spNames = specimen.names || [];
    spProperties = specimen.properties || [];
    spReferences = specimen.references || [];
    spSampledFeatureTypeInput.value = specimen.sampled_feature_type || "";
    spSamplingTimeExtensionSelect.value = specimen.sampling_time_extension || "instant";
    populateSharedSamplingLocationOptions();
    spSharedSamplingLocationTypeInput.value = specimen.shared_sampling_location_type || "";

    // Toggle Generated section visibility based on shared value
    const generatedContent = container.querySelector("#spGeneratedSamplingLocationContent");
    const generatedHeader = container.querySelector("#spGeneratedSamplingLocationHeader");
    if (specimen.shared_sampling_location_type && specimen.shared_sampling_location_type.trim() !== "") {
      generatedContent.style.display = "none";
      generatedHeader.style.display = "none";
    } else {
      generatedContent.style.display = "block";
      generatedHeader.style.display = "block";
    }

    if (specimen.generated_sampling_location_type) {
      spShapeTypeSelect.value = specimen.generated_sampling_location_type.shape_type || "point";
      spShapeCrsInput.value = specimen.generated_sampling_location_type.shape_crs || "";
      spHeightTypeSelect.value = specimen.generated_sampling_location_type.height_type || "";
      spHeightCrsInput.value = specimen.generated_sampling_location_type.height_crs || "";
    }
    let method = specimen.sampling_method_type || { name: "", description: "", names: [], properties: [], references: [] };
    container.querySelector("#spMethodNameInput").value = method.name || "";
    container.querySelector("#spMethodDescInput").value = method.description || "";
    spSamplingMethod.names = method.names || [];
    spSamplingMethod.properties = method.properties || [];
    spSamplingMethod.references = method.references || [];
    renderSPNames();
    renderSPProperties();
    renderSPReferences();
    renderSPMethodNames();
    renderSPMethodProperties();
    renderSPMethodReferences();
  }

  function reset() {
    editingIndex = null;
    spNameInput.value = "";
    spDescInput.value = "";
    spNames = [];
    spProperties = [];
    spReferences = [];
    spSampledFeatureTypeInput.value = "";
    spSamplingTimeExtensionSelect.value = "instant";
    populateSharedSamplingLocationOptions();
    spSharedSamplingLocationTypeInput.value = "";
    // Restore Generated section visibility
    const generatedContent = container.querySelector("#spGeneratedSamplingLocationContent");
    const generatedHeader = container.querySelector("#spGeneratedSamplingLocationHeader");
    if (generatedContent) generatedContent.style.display = "block";
    if (generatedHeader) generatedHeader.style.display = "block";
    spShapeTypeSelect.value = "point";
    spShapeCrsInput.value = "";
    spHeightTypeSelect.value = "";
    spHeightCrsInput.value = "";
    container.querySelector("#spMethodNameInput").value = "";
    container.querySelector("#spMethodDescInput").value = "";
    spSamplingMethod.names = [];
    spSamplingMethod.properties = [];
    spSamplingMethod.references = [];
    renderSPNames();
    renderSPProperties();
    renderSPReferences();
    renderSPMethodNames();
    renderSPMethodProperties();
    renderSPMethodReferences();
  }

  return { init, edit, reset };
})();
