import * as Konva from "Konva";
import { preferences } from "./preferences.js";
import Stats from "stats-js";

export class Editor {
  constructor() {
    this.stage = new Konva.Stage({
      container: "canvas-container",
      width: 500,
      height: 500,
    });
    this.mainLayer = new Konva.Layer();
    this.topLayer = new Konva.Layer();
    this.stage.add(this.mainLayer);
    this.stage.add(this.topLayer);
    this.selected = null;
    this.transformer = new Konva.Transformer({
      anchorStroke: preferences.transformToolColor,
      anchorFill: preferences.transformToolColor,
      borderStroke: preferences.transformToolColor,
      anchorSize: preferences.tranformToolAnchorSize,
      anchorCornerRadius: preferences.transfromToolBorderRadius,
      borderStrokeWidth: preferences.tranformToolborderStrokeWidth,
      padding: preferences.transfromToolPadding,
      rotateAnchorOffset: preferences.transfromToolrotateAnchorOffset,
    });
    console.log(this.transformer);
    this.background = new Konva.Rect({
      width: this.stage.width(),
      height: this.stage.height(),
      fill: preferences.defaultBackgroundColor,
      listening: false,
    });
    this.init();
  }

  init = () => {
    this.mainLayer.add(this.background);
    this.topLayer.add(this.transformer);
    this.stage.on("click tap", this.onClick);
    this.stage.on("wheel", this.onWheel);
    this.showPerformanceFPS();
  };

  addFigureToLayer = (figure) => {
    this.transformer.nodes([figure]);
    this.mainLayer.add(figure);
  };

  onClick = (event) => {
    console.log(event);
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
}
