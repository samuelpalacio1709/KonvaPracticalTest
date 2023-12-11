import * as Konva from "konva";
import { preferences } from "./preferences.js";

//Multiselector implementation suggested by Konva documentation
export const createMultiselector = (editor) => {
  const layer = editor.mainLayer;
  const tr = editor.transformer;
  const stage = editor.stage;

  const selectionRectangle = new Konva.Rect({
    fill: preferences.defaultSelectorFill,
    strokeWidth: 2,
    stroke: preferences.defaultSelectorStroke,
    visible: false,
  });
  layer.add(selectionRectangle);

  let x1, y1, x2, y2;
  stage.on("mousedown touchstart", (e) => {
    if (e.target !== stage) return;
    e.evt.preventDefault();
    x1 = stage.getPointerPosition().x;
    y1 = stage.getPointerPosition().y;
    x2 = stage.getPointerPosition().x;
    y2 = stage.getPointerPosition().y;

    selectionRectangle.visible(true);
    selectionRectangle.width(0);
    selectionRectangle.height(0);
  });

  stage.on("mouseout touchend", (e) => {
    if (!e.pointerId) {
      resetSelection();
    }
  });

  stage.on("mousemove touchmove", (e) => {
    if (!selectionRectangle.visible()) {
      return;
    }

    e.evt.preventDefault();
    x2 = stage.getPointerPosition().x;
    y2 = stage.getPointerPosition().y;

    selectionRectangle.setAttrs({
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
    });
  });

  stage.on("mouseup touchend", (e) => {
    if (!selectionRectangle.visible()) {
      return;
    }
    e.evt.preventDefault();

    setTimeout(() => {
      resetSelection();
    });

    var shapes = stage.find(".figure");
    var box = selectionRectangle.getClientRect();

    var selected = shapes.filter((shape) =>
      Konva.Util.haveIntersection(box, shape.getClientRect())
    );
    if (selectionRectangle.visible()) {
      tr.nodes(selected);
    }

    if (tr.nodes().length > 1) {
      editor.changeSelection(null);
    }
  });

  stage.on("click tap", function (e) {
    if (e.target === stage) {
      tr.nodes([]);
      resetSelection();
      editor.changeSelection(null);
      return;
    }

    if (selectionRectangle.visible()) {
      return;
    }

    if (!e.target.hasName("figure")) {
      return;
    }

    const keyPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = tr.nodes().indexOf(e.target) >= 0;

    if (!keyPressed && !isSelected) {
      tr.nodes([e.target]);
    } else if (keyPressed && isSelected) {
      const nodes = tr.nodes().slice();
      nodes.splice(nodes.indexOf(e.target), 1);
      tr.nodes(nodes);
    } else if (keyPressed && !isSelected) {
      const nodes = tr.nodes().concat([e.target]);
      tr.nodes(nodes);
    }

    if (tr.nodes().length > 1) {
      editor.changeSelection(null);
    }
  });

  const resetSelection = () => {
    selectionRectangle.width(0);
    selectionRectangle.height(0);
    selectionRectangle.x(0);
    selectionRectangle.y(0);
    selectionRectangle.visible(false);
  };
};
