export class ViewController {
  constructor(inputs) {
    this.inputs = inputs;
  }

  updateView = (editor) => {
    console.log(editor.selected);
    if (editor.selected) {
      this.hide(this.inputs.canvasEditorGUI);
      this.show(this.inputs.figureEditorGUI);
      this.inputs.colorPickerText.value = editor.selected.getFill();
    } else {
      this.show(this.inputs.canvasEditorGUI);
      this.hide(this.inputs.figureEditorGUI);
    }
  };

  hide = (element) => {
    element.classList.add("hide");
  };

  show = (element) => {
    element.classList.remove("hide");
  };
}
