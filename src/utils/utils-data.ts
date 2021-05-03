import fs from "fs";
import pretty from "pretty";
import { stripIndent } from "common-tags";
import { AnimationType, MediaType } from "~/common/static-data";
import { SlideType } from "~/typings/types";
import { fileUtils } from "~/utils/utils-files";

function singleSlideConstructor(slide: SlideType) {
  const subfolderPath = "assets/"; // "data/";

  return stripIndent(`
    <section>
      <h2>${slide.title}</h2>
      ${slide.slideBlocks
        .map((block) => {
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

          if (block.type === MediaType.AUDIO) {
            return `
            <audio src="${subfolderPath}/${block.assetName}"
              ${animAppend}
              ${block.autoPlay ? "data-autoplay" : ""}
            />`;
          }
          return `<div>${block.content}</div>`;
        })
        .join("\n")}
    </section>`);
}

export const dataUtils = {
  convertToMutableData: (inputData: Record<string, any> | Array<any>) => {
    return JSON.parse(JSON.stringify(inputData));
  },
  saveSlideJsonToCache: (jsonData: string) => {
    const p = fileUtils.createFilePathAtCacheDir("manifest.json");
    fs.writeFileSync(p, jsonData);
  },

  writeToHtml: (content: string) => {
    const path = fileUtils.createFilePathAtCacheDir("slide.html");
    fs.writeFileSync(path, content);
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

        <link rel="stylesheet" href="./vendor/reset.css" />
        <link rel="stylesheet" href="./vendor/reveal.css" />
        <link rel="stylesheet" href="./vendor/themes/white.css" id="theme" />
        <link rel="stylesheet" href="./vendor/custom.css" />
      </head>

      <body>
        <div class="reveal">
          <div class="slides">
            ${slides.map((slide) => singleSlideConstructor(slide)).join("\n")}
          </div>
        </div>

        <script src="./vendor/reveal.js"></script>
        <script>
          Reveal.initialize({
            hash: true,
            controls: true,
            disableLayout: false,
            width: 740,
            height: 540,
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
};
