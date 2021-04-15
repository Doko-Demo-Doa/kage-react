import { useEffect, useRef } from "react";
import { Modal } from "antd";
import Konva from "konva";
import { Stage, Layer, Image, Transformer } from "react-konva";
import html2canvas from "html2canvas";
import ReactQuill from "react-quill";
import { useRecoilState } from "recoil";
import { MediaType, MinimumCanvasSize } from "~/common/static-data";
import { emitter } from "~/services/events-helper";
import { canvasHelper } from "~/routes/authen/builder/slide-builder/slide-interactive-editor/canvas-helper";
import { slideListState } from "~/atoms/slide-list-atom";
import { slideBuilderState } from "~/atoms/slide-builder-atom";
import { fileUtils } from "~/utils/utils-files";

import "react-quill/dist/quill.snow.css";
import "~/routes/authen/builder/slide-builder/slide-interactive-editor/slide-interactive-editor.scss";

export const SlideInteractiveEditor: React.FC = () => {
  const layerRef = useRef<Konva.Layer>(null);
  const quillRef = useRef<ReactQuill>(null);
  const tRef = useRef<Transformer>(null);

  const [slideList, setSlideList] = useRecoilState(slideListState);
  const [slideBuilderMeta] = useRecoilState(slideBuilderState);

  useEffect(() => {
    emitter.on("insert-image", (imgUrl) => {
      const layer = layerRef.current;
      if (layer) {
        const mediaType = fileUtils.detectMediaType(imgUrl);
        if (mediaType === MediaType.IMAGE) {
          canvasHelper.insertImageCanvas(layer, imgUrl);
        } else if (mediaType === MediaType.VIDEO) {
          canvasHelper.insertVideoCanvas(layer, imgUrl);
        }
      }
    });

    emitter.on("insert-rich-text", () => {
      Modal.success({
        title: "Chỉnh sửa chữ",
        width: 700,
        content: (
          <>
            <ReactQuill
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["clean"],
                ],
              }}
              ref={quillRef}
              theme="snow"
            />
          </>
        ),
        onOk: () => {
          const txt = quillRef.current?.getEditor().getBounds(0);
          console.log(txt);

          html2canvas(document.querySelector(".ql-editor")!, {
            backgroundColor: "rgba(0,0,0,0)",
          }).then((canvas) => {
            const layer = layerRef.current;
            if (layer) {
              const shape = new Konva.Image({
                image: undefined,
                x: 10,
                y: 10,
                draggable: true,
                dash: [2],
                dashEnabled: true,
                stroke: "#ffb81c",
                scaleX: 1 / window.devicePixelRatio,
                scaleY: 1 / window.devicePixelRatio,
              });
              layer.add(shape);
              shape.image(canvas);
              layer.draw();
            }
          });
        },
      });
    });
    return () => {
      emitter.off("insert-image", () => null);
      emitter.off("insert-rich-text", () => null);
    };
  }, []);

  return (
    <>
      <div id="slide-interactive-editor">
        <div id="editor-container" />

        <Stage width={MinimumCanvasSize.WIDTH} height={MinimumCanvasSize.HEIGHT}>
          <Layer ref={layerRef}>
            {slideList[slideBuilderMeta.selectedIndex]?.slideBlocks.map((n, idx) => {
              return (
                <Transformer key={idx}>
                  <Image key={idx} image={undefined} />
                </Transformer>
              );
            })}
          </Layer>
        </Stage>
      </div>
    </>
  );
};
