import { preferences } from "./preferences";

export const drawTriangle = (context, shape) => {
  const width = shape.getAttr("width");
  const height = shape.getAttr("height");
  context.beginPath();
  context.moveTo(width / 2, 0);
  context.lineTo(width, height);
  context.lineTo(0, height);
  context.closePath();
  context.fill();
  context.fillStrokeShape(shape);
  DrawText(context, width, shape, height);
};

export const drawRect = (context, shape) => {
  const width = shape.getAttr("width");
  const height = shape.getAttr("height");
  context.beginPath();
  context.lineTo(width, 0);
  context.lineTo(width, height);
  context.lineTo(0, height);
  context.lineTo(0, 0);
  context.closePath();
  context.fill();
  context.fillStrokeShape(shape);
  DrawText(context, width, shape, height);
};

export const drawCircle = (context, shape) => {
  const width = shape.getAttr("width");
  const height = shape.getAttr("height");
  context.beginPath();
  context.arc(width / 2, height / 2, width / 2, 0, 2 * Math.PI);
  context.closePath();
  context.fill();
  context.fillStrokeShape(shape);
  DrawText(context, width, shape, height);
};

export const drawHeart = (context, shape) => {
  context.beginPath();
  const width = shape.getAttr("width");
  const height = shape.getAttr("height");
  const offset = 24;

  const bezier1 = {
    x: width - width / 6,
    y: -height / 4,
  };

  const bezier2 = {
    x: width + width / 6,
    y: height / 4,
  };

  const bezier3 = {
    x: width / 6,
    y: -height / 4,
  };

  const bezier4 = {
    x: -width / 6,
    y: height / 4,
  };

  context.moveTo(width / 2, offset);
  context.bezierCurveTo(
    bezier1.x,
    bezier1.y,
    bezier2.x,
    bezier2.y,
    width - offset / 2,
    height / 2
  );

  context.lineTo(width / 2, height);
  context.lineTo(offset / 2, height / 2);

  context.bezierCurveTo(
    bezier4.x,
    bezier4.y,
    bezier3.x,
    bezier3.y,
    width / 2,
    offset
  );

  context.closePath();
  context.fill();
  context.fillStrokeShape(shape);
  DrawText(context, width, shape, height);
};

const DrawText = (context, width, shape, height) => {
  const text = shape.getAttr("text") || "";
  const line = 50;
  context.font = preferences.defaultFigureText;
  context.fillStyle = preferences.defaultTextColor;
  const splitedText = splitString(text);
  const spacing = 20;

  for (let i = 0; i < splitedText.length; i++) {
    const totalTextWidth = splitedText[i]
      .split("")
      .reduce(
        (total, character) => total + context.measureText(character).width,
        0
      );
    let xText =
      (width - totalTextWidth - (splitedText[i].length - 1) * spacing) / 2;
    const yText = height / 2 + i * line - splitedText.length * (line / 5);

    for (let j = 0; j < splitedText[i].length; j++) {
      const character = splitedText[i][j];
      context.fillText(character, xText, yText);

      xText += context.measureText(character).width + spacing;
    }
  }
};

const splitString = (text) => {
  const max = 15;
  let counter = 0;
  let maxCount = 0;
  let strings = [];
  for (let i = 0; i < text.length; i++) {
    counter++;
    if (counter % max === 0) {
      strings.push(text.slice(maxCount, counter));
      maxCount += max;
    }
  }
  strings.push(text.slice(maxCount, text.length));

  return strings;
};
