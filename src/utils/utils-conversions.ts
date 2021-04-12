import { Metadata } from "sharp";
import fs from "fs";
import { FFProbeMetaType, VideoStreamType } from "~/typings/types";
import { fileUtils } from "./utils-files";

const OptimalImageSize = {
  width: 1200,
  height: 675
};

export const imageUtils = {
  checkImageMetadata: async (filePath: string): Promise<Metadata> => {
    const remote = require("electron").remote;
    const sharp = remote.require("sharp");
    const resp = await sharp(filePath).metadata();
    return resp;
  },

  isImageOptimized: (width?: number, height?: number) => {
    if (!width || !height) return false;
    if (width > 1920 || height > 1080) return false;
    return true;
  },

  /**
   * Optimize the image, it will convert input image into JPEG format at the app's cache directory.
   * @param filePath Input file path, use "path.join" to concentrate directories.
   * @returns Optimized file path.
   */
  optimizeImage: async (filePath: string): Promise<string> => {
    const remote = require("electron").remote;

    const path = remote.require("path");
    const sharp = remote.require("sharp");
    const data = sharp(filePath)
      .rotate()
      .resize(OptimalImageSize.width, OptimalImageSize.height)
      .jpeg({ mozjpeg: true });

    const dataBuf = await data.toBuffer();
    const crc32 = remote.require("crc").crc32;
    const name = crc32(dataBuf).toString(16);

    const dest = path.join(fileUtils.getCacheDirectory(), `${name}.jpg`);

    fs.writeFileSync(dest, dataBuf);

    return dest;
  }
};

export const ffmpegUtils = {
  isTooBig: (width: number, height: number) => {
    if (width > 848 || height > 480) return true;
    return false;
  },

  checkVideoMetadata: (filePath: string): Promise<VideoStreamType> => {
    const remote = require("electron").remote;
    const ffmpeg = remote.require("fluent-ffmpeg");

    return new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .ffprobe(0, function (err: any, data: FFProbeMetaType) {
          console.dir(data);
          if (data) {
            const videoStream = data.streams.find((n) => n.codec_type === "video");
            if (videoStream) {
              return resolve(videoStream);
            }
          }
          reject(err);
        });
    });
  },

  convertToMp4: (filePath: string, inputWidth: number, progressCallback?: (percent: number | string) => void) => {
    const remote = require("electron").remote;
    const ffmpeg = remote.require("fluent-ffmpeg");
    const isVideo = (/\.(gif|mkv|mp4|wmv|avi|webp)$/i).test(filePath);

    const ratio = (848 / inputWidth) * 100;

    if (isVideo) {
      const cmd = ffmpeg()
        .on("start", function (ffmpegCommand: string) {
          console.log("[ffmpeg command]:", ffmpegCommand);
        })
        .on("progress", function (data: any) {
          // console.log("[ffmpeg]:", data);
          progressCallback?.(data.percent);
        })
        .on("end", function () {
          console.log("[ffmpeg end]");
          progressCallback?.("end");
        })
        .on("error", function (error: any) {
          console.log("[ffmpeg error]:", error);
        })
        .input(filePath)
        .size(`${ratio.toFixed(0)}%`)
        .output("D:\\test.mp4");
      cmd.run();
    } else {
      console.log("[ffmpeg]", "Input file is not a valid video");
    }
  }
};
