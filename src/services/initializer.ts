import { fileUtils } from "~/utils/utils-files";

export function initializeApp() {
  fileUtils.clearCacheDir();
  fileUtils.createCacheDir();
}
