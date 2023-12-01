import { Editor } from "./editor.js";
import * as Konva from "Konva";
import { getInputs } from "./inputs.js";
import { preferences } from "./preferences.js";

export const startApp = () => {
  const inputs = getInputs();
  const editor = new Editor();
  editor.addFigureToLayer(
    new Konva.Circle({
      ...preferences.circleDefault,
      x: editor.stage.width() / 2,
      y: editor.stage.height() / 2,
    })
  );
  editor.addFigureToLayer(
    new Konva.Rect({
      ...preferences.rectDeafult,
      x: editor.stage.width() / 2,
      y: editor.stage.height() / 2,
      offset: {
        x: preferences.rectDeafult.width / 2,
        y: preferences.rectDeafult.height / 2,
      },
    })
  );
};
