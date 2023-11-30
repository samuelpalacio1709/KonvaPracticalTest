import { Editor } from "./editor.js";
import * as Konva from "Konva";
import { getInputs } from "./inputs.js";

export const startApp = () => {
  const inputs = getInputs();
  const editor = new Editor();
  editor.addFigureToLayer(
    new Konva.Circle({
      width: 200,
      height: 200,
      x: editor.stage.width() / 2,
      y: editor.stage.height() / 2,
      fill: "red",
      opacity: 1,
      stroke: "black",
      strokeWidth: 4,
      draggable: true,
    })
  );
  editor.addFigureToLayer(
    new Konva.Rect({
      width: 200,
      height: 200,
      x: editor.stage.width() / 2,
      y: editor.stage.height() / 2,
      fill: "red",
      opacity: 1,
      stroke: "black",
      strokeWidth: 4,
      draggable: true,
    })
  );
};
