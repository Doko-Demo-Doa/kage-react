import { DeltaOperation } from "quill";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

export const quillUtils = {
  quillDeltaToHtml: function quillDeltaToHtml(ops: DeltaOperation[]) {
    const converter = new QuillDeltaToHtmlConverter(ops!, {});
    const html = converter.convert();
    return html;
  },
};
