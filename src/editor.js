import * as Konva from "Konva";

export class Editor {
  constructor() {
    this.stage = new Konva.Stage({
      container: "canvas-container",
      width: 500,
      height: 500,
    });
    this.mainLayer = new Konva.Layer();
    this.stage.add(this.mainLayer);
    this.background = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.stage.width(),
      height: this.stage.height(),
      fill: "white",
      listening: false,
    });
    this.addToLayer(this.background);
  }

  addToLayer(figure) {
    this.mainLayer.add(figure);
  }
}
