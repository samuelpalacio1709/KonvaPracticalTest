const inputs = {
  widthCanvas: document.querySelector("#width-canvas"),
  heightCanvas: document.querySelector("#height-canvas"),
  colorPickerCanvas: document.querySelector("#color-picker-canvas"),
  colorPickerTextCanvas: document.querySelector("#color-picker-text-canvas"),
  positionX: document.querySelector("#x-position"),
  positionY: document.querySelector("#y-position"),
  sizeWidth: document.querySelector("#width"),
  sizeHeight: document.querySelector("#height"),
  colorPicker: document.querySelector("#color-picker"),
  borderColorPicker: document.querySelector("#border-color"),
  text: document.querySelector("#text"),
  borderSize: document.querySelector("#border-value"),
  colorPickerText: document.querySelector("#color-picker-text"),
  opacity: document.querySelector("#opacity-range"),
  opacityText: document.querySelector("#opacity-number"),
  canvasEditorGUI: document.querySelector("#canvas-editor-inputs"),
  figureEditorGUI: document.querySelector("#figure-editor-inputs"),
  download: document.querySelector("#download"),
  figures: document.querySelectorAll(".figure"),
};
export const getInputs = () => inputs;
