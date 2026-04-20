window.ProcessEditor = (function () {
  let container = null;
  let ptNameInput,
    ptDescInput,
    ptMetadataLanguageInput,
    ptMetadataDateInput,
    ptTitleInput,
    ptAbstractInput,
    ptIdentifierInput,
    ptSpecificUsageInput,
    ptUseLimitationInput,
    ptKeywordsInput,
    ptSpatialRepresentationTypeSelect,
    ptSpatialResolutionInput,
    ptLanguageInput,
    ptTopicCategoryInput,
    ptResultTimeTypeSelect,
    ptPhenomenonTimeTypeSelect,
    ptPlatformFeatureTypeInput,
    ptPlatformScopeSelect,
    ptSharedFOIInput;
  let ptShapeTypeSelect,
    ptShapeCrsInput,
    ptHeightTypeSelect,
    ptHeightCrsInput,
    ptSampledFeatureTypeInput;
  let ptNames = [],
    ptProperties = [],
    ptReferences = [],
    ptMetadataContacts = [],
    ptPointOfContacts = [],
    ptUserContacts = [],
    ptObservedProperties = [];
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
        <i class="bi bi-gear me-2 text-primary"></i>Process Editor
      </h6>
    </div>
    <div class="card-body p-3">
      <div class="mb-3">
        <label class="form-label"><strong>Name</strong> <span class="text-danger">*</span></label>
        <input type="text" class="form-control" id="ptNameInput" placeholder="Enter process name">
      </div>
      <div class="mb-3">
        <label class="form-label"><strong>Description</strong> <span class="text-danger">*</span></label>
        <textarea class="form-control" id="ptDescInput" rows="2" placeholder="Enter process description"></textarea>
      </div>      
      <div class="card shadow-sm mb-3">
        <div class="card-header bg-light py-2 px-3 d-flex justify-content-between align-items-center" id="ptNamesHeader">
          <h6 class="mb-0"><i class="bi bi-translate me-1 text-primary"></i>Names</h6>
          <button type="button" class="btn btn-sm btn-outline-primary" id="btnAddPTName">
            <i class="bi bi-plus-circle"></i>
          </button>
        </div>
        <div class="card-body p-2" id="ptNamesContent" style="display: block;">
          <div id="ptNamesContainer" class="mb-2"></div>
          <div id="ptEmptyNamesPlaceholder" class="text-center text-muted small">
            <i class="bi bi-info-circle me-1"></i>No names added yet
          </div>
        </div>
      </div>
      <div class="card shadow-sm mb-3">
        <div class="card-header bg-light py-2 px-3 d-flex justify-content-between align-items-center" id="ptPropertiesHeader">
          <h6 class="mb-0"><i class="bi bi-list-ul me-1 text-primary"></i>Properties</h6>
          <button type="button" class="btn btn-sm btn-outline-primary" id="btnAddPTProperty"><i class="bi bi-plus-circle"></i></button>
        </div>
        <div class="card-body p-2" id="ptPropertiesContent" style="display: block;">
          <div id="ptPropertiesContainer" class="mb-2"></div>
          <div id="ptEmptyPropertiesPlaceholder" class="text-center text-muted small"><i class="bi bi-info-circle me-1"></i>No properties added yet</div>
        </div>
      </div>
      <div class="card shadow-sm mb-3">
        <div class="card-header bg-light py-2 px-3 d-flex justify-content-between align-items-center" id="ptReferencesHeader">
          <h6 class="mb-0"><i class="bi bi-link-45deg me-1 text-primary"></i>References</h6>
          <button type="button" class="btn btn-sm btn-outline-primary" id="btnAddPTReference"><i class="bi bi-plus-circle"></i></button>
        </div>
        <div class="card-body p-2" id="ptReferencesContent" style="display: block;">
          <div id="ptReferencesContainer" class="mb-2"></div>
          <div id="ptEmptyReferencesPlaceholder" class="text-center text-muted small"><i class="bi bi-info-circle me-1"></i>No references added yet</div>
        </div>
      </div>
      <div class="card shadow-sm mb-3">
          <div class="card-header bg-light py-2 px-3 d-flex justify-content-between align-items-center" id="ptMetadataHeader">
            <h6 class="card-title mb-0"><i class="bi bi-info-circle me-2 text-primary"></i>Process Metadata</h6>            
          </div>
          <div class="card-body p-3" id="ptMetadataContent" style="display: block;">
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label"><strong>Metadata Language</strong> <span class="text-danger">*</span></label>
              <input type="text" class="form-control" id="ptMetadataLanguageInput" placeholder="Enter comma separated language codes">
            </div>
            <div class="col-md-6">
              <label class="form-label"><strong>Metadata Date Stamp</strong> <span class="text-danger">*</span></label>
              <input type="datetime-local" class="form-control" id="ptMetadataDateInput">
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label"><strong>Title</strong> <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="ptTitleInput" placeholder="Enter title">
          </div>
          <div class="mb-3">
            <label class="form-label"><strong>Abstract</strong> <span class="text-danger">*</span></label>
            <textarea class="form-control" id="ptAbstractInput" rows="2" placeholder="Enter abstract"></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label"><strong>Identifier</strong> <span class="text-danger">*</span></label>
            <input type="text" class="form-control" id="ptIdentifierInput" placeholder="Enter identifier">
          </div>
          <div class="mb-3">
            <label class="form-label"><strong>Specific Usage</strong></label>
            <input type="text" class="form-control" id="ptSpecificUsageInput" placeholder="Enter specific usage">
          </div>
          <div class="mb-3">
            <label class="form-label"><strong>Use Limitation</strong></label>
            <textarea class="form-control" id="ptUseLimitationInput" rows="2" placeholder="Enter use limitation"></textarea>
          </div>
        </div>
      </div>
      <div class="card shadow-sm mb-3">
        <div class="card-header bg-light py-2 px-3 d-flex justify-content-between align-items-center" id="ptContactsHeader">
          <h6 class="card-title mb-0"><i class="bi bi-people me-2 text-primary"></i>Contact Information</h6>
        </div>
        <div class="card-body p-3" id="ptContactsContent" style="display: block;">
          <div class="mb-3">
            <label class="form-label"><strong>Metadata Contact</strong></label>
            <div id="ptMetadataContactContainer"></div>
            <button type="button" class="btn btn-sm btn-secondary" id="btnAddPTMetadataContact">+ Add Contact</button>
          </div>
          <div class="mb-3">
            <label class="form-label"><strong>Point of Contact</strong></label>
            <div id="ptPointOfContactContainer"></div>
            <button type="button" class="btn btn-sm btn-secondary" id="btnAddPTPointOfContact">+ Add Contact</button>
          </div>
          <div class="mb-3">
            <label class="form-label"><strong>User Contact</strong></label>
            <div id="ptUserContactContainer"></div>
            <button type="button" class="btn btn-sm btn-secondary" id="btnAddPTUserContact">+ Add Contact</button>
          </div>
        </div>
      </div>
      <div class="card shadow-sm mb-3">
        <div class="card-header bg-light py-2 px-3 d-flex justify-content-between align-items-center" id="ptKeywordsHeader">
          <h6 class="card-title mb-0"><i class="bi bi-key me-2 text-primary"></i>Keywords</h6>
        </div>
        <div class="card-body p-3" id="ptKeywordsContent" style="display: block;">
          <div class="mb-3">
            <label class="form-label"><strong>Keywords</strong></label>
            <input type="text" class="form-control" id="ptKeywordsInput" placeholder="Enter keywords, separated by commas">
          </div>
        </div>
      </div>
      <div class="card shadow-sm mb-3">
        <div class="card-header bg-light py-2 px-3 d-flex justify-content-between align-items-center" id="ptSpatialTemporalHeader">
          <h6 class="card-title mb-0"><i class="bi bi-arrows-fullscreen me-2 text-primary"></i>Spatial and Temporal</h6>
        </div>
        <div class="card-body p-3" id="ptSpatialTemporalContent" style="display: block;">
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label"><strong>Spatial Representation Type</strong></label>
              <select class="form-select" id="ptSpatialRepresentationTypeSelect">
                <option value="vector">vector</option>
                <option value="grid">grid</option>
                <option value="textTable">textTable</option>
                <option value="tin">tin</option>
                <option value="stereoModel">stereoModel</option>
                <option value="video">video</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label"><strong>Spatial Resolution</strong></label>
              <input type="text" class="form-control" id="ptSpatialResolutionInput" placeholder="Enter comma separated resolution values">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label"><strong>Language</strong></label>
              <input type="text" class="form-control" id="ptLanguageInput" placeholder="Enter comma separated language codes">
            </div>
            <div class="col-md-6">
              <label class="form-label"><strong>Topic Category</strong></label>
              <input type="text" class="form-control" id="ptTopicCategoryInput" placeholder="Enter topic categories, separated by commas">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label"><strong>Result Time Type</strong></label>
              <select class="form-select" id="ptResultTimeTypeSelect">
                <option value="instant">instant</option>
                <option value="period">period</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label"><strong>Phenomenon Time Type</strong></label>
              <select class="form-select" id="ptPhenomenonTimeTypeSelect">
                <option value="result_time">result_time</option>
                <option value="instant">instant</option>
                <option value="period">period</option>
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label class="form-label"><strong>Platform</strong></label>
              <div class="row g-2 align-items-center">
                <div class="col">
                  <input type="text" class="form-control" id="ptPlatformFeatureTypeInput" placeholder="Enter platform feature_type">
                </div>
                <div class="col-auto">
                  <select class="form-select" id="ptPlatformScopeSelect">
                    <option value="feature">feature</option>
                    <option value="valid_time_period">valid_time_period</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label"><strong>Shared Feature of Interest Type</strong></label>
              <input type="text" class="form-control" id="ptSharedFOIInput" placeholder="Enter shared feature of interest type">
            </div>
          </div>
        </div>
      </div>
      <div class="card shadow-sm mb-3">
        <div class="card-header bg-light py-2 px-3 d-flex justify-content-between align-items-center" id="ptGeneratedFOIHeader">
          <h6 class="card-title mb-0"><i class="bi bi-arrow-repeat me-2 text-primary"></i>Generated Feature of Interest Type</h6>
        </div>
        <div class="card-body p-3" id="ptGeneratedFOIContent" style="display: block;">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label"><strong>Shape Type</strong></label>
              <select class="form-select" id="ptShapeTypeSelect">
                <option value="point">point</option>
                <option value="line">line</option>
                <option value="surface">surface</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label"><strong>Shape CRS</strong></label>
              <input type="text" class="form-control" id="ptShapeCrsInput" placeholder="Enter shape CRS">
            </div>
            <div class="col-md-6">
              <label class="form-label"><strong>Height Type</strong></label>
              <select class="form-select" id="ptHeightTypeSelect">
                <option value="">(none)</option>
                <option value="point">point</option>
                <option value="range">range</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label"><strong>Height CRS</strong></label>
              <input type="text" class="form-control" id="ptHeightCrsInput" placeholder="Enter height CRS">
            </div>
            <div class="col-12">
              <label class="form-label"><strong>Sampled Feature Type</strong></label>
              <input type="text" class="form-control" id="ptSampledFeatureTypeInput" placeholder="Enter sampled feature type">
            </div>
          </div>
        </div>
      </div>
      <div class="card shadow-sm mb-3">
        <div class="card-header bg-light py-2 px-3 d-flex justify-content-between align-items-center" id="ptObservedPropertiesHeader">
          <h6 class="mb-0"><i class="bi bi-eye me-1 text-primary"></i>Observed Properties</h6>
          <button type="button" class="btn btn-sm btn-outline-primary" id="btnAddPTObservedProperty"><i class="bi bi-plus-circle"></i></button>
        </div>
        <div class="card-body p-2" id="ptObservedPropertiesContent" style="display: block;">
          <div id="ptObservedPropertiesContainer" class="mb-2"></div>
          <div id="ptEmptyObservedPropertiesPlaceholder" class="text-center text-muted small"><i class="bi bi-info-circle me-1"></i>No observed properties added yet</div>
        </div>
      </div>
    </div>
  </div>
  <div class="position-sticky bottom-0 bg-light py-2 px-3 d-flex justify-content-end border-top shadow-sm" style="z-index: 1000;">
    <button type="button" class="btn btn-primary" id="btnSavePTEditor"><i class="bi bi-check-circle me-1"></i>Save Process</button>
  </div>
</div>
    `;
    ptNameInput = container.querySelector("#ptNameInput");
    ptDescInput = container.querySelector("#ptDescInput");
    ptMetadataLanguageInput = container.querySelector(
      "#ptMetadataLanguageInput"
    );
    ptMetadataDateInput = container.querySelector("#ptMetadataDateInput");
    ptTitleInput = container.querySelector("#ptTitleInput");
    ptAbstractInput = container.querySelector("#ptAbstractInput");
    ptIdentifierInput = container.querySelector("#ptIdentifierInput");
    ptSpecificUsageInput = container.querySelector("#ptSpecificUsageInput");
    ptUseLimitationInput = container.querySelector("#ptUseLimitationInput");
    ptKeywordsInput = container.querySelector("#ptKeywordsInput");
    ptSpatialRepresentationTypeSelect = container.querySelector(
      "#ptSpatialRepresentationTypeSelect"
    );
    ptSpatialResolutionInput = container.querySelector(
      "#ptSpatialResolutionInput"
    );
    ptLanguageInput = container.querySelector("#ptLanguageInput");
    ptTopicCategoryInput = container.querySelector("#ptTopicCategoryInput");
    ptResultTimeTypeSelect = container.querySelector("#ptResultTimeTypeSelect");
    ptPhenomenonTimeTypeSelect = container.querySelector(
      "#ptPhenomenonTimeTypeSelect"
    );
    ptPlatformFeatureTypeInput = container.querySelector("#ptPlatformFeatureTypeInput");
ptPlatformScopeSelect = container.querySelector("#ptPlatformScopeSelect");
    ptSharedFOIInput = container.querySelector("#ptSharedFOIInput");
    ptShapeTypeSelect = container.querySelector("#ptShapeTypeSelect");
    ptShapeCrsInput = container.querySelector("#ptShapeCrsInput");
    ptHeightTypeSelect = container.querySelector("#ptHeightTypeSelect");
    ptHeightCrsInput = container.querySelector("#ptHeightCrsInput");
    ptSampledFeatureTypeInput = container.querySelector(
      "#ptSampledFeatureTypeInput"
    );
    const btnAddPTName = container.querySelector("#btnAddPTName");
    const btnAddPTProperty = container.querySelector("#btnAddPTProperty");
    const btnAddPTReference = container.querySelector("#btnAddPTReference");
    const btnAddPTMetadataContact = container.querySelector(
      "#btnAddPTMetadataContact"
    );
    const btnAddPTPointOfContact = container.querySelector(
      "#btnAddPTPointOfContact"
    );
    const btnAddPTUserContact = container.querySelector("#btnAddPTUserContact");
    const btnAddPTObservedProperty = container.querySelector(
      "#btnAddPTObservedProperty"
    );
    const btnSavePTEditor = container.querySelector("#btnSavePTEditor");
    btnAddPTName.addEventListener("click", function (e) {
      e.preventDefault();
      ptNames.push({ term: "", vocabulary: "" });
      renderPTNames();
    });
    btnAddPTProperty.addEventListener("click", function (e) {
      e.preventDefault();
      ptProperties.push({
        name: "",
        description: "",
        names: [],
        data_type: "",
        repeated: false,
        scope: "feature",
      });
      renderPTProperties();
    });
    btnAddPTReference.addEventListener("click", function (e) {
      e.preventDefault();
      ptReferences.push({
        name: "",
        description: "",
        names: [],
        referenced_type: "",
        repeated: false,
        scope: "feature",
      });
      renderPTReferences();
    });
    btnAddPTMetadataContact &&
      btnAddPTMetadataContact.addEventListener("click", function (e) {
        e.preventDefault();
        ptMetadataContacts.push({
          organisation: "",
          email: "",
          role: "resourceProvider",
        });
        renderPTMetadataContacts();
      });
    btnAddPTPointOfContact &&
      btnAddPTPointOfContact.addEventListener("click", function (e) {
        e.preventDefault();
        ptPointOfContacts.push({
          organisation: "",
          email: "",
          role: "resourceProvider",
        });
        renderPTPointOfContacts();
      });
    btnAddPTUserContact &&
      btnAddPTUserContact.addEventListener("click", function (e) {
        e.preventDefault();
        ptUserContacts.push({
          organisation: "",
          email: "",
          role: "resourceProvider",
        });
        renderPTUserContacts();
      });
    btnAddPTObservedProperty.addEventListener("click", function (e) {
      e.preventDefault();
      ptObservedProperties.push({
        name: "",
        description: "",
        names: [],
        data_type: "",
        repeated: false,
        temporal_scope: "observation",
        sampling_time_type: "instant",
        geospatial_scope: "observation",
        sampling_geometry_type: "point",
        height_scope: "observation",
        sampling_height_type: "point",
      });
      renderPTObservedProperties();
    });
    btnSavePTEditor.addEventListener("click", save);
    renderPTNames();
    renderPTProperties();
    renderPTReferences();
    renderPTMetadataContacts();
    renderPTPointOfContacts();
    renderPTUserContacts();
    renderPTObservedProperties();

    // Añadir eventos de plegado/desplegado a todas las secciones con headers
    const sections = [
      { header: "ptNamesHeader", content: "ptNamesContent" },
      { header: "ptPropertiesHeader", content: "ptPropertiesContent" },
      { header: "ptReferencesHeader", content: "ptReferencesContent" },
      { header: "ptMetadataHeader", content: "ptMetadataContent" },
      { header: "ptContactsHeader", content: "ptContactsContent" },
      { header: "ptKeywordsHeader", content: "ptKeywordsContent" },
      { header: "ptSpatialTemporalHeader", content: "ptSpatialTemporalContent" },
      { header: "ptGeneratedFOIHeader", content: "ptGeneratedFOIContent" },
      { header: "ptObservedPropertiesHeader", content: "ptObservedPropertiesContent" }
    ];

    sections.forEach((section) => {
      const header = container.querySelector(`#${section.header}`);
      const content = container.querySelector(`#${section.content}`);

      if (header) {
        header.style.cursor = "pointer";

        header.addEventListener("click", (e) => {
          // Evitar que el clic en el botón de añadir active el plegado/desplegado
          if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
            return;
          }

          toggleSectionVisibility(content);
        });

        
      }
    });

    // Función auxiliar para cambiar la visibilidad de una sección
    function toggleSectionVisibility(contentElement) {
      if (contentElement.style.display === "none") {
        contentElement.style.display = "block";
      } else {
        contentElement.style.display = "none";        
      }
    }
  }

  function renderPTNames() {
    const namesContainer = container.querySelector("#ptNamesContainer");
    namesContainer.innerHTML = "";
    ptNames.forEach((n, index) => {
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
        ptNames[index].term = ev.target.value;
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
        ptNames[index].vocabulary = newValue;
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
        ptNames.splice(index, 1);
        renderPTNames();
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

    // Update placeholder visibility
    if (ptNames.length === 0) {
      container.querySelector("#ptEmptyNamesPlaceholder").style.display =
        "block";
    } else {
      container.querySelector("#ptEmptyNamesPlaceholder").style.display =
        "none";
    }
  }

  function updatePlaceholders() {
    const placeholder = container.querySelector("#ptEmptyNamesPlaceholder");
    if (ptNames.length === 0) {
      placeholder.style.display = "block";
    } else {
      placeholder.style.display = "none";
    }
  }

  function renderPTProperties() {
    const containerEl = container.querySelector("#ptPropertiesContainer");
    containerEl.innerHTML = "";

    ptProperties.forEach((prop, index) => {
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
        ptProperties[index].name = e.target.value;
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
        ptProperties.splice(index, 1);
        renderPTProperties();
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
        ptProperties[index].description = ev.target.value;
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

      const inpDT = document.createElement("input");
      inpDT.className = "form-control";
      inpDT.placeholder = "string, number, Date, etc.";
      inpDT.value = prop.data_type;
      inpDT.addEventListener("input", (ev) => {
        ptProperties[index].data_type = ev.target.value;
      });

      colDT.appendChild(dtLabel);
      colDT.appendChild(inpDT);

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
        ptProperties[index].repeated = ev.target.value === "true";
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
        ptProperties[index].scope = ev.target.value;
      });

      colScope.appendChild(lblScope);
      colScope.appendChild(inpScope);

      row2.appendChild(colDT);
      row2.appendChild(colRep);
      row2.appendChild(colScope);

      contentDiv.appendChild(descFormGroup);
      contentDiv.appendChild(row2);

      propCard.appendChild(headerDiv);
      propCard.appendChild(contentDiv);
      containerEl.appendChild(propCard);
    });

    if (ptProperties.length === 0) {
      container.querySelector("#ptEmptyPropertiesPlaceholder").style.display =
        "block";
    } else {
      container.querySelector("#ptEmptyPropertiesPlaceholder").style.display =
        "none";
    }
  }

  function getReferenceTypeOptions() {
    let options = '<option value="">Select a Reference Type</option>';

    // Feature Types
    if (
      typeof featureTypes !== "undefined" &&
      Array.isArray(featureTypes) &&
      featureTypes.length > 0
    ) {
      featureTypes.forEach((ft) => {
        options += `<option value="${ft.name}">${ft.name} (Feature Type)</option>`;
      });
    }

    // Spatial Sampling Feature Types
    if (
      typeof spatialSamplingFeatureTypes !== "undefined" &&
      Array.isArray(spatialSamplingFeatureTypes) &&
      spatialSamplingFeatureTypes.length > 0
    ) {
      spatialSamplingFeatureTypes.forEach((ssft) => {
        options += `<option value="${ssft.name}">${ssft.name} (Spatial Sampling Feature Type)</option>`;
      });
    }

    // Specimen Feature Types
    if (
      typeof specimenFeatureTypes !== "undefined" &&
      Array.isArray(specimenFeatureTypes) &&
      specimenFeatureTypes.length > 0
    ) {
      specimenFeatureTypes.forEach((sft) => {
        options += `<option value="${sft.name}">${sft.name} (Specimen Feature Type)</option>`;
      });
    }

    // Process Types
    if (
      typeof processTypes !== "undefined" &&
      Array.isArray(processTypes) &&
      processTypes.length > 0
    ) {
      processTypes.forEach((pt) => {
        options += `<option value="${pt.name}">${pt.name} (Process Type)</option>`;
      });
    }

    return options;
  }

  function renderPTReferences() {
    const containerEl = container.querySelector("#ptReferencesContainer");
    containerEl.innerHTML = "";

    ptReferences.forEach((ref, index) => {
      const refCard = document.createElement("div");
      refCard.className = "card border-0 shadow-sm mb-3";

      const headerDiv = document.createElement("div");
      headerDiv.className =
        "card-header bg-light d-flex justify-content-between align-items-center";

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
        ptReferences[index].name = e.target.value;
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
        ptReferences.splice(index, 1);
        renderPTReferences();
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
        ptReferences[index].description = ev.target.value;
      });

      descFormGroup.appendChild(lblDesc);
      descFormGroup.appendChild(inpDesc);

      // Referenced Type, Repeated, Scope
      const row = document.createElement("div");
      row.className = "row mb-3";

      // Referenced Type (Select)
      const colType = document.createElement("div");
      colType.className = "col-md-4";

      const typeLabel = document.createElement("label");
      typeLabel.className = "form-label";
      typeLabel.innerHTML =
        '<i class="bi bi-diagram-3 me-1"></i> Referenced Type';

      const typeGroup = document.createElement("div");
      typeGroup.className = "input-group";

      const typeGroupText = document.createElement("span");
      typeGroupText.className = "input-group-text";
      typeGroupText.innerHTML = '<i class="bi bi-link"></i>';

      const typeSelect = document.createElement("select");
      typeSelect.className = "form-select";
      typeSelect.innerHTML = getReferenceTypeOptions();
      typeSelect.value = ref.referenced_type || "";

      // Evento de cambio
      typeSelect.addEventListener("change", (ev) => {
        ptReferences[index].referenced_type = ev.target.value;
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
        ptReferences[index].repeated = ev.target.value === "true";
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
        ptReferences[index].scope = ev.target.value;
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
      containerEl.appendChild(refCard);
    });

    if (ptReferences.length === 0) {
      container.querySelector("#ptEmptyReferencesPlaceholder").style.display =
        "block";
    } else {
      container.querySelector("#ptEmptyReferencesPlaceholder").style.display =
        "none";
    }
  }

  function renderPTMetadataContacts() {
    const containerEl = container.querySelector("#ptMetadataContactContainer");
    containerEl.innerHTML = "";
    ptMetadataContacts.forEach((contact, i) => {
      const row = document.createElement("div");
      row.className = "row g-2 mb-1 align-items-center";
      const colOrg = document.createElement("div");
      colOrg.className = "col";
      const orgInput = document.createElement("input");
      orgInput.type = "text";
      orgInput.className = "form-control form-control-sm";
      orgInput.placeholder = "Organization";
      orgInput.value = contact.organisation;
      orgInput.addEventListener("input", function (e) {
        ptMetadataContacts[i].organisation = e.target.value;
      });
      colOrg.appendChild(orgInput);
      const colEmail = document.createElement("div");
      colEmail.className = "col";
      const emailInput = document.createElement("input");
      emailInput.type = "email";
      emailInput.className = "form-control form-control-sm";
      emailInput.placeholder = "Email";
      emailInput.value = contact.email;
      emailInput.addEventListener("input", function (e) {
        ptMetadataContacts[i].email = e.target.value;
      });
      colEmail.appendChild(emailInput);
      const colRole = document.createElement("div");
      colRole.className = "col";
      const roleSelect = document.createElement("select");
      roleSelect.className = "form-select form-select-sm";
      roleSelect.innerHTML = `<option value="resourceProvider">resourceProvider</option>
<option value="custodian">custodian</option>
<option value="owner">owner</option>
<option value="user">user</option>
<option value="distributor">distributor</option>
<option value="originator">originator</option>
<option value="pointOfContact">pointOfContact</option>
<option value="principalInvestigator">principalInvestigator</option>
<option value="processor">processor</option>
<option value="publisher">publisher</option>
<option value="author">author</option>`;
      roleSelect.value = contact.role;
      roleSelect.addEventListener("change", function (e) {
        ptMetadataContacts[i].role = e.target.value;
      });
      colRole.appendChild(roleSelect);
      const colBtn = document.createElement("div");
      colBtn.className = "col-auto";
      const btnRem = document.createElement("button");
      btnRem.className = "btn btn-danger btn-sm";
      btnRem.textContent = "-";
      btnRem.addEventListener("click", function () {
        ptMetadataContacts.splice(i, 1);
        renderPTMetadataContacts();
      });
      colBtn.appendChild(btnRem);
      row.appendChild(colOrg);
      row.appendChild(colEmail);
      row.appendChild(colRole);
      row.appendChild(colBtn);
      containerEl.appendChild(row);
    });
  }

  function renderPTPointOfContacts() {
    const containerEl = container.querySelector("#ptPointOfContactContainer");
    containerEl.innerHTML = "";
    ptPointOfContacts.forEach((contact, i) => {
      const row = document.createElement("div");
      row.className = "row g-2 mb-1 align-items-center";
      const colOrg = document.createElement("div");
      colOrg.className = "col";
      const orgInput = document.createElement("input");
      orgInput.type = "text";
      orgInput.className = "form-control form-control-sm";
      orgInput.placeholder = "Organization";
      orgInput.value = contact.organisation;
      orgInput.addEventListener("input", function (e) {
        ptPointOfContacts[i].organisation = e.target.value;
      });
      colOrg.appendChild(orgInput);
      const colEmail = document.createElement("div");
      colEmail.className = "col";
      const emailInput = document.createElement("input");
      emailInput.type = "email";
      emailInput.className = "form-control form-control-sm";
      emailInput.placeholder = "Email";
      emailInput.value = contact.email;
      emailInput.addEventListener("input", function (e) {
        ptPointOfContacts[i].email = e.target.value;
      });
      colEmail.appendChild(emailInput);
      const colRole = document.createElement("div");
      colRole.className = "col";
      const roleSelect = document.createElement("select");
      roleSelect.className = "form-select form-select-sm";
      roleSelect.innerHTML = `<option value="resourceProvider">resourceProvider</option>
<option value="custodian">custodian</option>
<option value="owner">owner</option>
<option value="user">user</option>
<option value="distributor">distributor</option>
<option value="originator">originator</option>
<option value="pointOfContact">pointOfContact</option>
<option value="principalInvestigator">principalInvestigator</option>
<option value="processor">processor</option>
<option value="publisher">publisher</option>
<option value="author">author</option>`;
      roleSelect.value = contact.role;
      roleSelect.addEventListener("change", function (e) {
        ptPointOfContacts[i].role = e.target.value;
      });
      colRole.appendChild(roleSelect);
      const colBtn = document.createElement("div");
      colBtn.className = "col-auto";
      const btnRem = document.createElement("button");
      btnRem.className = "btn btn-danger btn-sm";
      btnRem.textContent = "-";
      btnRem.addEventListener("click", function () {
        ptPointOfContacts.splice(i, 1);
        renderPTPointOfContacts();
      });
      colBtn.appendChild(btnRem);
      row.appendChild(colOrg);
      row.appendChild(colEmail);
      row.appendChild(colRole);
      row.appendChild(colBtn);
      containerEl.appendChild(row);
    });
  }

  function renderPTUserContacts() {
    const containerEl = container.querySelector("#ptUserContactContainer");
    containerEl.innerHTML = "";
    ptUserContacts.forEach((contact, i) => {
      const row = document.createElement("div");
      row.className = "row g-2 mb-1 align-items-center";
      const colOrg = document.createElement("div");
      colOrg.className = "col";
      const orgInput = document.createElement("input");
      orgInput.type = "text";
      orgInput.className = "form-control form-control-sm";
      orgInput.placeholder = "Organization";
      orgInput.value = contact.organisation;
      orgInput.addEventListener("input", function (e) {
        ptUserContacts[i].organisation = e.target.value;
      });
      colOrg.appendChild(orgInput);
      const colEmail = document.createElement("div");
      colEmail.className = "col";
      const emailInput = document.createElement("input");
      emailInput.type = "email";
      emailInput.className = "form-control form-control-sm";
      emailInput.placeholder = "Email";
      emailInput.value = contact.email;
      emailInput.addEventListener("input", function (e) {
        ptUserContacts[i].email = e.target.value;
      });
      colEmail.appendChild(emailInput);
      const colRole = document.createElement("div");
      colRole.className = "col";
      const roleSelect = document.createElement("select");
      roleSelect.className = "form-select form-select-sm";
      roleSelect.innerHTML = `<option value="resourceProvider">resourceProvider</option>
<option value="custodian">custodian</option>
<option value="owner">owner</option>
<option value="user">user</option>
<option value="distributor">distributor</option>
<option value="originator">originator</option>
<option value="pointOfContact">pointOfContact</option>
<option value="principalInvestigator">principalInvestigator</option>
<option value="processor">processor</option>
<option value="publisher">publisher</option>
<option value="author">author</option>`;
      roleSelect.value = contact.role;
      roleSelect.addEventListener("change", function (e) {
        ptUserContacts[i].role = e.target.value;
      });
      colRole.appendChild(roleSelect);
      const colBtn = document.createElement("div");
      colBtn.className = "col-auto";
      const btnRem = document.createElement("button");
      btnRem.className = "btn btn-danger btn-sm";
      btnRem.textContent = "-";
      btnRem.addEventListener("click", function () {
        ptUserContacts.splice(i, 1);
        renderPTUserContacts();
      });
      colBtn.appendChild(btnRem);
      row.appendChild(colOrg);
      row.appendChild(colEmail);
      row.appendChild(colRole);
      row.appendChild(colBtn);
      containerEl.appendChild(row);
    });
  }

  function renderPTObservedProperties() {
    const containerEl = container.querySelector(
      "#ptObservedPropertiesContainer"
    );
    containerEl.innerHTML = "";
    ptObservedProperties.forEach((op, i) => {
      const card = document.createElement("div");
      card.className = "card border-0 shadow-sm mb-3";

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
        const contentDiv = card.querySelector(".op-content");
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
      nameInput.placeholder = "Observed property name";
      nameInput.value = op.name;
      nameInput.addEventListener("input", (e) => {
        ptObservedProperties[i].name = e.target.value;
      });

      nameGroup.appendChild(nameIcon);
      nameGroup.appendChild(nameInput);

      headerLeftDiv.appendChild(toggleBtn);
      headerLeftDiv.appendChild(nameGroup);

      const btnRemove = document.createElement("button");
      btnRemove.className = "btn btn-sm btn-outline-danger ms-2";
      btnRemove.innerHTML = '<i class="bi bi-trash"></i>';
      btnRemove.title = "Remove observed property";
      btnRemove.addEventListener("click", () => {
        ptObservedProperties.splice(i, 1);
        renderPTObservedProperties();
      });

      headerDiv.appendChild(headerLeftDiv);
      headerDiv.appendChild(btnRemove);

      const contentDiv = document.createElement("div");
      contentDiv.className = "card-body op-content p-3";
      contentDiv.style.display = "block";

      // Descripción
      const descFormGroup = document.createElement("div");
      descFormGroup.className = "mb-3";

      const lblDesc = document.createElement("label");
      lblDesc.className = "form-label";
      lblDesc.innerHTML = '<i class="bi bi-file-text me-1"></i> Description';

      const inpDesc = document.createElement("textarea");
      inpDesc.className = "form-control";
      inpDesc.rows = 2;
      inpDesc.placeholder = "Enter property description";
      inpDesc.value = op.description;
      inpDesc.addEventListener("input", (ev) => {
        ptObservedProperties[i].description = ev.target.value;
      });

      descFormGroup.appendChild(lblDesc);
      descFormGroup.appendChild(inpDesc);

      // Primera fila: Data Type, Repeated
      const row1 = document.createElement("div");
      row1.className = "row mb-3";

      // Data Type
      const colDT = document.createElement("div");
      colDT.className = "col-md-6";

      const dtLabel = document.createElement("label");
      dtLabel.className = "form-label";
      dtLabel.innerHTML = '<i class="bi bi-braces me-1"></i> Data Type';

      const inpDT = document.createElement("input");
      inpDT.className = "form-control";
      inpDT.placeholder = "string, number, Date, etc.";
      inpDT.value = op.data_type;
      inpDT.addEventListener("input", (ev) => {
        ptObservedProperties[i].data_type = ev.target.value;
      });

      colDT.appendChild(dtLabel);
      colDT.appendChild(inpDT);

      // Repeated
      const colRep = document.createElement("div");
      colRep.className = "col-md-6";

      const lblRep = document.createElement("label");
      lblRep.className = "form-label";
      lblRep.innerHTML = '<i class="bi bi-repeat me-1"></i> Repeated';

      const selRep = document.createElement("select");
      selRep.className = "form-select";
      selRep.innerHTML = `
        <option value="false">false</option>
        <option value="true">true</option>
      `;
      selRep.value = op.repeated.toString();
      selRep.addEventListener("change", (ev) => {
        ptObservedProperties[i].repeated = ev.target.value === "true";
      });

      colRep.appendChild(lblRep);
      colRep.appendChild(selRep);

      row1.appendChild(colDT);
      row1.appendChild(colRep);

      // Segunda fila: Temporal Scope, Sampling Time Type
      const row2 = document.createElement("div");
      row2.className = "row mb-3";

      // Temporal Scope
      const colTS = document.createElement("div");
      colTS.className = "col-md-6";

      const lblTS = document.createElement("label");
      lblTS.className = "form-label";
      lblTS.innerHTML = '<i class="bi bi-clock-history me-1"></i> Temporal Scope';

      const selTS = document.createElement("select");
      selTS.className = "form-select";
      selTS.innerHTML = `
        <option value="observation">observation</option>
        <option value="sample">sample</option>
        <option value="discrete_coverage">discrete_coverage</option>
        <option value="continuous_coverage">continuous_coverage</option>
      `;
      selTS.value = op.temporal_scope;
      selTS.addEventListener("change", (ev) => {
        ptObservedProperties[i].temporal_scope = ev.target.value;
      });

      colTS.appendChild(lblTS);
      colTS.appendChild(selTS);

      // Sampling Time Type
      const colSTT = document.createElement("div");
      colSTT.className = "col-md-6";

      const lblSTT = document.createElement("label");
      lblSTT.className = "form-label";
      lblSTT.innerHTML = '<i class="bi bi-stopwatch me-1"></i> Sampling Time Type';

      const selSTT = document.createElement("select");
      selSTT.className = "form-select";
      selSTT.innerHTML = `
        <option value="instant">instant</option>
        <option value="period">period</option>
      `;
      selSTT.value = op.sampling_time_type;
      selSTT.addEventListener("change", (ev) => {
        ptObservedProperties[i].sampling_time_type = ev.target.value;
      });

      colSTT.appendChild(lblSTT);
      colSTT.appendChild(selSTT);

      row2.appendChild(colTS);
      row2.appendChild(colSTT);

      // Tercera fila: Geospatial Scope, Sampling Geometry Type
      const row3 = document.createElement("div");
      row3.className = "row mb-3";

      // Geospatial Scope
      const colGS = document.createElement("div");
      colGS.className = "col-md-6";

      const lblGS = document.createElement("label");
      lblGS.className = "form-label";
      lblGS.innerHTML = '<i class="bi bi-geo-alt me-1"></i> Geospatial Scope';

      const selGS = document.createElement("select");
      selGS.className = "form-select";
      selGS.innerHTML = `
        <option value="observation">observation</option>
        <option value="sample">sample</option>
        <option value="discrete_coverage">discrete_coverage</option>
        <option value="continuous_coverage">continuous_coverage</option>
      `;
      selGS.value = op.geospatial_scope;
      selGS.addEventListener("change", (ev) => {
        ptObservedProperties[i].geospatial_scope = ev.target.value;
      });

      colGS.appendChild(lblGS);
      colGS.appendChild(selGS);

      // Sampling Geometry Type
      const colSGT = document.createElement("div");
      colSGT.className = "col-md-6";

      const lblSGT = document.createElement("label");
      lblSGT.className = "form-label";
      lblSGT.innerHTML = '<i class="bi bi-bounding-box me-1"></i> Sampling Geometry Type';

      const selSGT = document.createElement("select");
      selSGT.className = "form-select";
      selSGT.innerHTML = `
        <option value="point">point</option>
        <option value="line">line</option>
        <option value="surface">surface</option>
      `;
      selSGT.value = op.sampling_geometry_type;
      selSGT.addEventListener("change", (ev) => {
        ptObservedProperties[i].sampling_geometry_type = ev.target.value;
      });

      colSGT.appendChild(lblSGT);
      colSGT.appendChild(selSGT);

      row3.appendChild(colGS);
      row3.appendChild(colSGT);

      // Cuarta fila: Height Scope, Sampling Height Type
      const row4 = document.createElement("div");
      row4.className = "row mb-3";

      // Height Scope
      const colHS = document.createElement("div");
      colHS.className = "col-md-6";

      const lblHS = document.createElement("label");
      lblHS.className = "form-label";
      lblHS.innerHTML = '<i class="bi bi-arrows-vertical me-1"></i> Height Scope';

      const selHS = document.createElement("select");
      selHS.className = "form-select";
      selHS.innerHTML = `
        <option value="observation">observation</option>
        <option value="sample">sample</option>
        <option value="discrete_coverage">discrete_coverage</option>
        <option value="continuous_coverage">continuous_coverage</option>
      `;
      selHS.value = op.height_scope;
      selHS.addEventListener("change", (ev) => {
        ptObservedProperties[i].height_scope = ev.target.value;
      });

      colHS.appendChild(lblHS);
      colHS.appendChild(selHS);

      // Sampling Height Type
      const colSHT = document.createElement("div");
      colSHT.className = "col-md-6";

      const lblSHT = document.createElement("label");
      lblSHT.className = "form-label";
      lblSHT.innerHTML = '<i class="bi bi-rulers me-1"></i> Sampling Height Type';

      const selSHT = document.createElement("select");
      selSHT.className = "form-select";
      selSHT.innerHTML = `
        <option value="point">point</option>
        <option value="range">range</option>
      `;
      selSHT.value = op.sampling_height_type;
      selSHT.addEventListener("change", (ev) => {
        ptObservedProperties[i].sampling_height_type = ev.target.value;
      });

      colSHT.appendChild(lblSHT);
      colSHT.appendChild(selSHT);

      row4.appendChild(colHS);
      row4.appendChild(colSHT);

      // Agregar filas al contenido
      contentDiv.appendChild(descFormGroup);
      contentDiv.appendChild(row1);
      contentDiv.appendChild(row2);
      contentDiv.appendChild(row3);
      contentDiv.appendChild(row4);

      card.appendChild(headerDiv);
      card.appendChild(contentDiv);
      containerEl.appendChild(card);
    });

    if (ptObservedProperties.length === 0) {
      container.querySelector(
        "#ptEmptyObservedPropertiesPlaceholder"
      ).style.display = "block";
    } else {
      container.querySelector(
        "#ptEmptyObservedPropertiesPlaceholder"
      ).style.display = "none";
    }
  }

  function save() {
    if (
      !ptNameInput.value.trim() ||
      !ptDescInput.value.trim() ||
      !ptMetadataLanguageInput.value.trim() ||
      !ptMetadataDateInput.value.trim() ||
      !ptTitleInput.value.trim() ||
      !ptAbstractInput.value.trim() ||
      !ptIdentifierInput.value.trim()
    ) {
      showNotification("Please fill all required fields.");
      return;
    }
    const result = {
      name: ptNameInput.value.trim(),
      description: ptDescInput.value.trim(),
      names: ptNames,
      properties: ptProperties,
      references: ptReferences,
      metadata_language: ptMetadataLanguageInput.value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      metadata_date_stamp: new Date(ptMetadataDateInput.value).toISOString(),
      title: ptTitleInput.value.trim(),
      abstract: ptAbstractInput.value.trim(),
      identifier: ptIdentifierInput.value.trim(),
      specific_usage: ptSpecificUsageInput.value.trim(),
      use_limitation: ptUseLimitationInput.value.trim(),
      metadata_contact: ptMetadataContacts,
      point_of_contact: ptPointOfContacts,
      user_contact: ptUserContacts,
      keywords: ptKeywordsInput.value
        .split(",")
        .map((s) => ({ keyword: s.trim(), vocabulary: "" }))
        .filter((k) => k.keyword),
      spatial_representation_type: ptSpatialRepresentationTypeSelect.value,
      spatial_resolution: ptSpatialResolutionInput.value
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n)),
      language: ptLanguageInput.value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      topic_category: ptTopicCategoryInput.value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      result_time_type: ptResultTimeTypeSelect.value,
      phenomenon_time_type: ptPhenomenonTimeTypeSelect.value,
      platform: {
      feature_type: ptPlatformFeatureTypeInput.value.trim(),
      scope: ptPlatformScopeSelect.value
},
      shared_feature_of_interest_type: ptSharedFOIInput.value.trim(),
      generated_feature_of_interest_type: {
        shape_type: ptShapeTypeSelect.value,
        shape_crs: ptShapeCrsInput.value.trim(),
        height_type: ptHeightTypeSelect.value,
        height_crs: ptHeightCrsInput.value.trim(),
        sampled_feature_type: ptSampledFeatureTypeInput.value.trim(),
      },
      observed_properties: ptObservedProperties,
    };
    if (onSaveCallback) onSaveCallback(result, editingIndex);
  }

  function edit(processType, index) {

editingIndex = index;

// Crear copias de los datos para evitar cambios directos en las variables globales
ptNames = JSON.parse(JSON.stringify(processType.names || []));
ptProperties = JSON.parse(JSON.stringify(processType.properties || []));
ptReferences = JSON.parse(JSON.stringify(processType.references || []));
ptMetadataContacts = JSON.parse(
  JSON.stringify(processType.metadata_contact || [])
);
ptPointOfContacts = JSON.parse(
  JSON.stringify(processType.point_of_contact || [])
);
ptUserContacts = JSON.parse(JSON.stringify(processType.user_contact || []));
    ptObservedProperties = JSON.parse(
      JSON.stringify(processType.observed_properties || [])
    );

    // Asignar valores a los inputs
    ptNameInput.value = processType.name || "";
    ptDescInput.value = processType.description || "";
    ptMetadataLanguageInput.value = processType.metadata_language
      ? processType.metadata_language.join(", ")
      : "";
    ptMetadataDateInput.value = processType.metadata_date_stamp
      ? processType.metadata_date_stamp.substring(0, 16)
      : "";
    ptTitleInput.value = processType.title || "";
    ptAbstractInput.value = processType.abstract || "";
    ptIdentifierInput.value = processType.identifier || "";
    ptSpecificUsageInput.value = processType.specific_usage || "";
    ptUseLimitationInput.value = processType.use_limitation || "";
    ptKeywordsInput.value = processType.keywords
      ? processType.keywords.map((k) => k.keyword).join(", ")
      : "";
    ptSpatialRepresentationTypeSelect.value =
      processType.spatial_representation_type || "vector";
    ptSpatialResolutionInput.value = processType.spatial_resolution
      ? processType.spatial_resolution.join(", ")
      : "";
    ptLanguageInput.value = processType.language
      ? processType.language.join(", ")
      : "";
    ptTopicCategoryInput.value = processType.topic_category
      ? processType.topic_category.join(", ")
      : "";
    ptResultTimeTypeSelect.value = processType.result_time_type || "instant";
    ptPhenomenonTimeTypeSelect.value =
    processType.phenomenon_time_type || "instant";
    // Plataforma
    if (processType.platform && typeof processType.platform === "object") {
      ptPlatformFeatureTypeInput.value = processType.platform.feature_type || "";
      ptPlatformScopeSelect.value = processType.platform.scope || "feature";
    } else {
      ptPlatformFeatureTypeInput.value = "";
      ptPlatformScopeSelect.value = "feature";
    }
    ptSharedFOIInput.value = processType.shared_feature_of_interest_type || "";

    // Configurar valores para "Generated Feature of Interest Type"
    if (processType.generated_feature_of_interest_type) {
      ptShapeTypeSelect.value =
        processType.generated_feature_of_interest_type.shape_type || "point";
      ptShapeCrsInput.value =
        processType.generated_feature_of_interest_type.shape_crs || "";
      ptHeightTypeSelect.value =
        processType.generated_feature_of_interest_type.height_type || "";
      ptHeightCrsInput.value =
        processType.generated_feature_of_interest_type.height_crs || "";
      ptSampledFeatureTypeInput.value =
        processType.generated_feature_of_interest_type.sampled_feature_type ||
        "";
    }

    // Renderizar nuevamente las secciones
    renderPTNames();
    renderPTProperties();
    renderPTReferences();
    renderPTMetadataContacts();
    renderPTPointOfContacts();
    renderPTUserContacts();
    renderPTObservedProperties();
  }

  function reset() {
    editingIndex = null;
    ptNameInput.value = "";
    ptDescInput.value = "";
    ptNames = [];
    ptProperties = [];
    ptReferences = [];
    ptMetadataLanguageInput.value = "";
    ptMetadataDateInput.value = "";
    ptTitleInput.value = "";
    ptAbstractInput.value = "";
    ptIdentifierInput.value = "";
    ptSpecificUsageInput.value = "";
    ptUseLimitationInput.value = "";
    ptMetadataContacts = [];
    ptPointOfContacts = [];
    ptUserContacts = [];
    ptKeywordsInput.value = "";
    ptSpatialRepresentationTypeSelect.value = "vector";
    ptSpatialResolutionInput.value = "";
    ptLanguageInput.value = "";
    ptTopicCategoryInput.value = "";
    ptResultTimeTypeSelect.value = "instant";
    ptPhenomenonTimeTypeSelect.value = "instant";
    ptPlatformFeatureTypeInput.value = "";
ptPlatformScopeSelect.value = "feature";
    ptSharedFOIInput.value = "";
    ptShapeTypeSelect.value = "point";
    ptShapeCrsInput.value = "";
    ptHeightTypeSelect.value = "";
    ptHeightCrsInput.value = "";
    ptSampledFeatureTypeInput.value = "";
    ptObservedProperties = [];
    renderPTNames();
    renderPTProperties();
    renderPTReferences();
    renderPTMetadataContacts();
    renderPTPointOfContacts();
    renderPTUserContacts();
    renderPTObservedProperties();
  }

  return { init, edit, reset };
})();
