import * as Konva from "Konva";
import { preferences } from "./preferences.js";
import { CommandInvoker, ColorCommand } from "./commands.js";
import Stats from "stats-js";

export class Editor {
  constructor(inputs) {
    this.inputs = inputs;
    this.stage = new Konva.Stage({
      container: "canvas-container",
      ...preferences.delfaultCanvasSize,
    });
    this.mainLayer = new Konva.Layer();
    this.topLayer = new Konva.Layer();
    this.stage.add(this.mainLayer);
    this.stage.add(this.topLayer);
    this.selected = null;
    this.transformer = new Konva.Transformer(preferences.defualtTransformer);
    this.background = new Konva.Rect({
      width: this.stage.width(),
      height: this.stage.height(),
      fill: preferences.defaultBackgroundColor,
      listening: false,
    });
    this.CommandInvoker = new CommandInvoker();
    this.init();
  }

  init = () => {
    this.mainLayer.add(this.background);
    this.topLayer.add(this.transformer);
    this.stage.on("click tap", this.onClick);
    this.stage.on("wheel", this.onWheel);
    this.handleInputs();
    this.showPerformanceFPS();
  };

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
  };

  setUpFigure = (figure) => {
    this.selected = figure;
    this.selected.setAttr("lastColor", figure.getFill());
  };

  handleInputs = () => {
    // Color
    this.inputs.colorPicker.addEventListener("change", (e) => {
      if (this.selected) {
        const colorCommand = new ColorCommand(
          this.selected,
          this.inputs.colorPicker
        );
        this.CommandInvoker.executeCommand(colorCommand);
        this.selected.setAttr("lastColor", e.target.value);
      }
    });

    this.inputs.colorPicker.addEventListener("input", (e) => {
      if (this.selected) {
        this.selected.fill(e.target.value);
      }
    });
  };
}
