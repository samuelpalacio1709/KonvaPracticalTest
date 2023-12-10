import { Editor } from "./editor.js";
import { getInputs } from "./inputs.js";
import { Project } from "./project.js";
export const startApp = () => {
  const inputs = getInputs();
  const data = null;
  const project = new Project("test", data);
  const editor = new Editor(inputs, project);
};
