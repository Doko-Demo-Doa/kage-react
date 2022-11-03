import fs from "fs-extra";

fs.copyFileSync(
  "./patches/fluent-ffmpeg.js",
  "./node_modules/fluent-ffmpeg/index.js"
);
