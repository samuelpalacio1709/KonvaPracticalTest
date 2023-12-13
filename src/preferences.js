export const preferences = {
  //canvas
  defaultBackgroundColor: "#ffffff",
  defaultFigureText: "bold 24px Nanum Gothic",
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
    centeredScaling: true,
    flipEnabled: false,
  },

  defaultSelectorStroke: "#CEE36E",
  defaultSelectorFill: "rgba(207, 255, 219,0.3)",

  //shapes
  defaultTextColor: "#000000",

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
  window.onpopstate = function (event) {
    location.reload();
  };
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
