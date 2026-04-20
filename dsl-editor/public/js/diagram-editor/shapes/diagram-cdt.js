joint.shapes.custom.ComplexDataTypeElement = createCustomElement({
  type: "custom.ComplexDataTypeElement",
  headerFill: "#ccffcc",
  headerStroke: "#00aa00",
  bodyFill: "#e0ffe0",
  bodyStroke: "#00aa00",
});
function createComplexDataTypeElement(x, y, cdt) {
  const headerHeight = 40;
  const width = 220;
  const versionsData = [];
  if (Array.isArray(cdt.versions)) {
    cdt.versions.forEach((version) => {
      versionsData.push({
        version: version.version,
        fields: version.fields || [],
        folded: false,
      });
    });
  }
  const bodyText = formatBodyText(versionsData);
  const bodyHeight = calculateBodyHeight(bodyText);
  const element = new joint.shapes.custom.ComplexDataTypeElement({
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
      fill: "#ccffcc",
      stroke: "#00aa00",
      width,
      height: headerHeight,
      rx: 4,
      ry: 4,
    },
    foldButton: {
      fill: "#e0ffe0",
      stroke: "#00aa00",
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
      stroke: "#006600",
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
      text: cdt.name || "(no name)",
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
      xlinkHref: "https://icons.getbootstrap.com/assets/icons/box.svg",
      width: 20,
      height: 20,
      ref: "headerRect",
      refX: "80%",
      refY: 10,
      pointerEvents: "none",
    },
    bodyRect: {
      fill: "#e0ffe0",
      stroke: "#00aa00",
      width,
      height: bodyHeight,
      x: 0,
      y: headerHeight,
      rx: 4,
      ry: 0,
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
    type: "complex_data_type",
    name: cdt.name,
    complex_data: cdt,
    versions: versionsData,
  });
  adjustElementWidth(element);
  return element;
}

function formatBodyText(versionsData) {
  if (!versionsData || versionsData.length === 0) {
    return "(no versions)";
  }
  let bodyText = "";
  versionsData.forEach((version, index) => {
    const foldSymbol = version.folded ? "▶ " : "▼ ";
    if (index > 0) {
      bodyText += SEPARATOR_LINE + "\n";
    }
    bodyText += `${foldSymbol}${version.version}\n`;
    
    if (!version.folded && Array.isArray(version.fields)) {
      if (version.fields.length === 0) {
        bodyText += "   (sin campos)\n";
      } else {
        version.fields.forEach((field) => {
          bodyText += "   ○ " + field.name + ": " + field.data_type;
          if (field.hasOwnProperty("repeated") && field.repeated) {
            bodyText += " [ ]";
          }
          bodyText += "\n";
        });
      }
    }
  });
  return bodyText.trim();
}

function updateComplexDataTypeElement(cell, newData) {
  cell.attr("titleText/text", newData.name);
  let versionsData = cell.get("data").versions || [];
  if (
    JSON.stringify(versionsData.map((v) => v.version)) !==
    JSON.stringify(newData.versions.map((v) => v.version))
  ) {
    versionsData = newData.versions.map((version) => ({
      version: version.version,
      fields: version.fields || [],
      folded: false,
    }));
  } else {
    versionsData.forEach((versionData, i) => {
      const newVersion = newData.versions.find(
        (v) => v.version === versionData.version
      );
      if (newVersion) {
        versionData.fields = newVersion.fields || [];
      }
    });
  }
  const bodyText = formatBodyText(versionsData);
  cell.attr("bodyText/text", bodyText);
  const headerHeight = 40;
  const bodyHeight = calculateBodyHeight(bodyText);
  cell.resize(cell.size().width, headerHeight + bodyHeight);
  cell.attr("bodyRect/height", bodyHeight);
  const data = cell.get("data");
  data.complex_data = newData;
  data.name = newData.name;
  data.versions = versionsData;
  cell.set("data", data);
  adjustElementWidth(cell);
}

function toggleVersionFold(cell, y) {
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

  let versionLineIndex = -1;
  let versionIndex = -1;
  for (let i = clickedLineIndex; i >= 0; i--) {
    if (lines[i].startsWith('▶ ') || lines[i].startsWith('▼ ')) {
      versionLineIndex = i;
      break;
    }
  }
  if (versionLineIndex === -1) return;
  let count = 0;
  for (let i = 0; i <= versionLineIndex; i++) {
    if (lines[i].startsWith('▶ ') || lines[i].startsWith('▼ ')) {
      count++;
    }
  }
  versionIndex = count - 1;
  const data = cell.get("data");
  const versionsData = data.versions;
  if (!versionsData || versionIndex >= versionsData.length) {
    return;
  }
  versionsData[versionIndex].folded = !versionsData[versionIndex].folded;

  const newBodyText = formatBodyText(versionsData);
  cell.attr("bodyText/text", newBodyText);

  const bodyHeight = calculateBodyHeight(newBodyText);
  cell.resize(cell.size().width, headerHeight + bodyHeight);
  cell.attr("bodyRect/height", bodyHeight);

  cell.attr('bodyText/opacity', 0.5);
  setTimeout(() => {
    cell.attr('bodyText/opacity', 1);
  }, 150);
}

