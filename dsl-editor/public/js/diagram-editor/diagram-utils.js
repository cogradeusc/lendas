const defaultStyles = {
  vocabulary: { stroke: "#cccccc", strokeWidth: 1 },
  enumeration_data_type: { stroke: "#ffaa00", strokeWidth: 1 },
  complex_data_type: { stroke: "#00aa00", strokeWidth: 1 },
  feature_type: { stroke: "#0077cc", strokeWidth: 1 },
  spatial_sampling_feature_type: { stroke: "#cc00cc", strokeWidth: 1 },
  specimen_feature_type: { stroke: "#0000cc", strokeWidth: 1 },
  process_type: { stroke: "#ff5555", strokeWidth: 1 },
};

document.addEventListener('DOMContentLoaded', function () {

  setTimeout(function () {
    if (typeof paper !== 'undefined') {

      paper.on('element:version:toggle', function (cellView, evt) {
        evt.stopPropagation();
        const cell = cellView.model;
        const cellData = cell.get('data');

        if (!cellData) return;

        if (cellData.type === 'complex_data_type' || cellData.type === 'enumeration_data_type') {
          const rect = cellView.el.getBoundingClientRect();
          const relativeY = evt.clientY - rect.top;

          const clickFeedback = document.createElement('div');
          clickFeedback.style.position = 'absolute';
          clickFeedback.style.left = (evt.clientX - 10) + 'px';
          clickFeedback.style.top = (evt.clientY - 10) + 'px';
          clickFeedback.style.width = '20px';
          clickFeedback.style.height = '20px';
          clickFeedback.style.borderRadius = '50%';
          const bgColor = cellData.type === 'complex_data_type'
            ? 'rgba(0, 170, 0, 0.3)'
            : 'rgba(255, 170, 0, 0.3)';
          clickFeedback.style.backgroundColor = bgColor;
          clickFeedback.style.zIndex = '1000';
          document.body.appendChild(clickFeedback);

          setTimeout(() => {
            document.body.removeChild(clickFeedback);
          }, 300);

          if (cellData.type === 'complex_data_type') {
            toggleVersionFold(cell, relativeY);
          } else {
            toggleEnumVersionFold(cell, relativeY);
          }
        }
      });

      paper.on('element:section:pointerdown', function (cellView, evt) {
        evt.stopPropagation();
        const cell = cellView.model;

        if (cell.get('data') && cell.get('data').type === 'process_type') {
          const rect = cellView.el.getBoundingClientRect();
          const relativeY = evt.clientY - rect.top;

          const clickFeedback = document.createElement('div');
          clickFeedback.style.position = 'absolute';
          clickFeedback.style.left = (evt.clientX - 10) + 'px';
          clickFeedback.style.top = (evt.clientY - 10) + 'px';
          clickFeedback.style.width = '20px';
          clickFeedback.style.height = '20px';
          clickFeedback.style.borderRadius = '50%';
          clickFeedback.style.backgroundColor = 'rgba(255, 85, 85, 0.3)';
          clickFeedback.style.zIndex = '1000';
          document.body.appendChild(clickFeedback);

          setTimeout(() => {
            document.body.removeChild(clickFeedback);
          }, 300);

          toggleSectionFold(cell, relativeY);
        }
      });

    } else {
      console.error('Paper not found. Events not initialized.');
    }
  }, 500);
});

function initDrawflow() {
  const container = document.getElementById("drawflow");
  const LINK_ANCHOR_DRAG_THRESHOLD = 18;

  graph = new joint.dia.Graph();
  paper = new joint.dia.Paper({
    el: container,
    model: graph,
    width: container.offsetWidth,
    height: container.offsetHeight,
    gridSize: 10,
    drawGrid: true,
    interactive(cellView) {
      if (cellView.model && cellView.model.isLink && cellView.model.isLink()) {
        return {
          linkMove: false,
          vertexAdd: false,
          vertexMove: false,
          vertexRemove: false,
          arrowheadMove: false,
          labelMove: false,
          useLinkTools: false,
        };
      }
      return true;
    },
  });

  paper.on("scale", (sx) => {
    zoomLevel = clampZoomLevel(sx);
  });

  let activeLinkAnchorDrag = null;
  let activeLinkAnchorPreviewCell = null;

  function clientToPaperPoint(clientX, clientY) {
    const rect = paper.el.getBoundingClientRect();
    const scale = paper.scale();
    const translate = paper.translate();
    return {
      x: (clientX - rect.left - translate.tx) / scale.sx,
      y: (clientY - rect.top - translate.ty) / scale.sy,
    };
  }

  function clearActiveLinkAnchorDrag() {
    if (
      activeLinkAnchorPreviewCell &&
      typeof hideLinkAnchorPreview === "function"
    ) {
      hideLinkAnchorPreview(activeLinkAnchorPreviewCell);
    }
    activeLinkAnchorPreviewCell = null;
    activeLinkAnchorDrag = null;
    paper.el.style.cursor = "";
  }

  function updateActiveLinkAnchorPreview(point) {
    if (!activeLinkAnchorDrag || typeof showLinkAnchorPreview !== "function") {
      return;
    }

    const currentEnd = activeLinkAnchorDrag.link.get(activeLinkAnchorDrag.end) || {};
    const cell = currentEnd.id ? graph.getCell(currentEnd.id) : null;
    if (!cell) return;

    activeLinkAnchorPreviewCell = cell;
    showLinkAnchorPreview(cell, point);
  }

  function onDocumentPointerMove(event) {
    if (!activeLinkAnchorDrag) return;
    event.preventDefault();
    paper.el.style.cursor = "crosshair";
    updateActiveLinkAnchorPreview(clientToPaperPoint(event.clientX, event.clientY));
  }

  function onDocumentPointerUp(event) {
    if (!activeLinkAnchorDrag) return;

    const point = clientToPaperPoint(event.clientX, event.clientY);
    const targetCell = typeof findTopmostElementAtPoint === "function"
      ? findTopmostElementAtPoint(point)
      : null;
    const currentEnd = activeLinkAnchorDrag.link.get(activeLinkAnchorDrag.end) || {};

    if (targetCell && targetCell.id === currentEnd.id) {
      setManualLinkAnchor(activeLinkAnchorDrag.link, activeLinkAnchorDrag.end, targetCell, point);
    }

    clearActiveLinkAnchorDrag();
  }

  document.addEventListener("mousemove", onDocumentPointerMove);
  document.addEventListener("mouseup", onDocumentPointerUp);

  let pendingLinkNormalizationFrame = null;
  const scheduleLinkNormalization = (forcePorts = true) => {
    if (pendingLinkNormalizationFrame !== null) {
      cancelAnimationFrame(pendingLinkNormalizationFrame);
    }
    pendingLinkNormalizationFrame = requestAnimationFrame(() => {
      pendingLinkNormalizationFrame = null;
      if (typeof window.normalizeDiagramLinksToHeaderPorts === "function") {
        window.normalizeDiagramLinksToHeaderPorts({ forcePorts });
      }
    });
  };

  paper.on("cell:pointerclick", (cellView, evt, x, y) => {
    updateSelectedElement(cellView.model);
    const data = cellView.model.get("data");
    if (data && data.type) {
      injectTooltips(cellView);
      renderNodeProperties(cellView.model);
    } else {
      renderNodeProperties(null);
    }
  });

  function injectTooltips(elementView) {
    const fbEl = elementView.el.querySelector(".foldButton");
    if (fbEl && !fbEl.querySelector("title")) {
      const t = document.createElementNS("http://www.w3.org/2000/svg", "title");
      t.textContent = "Collapse";
      fbEl.appendChild(t);
    }
    const dbEl = elementView.el.querySelector(".deleteButton");
    if (dbEl && !dbEl.querySelector("title")) {
      const t = document.createElementNS("http://www.w3.org/2000/svg", "title");
      t.textContent = "Remove";
      dbEl.appendChild(t);
    }
  }

  paper.on("element:foldButton:pointerdown", (elementView, evt) => {
    evt.stopPropagation();
    const model = elementView.model;
    const isFolded = model.get("folded");
    if (isFolded) {
      model.set("folded", false);
      const data = model.get("data");
      const enumDT = data.enumeration_data;
      let versionsText = "(sin versiones)";
      if (Array.isArray(enumDT?.versions) && enumDT.versions.length > 0) {
        versionsText = "";
        enumDT.versions.forEach((ver) => {
          versionsText += ver.version + "\n";
          if (Array.isArray(ver.values)) {
            ver.values.forEach((v) => (versionsText += "  • " + v + "\n"));
          }
          versionsText += "\n";
        });
      }
      const lines = versionsText.split("\n");
      const lineHeight = 15;
      const bodyMargin = 10;
      const bodyHeight = Math.max(
        40,
        lines.length * lineHeight + bodyMargin * 2
      );
      const headerHeight = 40;
      const totalHeight = headerHeight + bodyHeight;
      model.attr("bodyRect/display", null);
      model.attr("bodyText/display", null);
      model.resize(model.size().width, totalHeight);
    } else {
      model.set("folded", true);
      model.attr("bodyRect/display", "none");
      model.attr("bodyText/display", "none");
      const headerHeight = 40;
      model.resize(model.size().width, headerHeight);
    }
    model.attr("foldButtonText/text", model.get("folded") ? "+" : "-");
  });

  paper.on("element:deleteButton:pointerdown", (elementView, evt) => {
    evt.stopPropagation();
    elementView.model.remove();
  });

  container.addEventListener("click", (event) => {
    if (!event.target.closest(".joint-cell")) {
      updateSelectedElement(null);
      renderNodeProperties(null);
    }
  });
  
  graph.on("add", (cell) => {
    if (cell.isElement && cell.isElement()) {
      ensureElementHeaderPorts(cell);

      const spacing = 20;
      const overlap = (a, b) => {
        const A = a.getBBox();
        const B = b.getBBox();
        return !(
          A.x + A.width <= B.x ||
          A.x >= B.x + B.width ||
          A.y + A.height <= B.y ||
          A.y >= B.y + B.height
        );
      };

      let moved;
      do {
        moved = false;
        graph.getCells().forEach((other) => {
          if (other.id === cell.id) return;
          if (other.isElement && other.isElement() && overlap(cell, other)) {
            const pos = cell.position();
            cell.position(pos.x + spacing, pos.y + spacing);
            moved = true;
          }
        });
      } while (moved);

      const data = cell.get("data");
      if (data && data.type) {
        const view = paper.findViewByModel(cell);
        if (view) injectTooltips(view);
        if (typeof window.handleElementLinks === "function") {
          window.handleElementLinks(cell, data.type);
        }
      }
    }

    if (
      cell.get("type") === "standard.Link" ||
      (cell.isElement && cell.isElement())
    ) {
      scheduleLinkNormalization(true);
    }
  });

  paper.on("link:pointerdown", (linkView, evt, x, y) => {
    const point = { x, y };
    const sourcePoint = typeof getLinkEndpointPoint === "function"
      ? getLinkEndpointPoint(linkView.model, "source")
      : null;
    const targetPoint = typeof getLinkEndpointPoint === "function"
      ? getLinkEndpointPoint(linkView.model, "target")
      : null;

    const distanceToSource = sourcePoint
      ? Math.hypot(point.x - sourcePoint.x, point.y - sourcePoint.y)
      : Number.POSITIVE_INFINITY;
    const distanceToTarget = targetPoint
      ? Math.hypot(point.x - targetPoint.x, point.y - targetPoint.y)
      : Number.POSITIVE_INFINITY;

    if (
      distanceToSource > LINK_ANCHOR_DRAG_THRESHOLD &&
      distanceToTarget > LINK_ANCHOR_DRAG_THRESHOLD
    ) {
      return;
    }

    activeLinkAnchorDrag = {
      link: linkView.model,
      end: distanceToSource <= distanceToTarget ? "source" : "target",
    };
    evt.stopPropagation();
    evt.preventDefault();
    paper.el.style.cursor = "crosshair";
    updateActiveLinkAnchorPreview(point);
  });

  graph.on("remove", (cell) => {
    if (
      cell.get("type") === "standard.Link" ||
      (cell.isElement && cell.isElement())
    ) {
      scheduleLinkNormalization(true);
    }
  });

  let saveTimeout = null;
  const saveIndicator = document.getElementById("saveIndicator");
  graph.on("add remove change", () => {
    if (saveIndicator) {
      saveIndicator.innerHTML = '<i class="bi bi-dash-circle-fill text-warning"></i> Unsaved changes';
    }
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      saveDiagramToStorage();
      saveTimeout = null;
      if (saveIndicator) {
        saveIndicator.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i> Saved';
      }
    }, 300);
  });

  graph.on("change:position", (cell) => {
    if (cell.isElement && cell.isElement() && typeof window.relayoutIncidentLinks === "function") {
      window.relayoutIncidentLinks(cell);
    } else if (typeof applyEdgeOffsets === "function") {
      applyEdgeOffsets();
    }
  });

  graph.on("change:size", (cell) => {
    if (cell.isElement && cell.isElement()) {
      ensureElementHeaderPorts(cell);
      if (typeof window.relayoutIncidentLinks === "function") {
        window.relayoutIncidentLinks(cell);
      }
    }
  });

  renderNodeProperties(null);

  const drawflowContainer = document.getElementById("drawflow");
  drawflowContainer.addEventListener("dragover", (event) =>
    event.preventDefault()
  );
  drawflowContainer.addEventListener("drop", onDropNode);

  // Ctrl+Scroll to zoom
  paper.el.addEventListener("wheel", (evt) => {
    if (!evt.ctrlKey) return;
    evt.preventDefault();
    const delta = evt.deltaY > 0 ? -0.1 : 0.1;
    const newScale = clampZoomLevel(zoomLevel + delta);
    const scaleFactor = newScale / zoomLevel;

    const rect = paper.el.getBoundingClientRect();
    const mouseX = evt.clientX - rect.left;
    const mouseY = evt.clientY - rect.top;

    const translate = paper.translate();
    const newTx = mouseX - scaleFactor * (mouseX - translate.tx);
    const newTy = mouseY - scaleFactor * (mouseY - translate.ty);

    applyViewportTransform(newScale, newTx, newTy);
  }, { passive: false });

  // Space+drag to pan
  let isPanning = false;
  let panStart = { x: 0, y: 0 };

  paper.el.addEventListener("mousedown", (evt) => {
    if (evt.code === "Space" || evt.button === 1) {
      isPanning = true;
      panStart = { x: evt.clientX, y: evt.clientY };
      paper.el.style.cursor = "grab";
      evt.preventDefault();
    }
  });

  paper.el.addEventListener("mousemove", (evt) => {
    if (!isPanning) return;
    const dx = evt.clientX - panStart.x;
    const dy = evt.clientY - panStart.y;
    const translate = paper.translate();
    paper.translate(translate.tx + dx, translate.ty + dy);
    panStart = { x: evt.clientX, y: evt.clientY };
  });

  paper.el.addEventListener("mouseup", () => {
    if (isPanning) {
      isPanning = false;
      paper.el.style.cursor = "";
    }
  });

  paper.el.addEventListener("mouseleave", () => {
    if (isPanning) {
      isPanning = false;
      paper.el.style.cursor = "";
    }
  });
}

function zoomIn() {
  if (!paper) return;
  applyViewportTransform(clampZoomLevel(zoomLevel + 0.1));
}

function zoomOut() {
  if (!paper) return;
  applyViewportTransform(clampZoomLevel(zoomLevel - 0.1));
}

function zoomReset() {
  if (!paper) return;
  const translate = paper.translate();
  applyViewportTransform(1, translate.tx, translate.ty);
}

function centerContent() {
  fitContentToViewport();
}

const MIN_ZOOM_LEVEL = 0.1;
const MAX_ZOOM_LEVEL = 5;
const FIT_CONTENT_PADDING = 40;

function clampZoomLevel(level) {
  return Math.max(MIN_ZOOM_LEVEL, Math.min(MAX_ZOOM_LEVEL, level));
}

function getDiagramContentBBox() {
  if (!graph || !paper) return null;

  const cells = typeof graph.getCells === "function" ? graph.getCells() : [];
  if (!cells.length) {
    return null;
  }

  if (typeof paper.getContentArea === "function") {
    // Use content-local coordinates so fitting is independent of the current zoom/pan state.
    const contentBBox = paper.getContentArea();
    if (
      contentBBox &&
      [contentBBox.x, contentBBox.y, contentBBox.width, contentBBox.height].every(Number.isFinite)
    ) {
      return contentBBox;
    }
  }

  const fallbackBBox = graph.getBBox(cells);
  if (
    !fallbackBBox ||
    ![fallbackBBox.x, fallbackBBox.y, fallbackBBox.width, fallbackBBox.height].every(Number.isFinite)
  ) {
    return null;
  }

  return fallbackBBox;
}

function getPaperViewportRect() {
  if (!paper || !paper.el) return null;

  const rect = paper.el.getBoundingClientRect();
  if (!Number.isFinite(rect.width) || !Number.isFinite(rect.height) || rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  return rect;
}

function applyViewportTransform(scale, tx, ty) {
  if (!paper) return;

  const nextScale = clampZoomLevel(scale);
  const currentTranslate = paper.translate();
  const nextTx = Number.isFinite(tx) ? tx : currentTranslate.tx;
  const nextTy = Number.isFinite(ty) ? ty : currentTranslate.ty;

  zoomLevel = nextScale;
  paper.scale(nextScale, nextScale);
  paper.translate(nextTx, nextTy);
}

function fitContentToViewport(options = {}) {
  if (!graph || !paper) return;

  const bbox = getDiagramContentBBox();
  const viewport = getPaperViewportRect();
  if (!bbox || !viewport) return;

  const padding = Math.max(0, Number.isFinite(options.padding) ? options.padding : FIT_CONTENT_PADDING);
  const availableWidth = viewport.width - padding * 2;
  const availableHeight = viewport.height - padding * 2;

  if (availableWidth <= 0 || availableHeight <= 0) return;

  const contentWidth = Math.max(bbox.width, 1);
  const contentHeight = Math.max(bbox.height, 1);
  const targetScale = clampZoomLevel(
    Math.min(availableWidth / contentWidth, availableHeight / contentHeight)
  );

  const tx = (viewport.width - bbox.width * targetScale) / 2 - bbox.x * targetScale;
  const ty = (viewport.height - bbox.height * targetScale) / 2 - bbox.y * targetScale;

  applyViewportTransform(targetScale, tx, ty);
}

function cleanDiagram() {
  showConfirmation(
    "This will remove all elements from the diagram canvas. The model catalog will not be affected.",
    () => {
      localStorage.removeItem("diagramData");
      graph.clear();
      currentSelectedElement = null;
      renderNodeProperties(null);
      showNotification("Diagram cleared.");
    }
  );
}

function cleanModel() {
  showConfirmation(
    "This will delete the entire model catalog and clear the diagram. This action cannot be undone.",
    () => {
      schemaNameInput.value = "";
      vocabularies = [];
      enumerationDataTypes = [];
      complexDataTypes = [];
      featureTypes = [];
      spatialSamplingFeatureTypes = [];
      specimenFeatureTypes = [];
      processTypes = [];

      localStorage.removeItem("schemaName");
      localStorage.removeItem("vocabularies");
      localStorage.removeItem("enumerationDataTypes");
      localStorage.removeItem("complexDataTypes");
      localStorage.removeItem("featureTypes");
      localStorage.removeItem("spatialSamplingFeatureTypes");
      localStorage.removeItem("specimenFeatureTypes");
      localStorage.removeItem("processTypes");

      renderVocabulariesList();
      renderEnumerationDataTypesList();
      renderComplexTypesList();
      renderFeatureTypesList();
      renderSpatialSamplingFeatureTypesList();
      renderSpecimenFeatureTypesList();
      renderProcessTypesList();

      localStorage.removeItem("diagramData");
      graph.clear();
      currentSelectedElement = null;
      renderNodeProperties(null);

      showNotification("Model and diagram cleared.");
    }
  );
}

function applyCellStyle(cell, stroke, strokeWidth) {
  if (cell.attr("headerRect")) {
    cell.attr("headerRect/stroke", stroke);
    cell.attr("headerRect/strokeWidth", strokeWidth);
  }
  if (cell.attr("bodyRect")) {
    cell.attr("bodyRect/stroke", stroke);
    cell.attr("bodyRect/strokeWidth", strokeWidth);
  }
}

function resetAllCellStyles() {
  graph.getCells().forEach((cell) => {
    const data = cell.get("data");
    if (data && data.type) {
      const defStyle = defaultStyles[data.type] || {
        stroke: "#cccccc",
        strokeWidth: 1,
      };
      applyCellStyle(cell, defStyle.stroke, defStyle.strokeWidth);
    }
  });
  currentSelectedElement = null;
}

function updatePaperDimensions() {
  const wrapper = document.getElementById("diagramWrapper");
  if (paper && wrapper) {
    const rect = wrapper.getBoundingClientRect();
    paper.setDimensions(rect.width, rect.height);
  }
}

function updateSelectedElement(newSelected) {
  if (currentSelectedElement && currentSelectedElement !== newSelected) {
    const prevData = currentSelectedElement.get("data");
    let defStyle = { stroke: "#cccccc", strokeWidth: 1 };
    if (prevData && prevData.type && defaultStyles[prevData.type]) {
      defStyle = defaultStyles[prevData.type];
    }
    applyCellStyle(currentSelectedElement, defStyle.stroke, defStyle.strokeWidth);
  }
  currentSelectedElement = newSelected;
  if (newSelected) {
    const newData = newSelected.get("data");
    if (newData && newData.type) {
      applyCellStyle(newSelected, "#1e88e5", 5);
    }
  }
}
