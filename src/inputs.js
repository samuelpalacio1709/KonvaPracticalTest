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
  colorPickerText: document.querySelector("#color-picker-text"),
  opacity: document.querySelector("#opacity-range"),
  canvasEditorGUI: document.querySelector("#canvas-editor-inputs"),
  figureEditorGUI: document.querySelector("#figure-editor-inputs"),
  figures: document.querySelectorAll(".figure"),
};
export const getInputs = () => inputs;
