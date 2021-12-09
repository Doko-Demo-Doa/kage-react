import htmlFormat from "html-format";
import dayjs from "dayjs";
import { stripIndent } from "common-tags";
import { v4 } from "uuid";
import shortUid from "short-uuid";
import { DropResult } from "smooth-dnd";
import { AnimationType, MediaType, MinimumCanvasSize, QuizType } from "~/common/static-data";
import { QResult, SlideType } from "~/typings/types";
import { formattingUtils } from "~/utils/utils-formatting";
import { quillUtils } from "~/utils/utils-quill";

const ADDITIONAL_WIDTH_PX = 2;

function singleSlideConstructor(slide: SlideType, markHiddenSlides: boolean, slideIdx?: number) {
  const subfolderPath = "assets"; // "data";

  const bgStr = slide.background
    ? `data-background-image="./vendor/backgrounds/${slide.background}"}`
    : "";

  const titleStyleAppend = slide.titleFontSize ? `style="font-size: ${slide.titleFontSize}px"` : "";

  return stripIndent(`
    <section ${bgStr} ${markHiddenSlides ? 'data-visibility="hidden"' : ""}>
      <h1 class="slide-title" ${titleStyleAppend}>${formattingUtils.furiganaTemplateToHTML(
    slide.title ?? ""
  )}</h1>
      ${slide.slideBlocks
        .map((block, idx) => {
          // Xử lý layer tương tự bên slide-block-v2
          const layer = Math.abs(slide.slideBlocks.length - idx);

          // Tìm trong danh sách animation mà có blockId trùng thì lấy ra xử lý.
          const anim = slide.animations.find((n) => n.blockId === block.id);
          let animAppend = "";

          if (anim && !anim.mediaAutoplay) {
            // Thống nhất dặt fragment-index bắt đầu từ 1
            animAppend = `class="fragment" data-fragment-index="${anim.animationIndex}" `;
          }

          if (block.type === MediaType.VIDEO) {
            const sizeAppend = `${
              block.size
                ? `width: ${Math.ceil(block.size.w)}px; height: ${Math.ceil(block.size.h)}px; `
                : ""
            }`;
            const positionAppend = `${
              block.position
                ? `position: absolute; left: ${block.position.x}px; top: ${block.position.y}px;`
                : ""
            }`;

            const styleAppender = (dataIn: string) => `style="${dataIn} z-index: ${layer};"`;
            return stripIndent(`
            <div
              ${animAppend}
              ${styleAppender(sizeAppend + positionAppend)}>
              <video class="r-stack" src="${subfolderPath}/${block.assetName}" style="width: 100%;"
                ${block.autoPlay ? "data-autoplay" : ""}
              />
            </div>
            `);
          }

          if (block.type === MediaType.IMAGE) {
            const sizeAppend = `${
              block.size
                ? `width: ${Math.ceil(block.size.w)}px; height: ${Math.ceil(block.size.h)}px; `
                : ""
            }`;
            const positionAppend = `${
              block.position
                ? `position: absolute; left: ${block.position.x}px; top: ${block.position.y}px;`
                : ""
            }`;

            const styleAppender = (dataIn: string) => `style="${dataIn} z-index: ${layer};"`;
            return stripIndent(`
            <img src="${subfolderPath}/${block.assetName}"
              ${animAppend}
              ${styleAppender(sizeAppend + positionAppend)}
            />`);
          }

          if (block.type === MediaType.TEXT_BLOCK) {
            const ops = block.deltaContent?.ops;
            const html = quillUtils.quillDeltaToHtml(ops!);
            // Last line is to remove line breaks.
            const styleAppend = stripIndent(`
              z-index: ${layer};
              position: absolute;
              padding: 10px;
              user-select: auto;
              width: ${block.size?.w ? block.size?.w + ADDITIONAL_WIDTH_PX + "px" : "auto"};
              height: auto;
              display: inline-block;
              background-color: ${block.bgColor || "unset"};
              top: ${block.position?.y}px;
              left: ${block.position?.x}px;
              box-sizing: border-box;
            `)
              .replace(/(\r\n|\n|\r)/gm, "")
              .replace(" ", "");

            const result = htmlFormat(
              stripIndent(`
              <div style="${styleAppend}" ${animAppend}>
                ${formattingUtils.furiganaTemplateToHTML(html)}
              </div>
            `)
            );

            return result;
          }

          // Append những audio có mediaAutoplay = true
          // Các audio này luôn chạy khi vào đầu trang.
          if (block.type === MediaType.AUDIO && anim?.mediaAutoplay) {
            return `
            <audio
              data-audio-index="${slideIdx || 0}"
              src="${subfolderPath}/${block.assetName}">
            </audio>`;
          }
          // Ta chỉ xử lý những audio trong danh sách animation
          // vì nếu không đưa vào danh sách animation, audio sẽ luôn bật ở chế độ nền.
          if (block.type === MediaType.AUDIO && anim?.animationIndex !== -1) {
            return `
            <p
              ${animAppend}
              data-audio-src="${subfolderPath}/${block.assetName}">
            </p>`;
          }

          if (block.type === MediaType.CALLOUT) {
            const ops = block.deltaContent?.ops;
            const html = quillUtils.quillDeltaToHtml(ops!);

            const shiftLeg1 = (block.size?.w || 0) * 0.35;
            const shiftLeg2 = Math.min(
              (block.size?.w || 0) * 0.75,
              (block.size?.w || 0) * 0.35 + 120
            );

            const leg1 = {
              x: (block.position?.x || 0) + shiftLeg1,
              y: (block.position?.y || 0) + (block.size?.h || 0),
            };
            const leg2 = {
              x: (block.position?.x || 0) + shiftLeg2,
              y: (block.position?.y || 0) + (block.size?.h || 0),
            };

            const anchor = block.anchor!;

            const wrapperStyleAppend = stripIndent(`
              z-index: ${layer};
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0;
              top: 0;
            `);

            // Tham khảo class .callout-inside
            const styleAppend = stripIndent(`
              position: absolute;
              padding: 10px;
              padding-top: 16px;
              border-radius: 6px;
              background-color: ${block.bgColor};
              width: ${(block.size?.w || 1) + ADDITIONAL_WIDTH_PX}px;
              top: ${block.position?.y}px;
              left: ${block.position?.x}px;
              box-sizing: border-box;
            `);

            return stripIndent(`
            <div style="${wrapperStyleAppend}" ${animAppend}>
              <article class="interactive-callout" style="${styleAppend}">
                ${formattingUtils.furiganaTemplateToHTML(html)}
              </article>
              <svg style="position: absolute; z-index: -1; width: ${
                MinimumCanvasSize.WIDTH
              }px; height: ${MinimumCanvasSize.HEIGHT}px; top: 0; left: 0;">
                <polyline points="${leg1.x},${leg1.y} ${anchor.x},${anchor.y} ${leg2.x},${
              leg2.y
              }" fill="${block.bgColor}" stroke="${block.bgColor}"
                  style="position: absolute;"
                />
                Trình duyệt không hỗ trợ hiển thị
              </svg>
            </div>
            `);
          }
          return `<div>${block.content}</div>`;
        })
        .join("\n")}
    </section>`);
}

function generateShortUid() {
  return shortUid.generate().toString();
}

export const dataUtils = {
  convertToHtmlSlideData: (slides: SlideType[], shouldMarkHidden: boolean) => {
    // Convert từng slide vào template HTML
    // Xem file template.ts để biết khuôn dạng.
    const templateStr = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />

        <title>Dora Presentation Player</title>

        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        <link rel="stylesheet" href="./vendor/reveal.css" />
        <link rel="stylesheet" href="./vendor/reset.css" />
        <link rel="stylesheet" href="./vendor/default.css" id="theme" />
        <link rel="stylesheet" href="./vendor/custom.css" />
      </head>

      <body>
        <div class="reveal">
          <div class="slides">
            ${slides
              .map((slide, idx) => {
                return singleSlideConstructor(slide, shouldMarkHidden && !!slide.isHidden, idx);
              })
              .join("\n")}
          </div>
        </div>

        <script src="./vendor/reveal.js"></script>
        <script src="./vendor/plugins/audio-plugin.js"></script>
        <script>
          // https://revealjs.com/markup/
          Reveal.initialize({
            plugins: [ RevealAudioSlideshow ],
            audio: {
              defaultAudios: false,
              playerOpacity: 0,
              startAtFragment: true,
              advance: -1,
              autoplay: true,
            },
            hash: true,
            controls: false,
            slideNumber: true,
            disableLayout: false,
            width: ${MinimumCanvasSize.WIDTH},
            height: ${MinimumCanvasSize.HEIGHT},
            center: false,
            overview: false,
            postMessage: true,
            postMessageEvents: true,
          });

          Reveal.on('ready', event => {
            autoplayFragmentZero();
          });

          Reveal.on('slidetransitionend', event => {
            const state = Reveal.getState();
            if (state.indexf === -1 || state.indexf === undefined) {
              autoplayFragmentZero();
            }
          });

          Reveal.on('fragmenthidden', event => {
            const state = Reveal.getState();
            if (state.indexf === -1) {
              autoplayFragmentZero();
            }
          });

          // Tìm fragment đầu tiên
          function autoplayFragmentZero() {
            const state = Reveal.getState();
            const targetElem = document.querySelector('[data-audio-index="' + state.indexh + '"]');
            if (targetElem.play) {
              targetElem.play();
            }
          }
        </script>
      </body>

      </html>
      `;

    return htmlFormat(templateStr);
  },
  mapAnimationLabel: (type: AnimationType) => {
    if (type === AnimationType.APPEAR) return "Mờ dần";
    if (type === AnimationType.MOVE) return "Di chuyển";
    return "";
  },
  generateUid: () => {
    return v4();
  },
  generateShortUid,
  generateInitQuizChoices: () => {
    return [
      { id: dayjs().unix().toString(), label: "Lựa chọn 1" },
      { id: (dayjs().unix() + 1).toString(), label: "Lựa chọn 2" },
    ];
  },
  mapQuizLabel: (type: QuizType) => {
    if (type === QuizType.SINGLE_CHOICE) {
      return "Chọn 1 đáp án đúng";
    }
    if (type === QuizType.MULTIPLE_CHOICES) {
      return "Chọn nhiều đáp án";
    }
    if (type === QuizType.SELECT_IN_THE_BLANKS) {
      return "Chọn từ điền chỗ trống";
    }
    return "";
  },
  mapQuizResultLabel: (type: QResult) => {
    if (type === "correct") {
      return "Chính xác";
    }
    if (type === "incorrect") {
      return "Sai";
    }
    if (type === "mixed") {
      return "Đúng một phần";
    }
    return "Không xác định";
  },
  mapMediaTypeName: (type: MediaType) => {
    if (type === MediaType.AUDIO) return "Âm thanh";
    if (type === MediaType.CALLOUT) return "Ô hội thoại";
    if (type === MediaType.IMAGE) return "Ảnh";
    if (type === MediaType.VIDEO) return "Video";
    if (type === MediaType.TEXT_BLOCK) return "Văn bản / chữ";
    return "";
  },
  createSortedList: (arr: Array<any>, dropResult: DropResult) => {
    const { removedIndex, addedIndex, payload } = dropResult;
    if (removedIndex === null && addedIndex === null) return arr;

    const result = [...arr];
    let itemToAdd = payload;

    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    }

    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
    }

    return result;
  },
};
