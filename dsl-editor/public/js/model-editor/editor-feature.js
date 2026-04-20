window.FeatureEditor = (() => {
  let container = null;
  let ftNameInput, ftDescInput, namesContainer, propertiesContainer;
  let currentNames = [];
  let currentProperties = [];
  let currentReferences = []; // Nueva variable
  let editingIndex = null;
  let onSaveCallback = null;

  const updatePlaceholders = () => {
    const emptyNames = container.querySelector("#ftEmptyNamesPlaceholder");
    const emptyProps = container.querySelector("#ftEmptyPropertiesPlaceholder");
    const emptyRefs = container.querySelector("#ftEmptyReferencesPlaceholder");
    if (emptyNames) emptyNames.style.display = currentNames.length ? "none" : "block";
    if (emptyProps) emptyProps.style.display = currentProperties.length ? "none" : "block";
    if (emptyRefs) emptyRefs.style.display = currentReferences.length ? "none" : "block";
  };

  const renderNames = () => {
    namesContainer.innerHTML = "";
    currentNames.forEach((n, index) => {
      const card = createNameCard(n, index);
      namesContainer.appendChild(card);
    });
  };

  const createNameCard = (name, index) => {
    const card = document.createElement("div");
    card.className = "card mb-2 border-0 shadow-sm";
    const body = document.createElement("div");
    body.className = "card-body p-2";
    const row = document.createElement("div");
    row.className = "row g-2 align-items-center";
    const colTerm = document.createElement("div");
    colTerm.className = "col-md-5";
    const termGroup = document.createElement("div");
    termGroup.className = "input-group input-group-sm";
    const termIcon = document.createElement("span");
    termIcon.className = "input-group-text";
    termIcon.innerHTML = '<i class="bi bi-type"></i>';
    const termInput = document.createElement("input");
    termInput.type = "text";
    termInput.className = "form-control";
    termInput.placeholder = "Enter term";
    termInput.value = name.term;
    termInput.addEventListener("input", (e) => {
      currentNames[index].term = e.target.value;
    });
    termGroup.appendChild(termIcon);
    termGroup.appendChild(termInput);
    colTerm.appendChild(termGroup);
    const colVoc = document.createElement("div");
    colVoc.className = "col-md-5";
    const vocGroup = document.createElement("div");
    vocGroup.className = "input-group input-group-sm";
    const vocIcon = document.createElement("span");
    vocIcon.className = "input-group-text";
    vocIcon.innerHTML = '<i class="bi bi-book"></i>';
    const vocSelect = createVocabularySelect(name.vocabulary, (val) => {
      currentNames[index].vocabulary = val;
    });
    vocSelect.className = "form-select";
    vocGroup.appendChild(vocIcon);
    vocGroup.appendChild(vocSelect);
    colVoc.appendChild(vocGroup);
    const colBtn = document.createElement("div");
    colBtn.className = "col-md-2 text-end";
    const btnRemove = document.createElement("button");
    btnRemove.type = "button";
    btnRemove.className = "btn btn-outline-danger btn-sm";
    btnRemove.innerHTML = '<i class="bi bi-trash"></i>';
    btnRemove.addEventListener("click", () => {
      currentNames.splice(index, 1);
      renderNames();
      updatePlaceholders();
    });
    colBtn.appendChild(btnRemove);
    row.appendChild(colTerm);
    row.appendChild(colVoc);
    row.appendChild(colBtn);
    body.appendChild(row);
    card.appendChild(body);
    return card;
  };

  const createInputGroup = (icon, placeholder, value, onChange, type = "text") => {
    const group = document.createElement("div");
    group.className = "input-group input-group-sm shadow-sm rounded overflow-hidden";
    
    const iconSpan = document.createElement("span");
    iconSpan.className = "input-group-text border-0 bg-light py-0 px-2";
    iconSpan.innerHTML = `<i class="bi bi-${icon}"></i>`;
    
    const input = document.createElement(type === "textarea" ? "textarea" : "input");
    input.className = "form-control form-control-sm border-0";
    input.placeholder = placeholder;
    input.value = value;
    input.addEventListener("input", onChange);
    
    group.appendChild(iconSpan);
    group.appendChild(input);
    return group;
  };

  const renderProperties = () => {
    propertiesContainer.innerHTML = "";
    currentProperties.forEach((prop, index) => {
      const card = document.createElement("div");
      card.className = "card mb-3 border-0 shadow-sm";
      const header = document.createElement("div");
      header.className = "card-header bg-light d-flex justify-content-between align-items-center";
      
      // Contenedor izquierdo para toggle + nombre
      const headerLeftDiv = document.createElement("div");
      headerLeftDiv.className = "d-flex align-items-center flex-grow-1";
      
      const toggleBtn = document.createElement("button");
      toggleBtn.type = "button";
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
      
      const nameGroup = document.createElement("div");
      nameGroup.className = "input-group input-group-sm ms-2 flex-grow-1";
      const nameIcon = document.createElement("span");
      nameIcon.className = "input-group-text";
      nameIcon.innerHTML = '<i class="bi bi-input-cursor-text"></i>';
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.className = "form-control";
      nameInput.placeholder = "Property name";
      nameInput.value = prop.name;
      nameInput.addEventListener("input", (e) => {
        currentProperties[index].name = e.target.value;
      });
      nameGroup.appendChild(nameIcon);
      nameGroup.appendChild(nameInput);
      
      headerLeftDiv.appendChild(toggleBtn);
      headerLeftDiv.appendChild(nameGroup);
      
      // Botón eliminar en el header
      const btnRemoveProp = document.createElement("button");
      btnRemoveProp.type = "button";
      btnRemoveProp.className = "btn btn-sm btn-outline-danger ms-2";
      btnRemoveProp.innerHTML = '<i class="bi bi-trash"></i>';
      btnRemoveProp.title = "Remove property";
      btnRemoveProp.addEventListener("click", () => {
        currentProperties.splice(index, 1);
        renderProperties();
        updatePlaceholders();
      });
      
      header.appendChild(headerLeftDiv);
      header.appendChild(btnRemoveProp);
      
      // ...resto del código para el contenido de la propiedad...
      const content = document.createElement("div");
      content.className = "card-body property-content p-3";
      content.style.display = "block";
      const descGroup = document.createElement("div");
      descGroup.className = "mb-3";
      const descLabel = document.createElement("label");
      descLabel.className = "form-label";
      descLabel.innerHTML = '<i class="bi bi-file-text me-1"></i> Description';
      const descInput = document.createElement("textarea");
      descInput.className = "form-control";
      descInput.rows = 2;
      descInput.placeholder = "Enter property description";
      descInput.value = prop.description;
      descInput.addEventListener("input", (e) => {
        currentProperties[index].description = e.target.value;
      });
      descGroup.appendChild(descLabel);
      descGroup.appendChild(descInput);
      const row = document.createElement("div");
      row.className = "row mb-3";
      const colDT = document.createElement("div");
      colDT.className = "col-md-4";
      const dtLabel = document.createElement("label");
      dtLabel.className = "form-label";
      dtLabel.innerHTML = '<i class="bi bi-braces me-1"></i> Data Type';
      const dtGroup = document.createElement("div");
      dtGroup.className = "input-group";
      const dtIcon = document.createElement("span");
      dtIcon.className = "input-group-text";
      dtIcon.innerHTML = '<i class="bi bi-code"></i>';
      const dtInput = document.createElement("input");
      dtInput.type = "text";
      dtInput.className = "form-control";
      dtInput.placeholder = "string, number, Date, etc.";
      dtInput.value = prop.data_type;
      dtInput.addEventListener("input", (e) => {
        currentProperties[index].data_type = e.target.value;
      });
      const helpBtn = document.createElement("button");
      helpBtn.type = "button";
      helpBtn.className = "btn btn-outline-info";
      helpBtn.innerHTML = '<i class="bi bi-question-circle"></i>';
      helpBtn.title = "Data Type Help";
      helpBtn.addEventListener("click", () => {
        new bootstrap.Modal(document.getElementById("modalDataTypeHelp")).show();
      });
      dtGroup.appendChild(dtIcon);
      dtGroup.appendChild(dtInput);
      dtGroup.appendChild(helpBtn);
      colDT.appendChild(dtLabel);
      colDT.appendChild(dtGroup);
      const colRep = document.createElement("div");
      colRep.className = "col-md-4";
      const repLabel = document.createElement("label");
      repLabel.className = "form-label";
      repLabel.innerHTML = '<i class="bi bi-repeat me-1"></i> Repeated';
      const repSelect = document.createElement("select");
      repSelect.className = "form-select";
      repSelect.innerHTML = `<option value="false">false</option><option value="true">true</option>`;
      repSelect.value = prop.repeated.toString();
      repSelect.addEventListener("change", (e) => {
        currentProperties[index].repeated = e.target.value === "true";
      });
      colRep.appendChild(repLabel);
      colRep.appendChild(repSelect);
      const colScope = document.createElement("div");
      colScope.className = "col-md-4";
      const scopeLabel = document.createElement("label");
      scopeLabel.className = "form-label";
      scopeLabel.innerHTML = '<i class="bi bi-layers me-1"></i> Scope';
      const scopeSelect = document.createElement("select");
      scopeSelect.className = "form-select";
      scopeSelect.innerHTML = `<option value="feature">feature</option><option value="valid_time_period">valid_time_period</option>`;
      scopeSelect.value = prop.scope || "feature";
      scopeSelect.addEventListener("change", (e) => {
        currentProperties[index].scope = e.target.value;
      });
      colScope.appendChild(scopeLabel);
      colScope.appendChild(scopeSelect);
      row.appendChild(colDT);
      row.appendChild(colRep);
      row.appendChild(colScope);
      const namesSection = document.createElement("div");
      namesSection.className = "mb-3";
      const namesHeader = document.createElement("div");
      namesHeader.className = "d-flex justify-content-between align-items-center mb-2";
      namesHeader.innerHTML = '<h6 class="mb-0"><i class="bi bi-translate me-1"></i>Property Names</h6>';
      const btnAddName = document.createElement("button");
      btnAddName.type = "button";
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
        const emptyMsg = document.createElement("div");
        emptyMsg.className = "text-center text-muted p-2 border rounded";
        emptyMsg.innerHTML = '<small><i class="bi bi-info-circle me-1"></i>No property names added yet</small>';
        propNamesContainer.appendChild(emptyMsg);
      } else {
        prop.names.forEach((nm, nmIdx) => {
          const nameRow = document.createElement("div");
          nameRow.className = "row g-2 mb-1 align-items-center";
          const colTerm = document.createElement("div");
          colTerm.className = "col-md-5";
          const nameGroup = document.createElement("div");
          nameGroup.className = "input-group input-group-sm";
          const nameGroupText = document.createElement("span");
          nameGroupText.className = "input-group-text";
          nameGroupText.innerHTML = '<i class="bi bi-type"></i>';
          const nameInput = document.createElement("input");
          nameInput.type = "text";
          nameInput.className = "form-control";
          nameInput.placeholder = "Enter term";
          nameInput.value = nm.term;
          nameInput.addEventListener("input", (e) => {
            prop.names[nmIdx].term = e.target.value;
          });
          nameGroup.appendChild(nameGroupText);
          nameGroup.appendChild(nameInput);
          colTerm.appendChild(nameGroup);
          const colVoc = document.createElement("div");
          colVoc.className = "col-md-5";
          const vocGroup = document.createElement("div");
          vocGroup.className = "input-group input-group-sm";
          const vocGroupText = document.createElement("span");
          vocGroupText.className = "input-group-text";
          vocGroupText.innerHTML = '<i class="bi bi-book"></i>';
          const nameSelect = createVocabularySelect(nm.vocabulary, (val) => {
            prop.names[nmIdx].vocabulary = val;
          });
          nameSelect.className = "form-select";
          vocGroup.appendChild(vocGroupText);
          vocGroup.appendChild(nameSelect);
          colVoc.appendChild(vocGroup);
          const colBtn = document.createElement("div");
          colBtn.className = "col-md-2 text-end";
          const btnRem = document.createElement("button");
          btnRem.type = "button";
          btnRem.className = "btn btn-outline-danger btn-sm";
          btnRem.innerHTML = '<i class="bi bi-trash"></i>';
          btnRem.addEventListener("click", () => {
            prop.names.splice(nmIdx, 1);
            renderProperties();
          });
          colBtn.appendChild(btnRem);
          nameRow.appendChild(colTerm);
          nameRow.appendChild(colVoc);
          nameRow.appendChild(colBtn);
          propNamesContainer.appendChild(nameRow);
        });
      }
      namesSection.appendChild(namesHeader);
      namesSection.appendChild(propNamesContainer);
      
      content.appendChild(descGroup);
      content.appendChild(row);
      content.appendChild(namesSection);
      card.appendChild(header);
      card.appendChild(content);
      propertiesContainer.appendChild(card);
    });
  };

  const validateForm = () => {
    const errors = [];
    if (!ftNameInput.value.trim()) errors.push("The 'Name' field is required.");
    if (!ftDescInput.value.trim()) errors.push("The 'Description' field is required.");
    if (errors.length) {
      showNotification(errors.join("\n"));
      return false;
    }
    return true;
  };

  const save = () => {
    if (!validateForm()) return;
    const result = {
      name: ftNameInput.value.trim(),
      description: ftDescInput.value.trim(),
      names: JSON.parse(JSON.stringify(currentNames)),
      properties: JSON.parse(JSON.stringify(currentProperties)),
      references: JSON.parse(JSON.stringify(currentReferences))
    };
    if (onSaveCallback) onSaveCallback(result, editingIndex);
  };

  const edit = (ft, index) => {
    editingIndex = index;
    ftNameInput.value = ft.name || "";
    ftDescInput.value = ft.description || "";
    currentNames = JSON.parse(JSON.stringify(ft.names || []));
    currentProperties = JSON.parse(JSON.stringify(ft.properties || []));
    currentReferences = JSON.parse(JSON.stringify(ft.references || []));
    renderNames();
    renderProperties();
    renderReferences();
    updatePlaceholders();
  };

  const reset = () => {
    editingIndex = null;
    ftNameInput.value = "";
    ftDescInput.value = "";
    currentNames = [];
    currentProperties = [];
    currentReferences = [];
    renderNames();
    renderProperties();
    renderReferences();
  };

  const scrollToNewProperty = () => {
    setTimeout(() => {
      const lastProperty = propertiesContainer.lastElementChild;
      if (lastProperty) {
        lastProperty.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const nameInput = lastProperty.querySelector('input[type="text"]');
        if (nameInput) nameInput.focus();
      }
    }, 100);
  };

  const scrollToNewReference = () => {
    setTimeout(() => {
      const lastReference = container.querySelector("#ftReferencesContainer .card:last-child");
      if (lastReference) {
        lastReference.scrollIntoView({ behavior: "smooth", block: "start" });
        const nameInput = lastReference.querySelector('input[type="text"]');
        if (nameInput) nameInput.focus();
      }
    }, 100);
  };

  const renderBaseForm = () => {
    container.innerHTML = `
      <div class="position-relative">
        <div class="card shadow-sm mb-4">
          <div class="card-header bg-light py-2 px-3">
            <h6 class="card-title d-flex align-items-center mb-0">
              <i class="bi bi-geo-alt me-2 text-primary"></i>Feature Editor
            </h6>
          </div>
          <div class="card-body p-3">
            <div class="mb-2">
              <label class="form-label mb-1 small fw-bold d-flex align-items-center">
                <i class="bi bi-tag me-1 text-primary"></i>Name
                <span class="ms-1 text-danger">*</span>
              </label>
              <input type="text" class="form-control form-control-sm shadow-sm" id="ftNameInput" placeholder="Enter feature name" />
            </div>
            <div class="mb-3">
              <label class="form-label mb-1 small fw-bold d-flex align-items-center">
                <i class="bi bi-file-text me-1 text-primary"></i>Description
                <span class="ms-1 text-danger">*</span>
              </label>
              <textarea class="form-control form-control-sm shadow-sm" id="ftDescInput" rows="2" placeholder="Enter a short description"></textarea>
            </div>
            <div class="card shadow-sm mb-3">
              <div class="card-header bg-light py-2 px-3 cursor-pointer d-flex justify-content-between align-items-center" id="namesHeader">
                <h6 class="mb-0 small fw-bold">
                  <i class="bi bi-translate me-1 text-primary"></i>Names
                </h6>
                <div>
                  <button type="button" class="btn btn-sm btn-outline-primary me-2" id="btnAddFeatureName">
                    <i class="bi bi-plus-circle"></i>
                  </button>
                </div>
              </div>
              <div class="card-body p-2" id="namesContent">
                <div id="ftNamesContainer" class="mb-2"></div>
                <div id="ftEmptyNamesPlaceholder" class="text-center text-muted p-2 small">
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
                  <button type="button" class="btn btn-sm btn-outline-primary me-2" id="btnAddFeatureProp">
                    <i class="bi bi-plus-circle"></i>
                  </button>
                </div>
              </div>
              <div class="card-body p-2" id="propertiesContent">
                <div id="ftPropertiesContainer" class="mb-2"></div>
                <div id="ftEmptyPropertiesPlaceholder" class="text-center text-muted p-2 small">
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
                  <button type="button" class="btn btn-sm btn-outline-primary me-2" id="btnAddFeatureReference">
                    <i class="bi bi-plus-circle"></i>
                  </button>
                </div>
              </div>
              <div class="card-body p-2" id="referencesContent">
                <div id="ftReferencesContainer" class="mb-2"></div>
                <div id="ftEmptyReferencesPlaceholder" class="text-center text-muted p-2 small">
                  <i class="bi bi-info-circle me-1"></i>No references added yet
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="position-sticky bottom-0 bg-white py-3 px-3 d-flex justify-content-end border-top shadow" style="z-index: 1000; margin-top: 1rem;">
          <button type="button" class="btn btn-primary px-4" id="btnSaveFeatureEditor">
            <i class="bi bi-check-circle-fill me-2"></i>Save Changes
          </button>
        </div>
      </div>
    `;

    ftNameInput = container.querySelector("#ftNameInput");
    ftDescInput = container.querySelector("#ftDescInput");
    namesContainer = container.querySelector("#ftNamesContainer");
    propertiesContainer = container.querySelector("#ftPropertiesContainer");
    container.querySelector("#btnAddFeatureName").addEventListener("click", (e) => {
      e.preventDefault();
      currentNames.push({ term: "", vocabulary: "" });
      renderNames();
      updatePlaceholders();
    });
    container.querySelector("#btnAddFeatureProp").addEventListener("click", (e) => {
      e.preventDefault();
      currentProperties.push({ 
        name: "", 
        description: "", 
        data_type: "", 
        repeated: false, 
        scope: "feature", 
        names: [] 
      });
      renderProperties();
      updatePlaceholders();
      scrollToNewProperty();
    });
    container.querySelector("#btnAddFeatureReference").addEventListener("click", (e) => {
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
    container.querySelector("#btnSaveFeatureEditor").addEventListener("click", save);
    reset();
    updatePlaceholders();

    // Add event listeners for section folding
    const sections = [
      { header: 'names', button: 'btnAddFeatureName' },
      { header: 'properties', button: 'btnAddFeatureProp' },
      { header: 'references', button: 'btnAddFeatureReference' }
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
  };

  // Correctly placed: Reference type selector options for all types
  const getReferenceTypeOptions = () => {
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
  };

  const renderReferences = () => {
    const refsContainer = container.querySelector("#ftReferencesContainer");
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
      toggleBtn.innerHTML = '<i class="bi bi-dash-lg"></i>';
      toggleBtn.addEventListener("click", () => {
        const contentDiv = refCard.querySelector(".reference-content");
        if (contentDiv.style.display === "none") {
          contentDiv.style.display = "block";
          toggleBtn.innerHTML = '<i class="bi bi-dash-lg"></i>';
        } else {
          contentDiv.style.display = "none";
          toggleBtn.innerHTML = '<i class="bi bi-plus-lg"></i>';
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

      // Referenced Type, Repeated, Scope row
      const row = document.createElement("div");
      row.className = "row mb-3";

      // Referenced Type column
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

      // Repeated column 
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

      // Scope column
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

      contentDiv.appendChild(descFormGroup);
      contentDiv.appendChild(row);
      refCard.appendChild(headerDiv);
      refCard.appendChild(contentDiv);
      refsContainer.appendChild(refCard);
    });
  };

  const init = (targetElement, onSave) => {
    container = targetElement;
    onSaveCallback = onSave;
    renderBaseForm();
  };

  return { init, edit, reset };
})();
