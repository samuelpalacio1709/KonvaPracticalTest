export class ViewController {
  constructor(editor) {
    this.editor = editor;
    this.showCanvasOptions();
  }

  updateView = () => {
    if (this.editor.selected) {
      this.showSelectionGUI(this.editor);
    } else {
      this.showCanvasGUI(this.editor);
    }
    this.checkOptions(this.editor, this.editor.inputs);
  };

  showCanvasOptions() {
    const canvasOptionsContainer = document.querySelector("#stage-virtual");
    const setSizes = () => {
      canvasOptionsContainer.style.width = `${this.editor.stage.width()}px`;
      canvasOptionsContainer.style.height = `${this.editor.stage.height()}px`;
    };
    setSizes();
    this.editor.stage.on("widthChange heightChange", () => {
      setSizes();
    });

    const allowDrop = (ev) => {
      ev.preventDefault();
    };

    const drop = (ev) => {
      ev.preventDefault();
      var data = ev.dataTransfer.getData("type");
      if (data != "") {
        this.editor.createFigure(data);
      }
    };

    const drag = (ev) => {
      ev.dataTransfer.setData("type", ev.target.dataset.figure);
    };

    for (const figure of this.editor.inputs.figures) {
      figure.ondragstart = drag;
    }

    const container = document.querySelector(".canvas-container");
    container.ondrop = drop;
    container.ondragover = allowDrop;
  }

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
    inputs.figureName.innerHTML = "";
    inputs.deleteButton.style.opacity = 0.3;
    inputs.undoButton.style.opacity = 0.3;
    inputs.redoButton.style.opacity = 0.3;

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
    inputs.positionX.value = Math.round(position.x);
    inputs.positionY.value = Math.round(position.y);
    inputs.borderSize.value = editor.selected.strokeWidth();
    inputs.text.value = editor.selected.getAttr("text") || "";
    inputs.textLine.value = editor.selected.getAttr("line") || "";
    inputs.textSpacing.value = editor.selected.getAttr("spacing") || "";
    inputs.borderColorPicker.value = editor.selected.stroke();
    inputs.sizeWidth.value = Math.round(
      editor.selected.getWidth() * editor.selected.scaleX()
    );
    inputs.sizeHeight.value = Math.round(
      editor.selected.getHeight() * editor.selected.scaleY()
    );
    const id = editor.selected.getAttr("id");
    inputs.figureName.innerHTML = id.charAt(0).toUpperCase() + id.slice(1);
    this.hide(inputs.canvasEditorGUI);
    this.show(inputs.figureEditorGUI);
  }

  checkOptions(editor, inputs) {
    if (editor.hasSelection().length > 0) {
      inputs.deleteButton.style.opacity = 1;
    } else {
      inputs.deleteButton.style.opacity = 0.3;
    }

    if (editor.commandInvoker.history.length > 0) {
      inputs.undoButton.style.opacity = 1;
    } else {
      inputs.undoButton.style.opacity = 0.3;
    }

    if (editor.commandInvoker.redoHistory.length > 0) {
      inputs.redoButton.style.opacity = 1;
    } else {
      inputs.redoButton.style.opacity = 0.3;
    }
  }
}
