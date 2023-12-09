import { preferences } from "./preferences";
import * as Konva from "Konva";
import { drawHeart, drawRect, drawTriangle, drawCircle } from "./shapeDrawer";
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
    const defaultFigurePosition = {
      x: this.stage.width() / 2,
      y: this.stage.height() / 2,
      name: "rect",
    };

    switch (this.name) {
      case "circle":
        figure = new Konva.Shape({
          ...preferences.circleDefault,
          ...defaultFigurePosition,
          sceneFunc(context, shape) {
            drawCircle(context, shape);
          },
          offset: {
            x: preferences.circleDefault.width / 2,
            y: preferences.circleDefault.height / 2,
          },
        });
        break;

      case "square":
        figure = new Konva.Shape({
          ...preferences.rectDeafult,
          ...defaultFigurePosition,
          sceneFunc(context, shape) {
            drawRect(context, shape);
          },
          offset: {
            x: preferences.rectDeafult.width / 2,
            y: preferences.rectDeafult.height / 2,
          },
        });
        break;
      case "triangle":
        figure = new Konva.Shape({
          ...preferences.triangleDefault,
          ...defaultFigurePosition,
          sceneFunc(context, shape) {
            drawTriangle(context, shape);
          },
          offset: {
            x: preferences.rectDeafult.width / 2,
            y: preferences.rectDeafult.height / 2,
          },
        });
        break;
      case "heart":
        figure = new Konva.Shape({
          ...preferences.heartDeafult,
          ...defaultFigurePosition,
          sceneFunc(context, shape) {
            drawHeart(context, shape);
          },
          offset: {
            x: preferences.heartDeafult.width / 2,
            y: preferences.heartDeafult.height / 2,
          },
        });
        break;
    }

    return figure;
  }
}

class DeleteCommand extends Command {
  constructor(figures, layer) {
    super();
    this.figures = figures;
    this.layer = layer;
  }

  execute = () => {
    for (let i = 0; i < this.figures.length; i++) {
      this.figures[i].remove();
    }
  };

  undo = () => {
    for (let i = 0; i < this.figures.length; i++) {
      this.layer.add(this.figures[i]);
    }
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
    this.opacity = input.value < 1 ? input.value : input.value / 100;
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

class TextCommand extends Command {
  constructor(figure, input) {
    super();
    this.figure = figure;
    this.text = input.value;
    this.lastText = figure.getAttr("lastText");
  }

  execute = () => {
    this.figure.setAttr("text", this.text);
  };

  undo = () => {
    this.figure.setAttr("text", this.lastText);
    this.figure.setAttr("lastText", this.lastText);
  };
}

class ColorBorderCommand extends Command {
  constructor(figure, input) {
    super();
    this.figure = figure;
    this.color = input.value;
    this.lastColor = figure.getAttr("lastBorderColor");
  }

  execute = () => {
    this.figure.stroke(this.color);
  };

  undo = () => {
    this.figure.stroke(this.lastColor);
    this.figure.setAttr("lastBorderColor", this.lastColor);
  };
}

class BorderSizeCommand extends Command {
  constructor(figure, input) {
    super();
    console.log(input.value);
    this.figure = figure;
    this.lastBorder = Number(figure.strokeWidth());
    this.border = Number(input.value);
  }

  execute = () => {
    this.figure.strokeWidth(this.border);
  };

  undo = () => {
    this.figure.strokeWidth(this.lastBorder);
  };
}

class MovementCommand extends Command {
  constructor(figures) {
    super();
    this.figures = figures;
    this.lastPostions = figures.map((figure) => figure.getAttr("lastPosition"));
    this.positions = figures.map((figure) => figure.position());
  }

  execute = () => {
    for (let i = 0; i < this.figures.length; i++) {
      this.figures[i].position(this.positions[i]);
    }
  };

  undo = () => {
    for (let i = 0; i < this.figures.length; i++) {
      this.figures[i].position(this.lastPostions[i]);
    }
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
  MovementCommand,
  ColorBorderCommand,
  BorderSizeCommand,
  TextCommand,
};
