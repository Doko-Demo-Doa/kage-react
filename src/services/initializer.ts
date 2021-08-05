import { fileUtils } from "~/utils/utils-files";

// Tạm chưa xài
export function initializeApp() {
  fileUtils.clearCacheDir();
  fileUtils.createCacheDir();
}
