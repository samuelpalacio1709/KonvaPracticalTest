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
    fill: "#ff0000",
    opacity: 1,
    stroke: "#000000",
    strokeWidth: 4,
    draggable: true,
    strokeScaleEnabled: false,
  },

  circleDefault: {
    width: 200,
    height: 200,
    fill: "#ff0000",
    opacity: 1,
    stroke: "#000000",
    strokeWidth: 4,
    draggable: true,
    strokeScaleEnabled: false,
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
