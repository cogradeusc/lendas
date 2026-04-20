window.SpatialSamplingEditor = (function () {
  let container = null;

  let ssfNameInput, ssfDescInput;
  let shapeTypeSelect, shapeCrsInput;
  let heightTypeSelect, heightCrsInput;
  let sampledFeatureTypeInput;

  let currentNames = [];
  let currentProperties = [];
  let currentReferences = [];

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
              <i class="bi bi-geo me-2 text-primary"></i>Spatial Sampling Feature Editor
            </h6>
          </div>
          <div class="card-body p-3">
            <div class="mb-2">
              <label class="form-label mb-1 small fw-bold d-flex align-items-center">
                <i class="bi bi-tag me-1 text-primary"></i>Name
                <span class="ms-1 text-danger">*</span>
              </label>
              <input type="text" class="form-control form-control-sm shadow-sm" id="ssfNameInput" placeholder="Enter feature name" />
            </div>
            <div class="mb-3">
              <label class="form-label mb-1 small fw-bold d-flex align-items-center">
                <i class="bi bi-file-text me-1 text-primary"></i>Description
                <span class="ms-1 text-danger">*</span>
              </label>
              <textarea class="form-control form-control-sm shadow-sm" id="ssfDescInput" rows="2" placeholder="Enter a short description"></textarea>
            </div>

            <div class="card shadow-sm mb-3">
              <div class="card-header bg-light py-2 px-3 cursor-pointer d-flex justify-content-between align-items-center" id="namesHeader">
                <h6 class="mb-0 small fw-bold">
                  <i class="bi bi-translate me-1 text-primary"></i>Names
                </h6>
                <div>
                  <button type="button" class="btn btn-sm btn-outline-primary me-2" id="btnAddSSFName">
                    <i class="bi bi-plus-circle"></i>
                  </button>                  
                </div>
              </div>
              <div class="card-body p-2" id="namesContent">
                <div id="ssfNamesContainer" class="mb-2"></div>
                <div id="ssfEmptyNamesPlaceholder" class="text-center text-muted p-2 small">
                  <i class="bi bi-info-circle me-1"></i>No names added yet
                </div>
              </div>
            </div>

            <div class="card shadow-sm mb-3">
              <div class="card-header bg-light py-2 px-3 cursor-pointer d-flex justify-content-between align-items-center" id="propertiesHeader">
                <h6 class="mb-0 small fw-bold">
                  <i class="bi bi-list-ul me-1 text-primary"></i>Properties
                </h6>
                <div>
                  <button type="button" class="btn btn-sm btn-outline-primary me-2" id="btnAddSSFProperty">
                    <i class="bi bi-plus-circle"></i>
                  </button>                  
                </div>
              </div>
              <div class="card-body p-2" id="propertiesContent">
                <div id="ssfPropertiesContainer" class="mb-2"></div>
                <div id="ssfEmptyPropertiesPlaceholder" class="text-center text-muted p-2 small">
                  <i class="bi bi-info-circle me-1"></i>No properties added yet
                </div>
              </div>
            </div>

            <div class="card shadow-sm mb-3">
              <div class="card-header bg-light py-2 px-3 cursor-pointer d-flex justify-content-between align-items-center" id="referencesHeader">
                <h6 class="mb-0 small fw-bold">
                  <i class="bi bi-link-45deg me-1 text-primary"></i>References
                </h6>
                <div>
                  <button type="button" class="btn btn-sm btn-outline-primary me-2" id="btnAddSSFReference">
                    <i class="bi bi-plus-circle"></i>
                  </button>                  
                </div>
              </div>
              <div class="card-body p-2" id="referencesContent">
                <div id="ssfReferencesContainer" class="mb-2"></div>
                <div id="ssfEmptyReferencesPlaceholder" class="text-center text-muted p-2 small">
                  <i class="bi bi-info-circle me-1"></i>No references added yet
                </div>
              </div>
            </div>

            <div class="card shadow-sm">
              <div class="card-header bg-light py-2 px-3 cursor-pointer" id="spatialConfigHeader">
                <h6 class="mb-0 small fw-bold d-flex align-items-center justify-content-between">
                  <span><i class="bi bi-geo-alt me-1 text-primary"></i>Spatial Configuration</span>                  
                </h6>
              </div>
              <div class="card-body p-3" id="spatialConfigContent">
                <div class="mb-3">
                  <label class="form-label mb-1 small fw-bold d-flex align-items-center">
                    <i class="bi bi-pin-map me-1 text-primary"></i>Sampled Feature Type
                  </label>
                  <div class="input-group input-group-sm shadow-sm">
                    <span class="input-group-text border-0 bg-light"><i class="bi bi-bullseye"></i></span>
                    <input type="text" class="form-control form-control-sm border-0" id="sampledFeatureTypeInput" 
                           placeholder="The feature type being sampled" />
                  </div>
                </div>

                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label mb-1 small fw-bold d-flex align-items-center">
                      <i class="bi bi-bounding-box me-1 text-primary"></i>Shape Type
                    </label>
                    <div class="input-group input-group-sm shadow-sm">
                      <span class="input-group-text border-0 bg-light"><i class="bi bi-box"></i></span>
                      <select class="form-select form-select-sm border-0" id="shapeTypeSelect">
                        <option value="point">point</option>
                        <option value="line">line</option>
                        <option value="surface">surface</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label mb-1 small fw-bold d-flex align-items-center">
                      <i class="bi bi-globe me-1 text-primary"></i>Shape CRS
                    </label>
                    <div class="input-group input-group-sm shadow-sm">
                      <span class="input-group-text border-0 bg-light"><i class="bi bi-map"></i></span>
                      <input type="text" class="form-control form-control-sm border-0" id="shapeCrsInput" 
                             placeholder="EPSG:4326, etc." />
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label mb-1 small fw-bold d-flex align-items-center">
                      <i class="bi bi-arrows-expand me-1 text-primary"></i>Height Type
                    </label>
                    <div class="input-group input-group-sm shadow-sm">
                      <span class="input-group-text border-0 bg-light"><i class="bi bi-arrow-up-down"></i></span>
                      <select class="form-select form-select-sm border-0" id="heightTypeSelect">
                        <option value="">(none)</option>
                        <option value="point">point</option>
                        <option value="range">range</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label mb-1 small fw-bold d-flex align-items-center">
                      <i class="bi bi-globe-americas me-1 text-primary"></i>Height CRS
                    </label>
                    <div class="input-group input-group-sm shadow-sm">
                      <span class="input-group-text border-0 bg-light"><i class="bi bi-rulers"></i></span>
                      <input type="text" class="form-control form-control-sm border-0" id="heightCrsInput" 
                             placeholder="EPSG:xxx" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="position-sticky bottom-0 bg-white py-3 px-3 d-flex justify-content-end border-top shadow" style="z-index: 1000; margin-top: 1rem;">
          <button type="button" class="btn btn-primary px-4" id="btnSaveSSFEditor">
            <i class="bi bi-check-circle-fill me-2"></i>Save Changes
          </button>
        </div>
      </div>
    `;

    ssfNameInput = container.querySelector("#ssfNameInput");
    ssfDescInput = container.querySelector("#ssfDescInput");

    shapeTypeSelect = container.querySelector("#shapeTypeSelect");
    shapeCrsInput = container.querySelector("#shapeCrsInput");
    heightTypeSelect = container.querySelector("#heightTypeSelect");
    heightCrsInput = container.querySelector("#heightCrsInput");
    sampledFeatureTypeInput = container.querySelector(
      "#sampledFeatureTypeInput"
    );

    // Add event listener for spatial configuration folding
    const spatialConfigHeader = container.querySelector("#spatialConfigHeader");
    const spatialConfigContent = container.querySelector("#spatialConfigContent");
    const spatialConfigIcon = container.querySelector("#spatialConfigIcon");
    
    spatialConfigHeader.style.cursor = "pointer";
    
    spatialConfigHeader.addEventListener("click", () => {
      if (spatialConfigContent.style.display === "none") {
        spatialConfigContent.style.display = "block";        
      } else {
        spatialConfigContent.style.display = "none";        
      }
    });

    // Add event listeners for section folding
    const sections = [
      { header: 'names', button: 'btnAddSSFName' },
      { header: 'properties', button: 'btnAddSSFProperty' },
      { header: 'references', button: 'btnAddSSFReference' }
    ];

    sections.forEach(section => {
      const header = container.querySelector(`#${section.header}Header`);
      const content = container.querySelector(`#${section.header}Content`);
      const icon = container.querySelector(`#${section.header}Icon`);
      const addButton = container.querySelector(`#${section.button}`);
      
      header.style.cursor = "pointer";
      
      header.addEventListener("click", (e) => {
        // Evitar que el click en el botón de añadir active el fold/unfold
        if (e.target === addButton || addButton.contains(e.target)) {
          return;
        }

        if (content.style.display === "none") {
          content.style.display = "block";          
        } else {
          content.style.display = "none";          
        }
      });
    });

    updatePlaceholders();

    // For "names"
    container.querySelector("#btnAddSSFName").addEventListener("click", (e) => {
      e.preventDefault();
      currentNames.push({ term: "", vocabulary: "" });
      renderNames();
      updatePlaceholders();
    });

    // For "properties"
    container
      .querySelector("#btnAddSSFProperty")
      .addEventListener("click", (e) => {
        e.preventDefault();
        currentProperties.push({
          name: "",
          description: "",
          data_type: "",
          repeated: false,
          scope: "feature",
          names: [],
        });
        renderProperties();
        updatePlaceholders();
        scrollToNewProperty();
      });

    // For "references" (using button now)
    container
      .querySelector("#btnAddSSFReference")
      .addEventListener("click", (e) => {
        e.preventDefault();
        currentReferences.push({
          name: "",
          description: "",
          referenced_type: "",
          repeated: false,
          scope: "feature",
          names: []
        });
        renderReferences();
        updatePlaceholders();
        scrollToNewReference();
      });

    container
      .querySelector("#btnSaveSSFEditor")
      .addEventListener("click", save);

    renderNames();
    renderProperties();
    renderReferences();
    updatePlaceholders();
  }

  function updatePlaceholders() {
    const emptyNames = container.querySelector("#ssfEmptyNamesPlaceholder");
    if (emptyNames)
      emptyNames.style.display = currentNames.length > 0 ? "none" : "block";

    const emptyProps = container.querySelector(
      "#ssfEmptyPropertiesPlaceholder"
    );
    if (emptyProps)
      emptyProps.style.display =
        currentProperties.length > 0 ? "none" : "block";

    const emptyRefs = container.querySelector("#ssfEmptyReferencesPlaceholder");
    if (emptyRefs)
      emptyRefs.style.display = currentReferences.length > 0 ? "none" : "block";
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

  function renderReferences() {
    const refsContainer = container.querySelector("#ssfReferencesContainer");
    refsContainer.innerHTML = "";
    currentReferences.forEach((ref, index) => {
      const refCard = document.createElement("div");
      refCard.className = "card border-0 shadow-sm mb-3";

      const headerDiv = document.createElement("div");
      headerDiv.className = "card-header bg-light d-flex justify-content-between align-items-center";

      const headerLeftDiv = document.createElement("div");
      headerLeftDiv.className = "d-flex align-items-center flex-grow-1";

      const toggleBtn = document.createElement("button");
      toggleBtn.className = "btn btn-sm btn-outline-secondary me-2";
      toggleBtn.style.width = "30px";
      toggleBtn.innerHTML = '<i class="bi bi-dash-lg"></i>'; // Icono inicial "desplegado"
      toggleBtn.addEventListener("click", () => {
        const contentDiv = refCard.querySelector(".reference-content");
        if (contentDiv.style.display === "none") {
          contentDiv.style.display = "block";
          toggleBtn.innerHTML = '<i class="bi bi-dash-lg"></i>'; // Icono "desplegado"
        } else {
          contentDiv.style.display = "none";
          toggleBtn.innerHTML = '<i class="bi bi-plus-lg"></i>'; // Icono "plegado"
        }
      });

      const nameGroup = document.createElement("div");
      nameGroup.className = "input-group input-group-sm flex-grow-1";

      const nameIcon = document.createElement("span");
      nameIcon.className = "input-group-text border-0 bg-light";
      nameIcon.innerHTML = '<i class="bi bi-input-cursor-text"></i>';

      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.className = "form-control form-control-sm border-0";
      nameInput.placeholder = "Reference name";
      nameInput.value = ref.name || "";
      nameInput.addEventListener("input", (e) => {
        currentReferences[index].name = e.target.value;
      });

      nameGroup.appendChild(nameIcon);
      nameGroup.appendChild(nameInput);

      headerLeftDiv.appendChild(toggleBtn);
      headerLeftDiv.appendChild(nameGroup);

      const btnRemove = document.createElement("button");
      btnRemove.className = "btn btn-sm btn-outline-danger ms-2";
      btnRemove.innerHTML = '<i class="bi bi-trash"></i>';
      btnRemove.title = "Remove reference";
      btnRemove.addEventListener("click", () => {
        currentReferences.splice(index, 1);
        renderReferences();
        updatePlaceholders();
      });

      headerDiv.appendChild(headerLeftDiv);
      headerDiv.appendChild(btnRemove);

      const contentDiv = document.createElement("div");
      contentDiv.className = "card-body reference-content p-3";
      contentDiv.style.display = "block";

      // Description
      const descFormGroup = document.createElement("div");
      descFormGroup.className = "mb-3";

      const lblDesc = document.createElement("label");
      lblDesc.className = "form-label";
      lblDesc.innerHTML = '<i class="bi bi-file-text me-1"></i> Description';

      const inpDesc = document.createElement("textarea");
      inpDesc.className = "form-control";
      inpDesc.rows = 2;
      inpDesc.placeholder = "Enter reference description";
      inpDesc.value = ref.description || "";
      inpDesc.addEventListener("input", (ev) => {
        currentReferences[index].description = ev.target.value;
      });

      descFormGroup.appendChild(lblDesc);
      descFormGroup.appendChild(inpDesc);

      // Referenced Type, Repeated, Scope
      const row = document.createElement("div");
      row.className = "row mb-3";

      // Referenced Type
      const colType = document.createElement("div");
      colType.className = "col-md-4";

      const typeLabel = document.createElement("label");
      typeLabel.className = "form-label";
      typeLabel.innerHTML = '<i class="bi bi-diagram-3 me-1"></i> Referenced Type';

      const typeGroup = document.createElement("div");
      typeGroup.className = "input-group";

      const typeGroupText = document.createElement("span");
      typeGroupText.className = "input-group-text";
      typeGroupText.innerHTML = '<i class="bi bi-link"></i>';

      const typeSelect = document.createElement("select");
      typeSelect.className = "form-select";
      typeSelect.innerHTML = getReferenceTypeOptions();
      typeSelect.value = ref.referenced_type || "";
      typeSelect.addEventListener("change", (ev) => {
        currentReferences[index].referenced_type = ev.target.value;
      });

      typeGroup.appendChild(typeGroupText);
      typeGroup.appendChild(typeSelect);

      colType.appendChild(typeLabel);
      colType.appendChild(typeGroup);

      // Repeated
      const colRep = document.createElement("div");
      colRep.className = "col-md-4";

      const lblRep = document.createElement("label");
      lblRep.className = "form-label";
      lblRep.innerHTML = '<i class="bi bi-repeat me-1"></i> Repeated';

      const selRep = document.createElement("select");
      selRep.className = "form-select";
      selRep.innerHTML = `
        <option value="false">false</option>
        <option value="true">true</option>
      `;
      selRep.value = (ref.repeated || false).toString();
      selRep.addEventListener("change", (ev) => {
        currentReferences[index].repeated = ev.target.value === "true";
      });

      colRep.appendChild(lblRep);
      colRep.appendChild(selRep);

      // Scope
      const colScope = document.createElement("div");
      colScope.className = "col-md-4";

      const lblScope = document.createElement("label");
      lblScope.className = "form-label";
      lblScope.innerHTML = '<i class="bi bi-layers me-1"></i> Scope';

      const inpScope = document.createElement("select");
      inpScope.className = "form-select";
      inpScope.innerHTML = `
        <option value="feature">feature</option>
        <option value="valid_time_period">valid_time_period</option>
      `;
      inpScope.value = ref.scope || "feature";
      inpScope.addEventListener("change", (ev) => {
        currentReferences[index].scope = ev.target.value;
      });

      colScope.appendChild(lblScope);
      colScope.appendChild(inpScope);

      row.appendChild(colType);
      row.appendChild(colRep);
      row.appendChild(colScope);

      // Names section
      const namesSection = document.createElement("div");
      namesSection.className = "mb-3";

      const namesHeader = document.createElement("div");
      namesHeader.className = "d-flex justify-content-between align-items-center mb-2";
      namesHeader.innerHTML = '<h6 class="mb-0"><i class="bi bi-translate me-1"></i>Reference Names</h6>';

      const btnAddName = document.createElement("button");
      btnAddName.className = "btn btn-sm btn-outline-primary";
      btnAddName.innerHTML = '<i class="bi bi-plus-circle me-1"></i>';
      btnAddName.addEventListener("click", () => {
        if (!ref.names) ref.names = [];
        ref.names.push({ term: "", vocabulary: "" });
        renderReferences();
      });
      namesHeader.appendChild(btnAddName);

      const refNamesContainer = document.createElement("div");
      refNamesContainer.className = "mb-3";

      if (!ref.names || ref.names.length === 0) {
        const emptyNamesMsg = document.createElement("div");
        emptyNamesMsg.className = "text-center text-muted p-2 border rounded";
        emptyNamesMsg.innerHTML = '<small><i class="bi bi-info-circle me-1"></i>No reference names added yet</small>';
        refNamesContainer.appendChild(emptyNamesMsg);
      } else {
        ref.names.forEach((nm, nmIdx) => {
          const nameCard = document.createElement("div");
          nameCard.className = "card mb-2 border-light";

          const nameCardBody = document.createElement("div");
          nameCardBody.className = "card-body p-2";

          const nameRow = document.createElement("div");
          nameRow.className = "row g-2 align-items-center";

          const nameColTerm = document.createElement("div");
          nameColTerm.className = "col-md-5";
          const nameInputGroup = document.createElement("div");
          nameInputGroup.className = "input-group input-group-sm";

          const nameInputGroupText = document.createElement("span");
          nameInputGroupText.className = "input-group-text";
          nameInputGroupText.innerHTML = '<i class="bi bi-type"></i>';

          const nameInputTerm = document.createElement("input");
          nameInputTerm.className = "form-control";
          nameInputTerm.placeholder = "Enter term";
          nameInputTerm.value = nm.term || "";
          nameInputTerm.addEventListener("input", (ev) => {
            ref.names[nmIdx].term = ev.target.value;
          });

          nameInputGroup.appendChild(nameInputGroupText);
          nameInputGroup.appendChild(nameInputTerm);
          nameColTerm.appendChild(nameInputGroup);

          const nameColVoc = document.createElement("div");
          nameColVoc.className = "col-md-5";
          const nameVocGroup = document.createElement("div");
          nameVocGroup.className = "input-group input-group-sm";

          const nameVocGroupText = document.createElement("span");
          nameVocGroupText.className = "input-group-text";
          nameVocGroupText.innerHTML = '<i class="bi bi-book"></i>';

          const nameSelectVoc = createVocabularySelect(
            nm.vocabulary || "",
            (newValue) => {
              ref.names[nmIdx].vocabulary = newValue;
            }
          );
          nameSelectVoc.className = "form-select";

          nameVocGroup.appendChild(nameVocGroupText);
          nameVocGroup.appendChild(nameSelectVoc);
          nameColVoc.appendChild(nameVocGroup);

          const nameColBtn = document.createElement("div");
          nameColBtn.className = "col-md-2 text-end";
          const nameBtnRem = document.createElement("button");
          nameBtnRem.className = "btn btn-outline-danger btn-sm";
          nameBtnRem.innerHTML = '<i class="bi bi-trash"></i>';
          nameBtnRem.addEventListener("click", () => {
            ref.names.splice(nmIdx, 1);
            renderReferences();
          });
          nameColBtn.appendChild(nameBtnRem);

          nameRow.appendChild(nameColTerm);
          nameRow.appendChild(nameColVoc);
          nameRow.appendChild(nameColBtn);

          nameCardBody.appendChild(nameRow);
          nameCard.appendChild(nameCardBody);
          refNamesContainer.appendChild(nameCard);
        });
      }

      namesSection.appendChild(namesHeader);
      namesSection.appendChild(refNamesContainer);

      contentDiv.appendChild(descFormGroup);
      contentDiv.appendChild(row);
      contentDiv.appendChild(namesSection);

      refCard.appendChild(headerDiv);
      refCard.appendChild(contentDiv);
      refsContainer.appendChild(refCard);
    });
  }

  function scrollToNewReference() {
    setTimeout(() => {
      const lastReference = container.querySelector(
        "#ssfReferencesContainer .card:last-child"
      );
      if (lastReference) {
        lastReference.scrollIntoView({ behavior: "smooth", block: "start" });
        const nameInput = lastReference.querySelector('input[type="text"]');
        if (nameInput) nameInput.focus();
      }
    }, 100);
  }

  function validateForm() {
    const errors = [];

    if (!ssfNameInput.value.trim()) {
      errors.push("The 'Name' field is required.");
    }
    if (!ssfDescInput.value.trim()) {
      errors.push("The 'Description' field is required.");
    }
    if (!shapeTypeSelect.value.trim()) {
      errors.push("The 'Shape Type' field is required.");
    }
    if (!shapeCrsInput.value.trim()) {
      errors.push("The 'Shape CRS' field is required.");
    }

    // Validate that there are no duplicate references by name
    const refNames = currentReferences
      .map((ref) => ref.name)
      .filter((name) => name.trim() !== "");
    const uniqueRefNames = new Set(refNames);
    if (uniqueRefNames.size < refNames.length) {
      errors.push(
        "Duplicate Reference names found. Please ensure all reference names are unique."
      );
    }

    // Validate that all references have a name and referenced_type
    const invalidRefs = currentReferences.filter(
      (ref) => !ref.name.trim() || !ref.referenced_type
    );
    if (invalidRefs.length > 0) {
      errors.push(
        "All references must have both a Name and a Referenced Type selected."
      );
    }

    if (errors.length > 0) {
      showNotification(errors.join("\n"));
      return false;
    }

    return true;
  }

  function save() {
    if (!validateForm()) {
      return;
    }

    const result = {
      name: ssfNameInput.value.trim(),
      description: ssfDescInput.value.trim(),
      names: JSON.parse(JSON.stringify(currentNames)),
      properties: JSON.parse(JSON.stringify(currentProperties)),
      references: JSON.parse(JSON.stringify(currentReferences)),
      shape_type: shapeTypeSelect.value.trim(),
      shape_crs: shapeCrsInput.value.trim(),
      height_type: heightTypeSelect.value.trim(),
      height_crs: heightCrsInput.value.trim(),
      sampled_feature_type: sampledFeatureTypeInput.value.trim(),
    };

    if (onSaveCallback) {
      onSaveCallback(result, editingIndex);
    }
  }

  function renderNames() {
    const namesContainer = container.querySelector("#ssfNamesContainer");
    namesContainer.innerHTML = "";
    currentNames.forEach((n, index) => {
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
        currentNames[index].term = ev.target.value;
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

      const selectVoc = createVocabularySelect(n.vocabulary, (newValue) => {
        currentNames[index].vocabulary = newValue;
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
        currentNames.splice(index, 1);
        renderNames();
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
  }

  function renderProperties() {
    const propsContainer = container.querySelector("#ssfPropertiesContainer");
    propsContainer.innerHTML = "";
    currentProperties.forEach((prop, index) => {
      const propCard = document.createElement("div");
      propCard.className = "card border-0 shadow-sm mb-3";

      const headerDiv = document.createElement("div");
      headerDiv.className =
        "card-header bg-light d-flex justify-content-between align-items-center";

      const headerLeftDiv = document.createElement("div");
      headerLeftDiv.className = "d-flex align-items-center flex-grow-1";

      const toggleBtn = document.createElement("button");
      toggleBtn.className = "btn btn-sm btn-outline-secondary me-2";
      toggleBtn.style.width = "30px";
      toggleBtn.innerHTML = '<i class="bi bi-dash-lg"></i>'; // Icono inicial "desplegado"
      toggleBtn.addEventListener("click", () => {
        const contentDiv = propCard.querySelector(".property-content");
        if (contentDiv.style.display === "none") {
          contentDiv.style.display = "block";
          toggleBtn.innerHTML = '<i class="bi bi-dash-lg"></i>'; // Icono "desplegado"
        } else {
          contentDiv.style.display = "none";
          toggleBtn.innerHTML = '<i class="bi bi-plus-lg"></i>'; // Icono "plegado"
        }
      });

      const nameGroup = document.createElement("div");
      nameGroup.className = "input-group input-group-sm flex-grow-1";

      const nameIcon = document.createElement("span");
      nameIcon.className = "input-group-text border-0 bg-light";
      nameIcon.innerHTML = '<i class="bi bi-input-cursor-text"></i>';

      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.className = "form-control form-control-sm border-0";
      nameInput.placeholder = "Property name";
      nameInput.value = prop.name;
      nameInput.addEventListener("input", (e) => {
        currentProperties[index].name = e.target.value;
      });

      nameGroup.appendChild(nameIcon);
      nameGroup.appendChild(nameInput);

      headerLeftDiv.appendChild(toggleBtn);
      headerLeftDiv.appendChild(nameGroup);

      const btnRemove = document.createElement("button");
      btnRemove.className = "btn btn-sm btn-outline-danger ms-2";
      btnRemove.innerHTML = '<i class="bi bi-trash"></i>';
      btnRemove.title = "Remove property";
      btnRemove.addEventListener("click", () => {
        currentProperties.splice(index, 1);
        renderProperties();
        updatePlaceholders();
      });

      headerDiv.appendChild(headerLeftDiv);
      headerDiv.appendChild(btnRemove);

      const contentDiv = document.createElement("div");
      contentDiv.className = "card-body property-content p-3";
      contentDiv.style.display = "block";

      const descFormGroup = document.createElement("div");
      descFormGroup.className = "mb-3";

      const lblDesc = document.createElement("label");
      lblDesc.className = "form-label";
      lblDesc.innerHTML = '<i class="bi bi-file-text me-1"></i> Description';

      const inpDesc = document.createElement("textarea");
      inpDesc.className = "form-control";
      inpDesc.rows = 2;
      inpDesc.placeholder = "Enter property description";
      inpDesc.value = prop.description;
      inpDesc.addEventListener("input", (ev) => {
        currentProperties[index].description = ev.target.value;
      });

      descFormGroup.appendChild(lblDesc);
      descFormGroup.appendChild(inpDesc);

      const row2 = document.createElement("div");
      row2.className = "row mb-3";

      const colDT = document.createElement("div");
      colDT.className = "col-md-4";

      const dtLabel = document.createElement("label");
      dtLabel.className = "form-label";
      dtLabel.innerHTML = '<i class="bi bi-braces me-1"></i> Data Type';

      const dtInputGroup = document.createElement("div");
      dtInputGroup.className = "input-group";

      const dtGroupText = document.createElement("span");
      dtGroupText.className = "input-group-text";
      dtGroupText.innerHTML = '<i class="bi bi-code"></i>';

      const inpDT = document.createElement("input");
      inpDT.className = "form-control";
      inpDT.placeholder = "string, number, Date, etc.";
      inpDT.value = prop.data_type;
      inpDT.addEventListener("input", (ev) => {
        currentProperties[index].data_type = ev.target.value;
      });

      const helpBtn = document.createElement("button");
      helpBtn.className = "btn btn-outline-info";
      helpBtn.innerHTML = '<i class="bi bi-question-circle"></i>';
      helpBtn.type = "button";
      helpBtn.title = "Data Type Help";
      helpBtn.addEventListener("click", () => {
        new bootstrap.Modal(
          document.getElementById("modalDataTypeHelp")
        ).show();
      });

      dtInputGroup.appendChild(dtGroupText);
      dtInputGroup.appendChild(inpDT);
      dtInputGroup.appendChild(helpBtn);

      colDT.appendChild(dtLabel);
      colDT.appendChild(dtInputGroup);

      const colRep = document.createElement("div");
      colRep.className = "col-md-4";

      const lblRep = document.createElement("label");
      lblRep.className = "form-label";
      lblRep.innerHTML = '<i class="bi bi-repeat me-1"></i> Repeated';

      const selRep = document.createElement("select");
      selRep.className = "form-select";
      selRep.innerHTML = `
        <option value="false">false</option>
        <option value="true">true</option>
      `;
      selRep.value = prop.repeated.toString();
      selRep.addEventListener("change", (ev) => {
        currentProperties[index].repeated = ev.target.value === "true";
      });

      colRep.appendChild(lblRep);
      colRep.appendChild(selRep);

      const colScope = document.createElement("div");
      colScope.className = "col-md-4";

      const lblScope = document.createElement("label");
      lblScope.className = "form-label";
      lblScope.innerHTML = '<i class="bi bi-layers me-1"></i> Scope';

      const inpScope = document.createElement("select");
      inpScope.className = "form-select";
      inpScope.innerHTML = `
        <option value="feature">feature</option>
        <option value="valid_time_period">valid_time_period</option>
      `;
      inpScope.value = prop.scope || "feature";
      inpScope.addEventListener("change", (ev) => {
        currentProperties[index].scope = ev.target.value;
      });

      colScope.appendChild(lblScope);
      colScope.appendChild(inpScope);

      row2.appendChild(colDT);
      row2.appendChild(colRep);
      row2.appendChild(colScope);

      // Names section
      const namesSection = document.createElement("div");
      namesSection.className = "mb-3";

      const namesHeader = document.createElement("div");
      namesHeader.className =
        "d-flex justify-content-between align-items-center mb-2";
      namesHeader.innerHTML =
        '<h6 class="mb-0"><i class="bi bi-translate me-1"></i>Property Names</h6>';

      const btnAddName = document.createElement("button");
      btnAddName.className = "btn btn-sm btn-outline-primary";
      btnAddName.innerHTML = '<i class="bi bi-plus-circle me-1"></i>';
      btnAddName.addEventListener("click", () => {
        if (!prop.names) prop.names = [];
        prop.names.push({ term: "", vocabulary: "" });
        renderProperties();
      });
      namesHeader.appendChild(btnAddName);

      const propNamesContainer = document.createElement("div");
      propNamesContainer.className = "mb-3";

      if (!prop.names || prop.names.length === 0) {
        const emptyNamesMsg = document.createElement("div");
        emptyNamesMsg.className = "text-center text-muted p-2 border rounded";
        emptyNamesMsg.innerHTML =
          '<small><i class="bi bi-info-circle me-1"></i>No property names added yet</small>';
        propNamesContainer.appendChild(emptyNamesMsg);
      } else {
        prop.names.forEach((nm, nmIdx) => {
          const nameCard = document.createElement("div");
          nameCard.className = "card mb-2 border-light";

          const nameCardBody = document.createElement("div");
          nameCardBody.className = "card-body p-2";

          const nameRow = document.createElement("div");
          nameRow.className = "row g-2 align-items-center";

          const nameColTerm = document.createElement("div");
          nameColTerm.className = "col-md-5";
          const nameInputGroup = document.createElement("div");
          nameInputGroup.className = "input-group input-group-sm";

          const nameInputGroupText = document.createElement("span");
          nameInputGroupText.className = "input-group-text";
          nameInputGroupText.innerHTML = '<i class="bi bi-type"></i>';

          const nameInputTerm = document.createElement("input");
          nameInputTerm.className = "form-control";
          nameInputTerm.placeholder = "Enter term";
          nameInputTerm.value = nm.term;
          nameInputTerm.addEventListener("input", (ev) => {
            prop.names[nmIdx].term = ev.target.value;
          });

          nameInputGroup.appendChild(nameInputGroupText);
          nameInputGroup.appendChild(nameInputTerm);
          nameColTerm.appendChild(nameInputGroup);

          const nameColVoc = document.createElement("div");
          nameColVoc.className = "col-md-5";
          const nameVocGroup = document.createElement("div");
          nameVocGroup.className = "input-group input-group-sm";

          const nameVocGroupText = document.createElement("span");
          nameVocGroupText.className = "input-group-text";
          nameVocGroupText.innerHTML = '<i class="bi bi-book"></i>';

          const nameSelectVoc = createVocabularySelect(
            nm.vocabulary,
            (newValue) => {
              prop.names[nmIdx].vocabulary = newValue;
            }
          );
          nameSelectVoc.className = "form-select";

          nameVocGroup.appendChild(nameVocGroupText);
          nameVocGroup.appendChild(nameSelectVoc);
          nameColVoc.appendChild(nameVocGroup);

          const nameColBtn = document.createElement("div");
          nameColBtn.className = "col-md-2 text-end";
          const nameBtnRem = document.createElement("button");
          nameBtnRem.className = "btn btn-outline-danger btn-sm";
          nameBtnRem.innerHTML = '<i class="bi bi-trash"></i>';
          nameBtnRem.addEventListener("click", () => {
            prop.names.splice(nmIdx, 1);
            renderProperties();
          });
          nameColBtn.appendChild(nameBtnRem);

          nameRow.appendChild(nameColTerm);
          nameRow.appendChild(nameColVoc);
          nameRow.appendChild(nameColBtn);

          nameCardBody.appendChild(nameRow);
          nameCard.appendChild(nameCardBody);
          propNamesContainer.appendChild(nameCard);
        });
      }

      namesSection.appendChild(namesHeader);
      namesSection.appendChild(propNamesContainer);

      contentDiv.appendChild(descFormGroup);
      contentDiv.appendChild(row2);
      contentDiv.appendChild(namesSection);

      propCard.appendChild(headerDiv);
      propCard.appendChild(contentDiv);
      propsContainer.appendChild(propCard);
    });
  }

  function scrollToNewProperty() {
    setTimeout(() => {
      const lastProperty = container.querySelector(
        "#ssfPropertiesContainer .card:last-child"
      );
      if (lastProperty) {
        lastProperty.scrollIntoView({ behavior: "smooth", block: "start" });
        const nameInput = lastProperty.querySelector('input[type="text"]');
        if (nameInput) nameInput.focus();
      }
    }, 100);
  }

  function edit(item, index) {
    editingIndex = index;

    ssfNameInput.value = item.name || "";
    ssfDescInput.value = item.description || "";

    currentNames = JSON.parse(JSON.stringify(item.names || []));
    currentProperties = JSON.parse(JSON.stringify(item.properties || []));
    
    // Asegurar que las referencias tienen la estructura correcta
    currentReferences = JSON.parse(JSON.stringify(item.references || [])).map(ref => {
      // Si las referencias antiguas solo tienen la propiedad "name", convertirlas al nuevo formato
      if (typeof ref === 'string' || (ref && typeof ref === 'object' && !ref.description)) {
        const name = typeof ref === 'string' ? ref : ref.name || "";
        return {
          name: name,
          description: "",
          referenced_type: name, // Usar el nombre como referenced_type para compatibilidad
          repeated: false,
          scope: "feature",
          names: []
        };
      }
      return {
        ...ref,
        names: ref.names || [],
        referenced_type: ref.referenced_type || ref.name || "",
        repeated: ref.repeated || false,
        scope: ref.scope || "feature"
      };
    });

    shapeTypeSelect.value = item.shape_type || "point";
    shapeCrsInput.value = item.shape_crs || "";
    heightTypeSelect.value = item.height_type || "";
    heightCrsInput.value = item.height_crs || "";
    sampledFeatureTypeInput.value = item.sampled_feature_type || "";

    renderNames();
    renderProperties();
    renderReferences();
    updatePlaceholders();
  }

  function reset() {
    editingIndex = null;
    ssfNameInput.value = "";
    ssfDescInput.value = "";
    shapeTypeSelect.value = "point";
    shapeCrsInput.value = "";
    heightTypeSelect.value = "";
    heightCrsInput.value = "";
    sampledFeatureTypeInput.value = "";

    currentNames = [];
    currentProperties = [];
    currentReferences = [];

    renderNames();
    renderProperties();
    renderReferences();
    updatePlaceholders();
  }

  return {
    init,
    edit,
    reset
  };
})();
