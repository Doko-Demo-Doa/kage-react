import parse, { HTMLReactParserOptions } from "html-react-parser";
import { DeltaOperation } from "quill";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

function replaceString(str: string, strSub: string, strReplace: string) {
  const result = str.replace(strSub, strReplace);
  return result;
}

function furiganaTemplateToHTML(inputStr: string) {
  const rxp = /{([^}]+)}/g;
  const matched = rxp.exec(inputStr);
  if (matched?.[1]) {
    const ruby = inputStr
      .replace(/{/g, "<ruby>")
      .replace(/}/g, "</ruby>")
      .replaceAll("(", "<rt>")
      .replaceAll(")", "</rt>");
    return ruby;
  }

  return inputStr;
}

function htmlToJSX(inputHtml: string, options?: HTMLReactParserOptions) {
  return parse(furiganaTemplateToHTML(inputHtml), options);
}

function quillDeltaToHtml(ops: DeltaOperation[]) {
  const converter = new QuillDeltaToHtmlConverter(ops!, {});
  const html = converter.convert();
  return html;
}

export const formattingUtils = {
  replaceString,
  furiganaTemplateToHTML,
  htmlToJSX,
  quillDeltaToHtml,
  trimTextTo: (input: string, maxLength: number) => {
    if (!input) return "";
    if (input.length > maxLength) {
      const trimmed = input.substr(0, maxLength);
      return `${trimmed}...`;
    }
    return input;
  },
  furiganaToJSX: (input: string) => {
    return formattingUtils.htmlToJSX(formattingUtils.furiganaTemplateToHTML(input));
  },
};
