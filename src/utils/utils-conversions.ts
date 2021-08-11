import { Metadata } from "sharp";
import { remote } from "electron";
import path from "path";
import dayjs from "dayjs";
import fs from "fs-extra";
import { ffmpegPath, ffprobePath } from "ffmpeg-ffprobe-static";
import { FFProbeMetaType, MediaReturnType, MediaStreamType } from "~/typings/types";
import { fileUtils } from "~/utils/utils-files";
import { MediaType } from "~/common/static-data";

const OptimalImageSize = {
  width: 1800,
  height: 1200,
};

function getFfmpegPath(isProbe?: boolean) {
  const firstPart = path.join(
    remote.app.getAppPath().replace("app.asar", "app.asar.unpacked"),
    "node_modules/ffmpeg-ffprobe-static"
  );
  if (isProbe) {
    return path.join(firstPart, ffprobePath || "");
  }

  const p = path.join(firstPart, ffmpegPath || "");
  return p;
}

export const audioUtils = {
  checkAudioMetadata: (filePath: string): Promise<MediaStreamType> => {
    const remote = require("electron").remote;
    const ffmpeg = remote.require("fluent-ffmpeg");

    return new Promise((resolve, reject) => {
      ffmpeg
        .setFfmpegPath(getFfmpegPath())
        .input(filePath)
        .ffprobe(0, function (err: any, data: FFProbeMetaType) {
          if (data) {
            const audioStream = data.streams.find((n) => n.codec_type === "audio");
            if (audioStream) {
              return resolve(audioStream);
            }
          }
          reject(err);
        });
    });
  },
  /**
   * Convert to MP3
   * @param filePath file path đầu vào.
   * @param progressCallback
   */
  optimizeAudio: (
    filePath: string,
    outputPath?: string,
    progressCallback?: (
      percent: number | string,
      filePath: string,
      fileName: string,
      extension: string
    ) => void
  ) => {
    const remote = require("electron").remote;
    const ffmpeg = remote.require("fluent-ffmpeg");
    const path = remote.require("path");
    const isAudio = fileUtils.detectMediaType(filePath) === MediaType.AUDIO;

    const NORMALIZED_EXT = "mp3";

    if (isAudio) {
      // Đầu tiên ta convert audio với file name là <unix timestamp>.<đuôi file>
      const tempName = `${dayjs().unix()}.${NORMALIZED_EXT}`;
      const dest = path.join(outputPath || fileUtils.getCacheDirectory("assets"), tempName);
      const cmd = ffmpeg()
        .setFfmpegPath(getFfmpegPath())
        .noVideo()
        .audioCodec("libmp3lame")
        .on("progress", function (data: any) {
          // console.log("[ffmpeg]:", data);
          progressCallback?.(data.percent, "", "", "");
        })
        .on("end", function () {
          // Sau khi convert xong thì tính toán CRC32 (1 dạng hash giống MD5 nhưng ngắn hơn) của file đầu ra và đặt tên cho nó.
          const newName = fileUtils.getCRC32(dest);
          const newDest = path.join(
            outputPath || fileUtils.getCacheDirectory("assets"),
            `${newName}.${NORMALIZED_EXT}`
          );
          fs.renameSync(dest, newDest);
          progressCallback?.("end", newDest, newName, NORMALIZED_EXT);
        })
        .on("error", function (error: any) {
          console.log("[ffmpeg error]:", error);
        })
        .input(filePath)
        .output(dest);
      cmd.run();
    } else {
      console.log("[ffmpeg]", "Input file is not a valid audio");
    }
  },
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
    if (width > OptimalImageSize.width || height > OptimalImageSize.height) return false;
    return true;
  },

  /**
   * Optimize the image, it will convert input image into JPEG format at the app's cache directory.
   * @param filePath Input file path, use "path.join" to concentrate directories.
   * @returns Optimized file path.
   */
  optimizeImage: async (filePath: string, customOutput?: string): Promise<MediaReturnType> => {
    const remote = require("electron").remote;
    const path = remote.require("path");
    const sharp = remote.require("sharp");

    const imageMetadata = await sharp(filePath).metadata();
    const { width, height, format } = imageMetadata;

    const newWidth = Math.min(OptimalImageSize.width, width);
    const newHeight = Math.min(OptimalImageSize.height, height);

    const data = sharp(filePath)
      .resize({
        width: newWidth,
        height: newHeight,
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toFormat(format);

    const dataBuf = await data.toBuffer();
    const crc32 = remote.require("crc").crc32;
    const name = crc32(dataBuf).toString(16);

    const dest = path.join(
      customOutput || fileUtils.getCacheDirectory("assets"),
      `${name}.${format}`
    );

    const newMeta = await sharp(dataBuf).metadata();

    fs.writeFileSync(dest, dataBuf);

    const result = {
      filePath: dest,
      fileName: name,
      extension: format,
      extra: {
        width: newMeta.width,
        height: newMeta.height,
      },
    };

    return result;
  },
};

export const ffmpegUtils = {
  isTooBig: (width: number, height: number) => {
    if (width > 848 || height > 480) return true;
    return false;
  },

  checkVideoMetadata: (filePath: string): Promise<MediaStreamType> => {
    const remote = require("electron").remote;
    const ffmpeg = remote.require("fluent-ffmpeg");

    return new Promise((resolve, reject) => {
      ffmpeg()
        .setFfmpegPath(getFfmpegPath())
        .input(filePath)
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

  optimizeVideo: (
    filePath: string,
    inputWidth: number,
    progressCallback?: (
      percent: number | string,
      filePath: string,
      fileName: string,
      extension: string,
      outputRatio: number
    ) => void
  ) => {
    const remote = require("electron").remote;
    const ffmpeg = remote.require("fluent-ffmpeg");
    const path = remote.require("path");
    const isVideo = /\.(gif|mkv|mp4|wmv|avi|webp)$/i.test(filePath);

    const ratio = (848 / inputWidth) * 100;

    if (isVideo) {
      const tempName = `${dayjs().unix()}.mp4`;
      const dest = path.join(fileUtils.getCacheDirectory("assets"), tempName);
      const cmd = ffmpeg()
        .setFfmpegPath(getFfmpegPath())
        .on("start", function (ffmpegCommand: string) {
          console.log("[ffmpeg command]:", ffmpegCommand);
        })
        .on("progress", function (data: any) {
          // console.log("[ffmpeg]:", data);
          progressCallback?.(data.percent, "", "", "", 0);
        })
        .on("end", function () {
          const videoExt = "mp4";
          const videoName = fileUtils.getCRC32(dest);
          const newName = `${videoName}.${videoExt}`;

          const newDest = path.join(fileUtils.getCacheDirectory("assets"), newName);
          fs.renameSync(dest, newDest);
          progressCallback?.("end", newDest, videoName, videoExt, ratio);
        })
        .on("error", function (error: any) {
          console.log("[ffmpeg error]:", error);
        })
        .input(filePath)
        .size(`${ratio.toFixed(0)}%`)
        .output(dest);
      cmd.run();
    } else {
      console.log("[ffmpeg]", "Input file is not a valid video");
    }
  },
};
