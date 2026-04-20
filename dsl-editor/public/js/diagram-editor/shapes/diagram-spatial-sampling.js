joint.shapes.custom.SpatialSamplingFeatureTypeElement = createCustomElement({
  type: "custom.SpatialSamplingFeatureTypeElement",
  headerFill: "#ffe6ff",
  headerStroke: "#cc00cc",
  bodyFill: "#fff0ff",
  bodyStroke: "#cc00cc",
});

function createSpatialSamplingFeatureTypeElement(x, y, ssft) {
  let propertiesText = "";
  if (Array.isArray(ssft.properties)) {
    ssft.properties.forEach((prop) => {
      let propLabel = '';
      if (prop.scope === 'valid_time_period') {
        propLabel = prop.name + "(T): " + prop.data_type;
      } else {
        propLabel = prop.name + ": " + prop.data_type;
      }
      if (prop.hasOwnProperty("repeated") && prop.repeated) {
        propLabel += " [*]";
      }
      propertiesText += propLabel + "\n";
    });
  }
  propertiesText = propertiesText.trim() || "(no properties)";

  let shapeInfo =
    (ssft.shape_type || "(none)") +
    " : [" +
    (ssft.shape_crs || "(none)") +
    "]\n" +
    (ssft.height_type || "(none)") +
    " : [" +
    (ssft.height_crs || "(none)") +
    "]\n" + SEPARATOR_LINE + "\n";

  let bodyText = shapeInfo + propertiesText;

  const headerHeight = 40;
  const bodyHeight = calculateBodyHeight(bodyText);
  const width = 220;

  const element = new joint.shapes.custom.SpatialSamplingFeatureTypeElement({
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
      fill: "#ffe6ff",
      stroke: "#cc00cc",
      width,
      height: headerHeight,
      rx: 4,
      ry: 4,
    },
    foldButton: {
      fill: "#fff0ff",
      stroke: "#cc00cc",
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
      stroke: "#990099",
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
      text: ssft.name || "(no name)",
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
      xlinkHref: "https://icons.getbootstrap.com/assets/icons/geo.svg",
      width: 20,
      height: 20,
      ref: "headerRect",
      refX: "80%",
      refY: 10,
      pointerEvents: "none",
    },
    bodyRect: {
      fill: "#fff0ff",
      stroke: "#cc00cc",
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
    },
  });

  element.set("data", {
    type: "spatial_sampling_feature_type",
    name: ssft.name,
    spatial_sampling_data: ssft,
  });
  adjustElementWidth(element);
  return element;
}

function updateSpatialSamplingFeatureTypeElement(cell, newData) {
  cell.attr("titleText/text", newData.name);
  
  let propertiesText = "";
  if (Array.isArray(newData.properties)) {
    newData.properties.forEach((prop) => {
      let propLabel = '';
      if (prop.scope === 'valid_time_period') {
        propLabel = prop.name + "(T): " + prop.data_type;
      } else {
        propLabel = prop.name + ": " + prop.data_type;
      }
      if (prop.hasOwnProperty("repeated") && prop.repeated) {
        propLabel += " [*]";
      }
      propertiesText += propLabel + "\n";
    });
  }
  propertiesText = propertiesText.trim() || "(no properties)";

  let shapeInfo =
    (newData.shape_type || "(none)") +
    " : [" +
    (newData.shape_crs || "(none)") +
    "]\n" +
    (newData.height_type || "(none)") +
    " : [" +
    (newData.height_crs || "(none)") +
    "]\n" + SEPARATOR_LINE + "\n";

  let bodyText = shapeInfo + propertiesText;
  
  cell.attr("bodyText/text", bodyText);
  const headerHeight = 40;
  const bodyHeight = calculateBodyHeight(bodyText);
  cell.resize(cell.size().width, headerHeight + bodyHeight);
  cell.attr("bodyRect/height", bodyHeight);
  
  // Actualizar datos internos
  cell.set("data", {
    type: "spatial_sampling_feature_type",
    name: newData.name,
    spatial_sampling_data: newData
  });
  
  adjustElementWidth(cell);
}
