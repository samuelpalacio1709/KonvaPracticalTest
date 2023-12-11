const editorInputs = {
  widthCanvas: document.querySelector("#width-canvas"),
  heightCanvas: document.querySelector("#height-canvas"),
  colorPickerCanvas: document.querySelector("#color-picker-canvas"),
  colorPickerTextCanvas: document.querySelector("#color-picker-text-canvas"),
  positionX: document.querySelector("#x-position"),
  positionY: document.querySelector("#y-position"),
  sizeWidth: document.querySelector("#width"),
  sizeHeight: document.querySelector("#height"),
  colorPicker: document.querySelector("#color-picker"),
  closeProjectBtn: document.querySelector("#close-project-btn"),
  borderColorPicker: document.querySelector("#border-color"),
  text: document.querySelector("#text"),
  borderSize: document.querySelector("#border-value"),
  colorPickerText: document.querySelector("#color-picker-text"),
  opacity: document.querySelector("#opacity-range"),
  opacityText: document.querySelector("#opacity-number"),
  canvasEditorGUI: document.querySelector("#canvas-editor-inputs"),
  figureEditorGUI: document.querySelector("#figure-editor-inputs"),
  download: document.querySelector("#download"),
  save: document.querySelector("#save"),
  figures: document.querySelectorAll(".figure"),
};

const projectInputs = {
  btnNew: document.querySelector("#btn-new-project"),
  projectSection: document.querySelector("#projects"),
  newProjectConfig: document.querySelector("#new-project"),
  createBtn: document.querySelector("#create-new-button"),
  cancelBtn: document.querySelector("#cancel-new-button"),
  projectNameInput: document.querySelector("#new-project-name"),
  projectWidthInput: document.querySelector("#new-project-width"),
  projectHeightInput: document.querySelector("#new-project-height"),
  container: document.querySelector("#projects-list"),
  closeProjectBtn: document.querySelector("#close-project-btn"),
};

export const getProjectsInputs = () => {
  return projectInputs;
};

export const getInputs = () => {
  return editorInputs;
};
