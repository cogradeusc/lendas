let vocabularies = [];
let enumerationDataTypes = [];
let complexDataTypes = [];
let featureTypes = [];
let spatialSamplingFeatureTypes = [];
let specimenFeatureTypes = [];
let processTypes = [];

const schemaNameInput = document.getElementById("schemaName");

const vocabulariesList = document.getElementById("vocabulariesList");
const enumerationDataTypesList = document.getElementById("enumerationDataTypesList");
const leftPanelComplexList = document.getElementById("complexTypesList");
const leftPanelFeatureList = document.getElementById("featureTypesList");
const leftPanelSpatialSamplingList = document.getElementById("spatialSamplingFeatureTypesList");
const leftPanelSpecimenList = document.getElementById("specimenFeatureTypesList");
const leftPanelProcessList = document.getElementById("processTypesList");

const leftPanel = document.getElementById("leftPanel");
const rightPanel = document.getElementById("rightPanel");
const leftResizer = document.getElementById("leftResizer");
const rightResizer = document.getElementById("rightResizer");
const btnGenerateJSONHeader = document.getElementById("btnGenerateJSONHeader");
const btnCleanDiagram = document.getElementById("btnCleanDiagram");
const btnCleanModel = document.getElementById("btnCleanModel");
const btnApplyDSL = document.getElementById("btnApplyDSL");


const btnToggleLeftPanel = document.getElementById("btnToggleLeftPanel");
const btnToggleRightPanel = document.getElementById("btnToggleRightPanel");

const nodeProps = document.getElementById("node-properties");

const modalVocabularyEl = document.getElementById("modalVocabulary");
const modalVocabulary = new bootstrap.Modal(modalVocabularyEl);
const vocabularyEditorContainer = document.getElementById("vocabularyEditorContainer");

const modalEnumerationEl = document.getElementById("modalEnumeration");
const modalEnumeration = new bootstrap.Modal(modalEnumerationEl);
const enumerationEditorContainer = document.getElementById("enumerationEditorContainer");

const modalCDTEl = document.getElementById("modalCDT");
const modalCDT = new bootstrap.Modal(modalCDTEl);
const cdtEditorContainer = document.getElementById("cdtEditorContainer");

const modalFeatureEl = document.getElementById("modalFeature");
const modalFeature = new bootstrap.Modal(modalFeatureEl);
const featureEditorContainer = document.getElementById("featureEditorContainer");

const modalSpatialSamplingEl = document.getElementById("modalSpatialSampling");

const modalSpatialSampling = new bootstrap.Modal(modalSpatialSamplingEl);
const spatialSamplingEditorContainer = document.getElementById("spatialSamplingEditorContainer");

const modalSpecimenEl = document.getElementById("modalSpecimen");
const modalSpecimen = new bootstrap.Modal(modalSpecimenEl);
const specimenEditorContainer = document.getElementById("specimenEditorContainer");

const modalProcessEl = document.getElementById("modalProcess");
const modalProcess = new bootstrap.Modal(modalProcessEl);
const processEditorContainer = document.getElementById("processEditorContainer");

const modalJSONEl = document.getElementById("modalJSONPreview");
const modalJSON = new bootstrap.Modal(modalJSONEl);
const jsonContentEl = document.getElementById("jsonContent");
const jsonFilenameEl = document.getElementById("jsonFilename");

const confirmationModalEl = document.getElementById("confirmationModal");
const confirmationModal = new bootstrap.Modal(confirmationModalEl);
const confirmationMessageEl = document.getElementById("confirmationMessage");
const btnConfirmAction = document.getElementById("btnConfirmAction");

const modalExportImageEl = document.getElementById("modalExportImage");
const modalExportImage = new bootstrap.Modal(modalExportImageEl);
const exportImageFilenameEl = document.getElementById("exportImageFilename");
const exportImageFormatEl = document.getElementById("exportImageFormat");
const btnSaveExportImage = document.getElementById("btnSaveExportImage");

const btnExportJSON = document.getElementById("btnExportJSON");
const btnImportJSON = document.getElementById("btnImportJSON");
const fileImportJSON = document.getElementById("fileImportJSON");
const btnCenter = document.getElementById("btnCenterOverlay");
const btnZoomIn = document.getElementById("btnZoomInOverlay");
const btnZoomOut = document.getElementById("btnZoomOutOverlay");
const btnZoomReset = document.getElementById("btnZoomResetOverlay");

const drawflowContainer = document.getElementById("drawflow");

drawflowContainer.addEventListener("dragover", (event) =>
  event.preventDefault()
);
drawflowContainer.addEventListener("drop", onDropNode);

// ================================================================
// NODE PROPERTIES PANEL
// ================================================================

function escapeHtml(str) {
  if (str == null) return "";
  const s = String(str);
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

// --- Type badge colors ---
const TYPE_BADGE = {
  vocabulary:                    { label: "Vocabulary",                    bg: "bg-secondary" },
  enumeration_data_type:         { label: "Enumeration Data Type",         bg: "bg-warning text-dark" },
  complex_data_type:             { label: "Complex Data Type",             bg: "bg-success" },
  feature_type:                  { label: "Feature Type",                  bg: "bg-primary" },
  spatial_sampling_feature_type: { label: "Spatial Sampling Feature Type", bg: "bg-info text-dark" },
  specimen_feature_type:         { label: "Specimen Feature Type",         bg: "bg-dark" },
  process_type:                  { label: "Process Type",                  bg: "bg-danger" }
};

// --- Reusable renderers ---

function renderKeyValuePairs(pairs) {
  const dl = document.createElement("dl");
  dl.classList.add("prop-kv-list");
  let hasContent = false;
  for (const p of pairs) {
    const val = p.value;
    if (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) continue;
    hasContent = true;
    const dt = document.createElement("dt");
    dt.classList.add("prop-kv-label");
    dt.textContent = p.label;
    const dd = document.createElement("dd");
    dd.classList.add("prop-kv-value");
    dd.textContent = typeof val === "object" ? JSON.stringify(val) : val;
    dl.appendChild(dt);
    dl.appendChild(dd);
  }
  return hasContent ? dl : null;
}

function renderPropertiesTable(items, columns) {
  if (!items || items.length === 0) return null;
  const table = document.createElement("table");
  table.classList.add("prop-table");

  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  for (const col of columns) {
    const th = document.createElement("th");
    th.textContent = col.label;
    tr.appendChild(th);
  }
  thead.appendChild(tr);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (const item of items) {
    const row = document.createElement("tr");
    for (const col of columns) {
      const td = document.createElement("td");
      const raw = item[col.key];
      if (col.render) {
        col.render(td, item);
      } else {
        td.textContent = raw != null ? raw : "";
      }
      row.appendChild(td);
    }
    tbody.appendChild(row);
  }
  table.appendChild(tbody);
  return table;
}

function renderTextList(items, getKey) {
  if (!items || items.length === 0) return null;
  const ul = document.createElement("ul");
  ul.classList.add("prop-text-list");
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = getKey ? getKey(item) : String(item);
    ul.appendChild(li);
  }
  return ul;
}

function renderContactsTable(contacts) {
  if (!contacts || contacts.length === 0) return null;
  return renderPropertiesTable(contacts, [
    { key: "organisation", label: "Organisation" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" }
  ]);
}

function renderNamesTable(names) {
  return renderPropertiesTable(names, [
    { key: "term", label: "Term" },
    { key: "vocabulary", label: "Vocabulary" }
  ]);
}

function renderVersionedSections(versions, itemKey, renderFn) {
  if (!versions || versions.length === 0) return null;
  const container = document.createElement("div");
  for (let i = 0; i < versions.length; i++) {
    const v = versions[i];
    const items = v[itemKey];
    if (!items || items.length === 0) continue;

    const vDiv = document.createElement("div");
    vDiv.classList.add("prop-version-section");

    const header = document.createElement("div");
    header.classList.add("prop-version-header");
    const chevron = document.createElement("i");
    chevron.classList.add("bi", "bi-chevron-down", "prop-section-chevron");
    const label = document.createElement("span");
    label.textContent = v.version || ("Version " + (i + 1));
    header.appendChild(chevron);
    header.appendChild(label);

    const body = document.createElement("div");
    body.classList.add("prop-version-body");
    const content = renderFn(items);
    if (content) body.appendChild(content);

    header.addEventListener("click", () => {
      const isCollapsed = body.style.display === "none";
      body.style.display = isCollapsed ? "block" : "none";
      chevron.classList.toggle("bi-chevron-down", isCollapsed);
      chevron.classList.toggle("bi-chevron-right", !isCollapsed);
    });

    vDiv.appendChild(header);
    vDiv.appendChild(body);
    container.appendChild(vDiv);
  }
  return container.children.length > 0 ? container : null;
}

function renderEmptyState(message) {
  const div = document.createElement("div");
  div.classList.add("prop-empty");
  div.textContent = message || "No data available";
  return div;
}

// --- Section renderers ---

function sectionGeneral(d) {
  const source = d.enumeration_data || d.complex_data || d.feature_data ||
    d.spatial_sampling_data || d.specimen_feature_data || d.process_data || d;
  const pairs = [
    { label: "Name", value: source.name },
    { label: "Language", value: source.language },
    { label: "Description", value: source.description }
  ];
  return renderKeyValuePairs(pairs);
}

function sectionVersions(d) {
  return renderVersionedSections(d.enumeration_data?.versions || d.versions, "values", (values) => {
    return renderPropertiesTable(values, [
      { key: "vocabulary", label: "Vocabulary" },
      { key: "terms", label: "Terms", render: (td, item) => {
        if (Array.isArray(item.terms)) {
          td.textContent = item.terms.join(", ");
        }
      }}
    ]);
  });
}

function sectionVersionsFields(d) {
  const src = d.complex_data || d;
  return renderVersionedSections(src.versions, "fields", (fields) => {
    return renderPropertiesTable(fields, [
      { key: "name", label: "Name" },
      { key: "data_type", label: "Type" },
      { key: "repeated", label: "Repeated", render: (td, item) => {
        if (item.repeated) {
          const span = document.createElement("span");
          span.classList.add("badge", "prop-badge-repeated");
          span.textContent = "Yes";
          td.appendChild(span);
        } else {
          td.textContent = "";
        }
      }},
      { key: "names", label: "Names", render: (td, item) => {
        if (item.names && item.names.length > 0) {
          td.textContent = item.names.map(n => n.term).join(", ");
        }
      }}
    ]);
  });
}

function sectionNames(d) {
  const source = d.enumeration_data || d.complex_data || d.feature_data ||
    d.spatial_sampling_data || d.specimen_feature_data || d.process_data || d;
  return renderNamesTable(source.names);
}

function sectionProperties(d) {
  const source = d.feature_data || d.spatial_sampling_data || d.specimen_feature_data || d.process_data || d;
  return renderPropertiesTable(source.properties, [
    { key: "name", label: "Name" },
    { key: "data_type", label: "Type" },
    { key: "repeated", label: "Repeated", render: (td, item) => {
      if (item.repeated) {
        const span = document.createElement("span");
        span.classList.add("badge", "prop-badge-repeated");
        span.textContent = "Yes";
        td.appendChild(span);
      }
    }},
    { key: "scope", label: "Scope", render: (td, item) => {
      if (item.scope && item.scope !== "feature") {
        const span = document.createElement("span");
        span.classList.add("badge", "prop-badge-scope");
        span.textContent = item.scope;
        td.appendChild(span);
      }
    }}
  ]);
}

function sectionReferences(d) {
  const source = d.feature_data || d.spatial_sampling_data || d.specimen_feature_data || d.process_data || d;
  return renderPropertiesTable(source.references, [
    { key: "name", label: "Name" },
    { key: "referenced_type", label: "Ref Type" },
    { key: "repeated", label: "Repeated", render: (td, item) => {
      if (item.repeated) {
        const span = document.createElement("span");
        span.classList.add("badge", "prop-badge-repeated");
        span.textContent = "Yes";
        td.appendChild(span);
      }
    }},
    { key: "scope", label: "Scope", render: (td, item) => {
      if (item.scope && item.scope !== "feature") {
        const span = document.createElement("span");
        span.classList.add("badge", "prop-badge-scope");
        span.textContent = item.scope;
        td.appendChild(span);
      }
    }}
  ]);
}

function sectionObservedProperties(d) {
  const source = d.process_data || d;
  return renderPropertiesTable(source.observed_properties, [
    { key: "name", label: "Name" },
    { key: "data_type", label: "Type" },
    { key: "temporal_scope", label: "Temporal" },
    { key: "geospatial_scope", label: "Geospatial" },
    { key: "sampling_geometry_type", label: "Geometry" }
  ]);
}

function sectionKeywords(d) {
  const source = d.process_data || d;
  return renderTextList(source.keywords, (k) => k.keyword);
}

function sectionContactsGroup(title, key) {
  return (d) => {
    const source = d.process_data || d;
    const contacts = source[key];
    if (!contacts || contacts.length === 0) return null;
    const container = document.createElement("div");
    const heading = document.createElement("div");
    heading.classList.add("prop-contact-group-title");
    heading.textContent = title;
    container.appendChild(heading);
    const table = renderContactsTable(contacts);
    if (table) container.appendChild(table);
    return container;
  };
}

function sectionMetadata(d) {
  const source = d.process_data || d;
  const pairs = [
    { label: "Title", value: source.title },
    { label: "Identifier", value: source.identifier },
    { label: "Abstract", value: source.abstract },
    { label: "Specific Usage", value: source.specific_usage },
    { label: "Use Limitation", value: source.use_limitation },
    { label: "Language", value: Array.isArray(source.language) ? source.language.join(", ") : source.language },
    { label: "Metadata Language", value: Array.isArray(source.metadata_language) ? source.metadata_language.join(", ") : source.metadata_language },
    { label: "Metadata Date Stamp", value: source.metadata_date_stamp },
    { label: "Topic Category", value: Array.isArray(source.topic_category) ? source.topic_category.join(", ") : source.topic_category }
  ];
  return renderKeyValuePairs(pairs);
}

function sectionSpatialTemporal(d) {
  const source = d.process_data || d;
  const pairs = [
    { label: "Spatial Representation", value: source.spatial_representation_type },
    { label: "Spatial Resolution", value: Array.isArray(source.spatial_resolution) ? source.spatial_resolution.join(", ") : source.spatial_resolution },
    { label: "Result Time Type", value: source.result_time_type },
    { label: "Phenomenon Time Type", value: source.phenomenon_time_type }
  ];
  return renderKeyValuePairs(pairs);
}

function sectionPlatformLinks(d) {
  const source = d.process_data || d;
  const pairs = [];
  const platform = source.platform;
  if (platform && platform.feature_type) {
    pairs.push({ label: "Platform Feature Type", value: platform.feature_type });
    if (platform.scope && platform.scope !== "feature") {
      pairs.push({ label: "Platform Scope", value: platform.scope });
    }
  }
  pairs.push({ label: "Shared FOI Type", value: source.shared_feature_of_interest_type });
  if (!pairs.some(p => p.value)) return null;
  return renderKeyValuePairs(pairs);
}

function sectionGeneratedFOI(d) {
  const source = d.process_data || d;
  const foi = source.generated_feature_of_interest_type;
  if (!foi || (!foi.shape_type && !foi.sampled_feature_type)) return null;
  const pairs = [
    { label: "Shape Type", value: foi.shape_type },
    { label: "Shape CRS", value: foi.shape_crs },
    { label: "Height Type", value: foi.height_type },
    { label: "Height CRS", value: foi.height_crs },
    { label: "Sampled Feature Type", value: foi.sampled_feature_type }
  ];
  return renderKeyValuePairs(pairs);
}

function sectionShape(d) {
  const source = d.spatial_sampling_data || d;
  const pairs = [
    { label: "Shape Type", value: source.shape_type },
    { label: "Shape CRS", value: source.shape_crs },
    { label: "Height Type", value: source.height_type },
    { label: "Height CRS", value: source.height_crs }
  ];
  return renderKeyValuePairs(pairs);
}

function sectionSampledFeature(d) {
  const source = d.spatial_sampling_data || d;
  const pairs = [{ label: "Sampled Feature Type", value: source.sampled_feature_type }];
  return renderKeyValuePairs(pairs);
}

function sectionSampling(d) {
  const source = d.specimen_feature_data || d;
  const pairs = [
    { label: "Sampled Feature Type", value: source.sampled_feature_type },
    { label: "Sampling Time Extension", value: source.sampling_time_extension },
    { label: "Shared Sampling Location", value: source.shared_sampling_location_type }
  ];
  return renderKeyValuePairs(pairs);
}

function sectionGeneratedLocation(d) {
  const source = d.specimen_feature_data || d;
  const loc = source.generated_sampling_location_type;
  if (!loc || (!loc.shape_type && !loc.sampled_feature_type)) return null;
  const pairs = [
    { label: "Shape Type", value: loc.shape_type },
    { label: "Shape CRS", value: loc.shape_crs },
    { label: "Height Type", value: loc.height_type },
    { label: "Height CRS", value: loc.height_crs }
  ];
  return renderKeyValuePairs(pairs);
}

// --- Section Registry ---

const SECTION_REGISTRY = {
  vocabulary: [
    { id: "general", title: "General", icon: "bi-info-circle", render: sectionGeneral }
  ],
  enumeration_data_type: [
    { id: "general", title: "General", icon: "bi-info-circle", render: sectionGeneral },
    { id: "versions", title: "Versions", icon: "bi-layers", render: sectionVersions }
  ],
  complex_data_type: [
    { id: "general", title: "General", icon: "bi-info-circle", render: sectionGeneral },
    { id: "versions_fields", title: "Versions & Fields", icon: "bi-layers", render: sectionVersionsFields }
  ],
  feature_type: [
    { id: "general", title: "General", icon: "bi-info-circle", render: sectionGeneral },
    { id: "names", title: "Names", icon: "bi-tag", render: sectionNames },
    { id: "properties", title: "Properties", icon: "bi-list-ul", render: sectionProperties },
    { id: "references", title: "References", icon: "bi-link-45deg", render: sectionReferences }
  ],
  spatial_sampling_feature_type: [
    { id: "general", title: "General", icon: "bi-info-circle", render: sectionGeneral },
    { id: "shape", title: "Shape", icon: "bi-geo-alt", render: sectionShape },
    { id: "sampled_feature", title: "Sampled Feature", icon: "bi-bullseye", render: sectionSampledFeature },
    { id: "properties", title: "Properties", icon: "bi-list-ul", render: sectionProperties },
    { id: "references", title: "References", icon: "bi-link-45deg", render: sectionReferences }
  ],
  specimen_feature_type: [
    { id: "general", title: "General", icon: "bi-info-circle", render: sectionGeneral },
    { id: "sampling", title: "Sampling", icon: "bi-eyedropper", render: sectionSampling },
    { id: "generated_location", title: "Generated Location", icon: "bi-geo-alt", render: sectionGeneratedLocation },
    { id: "properties", title: "Properties", icon: "bi-list-ul", render: sectionProperties },
    { id: "references", title: "References", icon: "bi-link-45deg", render: sectionReferences }
  ],
  process_type: [
    { id: "general", title: "General", icon: "bi-info-circle", render: sectionGeneral },
    { id: "metadata", title: "Metadata", icon: "bi-file-text", render: sectionMetadata },
    { id: "spatial_temporal", title: "Spatial & Temporal", icon: "bi-clock", render: sectionSpatialTemporal },
    { id: "platform_links", title: "Platform & Links", icon: "bi-diagram-3", render: sectionPlatformLinks },
    { id: "generated_foi", title: "Generated FOI", icon: "bi-geo-alt", render: sectionGeneratedFOI },
    { id: "names", title: "Names", icon: "bi-tag", render: sectionNames },
    { id: "keywords", title: "Keywords", icon: "bi-bookmarks", render: sectionKeywords },
    { id: "metadata_contact", title: "Metadata Contacts", icon: "bi-people", render: sectionContactsGroup("Metadata Contact", "metadata_contact") },
    { id: "point_of_contact", title: "Points of Contact", icon: "bi-person-lines-fill", render: sectionContactsGroup("Point of Contact", "point_of_contact") },
    { id: "user_contact", title: "User Contacts", icon: "bi-person-workspace", render: sectionContactsGroup("User Contact", "user_contact") },
    { id: "properties", title: "Properties", icon: "bi-list-ul", render: sectionProperties },
    { id: "references", title: "References", icon: "bi-link-45deg", render: sectionReferences },
    { id: "observed_properties", title: "Observed Properties", icon: "bi-eye", render: sectionObservedProperties }
  ]
};

// --- Main render function ---

function renderNodeProperties(model) {
  nodeProps.innerHTML = "";
  if (!model) {
    nodeProps.innerHTML =
      `<div class="text-center p-4 text-muted">
        <i class="bi bi-cursor-fill mb-3 display-6"></i>
        <p>Select a node to view its properties</p>
      </div>`;
    return;
  }

  const nodeData = model.get("data");
  const nodeType = nodeData.type;
  const nodeName = escapeHtml(nodeData.name);
  const badge = TYPE_BADGE[nodeType] || { label: nodeType, bg: "bg-secondary" };

  // Header
  const header = document.createElement("div");
  header.classList.add("properties-header");
  header.innerHTML = `
    <div class="d-flex align-items-center gap-2">
      <h6 class="mb-0">${nodeName}</h6>
      <span class="badge ${escapeHtml(badge.bg)} properties-type-badge">${escapeHtml(badge.label)}</span>
    </div>`;
  nodeProps.appendChild(header);

  // Sections container
  const container = document.createElement("div");
  container.classList.add("p-2");

  const sections = SECTION_REGISTRY[nodeType] || [];
  for (const sec of sections) {
    try {
      const content = sec.render(nodeData);
      if (!content) continue;
      const sectionEl = createPropertySection(sec.title, sec.icon, content);
      container.appendChild(sectionEl);
    } catch (err) {
      console.warn(`[Properties] Error rendering section "${sec.id}" for ${nodeType}:`, err);
    }
  }

  nodeProps.appendChild(container);
}

function createPropertySection(title, icon, contentEl) {
  const section = document.createElement("div");
  section.classList.add("prop-section");

  const header = document.createElement("div");
  header.classList.add("prop-section-title");

  const chevron = document.createElement("i");
  chevron.classList.add("bi", "bi-chevron-down", "prop-section-chevron");
  chevron.style.cursor = "pointer";

  const iconEl = document.createElement("i");
  iconEl.classList.add("bi", icon, "me-1");

  const label = document.createElement("span");
  label.textContent = title;

  header.appendChild(chevron);
  header.appendChild(iconEl);
  header.appendChild(label);

  const body = document.createElement("div");
  body.classList.add("prop-section-content");
  body.appendChild(contentEl);

  header.addEventListener("click", () => {
    const isCollapsed = body.style.display === "none";
    body.style.display = isCollapsed ? "block" : "none";
    chevron.classList.toggle("bi-chevron-down", isCollapsed);
    chevron.classList.toggle("bi-chevron-right", !isCollapsed);
  });

  section.appendChild(header);
  section.appendChild(body);
  return section;
}

document.addEventListener("DOMContentLoaded", () => {
  (function () {
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (
      type,
      listener,
      options
    ) {
      if (
        (type === "touchstart" || type === "wheel") &&
        (options === undefined || options === null)
      ) {
        options = { passive: true };
      }
      originalAddEventListener.call(this, type, listener, options);
    };
  })();

  loadAllData().then(() => {
    renderVocabulariesList();
    renderEnumerationDataTypesList();
    renderComplexTypesList();
    renderFeatureTypesList();
    renderSpatialSamplingFeatureTypesList();
    renderSpecimenFeatureTypesList();
    renderProcessTypesList();
  });

  initDrawflow();
  initVocabularyEditor();
  initEnumerationEditor();
  initCDTEditor();
  initSpatialSamplingEditor();
  initSpecimenEditor();
  initFeatureEditor();
  initProcessEditor();

  updateSelectedElement(null);
  renderNodeProperties(null);

  // Lazy load diagram after UI is ready to avoid blocking the initial render
  requestAnimationFrame(() => {
    loadDiagramFromStorage();
  });

  btnGenerateJSONHeader.addEventListener("click", generateAndShowJSON);
  document.getElementById("btnDownloadJSONModal").addEventListener("click", downloadGeneratedJSON);
  document.getElementById("btnExportImage").addEventListener("click", () => {
    modalExportImage.show();
  });
  btnSaveExportImage.addEventListener("click", () => {
    const fileName = exportImageFilenameEl.value.trim() || "diagram";
    const format = exportImageFormatEl.value;
    exportDiagramImage(format, fileName);
    modalExportImage.hide();
  }); 

  btnExportJSON.addEventListener("click", exportDiagramAsJSONFile);
  btnImportJSON.addEventListener("click", () => {
    fileImportJSON.click();
  });
  fileImportJSON.addEventListener("change", handleImportJSON);
  btnCleanDiagram.addEventListener("click", cleanDiagram);
  btnCleanModel.addEventListener("click", cleanModel);
  btnApplyDSL.addEventListener("click", applyDSL);

  btnCenter.addEventListener("click", centerContent);
  btnZoomIn.addEventListener("click", zoomIn);
  btnZoomOut.addEventListener("click", zoomOut);
  btnZoomReset.addEventListener("click", zoomReset);
  initResizers();
  initAddItemButtons();
  schemaNameInput.addEventListener("change", () => {
    localStorage.setItem("schemaName", schemaNameInput.value.trim());
  });
  window.addEventListener("resize", () => {
    const wrapper = document.getElementById("diagramWrapper");
    if (paper && wrapper) {
      const rect = wrapper.getBoundingClientRect();
      paper.setDimensions(rect.width, rect.height);
    }
  });

  const btnLoadJSONHeader = document.getElementById("btnLoadJSONHeader");
  const modalLoadModelEl = document.getElementById("modalLoadModel");
  const fileImportModel = document.getElementById("fileImportModel");
  const btnLoadModelFile = document.getElementById("btnLoadModelFile");

  if (!btnLoadJSONHeader) {
    console.error("[LoadModel] btnLoadJSONHeader not found");
    return;
  }
  if (!modalLoadModelEl) {
    console.error("[LoadModel] modalLoadModel element not found");
    return;
  }
  if (!fileImportModel) {
    console.error("[LoadModel] fileImportModel input not found");
    return;
  }
  if (!btnLoadModelFile) {
    console.error("[LoadModel] btnLoadModelFile button not found");
    return;
  }

  const modalLoadModel = new bootstrap.Modal(modalLoadModelEl);

  btnLoadJSONHeader.addEventListener("click", () => {
    fileImportModel.value = "";
    btnLoadModelFile.disabled = true;
    modalLoadModel.show();
  });

  fileImportModel.addEventListener("change", () => {
    btnLoadModelFile.disabled = !fileImportModel.files || fileImportModel.files.length === 0;
  });

  btnLoadModelFile.addEventListener("click", () => {
    if (!fileImportModel.files || fileImportModel.files.length === 0) {
      showNotification("Please select a JSON file to load.");
      return;
    }
    const file = fileImportModel.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        validateAndMaybeLoadModel(jsonData, modalLoadModel);
      } catch (error) {
        showNotification("Invalid JSON file: " + error.message);
        console.error("[LoadModel] JSON parse error", error);
      }
    };
    reader.onerror = () => {
      showNotification("Error reading the file.");
    };
    reader.readAsText(file);
  });

  btnToggleRightPanel.addEventListener("click", toggleRightPanel);
  btnToggleLeftPanel.addEventListener("click", toggleLeftPanel);
});

function applyDSL() {
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
  localStorage.setItem('sharedDSL', JSON.stringify(output));
  const win = window.open('dsl2db.html', '_blank');
}

function validateAndMaybeLoadModel(jsonData, loadModalInstance) {
  const loadModelStatus = document.getElementById('loadModelStatus');
  const modalValidationResultEl = document.getElementById('modalValidationResult');
  const validationResultMessage = document.getElementById('validationResultMessage');
  const validationResultDetails = document.getElementById('validationResultDetails');
  const validationModal = new bootstrap.Modal(modalValidationResultEl);

  // Show loading spinner
  btnLoadModelFile.disabled = true;
  if (loadModelStatus) loadModelStatus.classList.remove('d-none');

  fetch('api/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jsonData)
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
      // Hide loading spinner
      if (loadModelStatus) loadModelStatus.classList.add('d-none');
      btnLoadModelFile.disabled = false;
      fileImportModel.value = "";

      if (body.success) {
        // Validation passed: load model, close all modals
        loadModelFromFile(jsonData);
        renderVocabulariesList();
        renderEnumerationDataTypesList();
        renderComplexTypesList();
        renderFeatureTypesList();
        renderSpatialSamplingFeatureTypesList();
        renderSpecimenFeatureTypesList();
        renderProcessTypesList();
        loadModalInstance.hide();
        showNotification('Model loaded successfully.');
      } else {
        // Validation failed: show error details
        validationResultDetails.innerHTML = '';
        validationResultMessage.textContent = body.message || 'Validation failed. Please fix the errors below.';
        validationResultMessage.className = 'alert alert-danger';
        if (Array.isArray(body.details)) {
          body.details.forEach(detail => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            if (typeof detail === 'string') {
              li.textContent = detail;
            } else if (typeof detail === 'object' && detail !== null) {
              let msg = '';
              if (detail.instancePath) msg += detail.instancePath + ': ';
              if (detail.message) msg += detail.message;
              li.textContent = msg || JSON.stringify(detail);
            } else {
              li.textContent = String(detail);
            }
            validationResultDetails.appendChild(li);
          });
        }
        validationModal.show();
      }
    })
    .catch(err => {
      // Hide loading spinner on error
      if (loadModelStatus) loadModelStatus.classList.add('d-none');
      btnLoadModelFile.disabled = false;
      fileImportModel.value = "";

      validationResultMessage.textContent = 'Error validating JSON: ' + err.message;
      validationResultMessage.className = 'alert alert-danger';
      validationResultDetails.innerHTML = '';
      validationModal.show();
    });
}

function toggleRightPanel() {
  const btnToggle = document.getElementById('btnToggleRightPanel');
  const icon = btnToggle.querySelector('i');
  if (rightPanel.classList.contains('hidden')) {
    rightPanel.classList.remove('hidden');
    icon.style.transform = 'rotate(0deg)';
    btnToggle.setAttribute('title', 'Hide panel');
    rightPanel.style.width = (rightPanel._previousWidth || '420px');
    rightPanel.style.padding = '1rem';
    rightResizer.style.opacity = '1';
    rightResizer.style.pointerEvents = 'auto';
  } else {
    rightPanel._previousWidth = rightPanel.style.width || '420px';
    rightPanel.classList.add('hidden');
    icon.style.transform = 'rotate(180deg)';
    btnToggle.setAttribute('title', 'Show panel');
    rightResizer.style.opacity = '0';
    rightResizer.style.pointerEvents = 'none';
  }
  setTimeout(() => {
    updatePaperDimensions();
  }, 300);
}

function toggleLeftPanel() {
  const btnToggle = document.getElementById('btnToggleLeftPanel');
  const icon = btnToggle.querySelector('i');
  if (leftPanel.classList.contains('hidden')) {
    leftPanel.classList.remove('hidden');
    icon.style.transform = 'rotate(0deg)';
    btnToggle.setAttribute('title', 'Hide panel');
    leftPanel.style.width = (leftPanel._previousWidth || '350px');
    leftPanel.style.padding = '1rem';
    leftResizer.style.opacity = '1';
    leftResizer.style.pointerEvents = 'auto';
  } else {
    leftPanel._previousWidth = leftPanel.style.width || '350px';
    leftPanel.classList.add('hidden');
    icon.style.transform = 'rotate(180deg)';
    btnToggle.setAttribute('title', 'Show panel');
    leftResizer.style.opacity = '0';
    leftResizer.style.pointerEvents = 'none';
  }
  setTimeout(() => {
    updatePaperDimensions();
  }, 300);
}
