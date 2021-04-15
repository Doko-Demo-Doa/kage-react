import fs from "fs";
import { MediaType } from "~/common/static-data";
import { SlideType } from "~/typings/types";
import { fileUtils } from "~/utils/utils-files";

function singleSlideConstructor(slide: SlideType) {
  return `
    <section>
      <h2>${slide.title}</h2>
      ${slide.slideBlocks.map((block) => {
        if (block.type === MediaType.VIDEO) {
          const sizeAppend = `${
            block.size ? `width="${block.size.w}" height="${block.size.h}"` : ""
          }`;
          const positionAppend = `${
            block.position ? `style="left: ${block.position.x}; top: ${block.position.y}"` : ""
          }`;
          return `
            <video src="data/${block.assetName}"
              ${sizeAppend}
              ${positionAppend}
              ${block.autoPlay ? "data-autoplay" : ""}
            />`;
        }

        if (block.type === MediaType.IMAGE) {
          const sizeAppend = `${
            block.size ? `width="${block.size.w}" height="${block.size.h}"` : ""
          }`;
          const positionAppend = `${
            block.position ? `style="left: ${block.position.x}; top: ${block.position.y}"` : ""
          }`;
          return `
            <img src="data/${block.assetName}"
              ${sizeAppend}
              ${positionAppend}
              ${block.autoPlay ? "data-autoplay" : ""}
            />`;
        }

        if (block.type === MediaType.AUDIO) {
          const sizeAppend = `${
            block.size ? `width="${block.size.w}" height="${block.size.h}"` : ""
          }`;
          const positionAppend = `${
            block.position ? `style="left: ${block.position.x}; top: ${block.position.y}"` : ""
          }`;
          return `
            <audio src="data/${block.assetName}"
              ${sizeAppend}
              ${positionAppend}
              ${block.autoPlay ? "data-autoplay" : ""}
            />`;
        }
        return `
          <div>${block.content}</div>
        `;
      })}
    </section>`;
}

export const dataUtils = {
  saveSlideJsonToCache: (jsonData: string) => {
    const path = fileUtils.createFilePathAtCacheDir("manifest.json");
    fs.writeFileSync(path, jsonData);
  },

  convertToHtmlSlideData: (slides: SlideType[]) => {
    // Convert từng slide vào template HTML
    // Xem file template.ts để biết khuôn dạng.
    return `
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
            ${slides.map((slide) => singleSlideConstructor(slide))}
          </div>
        </div>

        <script src="./reveal.js"></script>
        <script>
          Reveal.initialize({ hash: true });
        </script>
      </body>

      </html>
      `;
  },
};
