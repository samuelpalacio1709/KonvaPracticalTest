import * as Konva from "Konva";
import { preferences } from "./preferences.js";
import { CommandInvoker, ColorCommand, OpacityCommand } from "./commands.js";
import Stats from "stats-js";
import { ViewController } from "./viewController.js";

export class Editor {
  constructor(inputs) {
    this.commandInvoker = new CommandInvoker();
    this.viewController = new ViewController(inputs);
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

    this.init();
  }

  init = () => {
    //Events to trigger GUI changes
    this.guiEvent = new CustomEvent("gui");
    this.onGUI = () => document.dispatchEvent(this.guiEvent);

    //Events laucnhed when a property has changed!
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

    this.setFigures();

    this.handleInputs();
    this.updateGuiView();
  };

  setFigures = () => {
    this.inputs.figures.forEach((figure) => {
      figure.addEventListener("click", () => {
        this.createFigure(figure.dataset.figure);
      });
    });
  };

  createFigure(name) {
    let figure = null;

    switch (name) {
      case "circle":
        figure = new Konva.Circle({
          ...preferences.circleDefault,
          x: this.stage.width() / 2,
          y: this.stage.height() / 2,
        });
        break;

      case "square":
        figure = new Konva.Rect({
          ...preferences.rectDeafult,
          x: this.stage.width() / 2,
          y: this.stage.height() / 2,
          offset: {
            x: preferences.rectDeafult.width / 2,
            y: preferences.rectDeafult.height / 2,
          },
        });
        break;
    }

    if (figure !== null) this.addFigureToLayer(figure);
  }

  addFigureToLayer = (figure) => {
    this.transformer.nodes([figure]);
    this.mainLayer.add(figure);
    this.setUpFigure(figure);
  };

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
    this.viewController.updateView(this);
  };

  handleInputs = () => {
    // Color
    this.inputs.colorPicker.addEventListener("change", (e) => {
      if (this.selected) {
        const colorCommand = new ColorCommand(
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
        const colorCommand = new OpacityCommand(
          this.selected,
          this.inputs.opacity
        );
        this.commandInvoker.executeCommand(colorCommand);
        this.selected.setAttr("lastOpacity", e.target.value);
      }
    });

    //Previews
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
  };
}
