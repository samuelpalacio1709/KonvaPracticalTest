export class CommandInvoker {
  constructor() {
    this.history = [];
    this.redoHistory = [];
    this.init();
  }

  init = () => {
    this.commandEvent = new CustomEvent("command");
    this.onCommand = () => document.dispatchEvent(this.commandEvent);

    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.key.toLowerCase() === "z") {
        this.undo();
      }
      if (event.ctrlKey && event.key.toLowerCase() === "y") {
        this.redo();
      }
    });
  };

  executeCommand = (command) => {
    command.execute();
    this.history.push(command);
    this.redoHistory = [];
    this.onCommand();
  };

  undo = () => {
    if (this.history.length > 0) {
      const command = this.history.pop();
      this.redoHistory.push(command);
      command.undo();
      this.onCommand();
    }
  };

  redo = () => {
    if (this.redoHistory.length > 0) {
      const command = this.redoHistory.pop();
      this.history.push(command);
      command.execute();
      this.onCommand();
    }
  };
}

class Command {
  execute() {}
  undo() {}
}

//Change the color of the selected figure in the editor

export class ColorCommand extends Command {
  constructor(figure, input) {
    super();
    this.figure = figure;
    this.lastColor = figure.getFill();
    this.color = input.value;
    this.lastColor = figure.getAttr("lastColor");
  }

  execute = () => {
    this.figure.fill(this.color);
  };

  undo = () => {
    this.figure.fill(this.lastColor);
    this.figure.setAttr("lastColor", this.lastColor);
  };
}

export class OpacityCommand extends Command {
  constructor(figure, input) {
    super();
    this.figure = figure;
    this.opacity = input.value;
    this.lastOpacity = figure.getAttr("lastOpacity");
  }

  execute = () => {
    this.figure.setOpacity(Number(this.opacity));
  };

  undo = () => {
    this.figure.setOpacity(Number(this.lastOpacity));
    this.figure.setAttr("lastOpacity", this.lastOpacity);
  };
}
