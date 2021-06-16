import pretty from "pretty";
import dayjs from "dayjs";
import { stripIndent } from "common-tags";
import { v4 } from "uuid";
import shortUid from "short-uuid";
import { DropResult } from "smooth-dnd";
import { AnimationType, MediaType, MinimumCanvasSize, QuizType } from "~/common/static-data";
import { QResult, SlideType } from "~/typings/types";
import { formattingUtils } from "~/utils/utils-formatting";
import { quillUtils } from "~/utils/utils-quill";

function singleSlideConstructor(slide: SlideType) {
  const subfolderPath = "assets"; // "data";

  return stripIndent(`
    <section>
      <h1 class="slide-title">${formattingUtils.furiganaTemplateToHTML(slide.title ?? "")}</h1>
      ${slide.slideBlocks
        .map((block) => {
          // Tìm trong danh sách animation mà có blockId trùng thì lấy ra xử lý.
          const anim = slide.animations.findIndex((n) => n.blockId === block.id);
          let animAppend = "";

          if (anim !== -1) {
            // Thống nhất dặt fragment-index bắt đầu từ 1
            animAppend = `class="fragment" data-fragment-index="${anim + 1}" `;
          }

          if (block.type === MediaType.VIDEO) {
            const sizeAppend = `${
              block.size ? `width="${block.size.w}" height="${block.size.h}"` : ""
            }`;
            const positionAppend = `${
              block.position ? `style="left: ${block.position.x}; top: ${block.position.y}"` : ""
            }`;
            return stripIndent(`
            <video class="r-stack" src="${subfolderPath}/${block.assetName}"
              ${animAppend}
              ${sizeAppend}
              ${positionAppend}
              ${block.autoPlay ? "data-autoplay" : ""}
            />
            `);
          }

          if (block.type === MediaType.IMAGE) {
            const sizeAppend = `${
              block.size ? `width: ${block.size.w}px; height: ${block.size.h}px; ` : ""
            }`;
            const positionAppend = `${
              block.position
                ? `position: absolute; left: ${block.position.x}px; top: ${block.position.y}px;`
                : ""
            }`;
            const styleAppend = (dataIn: string) => `style="${dataIn}"`;
            return stripIndent(`
            <img src="${subfolderPath}/${block.assetName}"
              ${animAppend}
              ${styleAppend(sizeAppend + positionAppend)}
              ${block.autoPlay ? "data-autoplay" : ""}
            />`);
          }

          if (block.type === MediaType.TEXT_BLOCK) {
            const ops = block.deltaContent?.ops;
            const html = quillUtils.quillDeltaToHtml(ops!);
            // Last line is to remove line breaks.
            const styleAppend = `
              position: absolute;
              padding: 12px 15px;
              user-select: auto;
              width: auto;
              height: auto;
              display: inline-block;
              top: ${block.position?.y}px;
              left: ${block.position?.x}px;
              box-sizing: border-box;
              flex-shrink: 0;
            `
              .replace(/(\r\n|\n|\r)/gm, "")
              .replace(" ", "");

            const result = pretty(
              stripIndent(`
              <div style="${styleAppend}" ${animAppend}">
                ${formattingUtils.furiganaTemplateToHTML(html)}
              </div>
            `)
            );

            return result;
          }

          // Ta chỉ xử lý những audio trong danh sách animation
          // vì nếu không đưa vào danh sách animation, audio sẽ luôn bật ở chế độ nền.
          if (block.type === MediaType.AUDIO && anim !== -1) {
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

            const wrapperStyleAppend = `
              position: absolute;
              width: 100%;
              height: 100%
              left: 0;
              top: 0;
            `;

            const styleAppend = `
              position: absolute;
              padding: 10px;
              border: 1px solid black;
              width: ${block.size?.w || 1}px;
              height: ${block.size?.h || 1}px;
              top: ${block.position?.y}px;
              left: ${block.position?.x}px;
              box-sizing: border-box;
            `;

            return `
            <div style="${wrapperStyleAppend}" ${animAppend}">
              <article class="interactive-callout" style="${styleAppend}">
                ${html}
              </article>
              <svg style="position: absolute; width: ${MinimumCanvasSize.WIDTH}px; height: ${MinimumCanvasSize.HEIGHT}px; top: 0; left: 0;">
                <polyline points="${leg1.x},${leg1.y} ${anchor.x},${anchor.y} ${leg2.x},${leg2.y}" fill="transparent" stroke="black"
                  style="position: absolute;"
                />
                Trình duyệt không hỗ trợ hiển thị
              </svg>
            </div>
            `;
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
  convertToMutableData: (inputData: Record<string, any> | Array<any>) => {
    return JSON.parse(JSON.stringify(inputData));
  },
  convertToHtmlSlideData: (slides: SlideType[]) => {
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
        <link rel="stylesheet" href="./vendor/themes/white.css" id="theme" />
        <link rel="stylesheet" href="./vendor/reset.css" />
        <link rel="stylesheet" href="./vendor/custom.css" />
      </head>

      <body>
        <div class="reveal">
          <div class="slides">
            ${slides.map((slide) => singleSlideConstructor(slide)).join("\n")}
          </div>
        </div>

        <script src="./vendor/reveal.js"></script>
        <script src="./vendor/plugins/audio-plugin.js"></script>
        <script>
          Reveal.initialize({
            plugins: [ RevealAudioSlideshow ],
            audio: {
              defaultAudios: false,
              playerOpacity: 0,
              startAtFragment: true,
              autoplay: true,
            },
            hash: true,
            controls: true,
            disableLayout: false,
            width: ${MinimumCanvasSize.WIDTH},
            height: ${MinimumCanvasSize.HEIGHT},
            center: false,
          });
        </script>
      </body>

      </html>
      `;

    return pretty(templateStr);
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
