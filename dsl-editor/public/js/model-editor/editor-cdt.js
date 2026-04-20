window.CDTEditor = (function () {
  let container = null;

  let cdtNameInput, cdtDescInput, namesContainer, versionsContainer;
  let currentNames = [];
  let currentVersions = [];
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
              <i class="bi bi-box me-2 text-primary"></i>CDT Editor
            </h6>
          </div>
          <div class="card-body p-3">
            <div class="mb-2">
              <label class="form-label mb-1 small fw-bold d-flex align-items-center">
                <i class="bi bi-tag me-1 text-primary"></i>Name
                <span class="ms-1 text-danger">*</span>
              </label>
              <input type="text" class="form-control form-control-sm shadow-sm" id="cdtNameInput" placeholder="Enter CDT name" />
            </div>
            <div class="mb-3">
              <label class="form-label mb-1 small fw-bold d-flex align-items-center">
                <i class="bi bi-file-text me-1 text-primary"></i>Description
                <span class="ms-1 text-danger">*</span>
              </label>
              <textarea class="form-control form-control-sm shadow-sm" id="cdtDescInput" rows="2" placeholder="Enter a short description"></textarea>
            </div>

            <div class="card shadow-sm mb-3">
              <div class="card-header bg-light py-2 px-3 cursor-pointer d-flex justify-content-between align-items-center" id="namesHeader">
                <h6 class="mb-0 small fw-bold">
                  <i class="bi bi-translate me-1 text-primary"></i>Names
                </h6>
                <div>
                  <button type="button" class="btn btn-sm btn-outline-primary me-2" id="btnAddCDTName">
                    <i class="bi bi-plus-circle"></i>
                  </button>                  
                </div>
              </div>
              <div class="card-body p-2" id="namesContent">
                <div id="cdtNamesContainer" class="mb-2"></div>
                <div id="cdtEmptyNamesPlaceholder" class="text-center text-muted p-2 small">
                  <i class="bi bi-info-circle me-1"></i>No names added yet
                </div>
              </div>
            </div>

            <div class="card shadow-sm mb-3">
              <div class="card-header bg-light py-2 px-3 cursor-pointer d-flex justify-content-between align-items-center" id="versionsHeader">
                <h6 class="mb-0 small fw-bold">
                  <i class="bi bi-layers me-1 text-primary"></i>Versions
                </h6>
                <div>
                  <button type="button" class="btn btn-sm btn-outline-primary me-2" id="btnAddCDTVersion">
                    <i class="bi bi-plus-circle"></i>
                  </button>                  
                </div>
              </div>
              <div class="card-body p-2" id="versionsContent">
                <div id="cdtVersionsContainer" class="mb-2"></div>
                <div id="cdtEmptyVersionsPlaceholder" class="text-center text-muted p-2 small">
                  <i class="bi bi-info-circle me-1"></i>No versions added yet
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="position-sticky bottom-0 bg-white py-3 px-3 d-flex justify-content-end border-top shadow" style="z-index: 1000; margin-top: 1rem;">
          <button type="button" class="btn btn-primary px-4" id="btnSaveCDTEditor">
            <i class="bi bi-check-circle-fill me-2"></i>Save Changes
          </button>
        </div>
      </div>
    `;

    cdtNameInput = container.querySelector("#cdtNameInput");
    cdtDescInput = container.querySelector("#cdtDescInput");
    namesContainer = container.querySelector("#cdtNamesContainer");
    versionsContainer = container.querySelector("#cdtVersionsContainer");

    function updatePlaceholders() {
      const emptyNames = document.getElementById('cdtEmptyNamesPlaceholder');
      if (emptyNames) emptyNames.style.display = currentNames.length > 0 ? 'none' : 'block';
      
      const emptyVersions = document.getElementById('cdtEmptyVersionsPlaceholder');
      if (emptyVersions) emptyVersions.style.display = currentVersions.length > 0 ? 'none' : 'block';
    }

    container.querySelector("#btnAddCDTName").addEventListener("click", (e) => {
      e.preventDefault();
      currentNames.push({ term: "", vocabulary: "" });
      renderNames();
      updatePlaceholders();
    });

    container
      .querySelector("#btnAddCDTVersion")
      .addEventListener("click", (e) => {
        e.preventDefault();
        currentVersions.push({ version: "", fields: [] });
        renderVersions();
        updatePlaceholders();
        
        // Scroll a la nueva versión después de renderizarla
        setTimeout(() => {
          const allVersionCards = versionsContainer.querySelectorAll('.card');
          if (allVersionCards.length > 0) {
            const lastCard = allVersionCards[allVersionCards.length - 1];
            const versionInput = lastCard.querySelector('input');
            lastCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (versionInput) {
              versionInput.focus();
            }
          }
        }, 100);
      });

    container
      .querySelector("#btnSaveCDTEditor")
      .addEventListener("click", save);
    
    cdtNameInput.addEventListener("input", function() {
      validateField(cdtNameInput, "#cdtNameError", "Name is required");
    });
    
    cdtDescInput.addEventListener("input", function() {
      validateField(cdtDescInput, "#cdtDescError", "Description is required");
    });

    // Add event listeners for section folding
    const sections = [
      { header: 'names', button: 'btnAddCDTName' },
      { header: 'versions', button: 'btnAddCDTVersion' }
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

    reset();
    updatePlaceholders();
  }

  function validateField(field, errorSelector, errorMessage) {
    const errorElement = container.querySelector(errorSelector);
    if (!field.value.trim()) {
      field.classList.add("is-invalid");
      field.classList.remove("is-valid");
      if (errorElement) errorElement.textContent = errorMessage;
      return false;
    } else {
      field.classList.remove("is-invalid");
      field.classList.add("is-valid");
      return true;
    }
  }

  function validateForm() {
    let isValid = true;
    
    // Validate required fields
    isValid = validateField(cdtNameInput, "#cdtNameError", "Name is required") && isValid;
    isValid = validateField(cdtDescInput, "#cdtDescError", "Description is required") && isValid;

    if (currentVersions.length === 0) {
      showNotification("You must add at least one version");
      isValid = false;
    }

    return isValid;
  }

  function edit(cdt, index) {
    editingIndex = index;
    cdtNameInput.value = cdt.name || "";
    cdtDescInput.value = cdt.description || "";
    currentNames = JSON.parse(JSON.stringify(cdt.names || []));
    currentVersions = JSON.parse(JSON.stringify(cdt.versions || []));
    renderNames();
    renderVersions();
    
    const emptyNames = document.getElementById('cdtEmptyNamesPlaceholder');
    if (emptyNames) emptyNames.style.display = currentNames.length > 0 ? 'none' : 'block';
    
    const emptyVersions = document.getElementById('cdtEmptyVersionsPlaceholder');
    if (emptyVersions) emptyVersions.style.display = currentVersions.length > 0 ? 'none' : 'block';
  }

  function reset() {
    editingIndex = null;
    cdtNameInput.value = "";
    cdtDescInput.value = "";
    currentNames = [];
    currentVersions = [];
    renderNames();
    renderVersions();
  }

  function save() {
    if (!validateForm()) {
      return;
    }

    const result = {
      name: cdtNameInput.value.trim(),
      description: cdtDescInput.value.trim(),
      names: JSON.parse(JSON.stringify(currentNames)),
      versions: JSON.parse(JSON.stringify(currentVersions)),
    };
    if (onSaveCallback) {
      onSaveCallback(result, editingIndex);
    }
  }

  function renderNames() {
    namesContainer.innerHTML = "";
    currentNames.forEach((n, index) => {
      const card = document.createElement("div");
      card.className = "card mb-2 border-0 shadow-sm";
      
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
        const emptyNames = document.getElementById('cdtEmptyNamesPlaceholder');
        if (emptyNames) emptyNames.style.display = currentNames.length > 0 ? 'none' : 'block';
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

  function renderVersions() {
    versionsContainer.innerHTML = "";
    currentVersions.forEach((ver, idxVer) => {
      const verCard = document.createElement("div");
      verCard.className = "card border-0 shadow-sm rounded mb-3";

      const headerDiv = document.createElement("div");
      headerDiv.className = "card-header bg-light d-flex justify-content-between align-items-center";

      const headerLeftDiv = document.createElement("div");
      headerLeftDiv.className = "d-flex align-items-center flex-grow-1";

      const toggleBtn = document.createElement("button");
      toggleBtn.className = "btn btn-sm btn-outline-secondary me-2";
      toggleBtn.style.width = "30px";
      toggleBtn.innerHTML = '<i class="bi bi-dash-lg"></i>';
      toggleBtn.addEventListener("click", () => {
        const contentDiv = verCard.querySelector(".version-content");
        if (contentDiv.style.display === "none") {
          contentDiv.style.display = "block";
          toggleBtn.innerHTML = '<i class="bi bi-dash-lg"></i>';
        } else {
          contentDiv.style.display = "none";
          toggleBtn.innerHTML = '<i class="bi bi-plus-lg"></i>';
        }
      });

      const versionInputGroup = document.createElement("div");
      versionInputGroup.className = "input-group ms-2 flex-grow-1";
      
      const versionInputGroupText = document.createElement("span");
      versionInputGroupText.className = "input-group-text";
      versionInputGroupText.innerHTML = '<i class="bi bi-code-slash"></i>';
      
      const inpVer = document.createElement("input");
      inpVer.className = "form-control";
      inpVer.placeholder = "Version name (e.g. default)";
      inpVer.value = ver.version;
      inpVer.addEventListener("input", (ev) => {
        currentVersions[idxVer].version = ev.target.value;
      });
      
      versionInputGroup.appendChild(versionInputGroupText);
      versionInputGroup.appendChild(inpVer);

      headerLeftDiv.appendChild(toggleBtn);
      headerLeftDiv.appendChild(versionInputGroup);

      const btnRemoveVer = document.createElement("button");
      btnRemoveVer.className = "btn btn-sm btn-outline-danger ms-2";
      btnRemoveVer.innerHTML = '<i class="bi bi-trash"></i>';
      btnRemoveVer.title = "Remove version";
      btnRemoveVer.addEventListener("click", () => {
        currentVersions.splice(idxVer, 1);
        renderVersions();
        const emptyVersions = document.getElementById('cdtEmptyVersionsPlaceholder');
        if (emptyVersions) emptyVersions.style.display = currentVersions.length > 0 ? 'none' : 'block';
      });

      headerDiv.appendChild(headerLeftDiv);
      headerDiv.appendChild(btnRemoveVer);

      const contentDiv = document.createElement("div");
      contentDiv.className = "card-body version-content p-3";
      contentDiv.style.display = "block";

      const fieldsTitle = document.createElement("div");
      fieldsTitle.className = "d-flex justify-content-between align-items-center mb-3";
      fieldsTitle.innerHTML = '<h6 class="mb-0"><i class="bi bi-list-columns-reverse me-1"></i>Fields</h6>';

      const btnAddField = document.createElement("button");
      btnAddField.className = "btn btn-sm btn-outline-primary";
      btnAddField.innerHTML = '<i class="bi bi-plus-circle me-1"></i>Add field';
      btnAddField.addEventListener("click", () => {
        ver.fields.push({
          name: "",
          data_type: "",
          repeated: false,
          names: [],
        });
        renderVersions();
      });
      fieldsTitle.appendChild(btnAddField);
      
      const fieldsContainer = document.createElement("div");
      fieldsContainer.className = "fields-container mb-3";

      if (!ver.fields || ver.fields.length === 0) {
        const emptyFieldsMsg = document.createElement("div");
        emptyFieldsMsg.className = "text-center text-muted p-3 border rounded";
        emptyFieldsMsg.innerHTML = '<i class="bi bi-info-circle me-1"></i>No fields added yet. Click "Add field" to add one.';
        fieldsContainer.appendChild(emptyFieldsMsg);
      } else {
        ver.fields.forEach((field, idxField) => {
          const fieldCard = document.createElement("div");
          fieldCard.className = "card mb-3 border";

          const fieldHeader = document.createElement("div");
          fieldHeader.className = "card-header bg-light d-flex justify-content-between align-items-center";
          
          const headerLeftDiv = document.createElement("div");
          headerLeftDiv.className = "d-flex align-items-center flex-grow-1";

          const fieldToggle = document.createElement("button");
          fieldToggle.className = "btn btn-sm btn-outline-secondary me-2";
          fieldToggle.style.width = "30px";
          fieldToggle.innerHTML = '<i class="bi bi-dash-lg"></i>';
          fieldToggle.addEventListener("click", () => {
            const fieldContent = fieldCard.querySelector(".field-content");
            if (fieldContent.style.display === "none") {
              fieldContent.style.display = "block";
              fieldToggle.innerHTML = '<i class="bi bi-dash-lg"></i>';
            } else {
              fieldContent.style.display = "none";
              fieldToggle.innerHTML = '<i class="bi bi-plus-lg"></i>';
            }
          });
          
          const fieldNameGroup = document.createElement("div");
          fieldNameGroup.className = "input-group ms-2 flex-grow-1";
          
          const fieldNameText = document.createElement("span");
          fieldNameText.className = "input-group-text";
          fieldNameText.innerHTML = '<i class="bi bi-input-cursor-text"></i>';
          
          const inpFieldName = document.createElement("input");
          inpFieldName.className = "form-control";
          inpFieldName.placeholder = "Field name";
          inpFieldName.value = field.name;
          inpFieldName.addEventListener("input", (ev) => {
            field.name = ev.target.value;
          });
          
          fieldNameGroup.appendChild(fieldNameText);
          fieldNameGroup.appendChild(inpFieldName);
          
          headerLeftDiv.appendChild(fieldToggle);
          headerLeftDiv.appendChild(fieldNameGroup);

          const btnRemoveField = document.createElement("button");
          btnRemoveField.className = "btn btn-sm btn-outline-danger ms-2";
          btnRemoveField.innerHTML = '<i class="bi bi-trash"></i>';
          btnRemoveField.title = "Remove field";
          btnRemoveField.addEventListener("click", () => {
            ver.fields.splice(idxField, 1);
            renderVersions();
          });
          
          fieldHeader.appendChild(headerLeftDiv);
          fieldHeader.appendChild(btnRemoveField);
          
          const fieldContent = document.createElement("div");
          fieldContent.className = "card-body field-content";
          fieldContent.style.display = "block";

          const row = document.createElement("div");
          row.className = "row mb-3";
          
          const colDT = document.createElement("div");
          colDT.className = "col-md-8";
          
          const dtLabel = document.createElement("label");
          dtLabel.className = "form-label";
          dtLabel.innerHTML = '<i class="bi bi-braces me-1"></i>Data Type';
          
          const dtInputGroup = document.createElement("div");
          dtInputGroup.className = "input-group mb-2";
          
          const dtGroupText = document.createElement("span");
          dtGroupText.className = "input-group-text";
          dtGroupText.innerHTML = '<i class="bi bi-code"></i>';
          
          const inpFieldDT = document.createElement("input");
          inpFieldDT.className = "form-control";
          inpFieldDT.placeholder = "string, number, Date, etc.";
          inpFieldDT.value = field.data_type;
          inpFieldDT.addEventListener("input", (ev) => {
            field.data_type = ev.target.value;
          });
          
          dtInputGroup.appendChild(dtGroupText);
          dtInputGroup.appendChild(inpFieldDT);
          
          colDT.appendChild(dtLabel);
          colDT.appendChild(dtInputGroup);
          
          const colRep = document.createElement("div");
          colRep.className = "col-md-4";
          
          const repLabel = document.createElement("label");
          repLabel.innerHTML = '<i class="bi bi-repeat me-1"></i>Repeated';
          
          const repSelect = document.createElement("select");
          repSelect.className = "form-select";
          repSelect.innerHTML = `
            <option value="false">false</option>
            <option value="true">true</option>
          `;
          repSelect.value = field.repeated ? "true" : "false";
          repSelect.addEventListener("change", (ev) => {
            field.repeated = ev.target.value === "true";
          });
          
          colRep.appendChild(repLabel);
          colRep.appendChild(repSelect);
          
          row.appendChild(colDT);
          row.appendChild(colRep);
          
          // Names section
          const namesSection = document.createElement("div");
          namesSection.className = "mb-3";
          
          const namesHeader = document.createElement("div");
          namesHeader.className = "d-flex justify-content-between align-items-center mb-2";
          namesHeader.innerHTML = '<h6 class="mb-0"><i class="bi bi-translate me-1"></i>Field Names</h6>';
          
          const btnAddFieldName = document.createElement("button");
          btnAddFieldName.className = "btn btn-sm btn-outline-primary";
          btnAddFieldName.innerHTML = '<i class="bi bi-plus-circle"></i>';
          btnAddFieldName.addEventListener("click", () => {
            if (!field.names) field.names = [];
            field.names.push({ term: "", vocabulary: "" });
            renderVersions();
          });
          namesHeader.appendChild(btnAddFieldName);
          
          const fieldNamesContainer = document.createElement("div");
          fieldNamesContainer.className = "mb-3";
          
          if (!field.names || field.names.length === 0) {
            const emptyNamesMsg = document.createElement("div");
            emptyNamesMsg.className = "text-center text-muted p-2 border rounded";
            emptyNamesMsg.innerHTML = '<small><i class="bi bi-info-circle me-1"></i>No names added yet</small>';
            fieldNamesContainer.appendChild(emptyNamesMsg);
          } else {
            field.names.forEach((fn, idxFn) => {
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
              nameInputTerm.value = fn.term;
              nameInputTerm.addEventListener("input", (ev) => {
                field.names[idxFn].term = ev.target.value;
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
              
              const nameSelectVoc = createVocabularySelect(fn.vocabulary, (newValue) => {
                field.names[idxFn].vocabulary = newValue;
              });
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
                field.names.splice(idxFn, 1);
                renderVersions();
              });
              nameColBtn.appendChild(nameBtnRem);
              
              nameRow.appendChild(nameColTerm);
              nameRow.appendChild(nameColVoc);
              nameRow.appendChild(nameColBtn);
              
              nameCardBody.appendChild(nameRow);
              nameCard.appendChild(nameCardBody);
              fieldNamesContainer.appendChild(nameCard);
            });
          }
          
          namesSection.appendChild(namesHeader);
          namesSection.appendChild(fieldNamesContainer);
          
          fieldContent.appendChild(row);
          fieldContent.appendChild(namesSection);
          
          fieldCard.appendChild(fieldHeader);
          fieldCard.appendChild(fieldContent);
          
          fieldsContainer.appendChild(fieldCard);
        });
      }

      contentDiv.appendChild(fieldsTitle);
      contentDiv.appendChild(fieldsContainer);

      verCard.appendChild(headerDiv);
      verCard.appendChild(contentDiv);
      versionsContainer.appendChild(verCard);
    });
  }

  return {
    init,
    edit,
    reset,
  };
})();
