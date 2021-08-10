import { DeltaOperation } from "quill";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

export const quillUtils = {
  quillDeltaToHtml: function quillDeltaToHtml(ops?: DeltaOperation[]) {
    if (!ops) return "";
    // Configuration object: https://github.com/nozer/quill-delta-to-html#configuration
    const converter = new QuillDeltaToHtmlConverter(ops, {});
    const html = converter.convert();
    return html;
  },
};
