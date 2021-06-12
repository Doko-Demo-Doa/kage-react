import dayjs from "dayjs";
import { SlideType } from "~/typings/types";
import { dataUtils } from "~/utils/utils-data";

export const commonHelper = {
  // Chuẩn bị dữ liệu chuẩn cho file manifest.json
  prepareExportData: (list: SlideType[]) => {
    const data = {
      id: dataUtils.generateUid(),
      lastModification: dayjs().unix(),
      alias: "",
      layout: list,
    };

    const exportData = JSON.stringify(data, null, 2);

    return exportData;
  },
};
