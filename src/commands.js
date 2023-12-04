import { preferences } from "./preferences";
import * as Konva from "Konva";

class CommandInvoker {
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

class FigureCommand extends Command {
  constructor(stage, layer, name) {
    super();
    this.stage = stage;
    this.layer = layer;
    this.name = name;
    this.figure = this.createFigure(name);
    this.layer = layer;
  }

  execute = () => {
    this.layer.add(this.figure);
  };

  undo = () => {
    this.figure.remove();
  };

  createFigure() {
    let figure = null;
    switch (this.name) {
      case "circle":
        figure = new Konva.Circle({
          ...preferences.circleDefault,
          x: this.stage.width() / 2,
          y: this.stage.height() / 2,
        });
        break;

      case "square":
        figure = new Konva.Rect({
          ...preferences.rectDeafult,
          x: this.stage.width() / 2,
          y: this.stage.height() / 2,
          offset: {
            x: preferences.rectDeafult.width / 2,
            y: preferences.rectDeafult.height / 2,
          },
        });
        break;
    }
    return figure;
  }
}

class DeleteCommand extends Command {
  constructor(figure, layer) {
    super();
    this.figure = figure;
    this.layer = layer;
  }

  execute = () => {
    this.figure.remove();
  };

  undo = () => {
    this.layer.add(this.figure);
  };
}

class ColorCommand extends Command {
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

class OpacityCommand extends Command {
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

class CanvasResizeCommand extends Command {
  constructor(stage, background, newValue, type) {
    super();
    this.stage = stage;
    this.background = background;
    this.newValue = Number(newValue);
    this.type = type;
    this.lastSizes = {
      width: stage.width(),
      height: stage.height(),
    };
  }

  execute = () => {
    if (this.type == "width") {
      this.stage.width(this.newValue);
      this.background.width(this.newValue);
    }
    if (this.type == "height") {
      this.stage.height(this.newValue);
      this.background.height(this.newValue);
    }
  };

  undo = () => {
    if (this.type == "width") {
      this.stage.width(this.lastSizes.width);
      this.background.width(this.lastSizes.width);
    }
    if (this.type == "height") {
      this.stage.height(this.lastSizes.height);
      this.background.height(this.lastSizes.height);
    }
  };
}
export default {
  CommandInvoker,
  FigureCommand,
  ColorCommand,
  CanvasResizeCommand,
  OpacityCommand,
  DeleteCommand,
};
