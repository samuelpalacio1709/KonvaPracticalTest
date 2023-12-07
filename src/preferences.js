export const preferences = {
  //canvas
  defaultBackgroundColor: "#ffffff",
  delfaultCanvasSize: { width: 500, height: 500 },

  //transformer tool
  defaultTransformer: {
    anchorStroke: "#CEE36E",
    anchorFill: "#CEE36E",
    borderStroke: "#CEE36E",
    anchorSize: 6,
    anchorCornerRadius: 50,
    borderStrokeWidth: 2,
    padding: 3,
    rotateAnchorOffset: 20,
  },

  //shapes
  rectDeafult: {
    width: 200,
    height: 200,
    fill: "#41D5E8",
    opacity: 1,
    stroke: "#2C8E9C",
    strokeWidth: 4,
    draggable: true,
    strokeScaleEnabled: false,
  },

  heartDeafult: {
    width: 220,
    height: 195,
    fill: "#41D5E8",
    opacity: 1,
    stroke: "#2C8E9C",
    strokeWidth: 4,
    draggable: true,
    strokeScaleEnabled: false,
  },

  circleDefault: {
    width: 200,
    height: 200,
    fill: "#41D5E8",
    opacity: 1,
    stroke: "#2C8E9C",
    strokeWidth: 4,
    draggable: true,
    strokeScaleEnabled: false,
  },

  triangleDefault: {
    width: 200,
    height: 200,
    fill: "#41D5E8",
    opacity: 1,
    stroke: "#2C8E9C",
    strokeWidth: 4,
    draggable: true,
    strokeScaleEnabled: false,
    sides: 3,
    radius: 100,
  },
};

const setBehaviors = () => {
  preventZoom();
};

const preventZoom = () => {
  document.addEventListener(
    "wheel",
    function (event) {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    },
    { passive: false }
  );
};

setBehaviors();
