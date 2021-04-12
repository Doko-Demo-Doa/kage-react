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
  },

  insertVideoCanvas: (layer: Konva.Layer, imgUrl: string) => {
    const video = document.createElement("video");
    video.src = imgUrl;

    const image = new Konva.Image({
      image: video,
      draggable: true,
      x: 50,
      y: 20,
    });

    const imgTransformer = new Konva.Transformer({
      enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
      nodes: [image],
      keepRatio: true,
      boundBoxFunc: (oldBox, newBox) => {
        if (newBox.width < 10 || newBox.height < 10) {
          return oldBox;
        }
        return newBox;
      },
    });

    layer.add(image);
    layer.add(imgTransformer);

    const anim = new Konva.Animation(function () {
      // Animation just need to update the layer
    }, layer);

    image.on("click", function () {
      video.pause();
    });

    image.on("dblclick", function () {
      video.pause();
      video.currentTime = 0;
      video.play();
    });

    video.onloadedmetadata = function () {
      image.width(video.videoWidth / 2);
      image.height(video.videoHeight / 2);
      layer.draw();

      video.play();
      anim.start();
    };
  },
};
