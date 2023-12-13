import * as Konva from "konva";
import { preferences } from "./preferences.js";
import Command from "./commands.js";
import { ViewController } from "./viewController.js";
import { createMultiselector } from "./multiselector.js";
import { drawMultipleFigures } from "./shapes.js";
import { showToast } from "./toastMessage.js";
export class Editor {
  constructor(inputs) {
    this.inputs = inputs;
    this.selected = null;

    this.init();
  }

  init = () => {
    this.setProject(null);
    this.setFigures();
    this.setCanvasConfig();
    this.handleInputs();
    this.handleInputPreviews();
    this.updateGuiView();
  };

  openProject = (project) => {
    this.editor = document.querySelector("#editor");
    this.inputs.closeProjectBtn.classList.remove("hide");
    this.container.classList.remove("hide");
    this.setProject(project);
    this.changeSelection(null);
    this.updateGuiView();
    this.saveProject();
  };

  closeEditor() {
    this.inputs.closeProjectBtn.classList.add("hide");
    this.container.classList.add("hide");
  }

  setUpMultiselector = () => {
    createMultiselector(this);
  };

  setUpEvents = () => {
    //subscribe to stage events
    this.stage.on("click tap", this.onClick);
    this.stage.on("mousemove", this.onMouseMove);
    this.background.setAttr("lastColor", preferences.defaultBackgroundColor);

    //Event launched when a property has changed

    this.transformer.on("transform", () => {
      this.updateGuiView();
    });
    this.transformer.on("transformstart", () => {
      this.saveTransform();
    });

    this.transformer.on("transformend", () => {
      this.handleTransformChange();
    });
  };

  setCanvasConfig = () => {
    document.addEventListener("command", () => {
      this.updateCanvas();
      this.updateGuiView();
    });
    this.inputs.download.addEventListener("click", () => {
      this.changeSelection(null);
      this.transformer.nodes([]);
      const dataURL = this.stage.toDataURL({ pixelRatio: 3 });
      this.project.downloadURI(dataURL);
    });

    this.inputs.save.addEventListener("click", () => {
      this.saveProject();
    });
  };

  saveProject = () => {
    const json = this.stage.toJSON();
    this.project.size.x = this.stage.width();
    this.project.size.y = this.stage.height();
    this.project.data = json;
    localStorage.setItem(this.project.name, JSON.stringify(this.project));
  };

  setFigures = () => {
    this.inputs.figures.forEach((figure) => {
      figure.addEventListener("click", () => {
        this.createFigure(figure.dataset.figure);
      });
    });
  };

  setProject(project) {
    this.project = project;

    if (this.project == null) {
      this.project = { size: { x: 500, y: 500 }, name: "default", data: null };
    }

    if (this.project.data ?? "") {
      const json = this.project.data;
      this.stage = Konva.Node.create(json, "canvas-container");
    } else {
      this.stage = new Konva.Stage({
        container: "canvas-container",
        width: Number(this.project.size.x),
        height: Number(this.project.size.y),
      });
    }

    this.transformer = new Konva.Transformer(preferences.defaultTransformer);

    if (this.stage.children <= 0) {
      this.mainLayer = new Konva.Layer();
      this.transformerLayer = new Konva.Layer();
      this.stage.add(this.mainLayer);
      this.stage.add(this.transformerLayer);
      this.transformerLayer.add(this.transformer);
    } else {
      this.mainLayer = this.stage.children[0];
      this.transformerLayer = this.stage.children[1];
      this.transformerLayer.add(this.transformer);
    }

    const existingBackground = this.mainLayer.children?.find(
      (child) => child?.attrs["id"] === "background"
    );

    const existingFigures = this.mainLayer.children?.filter(
      (child) => child?.attrs["type"] === "figure"
    );
    if (existingFigures.length > 0) {
      const newFigures = drawMultipleFigures(existingFigures, this.mainLayer);
      for (const figure of newFigures) {
        this.setFigureEvents(figure);
      }
    }

    if (!existingBackground) {
      this.background = new Konva.Rect({
        width: this.stage.width(),
        height: this.stage.height(),
        fill: preferences.defaultBackgroundColor,
        listening: false,
        id: "background",
      });
    } else {
      this.background = existingBackground;
    }
    this.mainLayer.add(this.background);
    this.commandInvoker = new Command.CommandInvoker();
    this.viewController = new ViewController(this);
    this.selectionOverMouse = null;
    this.container = document.querySelector("#editor");

    this.setUpEvents();
    this.setUpMultiselector();
  }

  createFigure(name) {
    const figureCommand = new Command.FigureCommand(
      this.stage,
      this.mainLayer,
      name
    );
    this.setFigureEvents(figureCommand.figure);
    this.commandInvoker.executeCommand(figureCommand);
    this.transformer.nodes([figureCommand.figure]);

    this.setUpFigure(figureCommand.figure);
  }

  setFigureEvents = (figure) => {
    figure.name("figure");
    figure.on("dragstart", () => {
      figure.setAttr("lastPosition", figure.position());
    });

    figure.on("dragmove", () => {
      this.updateGuiView();
    });

    figure.on("dragend", () => {
      this.moveFigure(figure);
    });
  };

  moveFigure(figure) {
    let movementCommand = null;
    if (this.transformer.nodes().length > 1) {
      if (this.selectionOverMouse === figure) {
        movementCommand = new Command.MovementCommand(this.transformer.nodes()); //Multiple figures moved
      }
    } else {
      movementCommand = new Command.MovementCommand([figure]); //Just one figure  moved
    }

    if (movementCommand) {
      this.handleInputChange(movementCommand);
    }
  }

  onClick = (event) => {
    if (event.target === this.stage) {
      this.changeSelection(null);
      return;
    }

    if (event.target) {
      this.changeSelection(event.target);
    }
  };

  onMouseMove = (event) => {
    this.selectionOverMouse = event.target;
  };

  changeSelection = (newSelection) => {
    this.selected = newSelection;
    this.updateGuiView();
  };

  setUpFigure = (figure) => {
    this.changeSelection(figure);
    this.selected.setAttr("lastColor", figure.getFill());
    this.selected.setAttr("defaultWidth", figure.width());
    this.selected.setAttr("defaultHeight", figure.height());
    this.selected.setAttr("lastBorderColor", figure.stroke());
    this.selected.setAttr("lastOpacity", figure.getOpacity());
    this.selected.setAttr("lastPosition", figure.position());
    this.selected.setAttr("lastRotation", figure.rotation());
    this.selected.setAttr("lastScale", figure.scale());
    this.selected.setAttr("lastText", "");
    this.selected.setAttr("lastLine", 25);
    this.selected.setAttr("lastSpacing", 10);
    this.selected.setAttr("spacing", 10);
    this.selected.setAttr("line", 25);
    this.selected.moveToTop();
    this.updateGuiView();
  };

  updateGuiView = () => {
    this.viewController.updateView();
  };
  updateCanvas = () => {
    this.transformer?.nodes(
      this.transformer.nodes().filter((node) => node.getStage() != null)
    );
    if (this.selected?.getStage() == null) {
      this.selected = null;
    }
  };
  hasSelection = () => {
    return this.transformer.nodes().filter((node) => node.getStage() != null);
  };

  handleInputChange = (command) => {
    if (command) {
      this.commandInvoker.executeCommand(command);
    }
    this.updateGuiView();
  };

  handleCanvasResize = (target, dimension) => {
    const resizeCommand = new Command.CanvasResizeCommand(
      this.stage,
      this.background,
      target.value,
      dimension
    );
    this.handleInputChange(resizeCommand);
  };

  saveTransform = () => {
    for (const node of this.transformer.nodes()) {
      node.setAttr("lastRotation", node.rotation());
      node.setAttr("lastScale", node.scale());
      node.setAttr("lastPosition", node.position());
    }
  };

  handleTransformChange = () => {
    const transformCommand = new Command.TransformCommand(
      this.transformer.nodes()
    );
    if (transformCommand) {
      this.handleInputChange(transformCommand);
    }
    this.saveTransform();
  };
  handleColorPickerChange = (input, targetObject) => {
    if (targetObject) {
      const colorCommand = new Command.ColorCommand(targetObject, input);
      this.handleInputChange(colorCommand);

      targetObject.setAttr("lastColor", input.value);
    }
  };

  handleOpacityChange = (input, targetObject) => {
    if (targetObject) {
      if (input.value < 0 || input.value > 100) return;

      const opacityCommand = new Command.OpacityCommand(targetObject, input);
      this.handleInputChange(opacityCommand);
      this.selected.setAttr(
        "lastOpacity",
        input.value < 1 ? input.value : input.value / 100
      );
    }
  };
  handleColorBorderPickerChange = (input, targetObject) => {
    if (targetObject) {
      const borderColorCommand = new Command.ColorBorderCommand(
        targetObject,
        input
      );
      this.handleInputChange(borderColorCommand);
      targetObject.setAttr("lastBorderColor", input.value);
    }
  };

  handleBorderSizeChange = (input, targetObject) => {
    if (targetObject) {
      const borderSizeCommand = new Command.BorderSizeCommand(
        targetObject,
        input
      );
      this.handleInputChange(borderSizeCommand);
    }
  };
  handleDelete = (e) => {
    if (typeof e.key !== "string") return;

    if (e.key?.toLowerCase() == "delete") {
      this.deleteSelection();
    }
  };

  deleteSelection = () => {
    let deleteFigureCommand = null;

    if (this.transformer.nodes().length > 1) {
      deleteFigureCommand = new Command.DeleteCommand(
        this.transformer.nodes(),
        this.mainLayer
      );
      this.changeSelection(null);
    } else {
      if (this.selected) {
        deleteFigureCommand = new Command.DeleteCommand(
          [this.selected],
          this.mainLayer
        );
        this.changeSelection(null);
      }
    }
    if (deleteFigureCommand) {
      this.handleInputChange(deleteFigureCommand);
    }
  };

  handleTextChange = (targetObject) => {
    if (targetObject) {
      const TextCommand = new Command.TextCommand(
        targetObject,
        this.inputs.text,
        this.inputs.textLine,
        this.inputs.textSpacing
      );
      this.handleInputChange(TextCommand);
      targetObject.setAttr("lastText", this.inputs.text.value);
      targetObject.setAttr("lastSpacing", this.inputs.textSpacing.value);
      targetObject.setAttr("lastLine", this.inputs.textLine.value);
    }
  };

  handlePositionPreview() {
    if (this.selected) {
      this.selected.position({
        x: Number(this.inputs.positionX.value),
        y: Number(this.inputs.positionY.value),
      });
    }
  }

  handlePositionChange() {
    if (this.selected) {
      this.moveFigure(this.selected);
      this.selected.setAttr("lastPosition", this.selected.position());
    }
  }

  handleTransformPreview() {
    if (this.selected) {
      const scaleX = this.selected.getAttr("defaultWidth");
      const scaleY = this.selected.getAttr("defaultHeight");
      this.selected.scale({
        x: Number(this.inputs.sizeWidth.value) / scaleX,
        y: Number(this.inputs.sizeHeight.value) / scaleY,
      });
    }
  }

  //Set the changes to the editor

  handleInputs = () => {
    //Canvas resize

    this.inputs.widthCanvas.addEventListener("change", (e) => {
      this.handleCanvasResize(e.target, "width");
    });

    this.inputs.heightCanvas.addEventListener("change", (e) => {
      this.handleCanvasResize(e.target, "height");
    });

    //Background Color
    this.inputs.colorPickerCanvas.addEventListener("change", () => {
      this.handleColorPickerChange(
        this.inputs.colorPickerCanvas,
        this.background
      );
    });

    this.inputs.colorPickerTextCanvas.addEventListener("change", () => {
      this.handleColorPickerChange(
        this.inputs.colorPickerTextCanvas,
        this.background
      );
    });

    //Selection Color
    this.inputs.colorPicker.addEventListener("change", () => {
      this.handleColorPickerChange(this.inputs.colorPicker, this.selected);
    });
    this.inputs.colorPickerText.addEventListener("change", () => {
      this.handleColorPickerChange(this.inputs.colorPickerText, this.selected);
    });

    //Opacity
    this.inputs.opacity.addEventListener("change", () => {
      this.handleOpacityChange(this.inputs.opacity, this.selected);
    });
    this.inputs.opacityText.addEventListener("change", () => {
      this.handleOpacityChange(this.inputs.opacityText, this.selected);
    });

    //Border
    this.inputs.borderColorPicker.addEventListener("change", () => {
      this.handleColorBorderPickerChange(
        this.inputs.borderColorPicker,
        this.selected
      );
    });
    this.inputs.borderSize.addEventListener("change", () => {
      this.handleBorderSizeChange(this.inputs.borderSize, this.selected);
    });

    //Text
    this.inputs.text.addEventListener("change", () => {
      this.handleTextChange(this.selected);
    });

    this.inputs.textLine.addEventListener("change", () => {
      this.handleTextChange(this.selected);
    });
    this.inputs.textSpacing.addEventListener("change", () => {
      this.handleTextChange(this.selected);
    });

    // Position
    this.inputs.positionX.addEventListener("change", () => {
      this.handlePositionChange();
    });
    this.inputs.positionY.addEventListener("change", () => {
      this.handlePositionChange();
    });

    // Scale
    this.inputs.sizeWidth.addEventListener("change", () => {
      this.handleTransformChange();
    });
    this.inputs.sizeHeight.addEventListener("change", () => {
      this.handleTransformChange();
    });

    //Delete
    document.addEventListener("keydown", (e) => {
      this.handleDelete(e);
    });
    this.inputs.deleteButton.addEventListener("click", (e) => {
      this.deleteSelection();
    });

    //Undo
    this.inputs.undoButton.addEventListener("click", (e) => {
      this.commandInvoker.undo();
    });

    //redo
    this.inputs.redoButton.addEventListener("click", (e) => {
      this.commandInvoker.redo();
    });

    //Close
    this.inputs.closeProjectBtn.addEventListener("click", () => {
      this.closeEditor();
    });
  };

  //Show the changes while the user is playing with the inputs
  handleInputPreviews = () => {
    this.inputs.colorPicker.addEventListener("input", (e) => {
      if (this.selected) {
        this.selected.fill(e.target.value);
        this.handleInputChange();
      }
    });

    this.inputs.opacity.addEventListener("input", (e) => {
      if (this.selected) {
        this.selected.setOpacity(Number(e.target.value));
        this.handleInputChange();
      }
    });

    this.inputs.colorPickerCanvas.addEventListener("input", (e) => {
      if (this.background) {
        this.background.fill(e.target.value);
        this.handleInputChange();
      }
    });

    this.inputs.borderColorPicker.addEventListener("input", (e) => {
      if (this.selected) {
        this.selected.stroke(e.target.value);
        this.handleInputChange();
      }
    });

    //Position preview
    this.inputs.positionX.addEventListener("input", () => {
      this.handlePositionPreview();
    });
    this.inputs.positionY.addEventListener("input", () => {
      this.handlePositionPreview();
    });

    //Scale preview
    this.inputs.sizeWidth.addEventListener("input", () => {
      this.handleTransformPreview();
    });
    this.inputs.sizeHeight.addEventListener("input", () => {
      this.handleTransformPreview();
    });

    //Text preview
    this.inputs.text.addEventListener("input", (e) => {
      if (this.selected) {
        this.selected.setAttr("text", e.target.value);
      }
    });

    this.inputs.textLine.addEventListener("input", (e) => {
      if (this.selected) {
        this.selected.setAttr("line", Number(e.target.value));
      }
    });

    this.inputs.textSpacing.addEventListener("input", (e) => {
      if (this.selected) {
        this.selected.setAttr("spacing", Number(e.target.value));
      }
    });
  };
}
