import { Project } from "./project";

export class ProjectsManager {
  constructor(editor, inputs) {
    this.editor = editor;
    this.inputs = inputs;
    this.init();
  }

  init = async () => {
    this.projects = await this.getProjects();

    this.grid = {
      view: document.querySelector("#projects-grid"),
      size: { x: 4, y: 6 },
    };
    this.setUpEvents();
    this.fillCells();

    this.fillProjectData();
    this.toggleProjects();
  };

  setUpEvents = () => {
    this.inputs.btnNew?.addEventListener("click", () => {
      this.toggleProjects();
      this.toggleNewProjectConfig();
      this.inputs.btnNew.classList.add("hide");
    });

    this.inputs.cancelBtn?.addEventListener("click", () => {
      this.toggleProjects();
      this.toggleNewProjectConfig();
      this.inputs.btnNew.classList.remove("hide");
    });

    this.inputs.createBtn?.addEventListener("click", () => {
      this.createProject();
    });

    this.inputs.closeProjectBtn?.addEventListener("click", () => {
      this.showProjects();
    });
  };

  fillCells = () => {
    const size = this.grid.size.x * this.grid.size.y;
    for (let i = 0; i < size; i++) {
      this.grid.view.innerHTML += ` <div class="cell" id="cell-${i}"></div>`;
    }
  };

  fillProjectData = () => {
    if (!this.projects) return;
    let index = 0;
    for (let i = 0; i < this.projects.length; i++) {
      if (i >= this.grid.size.y) break;

      const project = this.projects[i];
      document.querySelector(
        `#cell-${index}`
      ).innerHTML = `<h3>${project.name}</h3>`;
      document.querySelector(
        `#cell-${index + 1}`
      ).innerHTML = `<h3>${this.formateDate(project.date)}</h3>`;
      document.querySelector(
        `#cell-${index + 2}`
      ).innerHTML = `<h3>${project.size.x}x${project.size.y}</h3>`;
      document.querySelector(
        `#cell-${index + 3}`
      ).innerHTML = `<button class="project-button open-project" data-project="${i}"><h3>Open</h3></buton>`;

      index += 4;
    }

    this.setUpButtons();
  };

  formateDate(date) {
    const currentDate = new Date(date);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    return year + "-" + month + "-" + day;
  }
  getProjects = async () => {
    try {
      const data = await fetch("assets/info/defaultProjects.json");
      const json = await data.json();
      if (!json.projects) {
        json.projects = [];
      }
      for (const localProject of Object.values(localStorage)) {
        const storedProject = JSON.parse(localProject);

        json.projects = json?.projects?.filter((project) => {
          return project.name != storedProject.name;
        });

        json?.projects?.push(storedProject);
      }

      return json?.projects.sort(this.compareDates);
    } catch (e) {
      console.log(e);
    }
  };

  compareDates(a, b) {
    return new Date(b.date) - new Date(a.date);
  }
  toggleNewProjectConfig = () => {
    this.inputs.newProjectConfig.classList.toggle("hide");
    this.inputs.projectNameInput.value = "";
  };

  toggleProjects = () => {
    this.inputs.projectSection.classList.toggle("hide");
  };

  createProject = () => {
    const name = this.inputs.projectNameInput.value;
    const width = this.inputs.projectWidthInput.value;
    const height = this.inputs.projectHeightInput.value;

    if (name === "") return;
    if (width < 250) return;
    if (height < 250) return;
    if (this.projects?.find((project) => project.name == name)) return;

    const project = new Project(name, { x: width, y: height }, null);

    this.openEditor(project);
  };

  showProjects = async () => {
    this.projects = await this.getProjects();
    this.fillProjectData();
    console.log("show");
    this.inputs.projectSection.classList.remove("hide");
    this.inputs.container.classList.remove("hide");
    this.inputs.btnNew.classList.remove("hide");
  };

  setUpButtons = () => {
    const buttons = document.querySelectorAll(".open-project");
    for (const button of buttons) {
      button.addEventListener("click", () => {
        const index = button.dataset.project;
        const project = this.projects[index];
        this.openEditor(new Project(project.name, project.size, project.data));
      });
    }
  };

  openEditor(project) {
    this.inputs.newProjectConfig.classList.add("hide");
    this.inputs.projectSection.classList.add("hide");
    this.inputs.container.classList.add("hide");
    this.inputs.btnNew.classList.add("hide");

    this.editor.openProject(project);
  }
}
