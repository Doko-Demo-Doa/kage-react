import fs from "fs";
import pretty from "pretty";
import { stripIndent } from "common-tags";
import { MediaType } from "~/common/static-data";
import { SlideType } from "~/typings/types";
import { fileUtils } from "~/utils/utils-files";

function singleSlideConstructor(slide: SlideType) {
  const subfolderPath = "."; // "data/";

  return stripIndent(`
    <section>
      <h2>${slide.title}</h2>
      ${slide.slideBlocks
        .map((block) => {
          if (block.type === MediaType.VIDEO) {
            const sizeAppend = `${
              block.size ? `width="${block.size.w}" height="${block.size.h}"` : ""
            }`;
            const positionAppend = `${
              block.position ? `style="left: ${block.position.x}; top: ${block.position.y}"` : ""
            }`;
            return stripIndent(`
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
            return stripIndent(`
            <img src="${subfolderPath}/${block.assetName}"
              ${styleAppend(sizeAppend + positionAppend)}
              ${block.autoPlay ? "data-autoplay" : ""}
            />`);
          }

          if (block.type === MediaType.AUDIO) {
            return `
            <audio src="${subfolderPath}/${block.assetName}"
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
    const path = fileUtils.createFilePathAtCacheDir("manifest.json");
    fs.writeFileSync(path, jsonData);
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

        <link rel="stylesheet" href="./reveal.css" />
        <link rel="stylesheet" href="./theme/white.css" id="theme" />
      </head>

      <body>
        <div class="reveal">
          <div class="slides">
            ${slides.map((slide) => singleSlideConstructor(slide)).join("\n")}
          </div>
        </div>

        <script src="./reveal.js"></script>
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
};
