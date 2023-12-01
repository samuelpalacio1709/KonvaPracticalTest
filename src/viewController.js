export class ViewController {
  constructor(editor) {
    this.editor = editor;
  }

  updateView = () => {
    if (this.editor.selected) {
      this.showSelectionGUI(this.editor);
    } else {
      this.showCanvasGUI(this.editor);
    }
  };

  hide = (element) => {
    element.classList.add("hide");
  };

  show = (element) => {
    element.classList.remove("hide");
  };

  showCanvasGUI(editor) {
    const inputs = editor.inputs;

    inputs.widthCanvas.value = editor.stage.getWidth();
    inputs.heightCanvas.value = editor.stage.getHeight();
    inputs.colorPickerCanvas.value = editor.background.getFill();
    inputs.colorPickerTextCanvas.value = editor.background.getFill();
    inputs;
    this.show(inputs.canvasEditorGUI);
    this.hide(inputs.figureEditorGUI);
  }

  showSelectionGUI(editor) {
    const inputs = editor.inputs;

    inputs.colorPickerText.value = editor.selected.getFill();
    inputs.colorPicker.value = editor.selected.getFill();

    this.hide(inputs.canvasEditorGUI);
    this.show(inputs.figureEditorGUI);
  }
}
