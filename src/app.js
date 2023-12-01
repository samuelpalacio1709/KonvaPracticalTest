import { Editor } from "./editor.js";
import * as Konva from "Konva";
import { getInputs } from "./inputs.js";
import { preferences } from "./preferences.js";

export const startApp = () => {
  const inputs = getInputs();
  const editor = new Editor(inputs);
  editor.addFigureToLayer(
    new Konva.Circle({
      ...preferences.circleDefault,
      x: editor.stage.width() / 2,
      y: editor.stage.height() / 2,
    })
  );
};
