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
      ...preferences.delfaultCanvasSize,
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
    this.commandInvoker.executeCommand(figureCommand);
    this.transformer.nodes([figureCommand.figure]);
    this.setUpFigure(figureCommand.figure);
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
    this.selected.setAttr("lastOpacity", figure.getOpacity());
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
      const opacityCommand = new Command.OpacityCommand(targetObject, input);
      this.handleInputChange(opacityCommand);
      this.selected.setAttr("lastOpacity", input.value);
    }
  };

  handleDelete = (e) => {
    if (e.key.toLowerCase() == "delete" || e.key.toLowerCase() == "backspace") {
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

    //Selection Color
    this.inputs.colorPicker.addEventListener("change", () => {
      this.handleColorPickerChange(this.inputs.colorPicker, this.selected);
    });

    //Opacity
    this.inputs.opacity.addEventListener("change", () => {
      this.handleOpacityChange(this.inputs.opacity, this.selected);
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
  };
}
