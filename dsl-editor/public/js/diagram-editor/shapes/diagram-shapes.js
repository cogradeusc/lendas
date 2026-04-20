joint.shapes.custom = joint.shapes.custom || {};

const DEFAULT_HEADER_HEIGHT = 40;
const VOCABULARY_HEADER_HEIGHT = 50;
const HEADER_PORT_COUNTS = {
  top: 5,
  left: 3,
  right: 3,
};
const HEADER_PORT_RADIUS = 4;
const HEADER_PORT_GROUPS = ["top", "left", "right"];

const SEPARATOR_LINE = '──────────────────';
const FOLD_SYMBOLS = {
  FOLDED: '▶  ',
  UNFOLDED: '▼  '
};

function createHeaderPortMarkup() {
  return [{
    tagName: "circle",
    selector: "portBody",
  }];
}

function createHeaderPortAttrs() {
  return {
    portBody: {
      magnet: true,
      r: HEADER_PORT_RADIUS,
      fill: "transparent",
      stroke: "transparent",
      opacity: 0,
      pointerEvents: "none",
    },
  };
}

function buildHeaderPorts({ headerHeight = DEFAULT_HEADER_HEIGHT } = {}) {
  const groups = {};

  HEADER_PORT_GROUPS.forEach((side) => {
    groups[side] = {
      position: {
        name: "absolute",
      },
      markup: createHeaderPortMarkup(),
      attrs: createHeaderPortAttrs(),
    };
  });

  const items = [];
  HEADER_PORT_GROUPS.forEach((side) => {
    const count = HEADER_PORT_COUNTS[side];
    for (let index = 1; index <= count; index += 1) {
      const ratio = (index / (count + 1)) * 100;
      const args = side === "top"
        ? { x: `${ratio}%`, y: 0 }
        : side === "left"
          ? { x: 0, y: (headerHeight * index) / (count + 1) }
          : { x: "100%", y: (headerHeight * index) / (count + 1) };
      items.push({
        id: `header-${side}-${index}`,
        group: side,
        args,
      });
    }
  });

  return { groups, items };
}

function getExpectedHeaderPortIds() {
  const ids = [];
  HEADER_PORT_GROUPS.forEach((side) => {
    const count = HEADER_PORT_COUNTS[side];
    for (let index = 1; index <= count; index += 1) {
      ids.push(`header-${side}-${index}`);
    }
  });
  return ids;
}

function getHeaderHeightForElement(element) {
  if (!element || !element.attr) {
    return DEFAULT_HEADER_HEIGHT;
  }
  const data = element.get && element.get("data");
  if (data && data.type === "vocabulary") {
    return VOCABULARY_HEADER_HEIGHT;
  }
  const attrHeight = parseFloat(element.attr("headerRect/height"));
  return Number.isFinite(attrHeight) ? attrHeight : DEFAULT_HEADER_HEIGHT;
}

function ensureElementHeaderPorts(element) {
  if (!element || !element.isElement || !element.isElement()) {
    return;
  }

  const currentPorts = element.get("ports") || {};
  const currentItems = Array.isArray(currentPorts.items) ? currentPorts.items : [];
  const currentIds = new Set(currentItems.map((item) => item.id));
  const expectedIds = getExpectedHeaderPortIds();
  const hasAllExpectedPorts = expectedIds.every((id) => currentIds.has(id));

  if (hasAllExpectedPorts && currentItems.length === expectedIds.length) {
    return;
  }

  element.set("ports", buildHeaderPorts({
    headerHeight: getHeaderHeightForElement(element),
  }));
}

function createCustomElement(options) {
  const markup = [
    '<rect class="headerRect"/>',
    '<rect class="foldButton"><title>Collapse</title></rect>',
    '<text class="foldButtonText"/>',
    '<rect class="deleteButton"><title>Remove</title></rect>',
    '<text class="deleteButtonText"/>',
    '<text class="titleText"/>',
    '<rect class="bodyRect"/>',
    '<text class="bodyText"/>',
  ].join("");

  const defaults = {
    type: options.type,
    folded: false,
    size: { width: 220, height: 180 },
    ports: buildHeaderPorts({ headerHeight: DEFAULT_HEADER_HEIGHT }),
    attrs: {
      headerRect: {
        fill: options.headerFill,
        stroke: options.headerStroke,
        width: 220,
        height: DEFAULT_HEADER_HEIGHT,
      },
      foldButton: {
        fill: "#00ffff",
        stroke: "#000000",
        width: 10,
        height: 10,
        x: 2,
        y: 2,
        cursor: "pointer",
        event: "element:foldButton:pointerdown",
      },
      foldButtonText: {
        text: "-",
        fill: "#000000",
        fontSize: 14,
        fontWeight: "bold",
        ref: "foldButton",
        refX: "50%",
        refY: "50%",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        pointerEvents: "none",
      },
      deleteButton: {
        fill: "#ffcccc",
        stroke: "#ff0000",
        width: 10,
        height: 10,
        x: 15,
        y: 2,
        cursor: "pointer",
        event: "element:deleteButton:pointerdown",
      },
      deleteButtonText: {
        text: "X",
        fill: "#ff0000",
        fontSize: 14,
        fontWeight: "bold",
        ref: "deleteButton",
        refX: "50%",
        refY: "50%",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        pointerEvents: "none",
      },
      titleText: {
        text: "",
        fill: "#000000",
        fontSize: 14,
        fontWeight: "bold",
        ref: "headerRect",
        refX: "50%",
        refY: "50%",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
      },
      bodyRect: {
        fill: options.bodyFill,
        stroke: options.bodyStroke,
        width: 220,
      },
      bodyText: {
        text: "",
        fill: "#000000",
        fontSize: 14,
        ref: "bodyRect",
        refX: 10,
        refY: 10,
        textAnchor: "left",
        textVerticalAnchor: "top",
      },
    },
  };

  return joint.dia.Element.extend({
    markup: markup,
    defaults: joint.util.deepSupplement(
      defaults,
      joint.dia.Element.prototype.defaults
    ),
  });
}
