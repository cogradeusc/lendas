window.EnumerationEditor = (function () {
  let container = null;

  let enumNameInput, enumDescInput, namesContainer;
  let versionsContainer;
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
              <i class="bi bi-list-ul me-2 text-primary"></i>Enumeration Editor
            </h6>
          </div>
          <div class="card-body p-3">
            <div class="mb-2">
              <label class="form-label mb-1 small fw-bold d-flex align-items-center">
                <i class="bi bi-tag me-1 text-primary"></i>Name
                <span class="ms-1 text-danger">*</span>
              </label>
              <input type="text" class="form-control form-control-sm shadow-sm" id="enumNameInput" placeholder="Enter enumeration name" />
            </div>
            <div class="mb-3">
              <label class="form-label mb-1 small fw-bold d-flex align-items-center">
                <i class="bi bi-file-text me-1 text-primary"></i>Description
                <span class="ms-1 text-danger">*</span>
              </label>
              <textarea class="form-control form-control-sm shadow-sm" id="enumDescInput" rows="2" placeholder="Enter a short description"></textarea>
            </div>

            <div class="card shadow-sm mb-3">
              <div class="card-header bg-light py-2 px-3 cursor-pointer d-flex justify-content-between align-items-center" id="namesHeader">
                <h6 class="mb-0 small fw-bold">
                  <i class="bi bi-translate me-1 text-primary"></i>Names
                </h6>
                <div>
                  <button type="button" class="btn btn-sm btn-outline-primary me-2" id="btnAddEnumName">
                    <i class="bi bi-plus-circle"></i>
                  </button>                  
                </div>
              </div>
              <div class="card-body p-2" id="namesContent">
                <div id="enumNamesContainer" class="mb-2"></div>
                <div id="emptyNamesPlaceholder" class="text-center text-muted p-2 small">
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
                  <button type="button" class="btn btn-sm btn-outline-primary me-2" id="btnAddEnumVersion">
                    <i class="bi bi-plus-circle"></i>
                  </button>                  
                </div>
              </div>
              <div class="card-body p-2" id="versionsContent">
                <div id="enumVersionsContainer" class="mb-2"></div>
                <div id="emptyVersionsPlaceholder" class="text-center text-muted p-2 small">
                  <i class="bi bi-info-circle me-1"></i>No versions added yet
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="position-sticky bottom-0 bg-white py-3 px-3 d-flex justify-content-end border-top shadow" style="z-index: 1000; margin-top: 1rem;">
          <button type="button" class="btn btn-primary px-4" id="btnSaveEnumeration">
            <i class="bi bi-check-circle-fill me-2"></i>Save Changes
          </button>
        </div>
      </div>
    `;

    enumNameInput = container.querySelector("#enumNameInput");
    enumDescInput = container.querySelector("#enumDescInput");
    namesContainer = container.querySelector("#enumNamesContainer");
    versionsContainer = container.querySelector("#enumVersionsContainer");
    
    function updatePlaceholders() {
      const emptyNames = document.getElementById('emptyNamesPlaceholder');
      if (emptyNames) emptyNames.style.display = currentNames.length > 0 ? 'none' : 'block';
      
      const emptyVersions = document.getElementById('emptyVersionsPlaceholder');
      if (emptyVersions) emptyVersions.style.display = currentVersions.length > 0 ? 'none' : 'block';
    }
    
    container
      .querySelector("#btnAddEnumName")
      .addEventListener("click", (e) => {
        e.preventDefault();
        currentNames.push({ term: "", vocabulary: "" });
        renderNames();
        updatePlaceholders();
      });
    container
      .querySelector("#btnAddEnumVersion")
      .addEventListener("click", (e) => {
        e.preventDefault();
        currentVersions.push({ version: "", values: [] });
        renderVersions();
        updatePlaceholders();
        
        // Scroll a la nueva versión después de renderizarla
        setTimeout(() => {
          const allVersionCards = container.querySelectorAll('#enumVersionsContainer .card');
          if (allVersionCards.length > 0) {
            const lastCard = allVersionCards[allVersionCards.length - 1];
            lastCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      });
    container
      .querySelector("#btnSaveEnumeration")
      .addEventListener("click", save);
    
    // Eliminamos el listener para el botón Cancel ya que lo hemos quitado del HTML

    enumNameInput.addEventListener("input", function() {
      validateField(enumNameInput, "#enumNameError", "Name is required");
    });
    
    enumDescInput.addEventListener("input", function() {
      validateField(enumDescInput, "#enumDescError", "Description is required");
    });

    // Add event listeners for section folding
    const sections = [
      { header: 'names', button: 'btnAddEnumName' },
      { header: 'versions', button: 'btnAddEnumVersion' }
    ];

    sections.forEach(section => {
      const header = container.querySelector(`#${section.header}Header`);
      const content = container.querySelector(`#${section.header}Content`);
      const addButton = container.querySelector(`#${section.button}`);
      
      header.style.cursor = "pointer";
      
      header.addEventListener("click", (e) => {
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

  function edit(enumDT, index) {
    editingIndex = index;
    enumNameInput.value = enumDT.name || "";
    enumDescInput.value = enumDT.description || "";
    currentNames = JSON.parse(JSON.stringify(enumDT.names || []));
    currentVersions = JSON.parse(JSON.stringify(enumDT.versions || []));
    // Asegurar estructura para cada version y vocabulario
    currentVersions.forEach(ver => {
      if (!Array.isArray(ver.values)) {
        ver.values = [];
      } else {
        ver.values.forEach(voc => {
          if (!Array.isArray(voc.terms)) voc.terms = [];
          if (typeof voc.vocabulary !== 'string') voc.vocabulary = '';
        });
      }
    });
    renderNames();
    renderVersions();
    
    const emptyNames = document.getElementById('emptyNamesPlaceholder');
    if (emptyNames) emptyNames.style.display = currentNames.length > 0 ? 'none' : 'block';
    
    const emptyVersions = document.getElementById('emptyVersionsPlaceholder');
    if (emptyVersions) emptyVersions.style.display = currentVersions.length > 0 ? 'none' : 'block';
  }

  function reset() {
    editingIndex = null;
    enumNameInput.value = "";
    enumDescInput.value = "";
    currentNames = [];
    currentVersions = [];
    renderNames();
    renderVersions();
  }

  function save() {
    if (!validateForm()) return;

    // Validación de estructura anidada de versions
    for (let i = 0; i < currentVersions.length; i++) {
      const v = currentVersions[i];
      if (!v.version || typeof v.version !== 'string' || !v.version.trim()) {
        showNotification(`Version #${i + 1} must have a name.`);
        return;
      }
      if (!Array.isArray(v.values) || v.values.length === 0) {
        showNotification(`Version "${v.version}" must have at least one vocabulary.`);
        return;
      }
      for (let j = 0; j < v.values.length; j++) {
        const voc = v.values[j];
        if (!voc.vocabulary || typeof voc.vocabulary !== 'string' || !voc.vocabulary.trim()) {
          showNotification(`Vocabulary #${j + 1} in version "${v.version}" must have a name.`);
          return;
        }
        if (!Array.isArray(voc.terms) || voc.terms.length === 0) {
          showNotification(`Vocabulary "${voc.vocabulary}" in version "${v.version}" must have at least one term.`);
          return;
        }
        for (let k = 0; k < voc.terms.length; k++) {
          const term = voc.terms[k];
          if (!term || typeof term !== 'string' || !term.trim()) {
            showNotification(`Term #${k + 1} in vocabulary "${voc.vocabulary}" (version "${v.version}") must not be empty.`);
            return;
          }
        }
      }
    }

    const result = {
      name: enumNameInput.value.trim(),
      description: enumDescInput.value.trim(),
      names: JSON.parse(JSON.stringify(currentNames)),
      versions: JSON.parse(JSON.stringify(currentVersions)),
    };
    if (onSaveCallback) onSaveCallback(result, editingIndex);
  }

  function validateForm() {
    let isValid = true;

    // Validate required fields
    isValid = validateField(enumNameInput, "#enumNameError", "Name is required") && isValid;
    isValid = validateField(enumDescInput, "#enumDescError", "Description is required") && isValid;
    
    if (currentVersions.length === 0) {
      const errorMsg = "You must add at least one version";
      showNotification(errorMsg);
      isValid = false;
    }

    return isValid;
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
      inputGroup.className = "input-group input-group-sm shadow-sm rounded overflow-hidden";
      
      const inputGroupText = document.createElement("span");
      inputGroupText.className = "input-group-text py-0 px-2 border-0 bg-light";
      inputGroupText.innerHTML = '<i class="bi bi-type"></i>';
      
      const inputTerm = document.createElement("input");
      inputTerm.className = "form-control form-control-sm border-0";
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
      vocGroup.className = "input-group input-group-sm shadow-sm rounded overflow-hidden";
      
      const vocGroupText = document.createElement("span");
      vocGroupText.className = "input-group-text py-0 px-2 border-0 bg-light";
      vocGroupText.innerHTML = '<i class="bi bi-book"></i>';
      
      const selectVoc = createVocabularySelect(n.vocabulary || "", (newValue) => {
        currentNames[index].vocabulary = newValue;
      });
      selectVoc.className = "form-select form-select-sm border-0";
      
      vocGroup.appendChild(vocGroupText);
      vocGroup.appendChild(selectVoc);
      colVoc.appendChild(vocGroup);

      const colBtn = document.createElement("div");
      colBtn.className = "col-md-2 text-end";
      const btnRem = document.createElement("button");
      btnRem.className = "btn btn-sm btn-outline-danger";
      btnRem.innerHTML = '<i class="bi bi-trash"></i>';
      btnRem.title = "Remove this name";
      btnRem.addEventListener("click", () => {
        // Eliminar sin confirmación
        currentNames.splice(index, 1);
        renderNames();
        const emptyNames = document.getElementById('emptyNamesPlaceholder');
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

    // Header
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
      const emptyVersions = document.getElementById('emptyVersionsPlaceholder');
      if (emptyVersions) emptyVersions.style.display = currentVersions.length > 0 ? 'none' : 'block';
    });
    headerDiv.appendChild(headerLeftDiv);
    headerDiv.appendChild(btnRemoveVer);

    // Content
    const contentDiv = document.createElement("div");
    contentDiv.className = "card-body version-content p-3";
    contentDiv.style.display = "block";

    // Vocabularies section
    const vocabulariesContainer = document.createElement("div");
    vocabulariesContainer.className = "mb-2";
    (ver.values || []).forEach((vocObj, idxVoc) => {
      const vocCard = document.createElement("div");
      vocCard.className = "card mb-2 border-0 shadow-sm";
      const vocBody = document.createElement("div");
      vocBody.className = "card-body p-2";
      const row = document.createElement("div");
      row.className = "row g-2 align-items-center";

      // Vocabulary input
      const colVoc = document.createElement("div");
      colVoc.className = "col-md-4";
      const vocGroup = document.createElement("div");
      vocGroup.className = "input-group input-group-sm shadow-sm rounded overflow-hidden";
      const vocGroupText = document.createElement("span");
      vocGroupText.className = "input-group-text py-0 px-2 border-0 bg-light";
      vocGroupText.innerHTML = '<i class="bi bi-book"></i>';
      const inputVoc = document.createElement("input");
      inputVoc.className = "form-control form-control-sm border-0";
      inputVoc.placeholder = "Vocabulary";
      inputVoc.value = vocObj.vocabulary || "";
      inputVoc.addEventListener("input", (ev) => {
        currentVersions[idxVer].values[idxVoc].vocabulary = ev.target.value;
      });
      vocGroup.appendChild(vocGroupText);
      vocGroup.appendChild(inputVoc);
      colVoc.appendChild(vocGroup);

      // Terms input
      const colTerms = document.createElement("div");
      colTerms.className = "col-md-6";
      const termsGroup = document.createElement("div");
      termsGroup.className = "input-group input-group-sm shadow-sm rounded overflow-hidden";
      const termsGroupText = document.createElement("span");
      termsGroupText.className = "input-group-text py-0 px-2 border-0 bg-light";
      termsGroupText.innerHTML = '<i class="bi bi-list-check"></i>';
      const termsInput = document.createElement("textarea");
      termsInput.className = "form-control form-control-sm border-0";
      termsInput.placeholder = "Terms (one per line)";
      termsInput.rows = 2;
      termsInput.value = (vocObj.terms || []).join("\n");
      termsInput.addEventListener("input", (ev) => {
        const splitted = ev.target.value
          .split("\n")
          .map((s) => s.trim())
          .filter((s) => s);
        currentVersions[idxVer].values[idxVoc].terms = splitted;
      });
      termsGroup.appendChild(termsGroupText);
      termsGroup.appendChild(termsInput);
      colTerms.appendChild(termsGroup);

      // Remove vocabulary button
      const colBtn = document.createElement("div");
      colBtn.className = "col-md-2 text-end";
      const btnRemVoc = document.createElement("button");
      btnRemVoc.className = "btn btn-sm btn-outline-danger";
      btnRemVoc.innerHTML = '<i class="bi bi-trash"></i>';
      btnRemVoc.title = "Remove vocabulary";
      btnRemVoc.addEventListener("click", () => {
        currentVersions[idxVer].values.splice(idxVoc, 1);
        renderVersions();
      });
      colBtn.appendChild(btnRemVoc);

      row.appendChild(colVoc);
      row.appendChild(colTerms);
      row.appendChild(colBtn);
      vocBody.appendChild(row);
      vocCard.appendChild(vocBody);
      vocabulariesContainer.appendChild(vocCard);
    });

    // Add vocabulary button
    const addVocBtn = document.createElement("button");
    addVocBtn.type = "button";
    addVocBtn.className = "btn btn-sm btn-outline-primary mt-1";
    addVocBtn.innerHTML = '<i class="bi bi-plus-circle"></i> Add vocabulary';
    addVocBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!ver.values) currentVersions[idxVer].values = [];
      currentVersions[idxVer].values.push({ vocabulary: "", terms: [] });
      renderVersions();
    });
    vocabulariesContainer.appendChild(addVocBtn);

    contentDiv.appendChild(vocabulariesContainer);
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
