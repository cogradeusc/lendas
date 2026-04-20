joint.shapes.custom.VocabularyElement = joint.dia.Element.extend({
  markup: [
    '<rect class="headerRect"/>',
    '<rect class="deleteButton"><title>Remove</title></rect>',
    '<path class="deleteButtonIcon"/>',
    '<text class="titleText"/>',
  ].join(""),
  defaults: joint.util.deepSupplement(
    {
      type: "custom.VocabularyElement",
      ports: buildHeaderPorts({ headerHeight: VOCABULARY_HEADER_HEIGHT }),
      attrs: {
        headerRect: {
          fill: "#ffcc00",
          stroke: "#ffcc00",
          height: VOCABULARY_HEADER_HEIGHT,
          rx: 100,
          ry: 100,
        },
        deleteButton: {
          fill: "#ffeeee",
          stroke: "#aa0000",
          width: 22,
          height: 22,
          x: 8,
          y: 14,
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
          transform: "translate(8, 14)",
          pointerEvents: "none",
        },
        titleText: {
          text: "",
          fill: "#000000",
          fontSize: 16,
          fontWeight: "bold",
          ref: "headerRect",
          refX: 38,
          refY: "50%",
          textAnchor: "start",
          textVerticalAnchor: "middle",
        },
      },
    },
    joint.dia.Element.prototype.defaults
  ),
});

function createVocabularyElement(x, y, vocab) {
  const element = new joint.shapes.custom.VocabularyElement({
    position: { x, y },
    ports: buildHeaderPorts({ headerHeight: VOCABULARY_HEADER_HEIGHT }),
    markup: [
      { tagName: "rect", selector: "headerRect" },
      { tagName: "rect", selector: "deleteButton" },
      { tagName: "path", selector: "deleteButtonIcon" },
      { tagName: "text", selector: "titleText" },
    ],
  });
  element.attr({
    headerRect: {
      rx: 100,
      ry: 100,
    },
    deleteButton: {
      fill: "#ffeeee",
      stroke: "#aa0000",
      width: 22,
      height: 22,
      x: 8,
      y: 14,
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
      transform: "translate(8, 14)",
      pointerEvents: "none",
    },
    titleText: {
      text: vocab.name + " (" + vocab.language + ")",
      refX: 38,
    },
  });
  element.set("data", {
    type: "vocabulary",
    name: vocab.name,
    language: vocab.language,
  });
  adjustElementWidth(element);
  return element;
}

function updateVocabularyElement(cell, newData) {
  cell.attr("titleText/text", newData.name + " (" + newData.language + ")");
}
