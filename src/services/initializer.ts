import { fileUtils } from "~/utils/utils-files";

export function initializeApp() {
  fileUtils.createCacheDir();
}
