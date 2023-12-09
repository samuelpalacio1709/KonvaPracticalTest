import * as Konva from "Konva";
import { preferences } from "./preferences.js";
import Command from "./commands.js";
import { ViewController } from "./viewController.js";

export class Editor {
  constructor(inputs) {
    this.inputs = inputs;
    this.selected = null;

    //Konva set up
    this.stage = new Konva.Stage({
      container: "canvas-container",
      ...preferences.defaultCanvasSize,
    });
    this.transformer = new Konva.Transformer(preferences.defaultTransformer);
    this.mainLayer = new Konva.Layer();
    this.transformerLayer = new Konva.Layer();
    this.background = new Konva.Rect({
      width: this.stage.width(),
      height: this.stage.height(),
      fill: preferences.defaultBackgroundColor,
      listening: false,
    });

    this.commandInvoker = new Command.CommandInvoker();
    this.viewController = new ViewController(this);
    this.init();
  }

  init = () => {
    //Handle layers
    this.stage.add(this.mainLayer);
    this.stage.add(this.transformerLayer);
    this.mainLayer.add(this.background);
    this.transformerLayer.add(this.transformer);

    this.setUpEvents();
    this.setCanvasConfig();
    this.setFigures();
    this.handleInputs();
    this.handleInputPreviews();
    this.updateGuiView();
  };

  setUpEvents = () => {
    //subscribe to stage events
    this.stage.on("click tap", this.onClick);

    //Event launched when a property has changed
    document.addEventListener("command", () => {
      this.updateCanvas();
      this.updateGuiView();
    });
  };

  setCanvasConfig = () => {
    this.background.setAttr("lastColor", preferences.defaultBackgroundColor);
  };

  setFigures = () => {
    this.inputs.figures.forEach((figure) => {
      figure.addEventListener("click", () => {
        this.createFigure(figure.dataset.figure);
      });
    });
  };

  createFigure(name) {
    const figureCommand = new Command.FigureCommand(
      this.stage,
      this.mainLayer,
      name
    );
    figureCommand.figure.on("dragstart", () => {
      figureCommand.figure.setAttr(
        "lastPosition",
        figureCommand.figure.position()
      );
    });

    figureCommand.figure.on("dragmove", () => {
      this.updateGuiView();
    });

    figureCommand.figure.on("dragend", () => {
      this.moveFigure(figureCommand.figure);
    });

    this.commandInvoker.executeCommand(figureCommand);
    this.transformer.nodes([figureCommand.figure]);
    this.setUpFigure(figureCommand.figure);
  }

  moveFigure(figure) {
    const movementCommand = new Command.MovementCommand(figure);
    this.handleInputChange(movementCommand);
  }

  onClick = (event) => {
    if (event.target === this.stage) {
      this.changeSelection(null);
      this.transformer.nodes([]);
      return;
    }

    if (event.target) {
      this.changeSelection(event.target);
      this.transformer.nodes([event.target]);
    }
  };

  changeSelection = (newSelection) => {
    this.selected = newSelection;
    this.updateGuiView();
  };

  setUpFigure = (figure) => {
    this.changeSelection(figure);
    this.selected.setAttr("lastColor", figure.getFill());
    this.selected.setAttr("lastBorderColor", figure.stroke());
    this.selected.setAttr("lastOpacity", figure.getOpacity());
    this.selected.setAttr("lastText", "");
    console.log(figure.stroke());
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
    if (e.key.toLowerCase() == "delete") {
      if (this.selected) {
        const deleteFigureCommand = new Command.DeleteCommand(
          this.selected,
          this.mainLayer
        );
        this.handleInputChange(deleteFigureCommand);
        this.changeSelection(null);
      }
    }
  };

  handleTextChange = (input, targetObject) => {
    if (targetObject) {
      const TextCommand = new Command.TextCommand(targetObject, input);
      this.handleInputChange(TextCommand);
      targetObject.setAttr("lastText", input.value);
    }
  };

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
      this.handleTextChange(this.inputs.text, this.selected);
    });

    this.inputs.text.addEventListener("input", (e) => {
      if (this.selected) {
        this.selected.setAttr("text", e.target.value);
      }
    });

    //Delete
    document.addEventListener("keydown", (e) => {
      this.handleDelete(e);
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
  };
}
