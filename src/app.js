import { Editor } from "./editor.js";
import { getInputs } from "./inputs.js";

export const startApp = () => {
  const inputs = getInputs();
  const editor = new Editor(inputs);
};
