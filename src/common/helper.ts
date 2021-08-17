import dayjs from "dayjs";
import { SlideType } from "~/typings/types";
import { dataUtils } from "~/utils/utils-data";
import { platformUtils } from "~/utils/utils-platform";

export const commonHelper = {
  // Chuẩn bị dữ liệu chuẩn cho file manifest.json
  prepareExportData: (list: SlideType[], rootId?: string) => {
    const data = {
      id: rootId || dataUtils.generateUid(),
      exportedFrom: platformUtils.getAppVersion(),
      lastModification: dayjs().unix(),
      alias: "",
      layout: list,
    };

    const exportData = JSON.stringify(data, null, 2);

    return exportData;
  },
};
