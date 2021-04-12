import Konva from "konva";

export const canvasHelper = {
  insertImageCanvas: (layerNode: Konva.Layer, imgUrl: string) => {
    Konva.Image.fromURL(imgUrl, function (imgNode: Konva.Image) {
      imgNode.setAttrs({
        name: "rect",
        draggable: true,
        x: 200,
        y: 50,
        scaleX: 0.3,
        scaleY: 0.3,
      });

      console.log(imgNode);

      const imgTransformer = new Konva.Transformer({
        enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
        nodes: [imgNode],
        keepRatio: true,
        boundBoxFunc: (oldBox, newBox) => {
          if (newBox.width < 10 || newBox.height < 10) {
            return oldBox;
          }
          return newBox;
        },
      });

      layerNode.add(imgNode);
      layerNode.add(imgTransformer);
      layerNode.draw();
    });
  }
};
