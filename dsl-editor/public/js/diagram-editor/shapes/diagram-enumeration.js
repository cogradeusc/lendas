joint.shapes.custom.EnumerationDataTypeElement = createCustomElement({
  type: "custom.EnumerationDataTypeElement",
  headerFill: "#ffaa00",
  headerStroke: "#ffaa00",
  bodyFill: "#ffeecc",
  bodyStroke: "#ffaa00",
});

function createEnumerationDataTypeElement(x, y, enumDT) {
  const sections = [];
  if (Array.isArray(enumDT.versions)) {
    enumDT.versions.forEach((version) => {
      if (Array.isArray(version.values)) {
        version.values.forEach((voc) => {
          sections.push({
            version: version.version,
            vocabulary: voc.vocabulary,
            terms: Array.isArray(voc.terms) ? voc.terms : [],
            folded: false,
          });
        });
      }
    });
  }

  const bodyText = formatEnumBodyText(sections);
  let headerHeight = 40;
  let bodyHeight = calculateBodyHeight(bodyText);
  let width = 220;

  const element = new joint.dia.Element({
    type: "custom.EnumerationDataTypeElement",
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
      fill: "#ffaa00",
      stroke: "#ffaa00",
      width,
      height: headerHeight,
      rx: 4,
      ry: 4
    },
    foldButton: {
      fill: "#ffeecc",
      stroke: "#ffaa00",
      width: 22,
      height: 22,
      x: 8,
      y: 9,
      rx: 4,
      ry: 4,
      cursor: "pointer",
      event: "element:foldButton:pointerdown"
    },
    foldButtonIcon: {
      d: "M 4,7 L 11,14 L 18,7",
      stroke: "#aa6600",
      strokeWidth: 2,
      fill: "none",
      transform: "translate(8, 9)",
      pointerEvents: "none"
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
      event: "element:deleteButton:pointerdown"
    },
    deleteButtonIcon: {
      d: "M 6,6 L 16,16 M 16,6 L 6,16",
      stroke: "#aa0000",
      strokeWidth: 2,
      fill: "none",
      transform: "translate(38, 9)",
      pointerEvents: "none"
    },
    titleText: {
      text: enumDT.name || "(no name)",
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
      xlinkHref: "https://icons.getbootstrap.com/assets/icons/list-ul.svg",
      width: 20,
      height: 20,
      ref: "headerRect",
      refX: "80%",
      refY: 10,
      pointerEvents: "none",
    },
    bodyRect: {
      fill: "#ffeecc",
      stroke: "#ffaa00",
      width,
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
      event: "element:version:toggle",
    },
  });

  element.set("data", {
    type: "enumeration_data_type",
    name: enumDT.name,
    enumeration_data: enumDT,
    sections: sections,
  });
  adjustElementWidth(element);
  return element;
}

function formatEnumBodyText(sections) {
  if (!sections || sections.length === 0) {
    return "(no sections)";
  }
  let bodyText = "";
  sections.forEach((section, index) => {
    const foldSymbol = section.folded ? "▶ " : "▼ ";
    if (index > 0) {
      bodyText += SEPARATOR_LINE + "\n";
    }
    bodyText += `${foldSymbol}${section.version}[${section.vocabulary || '(no name)'}]\n`;
    if (!section.folded) {
      if (!section.terms || section.terms.length === 0) {
        bodyText += "   (no terms)\n";
      } else {
        section.terms.forEach(term => {
          bodyText += `   • ${term}\n`;
        });
      }
    }
  });
  return bodyText.trim();
}


function updateEnumerationDataTypeElement(cell, newData) {
  cell.attr("titleText/text", newData.name);

  let sections = cell.get("data").sections || [];
  const newSections = [];
  if (Array.isArray(newData.versions)) {
    newData.versions.forEach((version) => {
      if (Array.isArray(version.values)) {
        version.values.forEach((voc) => {
          const prev = sections.find(s => s.version === version.version && s.vocabulary === voc.vocabulary);
          newSections.push({
            version: version.version,
            vocabulary: voc.vocabulary,
            terms: Array.isArray(voc.terms) ? voc.terms : [],
            folded: prev ? prev.folded : false,
          });
        });
      }
    });
  }
  const bodyText = formatEnumBodyText(newSections);
  cell.attr("bodyText/text", bodyText);
  const headerHeight = 40;
  const bodyHeight = calculateBodyHeight(bodyText);
  cell.resize(cell.size().width, headerHeight + bodyHeight);
  cell.attr("bodyRect/height", bodyHeight);

  const data = cell.get("data");
  data.enumeration_data = newData;
  data.name = newData.name;
  data.sections = newSections;
  cell.set("data", data);
  adjustElementWidth(cell);
}

function toggleEnumVersionFold(cell, y) {
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

  let sectionLineIndex = -1;
  let sectionIndex = -1;
  for (let i = clickedLineIndex; i >= 0; i--) {
    if (lines[i].startsWith('▶ ') || lines[i].startsWith('▼ ')) {
      sectionLineIndex = i;
      break;
    }
  }
  if (sectionLineIndex === -1) return;
  let count = 0;
  for (let i = 0; i <= sectionLineIndex; i++) {
    if (lines[i].startsWith('▶ ') || lines[i].startsWith('▼ ')) {
      count++;
    }
  }
  sectionIndex = count - 1;
  const data = cell.get("data");
  const sections = data.sections;
  if (!sections || sectionIndex >= sections.length) {
    return;
  }
  sections[sectionIndex].folded = !sections[sectionIndex].folded;

  const newBodyText = formatEnumBodyText(sections);
  cell.attr("bodyText/text", newBodyText);

  const bodyHeight = calculateBodyHeight(newBodyText);
  cell.resize(cell.size().width, headerHeight + bodyHeight);
  cell.attr("bodyRect/height", bodyHeight);
  cell.attr('bodyText/opacity', 0.5);
  setTimeout(() => {
    cell.attr('bodyText/opacity', 1);
  }, 150);
}

