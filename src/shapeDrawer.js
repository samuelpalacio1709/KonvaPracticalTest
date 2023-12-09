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

function DrawText(context, width, shape, height) {
  const text = shape.getAttr("text") || "";
  context.font = preferences.defaultFigureText;
  context.fillStyle = preferences.defaultTextColor;
  const xText = width / 2 - context.measureText(text).width / 2;
  const yText = height / 2;
  context.fillText(text, xText, yText);
}
