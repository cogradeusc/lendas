joint.shapes.custom.SpecimenFeatureTypeElement = createCustomElement({
  type: "custom.SpecimenFeatureTypeElement",
  headerFill: "#ccccff",
  headerStroke: "#0000cc",
  bodyFill: "#e6e6ff",
  bodyStroke: "#0000cc",
});


function getSpecimenBodyText(data) {
  const isShared = data.shared_sampling_location_type && data.shared_sampling_location_type.trim() !== "";

  let section1 = "";
  if (Array.isArray(data.properties)) {
    data.properties.forEach((prop) => {
      let propLabel = '';
      if (prop.scope === 'valid_time_period') {
        propLabel = prop.name + "(T): " + prop.data_type;
      } else {
        propLabel = prop.name + ": " + prop.data_type;
      }
      if (prop.hasOwnProperty("repeated") && prop.repeated) {
        propLabel += " [*]";
      }
      section1 += propLabel + "\n";
    });
  }
  section1 = section1.trim() || "(no properties)";

  let section2 = "";
  if (typeof data.sampling_time_extension === "string" && data.sampling_time_extension.trim() !== "") {
    section2 = data.sampling_time_extension;
  }

  // When shared sampling location is set, only show properties and sampling_time_extension
  if (isShared) {
    if (section2) {
      return section1 + "\n" + SEPARATOR_LINE + "\n" + section2;
    }
    return section1;
  }

  // Only show section3 if generated_sampling_location_type has meaningful data
  let section3 = "";
  if (data.generated_sampling_location_type) {
    const g = data.generated_sampling_location_type;
    const shapePart = (g.shape_type && g.shape_type.trim()) ? `${g.shape_type.trim()}: [${g.shape_crs || ''}]` : '';
    const heightPart = (g.height_type && g.height_type.trim()) ? `${g.height_type.trim()}: [${g.height_crs || ''}]` : '';
    if (shapePart && heightPart) {
      section3 = shapePart + "\n" + heightPart;
    } else if (shapePart) {
      section3 = shapePart;
    } else if (heightPart) {
      section3 = heightPart;
    }
  }

  const parts = [section1];
  if (section2 || section3) {
    parts.push(SEPARATOR_LINE);
    if (section2) parts.push(section2);
    if (section2 && section3) parts.push(SEPARATOR_LINE);
    if (section3) parts.push(section3);
  }

  return parts.join('\n');
}

function createSpecimenFeatureTypeElement(x, y, sft) {
  let bodyText = getSpecimenBodyText(sft);

  const headerHeight = 40;
  const bodyHeight = calculateBodyHeight(bodyText);
  const width = 220;

  const element = new joint.shapes.custom.SpecimenFeatureTypeElement({
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
      fill: "#ccccff",
      stroke: "#0000cc",
      width: width,
      height: headerHeight,
      rx: 4,
      ry: 4,
    },
    foldButton: {
      fill: "#e6e6ff",
      stroke: "#0000cc",
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
      stroke: "#0000aa",
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
      text: sft.name || "(no name)",
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
      xlinkHref: "https://icons.getbootstrap.com/assets/icons/collection.svg",
      width: 20,
      height: 20,
      ref: "headerRect",
      refX: "80%",
      refY: 10,
      pointerEvents: "none",
    },
    bodyRect: {
      fill: "#e6e6ff",
      stroke: "#0000cc",
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
    },
  });

  element.set("data", {
    type: "specimen_feature_type",
    name: sft.name,
    specimen_feature_data: sft,
  });
  adjustElementWidth(element);
  return element;
}

function updateSpecimenFeatureTypeElement(cell, newData) {
  cell.attr("titleText/text", newData.name);
  let bodyText = getSpecimenBodyText(newData);
  cell.attr("bodyText/text", bodyText);
  const headerHeight = 40;
  const bodyHeight = calculateBodyHeight(bodyText);
  cell.resize(cell.size().width, headerHeight + bodyHeight);
  cell.attr("bodyRect/height", bodyHeight);
  adjustElementWidth(cell);
}
