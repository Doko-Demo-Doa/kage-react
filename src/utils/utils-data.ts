import fs from "fs";
import { fileUtils } from "~/utils/utils-files";

export const dataUtils = {
  saveSlideJsonToCache: (jsonData: string) => {
    const path = fileUtils.createFilePathAtCacheDir("manifest.json");
    fs.writeFileSync(path, jsonData);
  }
};
