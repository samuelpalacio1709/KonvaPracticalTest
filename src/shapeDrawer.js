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
};
