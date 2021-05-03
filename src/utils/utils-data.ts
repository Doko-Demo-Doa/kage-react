import fs from "fs";
import pretty from "pretty";
import { stripIndent } from "common-tags";
import { AnimationType, MediaType } from "~/common/static-data";
import { SlideType } from "~/typings/types";
import { fileUtils } from "~/utils/utils-files";

function singleSlideConstructor(slide: SlideType) {
  const subfolderPath = "assets"; // "data";

  return stripIndent(`
    <section>
      <section data-auto-animate>
        <h2>${slide.title}</h2>
        ${slide.slideBlocks
          .map((block) => {
            // Mặc định ta sẽ cho hiển thị tất cả các block trong một <section> con của <section> mẹ.
            // Nếu có animation thì bắt đầu nhân bản các section ra.

            // Tìm trong danh sách animation mà có blockId trùng thì lấy ra xử lý.
            const anim = slide.animations.findIndex((n) => n.blockId === block.id);

            let blockContentHtml = "";

            if (block.type === MediaType.VIDEO) {
              const sizeAppend = `${
                block.size ? `width="${block.size.w}" height="${block.size.h}"` : ""
              }`;
              const positionAppend = `${
                block.position ? `style="left: ${block.position.x}; top: ${block.position.y}"` : ""
              }`;
              blockContentHtml = stripIndent(`
              <video class="r-stack" src="${subfolderPath}/${block.assetName}"
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
              blockContentHtml = stripIndent(`
              <img src="${subfolderPath}/${block.assetName}"
                ${styleAppend(sizeAppend + positionAppend)}
                ${block.autoPlay ? "data-autoplay" : ""}
              />`);
            }

            // Ta chỉ xử lý những audio trong danh sách animation
            // vì nếu không đưa vào danh sách animation, audio sẽ luôn bật ở chế độ nền.
            if (block.type === MediaType.AUDIO && anim !== -1) {
              blockContentHtml = `
              <audio src="${subfolderPath}/${block.assetName}"
                ${block.autoPlay ? "data-autoplay" : ""}
              />`;
            }
            return blockContentHtml;
          })
          .join("\n")}
      </section>

      ${slide.animations.map((ani) => {
        // Hàm khung xương
        const skeleton = (subContent: string) => `
          <section data-auto-animate>
            <h2>${slide.title}</h2>
            ${subContent}
          </section>
        `;
        return "";
      })}
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
