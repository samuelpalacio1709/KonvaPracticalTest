import * as Konva from "Konva";
import { preferences } from "./preferences.js";
import Command from "./commands.js";
import Stats from "stats-js";
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
    //Events to trigger GUI changes
    this.guiEvent = new CustomEvent("gui");
    this.onGUI = () => document.dispatchEvent(this.guiEvent);

    //Events laucnhed when a property has changed!
    document.addEventListener("command", this.updateCanvas);
    document.addEventListener("command", this.updateGuiView);
    document.addEventListener("gui", this.updateGuiView);

    //subscribe to stage events
    this.stage.on("click tap", this.onClick);
    this.stage.on("wheel", this.onWheel);

    //Handle layers
    this.stage.add(this.mainLayer);
    this.stage.add(this.transformerLayer);
    this.mainLayer.add(this.background);
    this.transformerLayer.add(this.transformer);

    this.setCanvasConfig();
    this.setFigures();
    this.handleInputs();
    this.updateGuiView();
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
  onWheel = (event) => {
    var scaleBy = 1.01;

    const oldScale = this.stage.scaleX();
    const pointer = this.stage.getPointerPosition();
    var mousePointTo = {
      x: (pointer.x - this.stage.x()) / oldScale,
      y: (pointer.y - this.stage.y()) / oldScale,
    };

    let direction = event.evt.deltaY > 0 ? 1 : -1;
    if (event.evt.ctrlKey) {
      direction = -direction;
    }

    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    this.stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    this.stage.position(newPos);
  };

  showPerformanceFPS = () => {
    const stats = new Stats();
    document.body.appendChild(stats.domElement);
    const updateStats = () => {
      stats.begin();
      requestAnimationFrame(updateStats);
      stats.end();
    };
    window.requestAnimationFrame(updateStats);
  };

  changeSelection = (newSelection) => {
    this.selected = newSelection;
    this.onGUI();
  };

  setUpFigure = (figure) => {
    this.selected = figure;
    this.selected.setAttr("lastColor", figure.getFill());
    this.selected.setAttr("lastOpacity", figure.getOpacity());
    this.onGUI();
  };

  updateGuiView = () => {
    this.viewController.updateView();
  };
  updateCanvas = () => {
    this.transformer?.nodes(
      this.transformer.nodes().filter((node) => node.getStage() != null)
    );
  };

  setInputPreviews = () => {
    this.inputs.colorPicker.addEventListener("input", (e) => {
      if (this.selected) {
        this.selected.fill(e.target.value);
        this.onGUI();
      }
    });

    this.inputs.opacity.addEventListener("input", (e) => {
      if (this.selected) {
        this.selected.setOpacity(Number(e.target.value));
        this.onGUI();
      }
    });

    this.inputs.colorPickerCanvas.addEventListener("input", (e) => {
      if (this.background) {
        this.background.fill(e.target.value);
        this.onGUI();
      }
    });
  };

  handleInputs = () => {
    //Canvas width and height
    this.inputs.widthCanvas.addEventListener("change", (e) => {
      const resizeCommand = new Command.CanvasResizeCommand(
        this.stage,
        this.background,
        e.target.value,
        "width"
      );
      this.commandInvoker.executeCommand(resizeCommand);
    });
    this.inputs.heightCanvas.addEventListener("change", (e) => {
      const resizeCommand = new Command.CanvasResizeCommand(
        this.stage,
        this.background,
        e.target.value,
        "height"
      );
      this.commandInvoker.executeCommand(resizeCommand);
    });

    //Background Color
    this.inputs.colorPickerCanvas.addEventListener("change", (e) => {
      if (this.background) {
        const colorCommand = new Command.ColorCommand(
          this.background,
          this.inputs.colorPickerCanvas
        );
        this.commandInvoker.executeCommand(colorCommand);
        this.background.setAttr("lastColor", e.target.value);
      }
    });

    //Selection Color
    this.inputs.colorPicker.addEventListener("change", (e) => {
      if (this.selected) {
        const colorCommand = new Command.ColorCommand(
          this.selected,
          this.inputs.colorPicker
        );
        this.commandInvoker.executeCommand(colorCommand);
        this.selected.setAttr("lastColor", e.target.value);
      }
    });

    //Opacity
    this.inputs.opacity.addEventListener("change", (e) => {
      if (this.selected) {
        const colorCommand = new Command.OpacityCommand(
          this.selected,
          this.inputs.opacity
        );
        this.commandInvoker.executeCommand(colorCommand);
        this.selected.setAttr("lastOpacity", e.target.value);
      }
    });

    //Delete

    document.addEventListener("keydown", (e) => {
      if (
        e.key.toLowerCase() == "delete" ||
        e.key.toLowerCase() == "backspace"
      ) {
        if (this.selected) {
          const deleteFigureCommand = new Command.DeleteCommand(
            this.selected,
            this.mainLayer
          );
          this.commandInvoker.executeCommand(deleteFigureCommand);
          this.selected = null;
        }
      }
      this.onGUI();
    });

    //Previews
    this.setInputPreviews();
  };
}
