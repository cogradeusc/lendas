let graph;
let paper;
let currentSelectedElement = null;
let zoomLevel = 1;

// --- Edge offsetting for parallel links between same nodes ---
const EDGE_OFFSET_STEP = 30;

function applyEdgeOffsets() {
  if (!graph) return;

  const groups = {};
  graph.getCells().forEach(cell => {
    if (cell.get("type") !== "standard.Link") return;
    const src = cell.get("source");
    const tgt = cell.get("target");
    if (!src.id || !tgt.id) return;
    const key = src.id < tgt.id ? src.id + "|" + tgt.id : tgt.id + "|" + src.id;
    if (!groups[key]) groups[key] = [];
    groups[key].push(cell);
  });

  Object.values(groups).forEach(links => {
    if (links.length <= 1) {
      links.forEach(l => l.set("vertices", []));
      return;
    }

    const midIndex = Math.floor(links.length / 2);
    links.forEach((link, i) => {
      const offset = (i - midIndex) * EDGE_OFFSET_STEP;
      if (offset === 0) {
        link.set("vertices", []);
      } else {
        const srcCell = graph.getCell(link.get("source").id);
        const tgtCell = graph.getCell(link.get("target").id);
        if (!srcCell || !tgtCell) return;

        const srcBBox = srcCell.getBBox();
        const tgtBBox = tgtCell.getBBox();

        const mx = (srcBBox.x + srcBBox.width / 2 + tgtBBox.x + tgtBBox.width / 2) / 2;
        const my = (srcBBox.y + srcBBox.height / 2 + tgtBBox.y + tgtBBox.height / 2) / 2;

        const dx = tgtBBox.x + tgtBBox.width / 2 - (srcBBox.x + srcBBox.width / 2);
        const dy = tgtBBox.y + tgtBBox.height / 2 - (srcBBox.y + srcBBox.height / 2);
        const len = Math.sqrt(dx * dx + dy * dy) || 1;

        const px = -dy / len * offset;
        const py = dx / len * offset;

        link.set("vertices", [{ x: mx + px, y: my + py }]);
      }
    });
  });
}

const elementCreators = {
  vocabulary: createVocabularyElement,
  enumeration_data_type: createEnumerationDataTypeElement,
  complex_data_type: createComplexDataTypeElement,
  feature_type: createFeatureTypeElement,
  spatial_sampling_feature_type: createSpatialSamplingFeatureTypeElement,
  specimen_feature_type: createSpecimenFeatureTypeElement,
  process_type: createProcessTypeElement,
};

const HEADER_LINK_DIRECTIONS = ["top", "left", "right"];
const HEADER_LINK_PADDING = 20;
const HEADER_LINK_STEP = 10;
const HEADER_PORT_PREVIEW_STYLE = {
  fill: "#ffffff",
  stroke: "#1e88e5",
  opacity: 0.95,
  r: HEADER_PORT_RADIUS + 1,
  strokeWidth: 2,
};
const HEADER_PORT_ACTIVE_PREVIEW_STYLE = {
  fill: "#1e88e5",
  stroke: "#0d47a1",
  opacity: 1,
  r: HEADER_PORT_RADIUS + 2,
  strokeWidth: 2,
};
const HEADER_PORT_HIDDEN_STYLE = {
  fill: "transparent",
  stroke: "transparent",
  opacity: 0,
  r: HEADER_PORT_RADIUS,
  strokeWidth: 1,
};

function getHeaderLinkRouter() {
  return {
    name: "metro",
    args: {
      padding: HEADER_LINK_PADDING,
      step: HEADER_LINK_STEP,
      startDirections: HEADER_LINK_DIRECTIONS,
      endDirections: HEADER_LINK_DIRECTIONS,
      fallbackRouter(vertices, options, linkView) {
        return joint.routers.manhattan(vertices, {
          ...options,
          padding: HEADER_LINK_PADDING,
          step: HEADER_LINK_STEP,
          startDirections: HEADER_LINK_DIRECTIONS,
          endDirections: HEADER_LINK_DIRECTIONS,
        }, linkView);
      },
    },
  };
}

function getHeaderLinkConnector() {
  return { name: "jumpover" };
}

function getDataListForType(type) {
  const dataLists = {
    vocabulary: vocabularies,
    enumeration_data_type: enumerationDataTypes,
    complex_data_type: complexDataTypes,
    feature_type: featureTypes,
    spatial_sampling_feature_type: spatialSamplingFeatureTypes,
    specimen_feature_type: specimenFeatureTypes,
    process_type: processTypes,
  };
  return dataLists[type] || [];
}

function findTargetTypeAndData(name, types) {
  for (const type of types) {
    const list = getDataListForType(type);
    const found = list.find((item) => item.name === name);
    if (found) {
      return { type, data: found };
    }
  }
  return null;
}

function findDiagramElementByName(name, allowedTypes) {
  return graph.getCells().find((cell) => {
    const data = cell.get("data");
    return data && allowedTypes.includes(data.type) && data.name === name;
  });
}

function findOrCreateTargetCell({ from, toName, allowedTypes }) {
  let targetCell = findDiagramElementByName(toName, allowedTypes);
  if (!targetCell) {
    const found = findTargetTypeAndData(toName, allowedTypes);
    if (found) {
      const { type, data } = found;
      const { x, y } = from.position();
      targetCell = elementCreators[type](x + 300, y, data);
      graph.addCell(targetCell);
    }
  }
  return targetCell;
}

function targetMarkerSignature(targetMarker = {}) {
  return [
    targetMarker.type || "",
    targetMarker.d || "",
    targetMarker.fill || "",
    targetMarker.stroke || "",
    targetMarker["stroke-width"] || "",
  ].join("|");
}

function findExistingStyledLink({ fromId, targetId, lineAttrs }) {
  return graph.getCells().find((cell) => {
    if (cell.get("type") !== "standard.Link") return false;
    const source = cell.get("source");
    const target = cell.get("target");
    const attrs = cell.attr("line") || {};
    return (
      source.id === fromId &&
      target.id === targetId &&
      attrs.stroke === lineAttrs.stroke &&
      attrs.strokeWidth === lineAttrs.strokeWidth &&
      (attrs.strokeDasharray || "") === (lineAttrs.strokeDasharray || "") &&
      targetMarkerSignature(attrs.targetMarker) === targetMarkerSignature(lineAttrs.targetMarker)
    );
  });
}

function getElementCenter(cell) {
  const bbox = cell.getBBox();
  return {
    x: bbox.x + bbox.width / 2,
    y: bbox.y + bbox.height / 2,
  };
}

function getHeaderPortIdsBySide(side) {
  const count = HEADER_PORT_COUNTS[side] || 0;
  return Array.from({ length: count }, (_, index) => `header-${side}-${index + 1}`);
}

function getHeaderPortPoint(cell, portId) {
  const bbox = cell.getBBox();
  const width = cell.size().width;
  const headerHeight = getHeaderHeightForElement(cell);
  const [, side, slotIndexString] = portId.split("-");
  const slotIndex = Number(slotIndexString);
  const slotCount = HEADER_PORT_COUNTS[side];

  if (!slotCount || !slotIndex) {
    return getElementCenter(cell);
  }

  if (side === "top") {
    return {
      x: bbox.x + (width * slotIndex) / (slotCount + 1),
      y: bbox.y,
    };
  }

  const y = bbox.y + (headerHeight * slotIndex) / (slotCount + 1);
  if (side === "left") {
    return { x: bbox.x, y };
  }
  if (side === "right") {
    return { x: bbox.x + width, y };
  }

  return getElementCenter(cell);
}

function getPortSlotIndex(portId) {
  if (typeof portId !== "string") return null;
  const parts = portId.split("-");
  const slotIndex = Number(parts[2]);
  return Number.isFinite(slotIndex) ? slotIndex : null;
}

function getPortSide(portId) {
  if (typeof portId !== "string") return null;
  const parts = portId.split("-");
  return parts[1] || null;
}

function getSideCenterSlotIndex(side) {
  const count = HEADER_PORT_COUNTS[side] || 0;
  if (count <= 0) return 0;
  return (count + 1) / 2;
}

function getExistingPortUsage(cell, excludedLink = null) {
  const usageMap = new Map();
  if (!graph || !cell || !cell.id) {
    return usageMap;
  }

  graph.getCells().forEach((candidate) => {
    if (candidate.get("type") !== "standard.Link" || candidate === excludedLink) return;

    const source = candidate.get("source") || {};
    const target = candidate.get("target") || {};

    if (source.id === cell.id && source.port) {
      usageMap.set(source.port, (usageMap.get(source.port) || 0) + 1);
    }
    if (target.id === cell.id && target.port) {
      usageMap.set(target.port, (usageMap.get(target.port) || 0) + 1);
    }
  });

  return usageMap;
}

function getParallelPortUsage(cell, otherCell, side, excludedLink = null) {
  const usedPorts = [];
  if (!graph || !cell || !otherCell || !cell.id || !otherCell.id) {
    return usedPorts;
  }

  graph.getCells().forEach((candidate) => {
    if (candidate.get("type") !== "standard.Link" || candidate === excludedLink) return;

    const source = candidate.get("source") || {};
    const target = candidate.get("target") || {};

    let portId = null;
    if (source.id === cell.id && target.id === otherCell.id) {
      portId = source.port;
    } else if (target.id === cell.id && source.id === otherCell.id) {
      portId = target.port;
    }

    if (typeof portId === "string" && portId.split("-")[1] === side) {
      usedPorts.push(portId);
    }
  });

  return usedPorts;
}

function resolvePreferredSide(cell, otherCell) {
  const bbox = cell.getBBox();
  const headerHeight = getHeaderHeightForElement(cell);
  const cellCenter = getElementCenter(cell);
  const otherCenter = getElementCenter(otherCell);

  if (otherCenter.y < bbox.y + headerHeight * 0.75) {
    return "top";
  }

  return otherCenter.x < cellCenter.x ? "left" : "right";
}

function pickBestPort(cell, side, otherCell, usageMap, pairUsedPorts = []) {
  const portIds = getHeaderPortIdsBySide(side);
  const otherCenter = getElementCenter(otherCell);
  const centerSlotIndex = getSideCenterSlotIndex(side);

  return portIds
    .map((portId) => {
      const point = getHeaderPortPoint(cell, portId);
      const usage = usageMap.get(portId) || 0;
      const slotIndex = getPortSlotIndex(portId);
      const dx = point.x - otherCenter.x;
      const dy = point.y - otherCenter.y;
      const minParallelDistance = pairUsedPorts.length === 0
        ? Number.POSITIVE_INFINITY
        : Math.min(
            ...pairUsedPorts
              .map((usedPortId) => {
                const usedSlotIndex = getPortSlotIndex(usedPortId);
                if (!Number.isFinite(slotIndex) || !Number.isFinite(usedSlotIndex)) {
                  return 0;
                }
                return Math.abs(slotIndex - usedSlotIndex);
              })
          );
      return {
        portId,
        usage,
        distance: Math.sqrt(dx * dx + dy * dy),
        minParallelDistance,
        centerDistance: Number.isFinite(slotIndex)
          ? Math.abs(slotIndex - centerSlotIndex)
          : 0,
      };
    })
    .sort((leftPort, rightPort) => {
      if (pairUsedPorts.length > 0) {
        if (leftPort.minParallelDistance !== rightPort.minParallelDistance) {
          return rightPort.minParallelDistance - leftPort.minParallelDistance;
        }
        if (leftPort.centerDistance !== rightPort.centerDistance) {
          return rightPort.centerDistance - leftPort.centerDistance;
        }
        if (leftPort.usage !== rightPort.usage) {
          return leftPort.usage - rightPort.usage;
        }
      } else if (leftPort.usage !== rightPort.usage) {
        return leftPort.usage - rightPort.usage;
      }
      if (leftPort.distance !== rightPort.distance) {
        return leftPort.distance - rightPort.distance;
      }
      return leftPort.portId.localeCompare(rightPort.portId);
    })[0].portId;
}

function resolvePortPair(sourceCell, targetCell, excludedLink = null, options = {}) {
  const sourceSide = options.sourcePort
    ? getPortSide(options.sourcePort)
    : resolvePreferredSide(sourceCell, targetCell);
  const targetSide = options.targetPort
    ? getPortSide(options.targetPort)
    : resolvePreferredSide(targetCell, sourceCell);
  const sourceUsage = getExistingPortUsage(sourceCell, excludedLink);
  const targetUsage = getExistingPortUsage(targetCell, excludedLink);
  const sourcePairUsage = getParallelPortUsage(sourceCell, targetCell, sourceSide, excludedLink);
  const targetPairUsage = getParallelPortUsage(targetCell, sourceCell, targetSide, excludedLink);

  return {
    sourcePort: options.sourcePort || pickBestPort(sourceCell, sourceSide, targetCell, sourceUsage, sourcePairUsage),
    targetPort: options.targetPort || pickBestPort(targetCell, targetSide, sourceCell, targetUsage, targetPairUsage),
  };
}

function buildHeaderLinkEnd(cellId, portId) {
  return {
    id: cellId,
    port: portId,
    connectionPoint: { name: "anchor" },
  };
}

function applyHeaderLinkGeometry(link, sourceCell, targetCell, options = {}) {
  if (!link || !sourceCell || !targetCell) return;

  ensureElementHeaderPorts(sourceCell);
  ensureElementHeaderPorts(targetCell);

  const source = { ...(link.get("source") || {}) };
  const target = { ...(link.get("target") || {}) };
  const manualAnchors = link.get("manualAnchors") || {};
  const lockedSourcePort = manualAnchors.source && source.port ? source.port : null;
  const lockedTargetPort = manualAnchors.target && target.port ? target.port : null;
  const shouldReassignPorts =
    options.forcePorts ||
    !source.port ||
    !target.port ||
    source.selector === "headerRect" ||
    target.selector === "headerRect";

  if (shouldReassignPorts || lockedSourcePort || lockedTargetPort) {
    const ports = resolvePortPair(sourceCell, targetCell, link, {
      sourcePort: lockedSourcePort,
      targetPort: lockedTargetPort,
    });
    Object.assign(source, buildHeaderLinkEnd(sourceCell.id, ports.sourcePort));
    Object.assign(target, buildHeaderLinkEnd(targetCell.id, ports.targetPort));
  } else {
    source.connectionPoint = { name: "anchor" };
    target.connectionPoint = { name: "anchor" };
  }

  delete source.selector;
  delete target.selector;

  link.set("source", source);
  link.set("target", target);
  link.set("router", getHeaderLinkRouter());
  link.set("connector", getHeaderLinkConnector());
}

function createHeaderPortLink({ from, to, lineAttrs, labels = [] }) {
  if (!from || !to) return null;

  ensureElementHeaderPorts(from);
  ensureElementHeaderPorts(to);

  const ports = resolvePortPair(from, to);
  const link = new joint.shapes.standard.Link({
    source: buildHeaderLinkEnd(from.id, ports.sourcePort),
    target: buildHeaderLinkEnd(to.id, ports.targetPort),
    router: getHeaderLinkRouter(),
    connector: getHeaderLinkConnector(),
    attrs: { line: lineAttrs },
    labels,
  });

  graph.addCell(link);
  applyEdgeOffsets();
  return link;
}

function getLinkEndpointPoint(link, end) {
  if (!graph || !link) return null;
  const linkEnd = link.get(end) || {};
  const cell = linkEnd.id ? graph.getCell(linkEnd.id) : null;
  if (!cell || !linkEnd.port) return null;
  return getHeaderPortPoint(cell, linkEnd.port);
}

function pointToSegmentDistance(point, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    const px = point.x - start.x;
    const py = point.y - start.y;
    return Math.sqrt(px * px + py * py);
  }

  let t = ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared;
  t = Math.max(0, Math.min(1, t));
  const projection = {
    x: start.x + t * dx,
    y: start.y + t * dy,
  };
  const px = point.x - projection.x;
  const py = point.y - projection.y;
  return Math.sqrt(px * px + py * py);
}

function getNearestHeaderSide(cell, point) {
  const bbox = cell.getBBox();
  const headerHeight = getHeaderHeightForElement(cell);
  const segments = {
    top: {
      start: { x: bbox.x, y: bbox.y },
      end: { x: bbox.x + bbox.width, y: bbox.y },
    },
    left: {
      start: { x: bbox.x, y: bbox.y },
      end: { x: bbox.x, y: bbox.y + headerHeight },
    },
    right: {
      start: { x: bbox.x + bbox.width, y: bbox.y },
      end: { x: bbox.x + bbox.width, y: bbox.y + headerHeight },
    },
  };

  return Object.entries(segments)
    .map(([side, segment]) => ({
      side,
      distance: pointToSegmentDistance(point, segment.start, segment.end),
    }))
    .sort((leftSide, rightSide) => leftSide.distance - rightSide.distance)[0].side;
}

function pickClosestPortOnSide(cell, side, point) {
  return getHeaderPortIdsBySide(side)
    .map((portId) => {
      const portPoint = getHeaderPortPoint(cell, portId);
      const dx = portPoint.x - point.x;
      const dy = portPoint.y - point.y;
      return {
        portId,
        distance: Math.sqrt(dx * dx + dy * dy),
      };
    })
    .sort((leftPort, rightPort) => leftPort.distance - rightPort.distance)[0].portId;
}

function getClosestHeaderPortForPoint(cell, point) {
  if (!cell || !point) return null;
  const side = getNearestHeaderSide(cell, point);
  return pickClosestPortOnSide(cell, side, point);
}

function setHeaderPortPreviewStyle(cell, portId, style) {
  if (!cell || typeof cell.portProp !== "function" || !portId) return;
  cell.portProp(portId, "attrs/portBody/fill", style.fill);
  cell.portProp(portId, "attrs/portBody/stroke", style.stroke);
  cell.portProp(portId, "attrs/portBody/opacity", style.opacity);
  cell.portProp(portId, "attrs/portBody/r", style.r);
  cell.portProp(portId, "attrs/portBody/strokeWidth", style.strokeWidth);
}

function showLinkAnchorPreview(cell, point = null) {
  if (!cell) return;

  ensureElementHeaderPorts(cell);

  const activePortId = point ? getClosestHeaderPortForPoint(cell, point) : null;
  getExpectedHeaderPortIds().forEach((portId) => {
    setHeaderPortPreviewStyle(
      cell,
      portId,
      portId === activePortId ? HEADER_PORT_ACTIVE_PREVIEW_STYLE : HEADER_PORT_PREVIEW_STYLE
    );
  });
}

function hideLinkAnchorPreview(cell) {
  if (!cell) return;

  ensureElementHeaderPorts(cell);

  getExpectedHeaderPortIds().forEach((portId) => {
    setHeaderPortPreviewStyle(cell, portId, HEADER_PORT_HIDDEN_STYLE);
  });
}

function findTopmostElementAtPoint(point) {
  if (!graph) return null;

  const elements = graph.getCells().filter((cell) => cell.isElement && cell.isElement());
  for (let index = elements.length - 1; index >= 0; index -= 1) {
    const cell = elements[index];
    const bbox = cell.getBBox();
    const insideX = point.x >= bbox.x && point.x <= bbox.x + bbox.width;
    const insideY = point.y >= bbox.y && point.y <= bbox.y + bbox.height;
    if (insideX && insideY) {
      return cell;
    }
  }

  return null;
}

function setManualLinkAnchor(link, end, cell, point) {
  if (!link || !cell || !point) return false;

  ensureElementHeaderPorts(cell);

  const portId = getClosestHeaderPortForPoint(cell, point);
  const linkEnd = buildHeaderLinkEnd(cell.id, portId);
  const manualAnchors = { ...(link.get("manualAnchors") || {}), [end]: true };

  link.set(end, linkEnd);
  link.set("manualAnchors", manualAnchors);

  const source = link.get("source") || {};
  const target = link.get("target") || {};
  const sourceCell = source.id ? graph.getCell(source.id) : null;
  const targetCell = target.id ? graph.getCell(target.id) : null;

  if (sourceCell && targetCell) {
    applyHeaderLinkGeometry(link, sourceCell, targetCell, { forcePorts: true });
    applyEdgeOffsets();
  }

  return true;
}

function relayoutIncidentLinks(cell) {
  if (!graph || !cell || !cell.id) return;

  const links = graph.getConnectedLinks(cell) || [];
  links.forEach((link) => {
    const source = link.get("source") || {};
    const target = link.get("target") || {};
    const sourceCell = source.id ? graph.getCell(source.id) : null;
    const targetCell = target.id ? graph.getCell(target.id) : null;
    if (!sourceCell || !targetCell) return;
    applyHeaderLinkGeometry(link, sourceCell, targetCell, { forcePorts: true });
  });

  applyEdgeOffsets();
}

function normalizeDiagramLinksToHeaderPorts(options = {}) {
  if (!graph) return;

  graph.getCells().forEach((cell) => {
    if (cell.isElement && cell.isElement()) {
      ensureElementHeaderPorts(cell);
    }
  });

  graph.getCells().forEach((cell) => {
    if (cell.get("type") !== "standard.Link") return;
    const source = cell.get("source") || {};
    const target = cell.get("target") || {};
    const sourceCell = source.id ? graph.getCell(source.id) : null;
    const targetCell = target.id ? graph.getCell(target.id) : null;
    if (!sourceCell || !targetCell) return;
    applyHeaderLinkGeometry(cell, sourceCell, targetCell, options);
  });

  applyEdgeOffsets();
}

function createPlatformLink({ from, toName, allowedTypes, color, width }) {
  const targetCell = findOrCreateTargetCell({ from, toName, allowedTypes });
  if (!targetCell) return;

  const lineAttrs = {
    stroke: color,
    strokeWidth: width,
    targetMarker: {
      type: 'path',
      d: 'M 0 -9 L 0 9 L 18 9 L 18 -9 Z',
      fill: color,
      stroke: color
    }
  };
  const existingLink = findExistingStyledLink({
    fromId: from.id,
    targetId: targetCell.id,
    lineAttrs,
  });
  if (existingLink) return;

  const labelForValidTimePeriod = () => ({
    attrs: {
      text: { text: '(T)', fontSize: 16, fontWeight: 'bold' }
    },
    position: { distance: -30, offset: 20 }
  });

  const getPlatformScope = (cell) => {
    const data = cell.get('data');
    return data?.process_data?.platform?.scope;
  };

  const labels = getPlatformScope(from) === 'valid_time_period' ? [labelForValidTimePeriod()] : [];
  createHeaderPortLink({ from, to: targetCell, lineAttrs, labels });
}

function createSharedLink({ from, toName, allowedTypes, color, width, dash }) {
  const targetCell = findOrCreateTargetCell({ from, toName, allowedTypes });
  if (!targetCell) return;

  const lineAttrs = {
    stroke: color,
    strokeWidth: width,
    ...(dash ? { strokeDasharray: dash } : {}),
    targetMarker: {
      type: 'path',
      d: 'M 18 -9 0 0 18 9 Z',
      fill: color,
      stroke: color
    }
  };
  const existingLink = findExistingStyledLink({
    fromId: from.id,
    targetId: targetCell.id,
    lineAttrs,
  });
  if (existingLink) return;

  createHeaderPortLink({ from, to: targetCell, lineAttrs });
}

function createSampledLink({ from, toName, allowedTypes, color, width, dash }) {
  const targetCell = findOrCreateTargetCell({ from, toName, allowedTypes });
  if (!targetCell) return;

  const lineAttrs = {
    stroke: color,
    strokeWidth: width,
    ...(dash ? { strokeDasharray: dash } : {}),
    targetMarker: {
      type: 'path',
      d: 'M 18 -9 0 0 18 9',
      stroke: color,
      'stroke-width': width,
      fill: 'none'
    }
  };
  const existingLink = findExistingStyledLink({
    fromId: from.id,
    targetId: targetCell.id,
    lineAttrs,
  });
  if (existingLink) return;

  createHeaderPortLink({ from, to: targetCell, lineAttrs });
}

function createReferenceLink({ from, to, allowedTypes, color, width }) {
  let targetCell = null;
  if (typeof to === 'object' && to.id) {
    targetCell = to;
  } else if (typeof to === 'string') {
    targetCell = findOrCreateTargetCell({ from, toName: to, allowedTypes });
  }
  if (!targetCell) return;

  const lineAttrs = {
    stroke: color,
    strokeWidth: width,
    targetMarker: {
      type: 'path',
      d: 'M 18 -9 0 0 18 9 Z',
      fill: color,
      stroke: color
    }
  };
  const existingLink = findExistingStyledLink({
    fromId: from.id,
    targetId: targetCell.id,
    lineAttrs,
  });
  if (existingLink) return;
 
  const references = (from.get("data") && from.get("data").feature_data && Array.isArray(from.get("data").feature_data.references)) ? from.get("data").feature_data.references : [];
  let labelRef = null;
  if (references.length > 0) {
    const targetName = (targetCell && targetCell.get && targetCell.get("data") && typeof targetCell.get("data").name === "string") ? targetCell.get("data").name : undefined;
    labelRef = references.find(ref => ref && typeof ref.referenced_type === "string" && ref.referenced_type === targetName) || references.find(ref => ref && typeof ref.name === "string") || references[0];
  }
  let labelText = (labelRef && typeof labelRef.name === "string") ? labelRef.name : '';
  if (labelRef && labelRef.scope === 'valid_time_period') {
    labelText += ' (T)';
  }
  const labels = labelText ? [{
    attrs: {
      text: { text: labelText, fontSize: 16, fontWeight: 'bold' }
    },
    position: { distance: -40, offset: 20 }
  }] : [];

  createHeaderPortLink({ from, to: targetCell, lineAttrs, labels });
}

function handleElementLinks(element, nodeType) {
  ensureCatalogContainsElement(element);
  // --- NEW: Check if this element is a TARGET of any existing links in the diagram ---
  const data = element.get("data");
  const name = data && data.name;
  if (name) {
    graph.getCells().forEach((cell) => {
      if (!cell.isElement || !cell.isElement() || cell.id === element.id) return;
      const cellData = cell.get("data");
      if (!cellData) return;
      // Check for platform links
      if (cellData.type === "process_type" && cellData.process_data && cellData.process_data.platform && cellData.process_data.platform.feature_type === name) {
        createPlatformLink({
          from: cell,
          toName: name,
          allowedTypes: ["feature_type", "spatial_sampling_feature_type"],
          color: "#000",
          width: 3
        });
      }
    });
  }
  // --- LINK: Platform ---
  if (nodeType === "process_type") {
    const processData = element.get("data").process_data;
    if (processData && processData.platform && processData.platform.feature_type) {
      createPlatformLink({
        from: element,
        toName: processData.platform.feature_type,
        allowedTypes: ["feature_type", "spatial_sampling_feature_type"],
        color: "#000",
        width: 3
      });
    }
    // --- LINK: shared_feature_of_interest_type ---
    if (processData && processData.shared_feature_of_interest_type) {
      createSharedLink({
        from: element,
        toName: processData.shared_feature_of_interest_type,
        allowedTypes: ["feature_type", "spatial_sampling_feature_type", "specimen_feature_type"],
        color: "#000",
        width: 3,
        dash: "10,2"
      });
    }
  }

  // --- LINK: sampled_feature_type ---
  if (nodeType === "spatial_sampling_feature_type" || nodeType === "specimen_feature_type" || nodeType === "process_type") {
    let dataKey = null;
    let sampledFeatureType = null;
    if (nodeType === "spatial_sampling_feature_type") {
      dataKey = "spatial_sampling_data";
      sampledFeatureType = element.get("data")[dataKey]?.sampled_feature_type;
    } else if (nodeType === "specimen_feature_type") {
      dataKey = "specimen_feature_data";
      sampledFeatureType = element.get("data")[dataKey]?.sampled_feature_type;
    } else if (nodeType === "process_type") {
      dataKey = "process_data";
      sampledFeatureType = element.get("data")[dataKey]?.generated_feature_of_interest_type?.sampled_feature_type;
    }
    if (sampledFeatureType) {
      createSampledLink({
        from: element,
        toName: sampledFeatureType,
        allowedTypes: ["feature_type", "spatial_sampling_feature_type", "process_type"],
        color: "#000",
        width: 3,
        dash: "2,4"
      });
    }
  }

  // --- LINK: shared_sampling_location_type (specimen) ---
  if (nodeType === "specimen_feature_type") {
    const specimenData = element.get("data").specimen_feature_data;
    if (specimenData && specimenData.shared_sampling_location_type) {
      createSharedLink({
        from: element,
        toName: specimenData.shared_sampling_location_type,
        allowedTypes: ["feature_type", "spatial_sampling_feature_type"],
        color: "#000",
        width: 3,
        dash: "10,2"
      });
    }
  }

  // --- LINK: References ---
  const referenceDataKeys = [["spatial_sampling_feature_type", "spatial_sampling_data"], ["feature_type", "feature_data"], ["specimen_feature_type", "specimen_feature_data"], ["process_type", "process_data"]];
  referenceDataKeys.forEach(([type, dataKey]) => {
    if (nodeType === type) {
      const elementData = element.get("data")[dataKey];
      if (elementData && Array.isArray(elementData.references)) {
        const dataLists = {
          vocabulary: vocabularies,
          enumeration_data_type: enumerationDataTypes,
          complex_data_type: complexDataTypes,
          feature_type: featureTypes,
          spatial_sampling_feature_type: spatialSamplingFeatureTypes,
          specimen_feature_type: specimenFeatureTypes,
          process_type: processTypes,
        };
        elementData.references.forEach((ref) => {
          const targetName = ref.referenced_type || ref.name;
          let targetCell = graph.getCells().find((cell) => {
            const data = cell.get("data");
            return data && data.name === targetName;
          });

          let targetType;
          if (!targetCell) {
            let targetData;
            for (const [typeKey, list] of Object.entries(dataLists)) {
              const found = list.find((item) => item.name === targetName);
              if (found) {
                targetData = found;
                targetType = typeKey;
                break;
              }
            }
            if (targetData && elementCreators[targetType]) {
              const pos = element.position();
              const x = pos.x + 300;
              const y = pos.y;
              targetCell = elementCreators[targetType](x, y, targetData);
              graph.addCell(targetCell);
            }
          } else {
            const data = targetCell.get("data");
            if (data && data.type) {
              targetType = data.type;
            }
          }
          if (targetCell) {
            const existingLink = graph.getCells().find((cell) => {
              if (cell.get("type") === "standard.Link") {
                const source = cell.get("source");
                const target = cell.get("target");
                return source.id === element.id && target.id === targetCell.id;
              }
              return false;
            });
            if (!existingLink) {
              createReferenceLink({
                from: element,
                to: targetCell,
                allowedTypes: [targetType],
                color: '#000',
                width: 3,
              });
            }
          }
        });
      }
    }
  });
}

function ensureCatalogContainsElement(element) {
  const data = element.get("data");
  if (!data || !data.type || !data.name) return;
  const listMap = {
    vocabulary: vocabularies,
    enumeration_data_type: enumerationDataTypes,
    complex_data_type: complexDataTypes,
    feature_type: featureTypes,
    spatial_sampling_feature_type: spatialSamplingFeatureTypes,
    specimen_feature_type: specimenFeatureTypes,
    process_type: processTypes,
  };
  const list = listMap[data.type];
  if (Array.isArray(list) && !list.find((item) => item.name === data.name)) {
    list.push(data);
    if (typeof saveAllData === "function") {
      saveAllData();
    }
  }
}

function updateLinksForExistingCells(newCell) {
  graph.getCells().forEach((cell) => {
    if (cell.id === newCell.id) return;
    if (cell.isElement && cell.isElement()) {
      const data = cell.get("data");
      if (data && data.type && typeof window.handleElementLinks === "function") {
        window.handleElementLinks(cell, data.type);
      }
    }
  });
}

window.updateLinksForExistingCells = updateLinksForExistingCells;

function onDropNode(event) {
  event.preventDefault();
  const nodeType = event.dataTransfer.getData("nodetype");
  const nodeName = event.dataTransfer.getData("name");
  const cells = graph.getCells();
  for (const cell of cells) {
    const data = cell.get("data");
    if (data && data.name === nodeName && data.type === nodeType) {
      showNotification("The element '" + nodeName + "' already exists in the diagram.");
      return;
    }
  }
  const rect = paper.el.getBoundingClientRect();
  const posX = (event.clientX - rect.left) / paper.scale().sx;
  const posY = (event.clientY - rect.top) / paper.scale().sy;
  let element;
  if (elementCreators[nodeType]) {
    let item;
    switch (nodeType) {
      case "vocabulary":
        item = vocabularies.find((v) => v.name === nodeName);
        break;
      case "enumeration_data_type":
        item = enumerationDataTypes.find((e) => e.name === nodeName);
        break;
      case "complex_data_type":
        item = complexDataTypes.find((c) => c.name === nodeName);
        break;
      case "feature_type":
        item = featureTypes.find((f) => f.name === nodeName);
        break;
      case "spatial_sampling_feature_type":
        item = spatialSamplingFeatureTypes.find((s) => s.name === nodeName);
        break;
      case "specimen_feature_type":
        item = specimenFeatureTypes.find((s) => s.name === nodeName);
        break;
      case "process_type":
        item = processTypes.find((p) => p.name === nodeName);
        break;
      default:
        break;
    }
    if (!item) {
      showNotification("Element of type '" + nodeType + "' with name '" + nodeName + "' not found.");
      return;
    }
    element = elementCreators[nodeType](posX, posY, item);
  } else {
    element = new joint.shapes.standard.Rectangle({
      position: { x: posX, y: posY },
      size: { width: 120, height: 40 },
      attrs: {
        body: { fill: "#eeeeee", stroke: "#cccccc", rx: 4, ry: 4 },
        label: { text: nodeName, fill: "#000000", fontSize: 14 },
      },
    });
    element.set("data", { type: nodeType, name: nodeName });
  }
  graph.addCell(element);
  updateLinksForExistingCells(element);
}

function calculateBodyHeight(text, lineHeight = 15, bodyMargin = 10, minHeight = 40) {
  const lines = text.split("\n");
  return Math.max(minHeight, lines.length * lineHeight + bodyMargin * 2);
}

function calculateTextWidth(text, font) {
  const canvas =
    calculateTextWidth.canvas ||
    (calculateTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  return context.measureText(text).width;
}

function adjustElementWidth(element) {
  const bodyText = element.attr("bodyText/text") || "";
  const bodyFontSize = element.attr("bodyText/fontSize") || 14;
  const bodyFontFamily = element.attr("bodyText/fontFamily") || "sans-serif";
  const bodyFont = bodyFontSize + "px " + bodyFontFamily;
  const bodyLines = bodyText.split("\n");
  let bodyMaxWidth = 0;
  bodyLines.forEach((line) => {
    const w = calculateTextWidth(line, bodyFont);
    if (w > bodyMaxWidth) bodyMaxWidth = w;
  });
  const bodyLeftPad = 10;
  const bodyRightPad = 10;
  const requiredBodyWidth = bodyMaxWidth + bodyLeftPad + bodyRightPad;

  const headerText = element.attr("titleText/text") || "";
  const headerFontSize = element.attr("titleText/fontSize") || 16;
  const headerFontFamily = element.attr("titleText/fontFamily") || "sans-serif";
  const headerFont = headerFontSize + "px " + headerFontFamily;
  const headerTextWidth = calculateTextWidth(headerText, headerFont);
  const titleOffset = parseFloat(element.attr("titleText/refX")) || 0;
  const textIconGap = 16;
  const iconWidth = parseInt(element.attr("icon/width")) || 0;
  const iconRightPad = 10;
  const requiredHeaderWidth =
    titleOffset + headerTextWidth + textIconGap + iconWidth + iconRightPad;

  const minWidth = 100;
  const newWidth = Math.max(requiredBodyWidth, requiredHeaderWidth, minWidth);
  const currentWidth = element.size().width;
  if (Math.abs(newWidth - currentWidth) > 1) {
    element.resize(newWidth, element.size().height);
    element.attr("headerRect/width", newWidth);
    element.attr("bodyRect/width", newWidth);
  }

  if (iconWidth > 0) {
    element.attr("icon/refX", newWidth - iconWidth - iconRightPad);
  }
}

function fixLoadedElements() {
  graph.getCells().forEach(function (cell) {
    if (cell.isElement && cell.isElement()) {
      ensureElementHeaderPorts(cell);
      if (cell.get("type").indexOf("custom.") === 0) {
        adjustElementWidth(cell);
      }
    }
  });
}

function updateDiagramElement(nodeType, oldName, newData) {
  if (typeof graph !== "undefined") {
    graph.getCells().forEach((cell) => {
      const data = cell.get("data");
      if (data && data.name === oldName && data.type === nodeType) {
        newData.type = data.type;
        cell.set("data", newData);
        if (nodeType === "vocabulary") {
          updateVocabularyElement(cell, newData);
        } else if (nodeType === "enumeration_data_type") {
          updateEnumerationDataTypeElement(cell, newData);
        } else if (nodeType === "complex_data_type") {
          updateComplexDataTypeElement(cell, newData);
        } else if (nodeType === "feature_type") {
          updateFeatureTypeElement(cell, newData);
        } else if (nodeType === "spatial_sampling_feature_type") {
          updateSpatialSamplingFeatureTypeElement(cell, newData);
        } else if (nodeType === "specimen_feature_type") {
          updateSpecimenFeatureTypeElement(cell, newData);
        } else if (nodeType === "process_type") {
          updateProcessTypeElement(cell, newData);
        } else {
          cell.attr("label/text", newData.name);
        }
        if (cell.get("type").indexOf("custom.") === 0) {
          adjustElementWidth(cell);
        }
      }
    });
  }
}

window.normalizeDiagramLinksToHeaderPorts = normalizeDiagramLinksToHeaderPorts;
window.relayoutIncidentLinks = relayoutIncidentLinks;
