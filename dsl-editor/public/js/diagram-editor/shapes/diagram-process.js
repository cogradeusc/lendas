joint.shapes.custom.ProcessTypeElement = createCustomElement({
  type: "custom.ProcessTypeElement",
  headerFill: "#ffdcdc",
  headerStroke: "#ff5555",
  bodyFill: "#ffe6e6",
  bodyStroke: "#ff5555",
});

function createProcessSections(data, prevSections = [], observedPropertiesOverride = null) {
  const observedProps = observedPropertiesOverride !== null ? observedPropertiesOverride : data.observed_properties || [];
  return [
    {
      name: "Time and Space",
      id: "s_0",
      folded: false,
      content: formatTimeSpaceSection(data),
    },
    {
      name: "Properties",
      id: "s_1",
      folded: prevSections[1] ? prevSections[1].folded : false,
      content: formatPropertiesSection(data.properties || []),
    },
    {
      name: "Observed Properties",
      id: "s_2",
      folded: prevSections[2] ? prevSections[2].folded : false,
      content: formatObservedPropertiesSection(observedProps),
    },
  ];
}

function createProcessTypeElement(x, y, pr) {
  const headerHeight = 40;
  const width = 220;

  const sections = createProcessSections(pr);
  const bodyText = formatProcessBodyText(sections);
  const bodyHeight = calculateBodyHeight(bodyText);

  const element = new joint.shapes.custom.ProcessTypeElement({
    position: { x, y },
    size: { width, height: headerHeight + bodyHeight },
    folded: false,
    ports: buildHeaderPorts({ headerHeight }),
    markup: [
      { tagName: "rect", selector: "headerRect" },
      { tagName: "rect", selector: "foldButton" },
      { tagName: "path", selector: "foldButtonIcon" },
      { tagName: "rect", selector: "deleteButton" },
      { tagName: "path", selector: "deleteButtonIcon" },
      { tagName: "text", selector: "titleText" },
      { tagName: "image", selector: "icon" },
      { tagName: "rect", selector: "bodyRect" },
      { tagName: "text", selector: "bodyText" },
    ],
  });

  element.attr({
    headerRect: {
      fill: "#ffdcdc",
      stroke: "#ff5555",
      width: width,
      height: headerHeight,
      rx: 4,
      ry: 4,
    },
    foldButton: {
      fill: "#ffe6e6",
      stroke: "#ff5555",
      width: 22,
      height: 22,
      x: 8,
      y: 9,
      rx: 4,
      ry: 4,
      cursor: "pointer",
      event: "element:foldButton:pointerdown",
    },
    foldButtonIcon: {
      d: "M 4,7 L 11,14 L 18,7",
      stroke: "#cc3333",
      strokeWidth: 2,
      fill: "none",
      transform: "translate(8, 9)",
      pointerEvents: "none",
    },
    deleteButton: {
      fill: "#ffeeee",
      stroke: "#aa0000",
      width: 22,
      height: 22,
      x: 38,
      y: 9,
      rx: 4,
      ry: 4,
      cursor: "pointer",
      event: "element:deleteButton:pointerdown",
    },
    deleteButtonIcon: {
      d: "M 6,6 L 16,16 M 16,6 L 6,16",
      stroke: "#aa0000",
      strokeWidth: 2,
      fill: "none",
      transform: "translate(38, 9)",
      pointerEvents: "none",
    },
    titleText: {
      text: pr.name || "(no name)",
      fill: "#000000",
      fontSize: 16,
      fontWeight: "bold",
      ref: "headerRect",
      refX: 68,
      refY: "50%",
      textAnchor: "start",
      textVerticalAnchor: "middle",
    },
    icon: {
      xlinkHref: "https://icons.getbootstrap.com/assets/icons/gear-wide-connected.svg",
      width: 20,
      height: 20,
      ref: "headerRect",
      refX: "80%",
      refY: 10,
      pointerEvents: "none",
    },
    bodyRect: {
      fill: "#ffe6e6",
      stroke: "#ff5555",
      width: width,
      height: bodyHeight,
      x: 0,
      y: headerHeight,
    },
    bodyText: {
      text: bodyText,
      fill: "#000000",
      fontSize: 14,
      ref: "bodyRect",
      refX: 10,
      refY: 10,
      textAnchor: "left",
      textVerticalAnchor: "top",
      pointerEvents: "all",
      event: "element:section:pointerdown",
    },
  });

  element.set("data", {
    type: "process_type",
    name: pr.name,
    process_data: pr,
    sections: sections,
  });
  adjustElementWidth(element);
  return element;
}

const SECTION_ID_PREFIX = 's-';
const OBSERVED_PROP_PREFIX = 'op-';

function formatPropertiesSection(properties) {
  if (!properties || properties.length === 0) {
    return "";
  }
  return properties.map(prop => {
    let propLabel = '';
    if (prop.scope === 'valid_time_period') {
      propLabel = `   ○ ${prop.name}(T): ${prop.data_type}`;
    } else {
      propLabel = `   ○ ${prop.name}: ${prop.data_type}`;
    }
    if (prop.hasOwnProperty("repeated") && prop.repeated) {
      propLabel += " [*]";
    }
    return propLabel;
  }).join('\n');
}

function formatTimeSpaceSection(process) {
  const lines = [];
  lines.push(`   ○ result_time: ${process.result_time_type || "undefined"}`);
  lines.push(`   ○ phenomenon_time: ${process.phenomenon_time_type || "undefined"}`);

  const foi = process.generated_feature_of_interest_type || {};
  const shape_type = foi.shape_type || '';
  const shape_crs = foi.shape_crs || '';
  if (shape_type && shape_crs) {
    lines.push(`   ○ shape: ${shape_type} (${shape_crs})`);
  }
  const height_type = foi.height_type || '';
  const height_crs = foi.height_crs || '';
  if (height_type && height_crs) {
    lines.push(`   ○ height: ${height_type} (${height_crs})`);
  }

  return lines.join('\n');
}

function formatObservedPropertiesSection(observedProperties) {
  if (!observedProperties || observedProperties.length === 0) {
    return "";
  }  
  function scopeSuffix(scope) {
    if (scope === "continuous_coverage") return "C";
    if (scope === "discrete_coverage") return "D";
    return "";
  }
  return observedProperties.map((op, index) => {
    let scopes = [];
    let sampleScopes = [];
    const t = scopeSuffix(op.temporal_scope);
    if (t && op.sampling_time_type) scopes.push(`T${t}:${op.sampling_time_type}`);
    else if (t) scopes.push(`T${t}`);
    if (op.temporal_scope === 'sample' && op.sampling_time_type) sampleScopes.push(`T:${op.sampling_time_type}`);
    const g = scopeSuffix(op.geospatial_scope);
    if (g && op.sampling_geometry_type) scopes.push(`G${g}:${op.sampling_geometry_type}`);
    else if (g) scopes.push(`G${g}`);
    if (op.geospatial_scope === 'sample' && op.sampling_geometry_type) sampleScopes.push(`G:${op.sampling_geometry_type}`);
    const h = scopeSuffix(op.height_scope);
    if (h && op.sampling_height_type) scopes.push(`H${h}:${op.sampling_height_type}`);
    else if (h) scopes.push(`H${h}`);
    if (op.height_scope === 'sample' && op.sampling_height_type) sampleScopes.push(`H:${op.sampling_height_type}`);

    let scopesStr = "";
    if (scopes.length > 0 && sampleScopes.length > 0) {
      scopesStr = `(${scopes.join(",")} | ${sampleScopes.join(",")})`;
    } else if (scopes.length > 0) {
      scopesStr = `(${scopes.join(",")})`;
    } else if (sampleScopes.length > 0) {
      scopesStr = `(${sampleScopes.join(",")})`;
    }

    let propLabel = `   ○ ${op.name}${scopesStr}: ${op.data_type}`;
    if (op.hasOwnProperty("repeated") && op.repeated) {
      propLabel += " [*]";
    }
    let content = [propLabel];
    
    if (op.folded) {
      content.push("     ...");
    } else if (Array.isArray(op.elements)) {
      const elementTexts = op.elements.map(elem => {
        const repeatedMark = (elem.hasOwnProperty("repeated") && elem.repeated) ? " [*]" : "";
        return `     • ${elem.name}: ${elem.data_type}${repeatedMark}`;
      });
      content = content.concat(elementTexts);
    } else {
      content.push("");
    }    
    return content.join('\n');
  }).join('');
}

function getHiddenSectionId(id) {
  return `[${id}]`;
}

function formatProcessBodyText(sections) {
  if (!sections || sections.length === 0) {
    return "";
  }
  const parts = [];
  parts.push(sections[0].content);
  parts.push(SEPARATOR_LINE);
  const section1 = sections[1];
  const foldSymbol1 = section1.folded ? FOLD_SYMBOLS.FOLDED : FOLD_SYMBOLS.UNFOLDED;
  parts.push(`${foldSymbol1}Properties`);
  if (!section1.folded) {
    parts.push(section1.content);
  }
  parts.push(SEPARATOR_LINE);
  const section2 = sections[2];
  const foldSymbol2 = section2.folded ? FOLD_SYMBOLS.FOLDED : FOLD_SYMBOLS.UNFOLDED;
  parts.push(`${foldSymbol2}Observed Properties`);
  if (!section2.folded) {
    parts.push(section2.content);
  }
  return parts.join('\n');
}

function updateProcessTypeElement(cell, newData) {
  cell.attr("titleText/text", newData.name);

  let sections = cell.get("data").sections || [];
  const oldData = cell.get("data").process_data || {};

  const observedProperties = (newData.observed_properties || []).map(
    (op) => {
      const oldOpIndex = (oldData.observed_properties || []).findIndex((oldOp) => oldOp.name === op.name);
      const folded = oldOpIndex >= 0 && oldData.observed_properties[oldOpIndex].folded ? oldData.observed_properties[oldOpIndex].folded : false;
      return { ...op, folded };
    }
  );

  sections = createProcessSections(newData, sections, observedProperties);

  const bodyText = formatProcessBodyText(sections);
  cell.attr("bodyText/text", bodyText);

  const headerHeight = 40;
  const bodyHeight = calculateBodyHeight(bodyText);
  cell.resize(cell.size().width, headerHeight + bodyHeight);
  cell.attr("bodyRect/height", bodyHeight);

  const data = cell.get("data");
  newData.observed_properties = observedProperties;
  data.process_data = newData;
  data.name = newData.name;
  data.sections = sections;
  cell.set("data", data);

  adjustElementWidth(cell);
}

function toggleSectionFold(cell, y) {
  const bodyText = cell.attr("bodyText/text");
  const lines = bodyText.split("\n");
  const lineHeight = 15;
  const headerHeight = 40;
  const bodyY = 10;
  const clickY = y - headerHeight - bodyY;
  const clickedLineIndex = Math.floor(clickY / lineHeight);

  if (clickedLineIndex < 0 || clickedLineIndex >= lines.length) {
    return;
  }

  const clickedLine = lines[clickedLineIndex];
  const data = cell.get("data");

  if (clickedLine.trim().startsWith(FOLD_SYMBOLS.FOLDED + 'Properties') || clickedLine.trim().startsWith(FOLD_SYMBOLS.UNFOLDED + 'Properties')) {
    const sectionIndex = 1;
    data.sections[sectionIndex].folded = !data.sections[sectionIndex].folded;
    
    const newBodyText = formatProcessBodyText(data.sections);
    cell.attr("bodyText/text", newBodyText);
    
    const bodyHeight = calculateBodyHeight(newBodyText);
    cell.resize(cell.size().width, headerHeight + bodyHeight);
    cell.attr("bodyRect/height", bodyHeight);
    
    cell.attr('bodyText/opacity', 0.5);
    setTimeout(() => {
      cell.attr('bodyText/opacity', 1);
    }, 150);
    return;
  }

  if (clickedLine.trim().startsWith(FOLD_SYMBOLS.FOLDED + 'Observed Properties') || clickedLine.trim().startsWith(FOLD_SYMBOLS.UNFOLDED + 'Observed Properties')) {
    const sectionIndex = 2;
    data.sections[sectionIndex].folded = !data.sections[sectionIndex].folded;
    
    const newBodyText = formatProcessBodyText(data.sections);
    cell.attr("bodyText/text", newBodyText);
    
    const bodyHeight = calculateBodyHeight(newBodyText);
    cell.resize(cell.size().width, headerHeight + bodyHeight);
    cell.attr("bodyRect/height", bodyHeight);
    
    cell.attr('bodyText/opacity', 0.5);
    setTimeout(() => {
      cell.attr('bodyText/opacity', 1);
    }, 150);
    return;
  }

  const observedPropMatch = clickedLine.match(new RegExp(`\\[${OBSERVED_PROP_PREFIX}(\\d+)\\]`));
  if (observedPropMatch) {
    const opIndex = parseInt(observedPropMatch[1]);
    const processData = data.process_data;

    if (!processData.observed_properties || opIndex >= processData.observed_properties.length) {
      return;
    }

    processData.observed_properties[opIndex].folded = !processData.observed_properties[opIndex].folded;
    data.sections[2].content = formatObservedPropertiesSection(processData.observed_properties);
    
    const newBodyText = formatProcessBodyText(data.sections);
    cell.attr("bodyText/text", newBodyText);
    
    const bodyHeight = calculateBodyHeight(newBodyText);
    cell.resize(cell.size().width, headerHeight + bodyHeight);
    cell.attr("bodyRect/height", bodyHeight);
    
    cell.attr('bodyText/opacity', 0.5);
    setTimeout(() => {
      cell.attr('bodyText/opacity', 1);
    }, 150);
  }
}

