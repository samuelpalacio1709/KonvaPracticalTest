import { Editor } from "./editor.js";
import { getInputs, getProjectsInputs } from "./inputs.js";
import { ProjectsManager } from "./projectsController.js";
export const startApp = () => {
  const editor = createEditor();
  createProjects(editor);
};

const createEditor = () => {
  const inputs = getInputs();
  const editor = new Editor(inputs);
  return editor;
};

const createProjects = (editor) => {
  const inputs = getProjectsInputs();
  new ProjectsManager(editor, inputs);
};
