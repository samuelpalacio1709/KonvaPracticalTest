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

    this.show(inputs.canvasEditorGUI);
    this.hide(inputs.figureEditorGUI);
  }

  showSelectionGUI(editor) {
    const inputs = editor.inputs;
    const position = editor.selected.position();
    inputs.colorPickerText.value = editor.selected.getFill();
    inputs.colorPicker.value = editor.selected.getFill();
    inputs.opacity.value = editor.selected.getOpacity();
    inputs.opacityText.value = Math.round(editor.selected.getOpacity() * 100);
    inputs.positionX.value = position.x.toFixed(2);
    inputs.positionY.value = position.y.toFixed(2);
    inputs.borderSize.value = editor.selected.strokeWidth();
    inputs.text.value = editor.selected.getAttr("text") || "";
    inputs.borderColorPicker.value = editor.selected.stroke();
    inputs.sizeWidth.value = Math.round(
      editor.selected.getWidth() * editor.selected.scaleX()
    );
    inputs.sizeHeight.value = Math.round(
      editor.selected.getHeight() * editor.selected.scaleY()
    );
    console.log(editor.selected.rotation());

    this.hide(inputs.canvasEditorGUI);
    this.show(inputs.figureEditorGUI);
  }
}
