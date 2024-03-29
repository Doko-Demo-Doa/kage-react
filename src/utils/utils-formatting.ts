import React from "react";
import dayjs from "dayjs";
import dayjsDuration from "dayjs/plugin/duration";
import reactStringReplace from "react-string-replace";
import parse, { HTMLReactParserOptions } from "html-react-parser";

dayjs.extend(dayjsDuration);

function replaceString(str: string, strSub: string, strReplace: string) {
  const result = str.replace(strSub, strReplace);
  return result;
}

function furiganaTemplateToHTML(inputStr?: string) {
  if (!inputStr) return "";
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

function padZero(num: number, digits: number) {
  return Array(Math.max(digits - String(num).length + 1, 0)).join("0") + num;
}

export const formattingUtils = {
  padZero,
  replaceString,
  furiganaTemplateToHTML,
  htmlToJSX,
  parseHtml: (input: string) => {
    return parse(input);
  },
  replaceData: (input: string) => {
    const newData = input;

    return {
      with: (data: (key: string, pos: number) => React.ReactNode) => {
        const rxp = /\[(.*?)\]/g;
        return reactStringReplace(newData, rxp, (match, i) => {
          return data(match, i);
        });
      },
    };
  },
  trimTextTo: (input: string, maxLength: number) => {
    if (!input) return "";
    if (input.length > maxLength) {
      const trimmed = input.substr(0, maxLength);
      return `${trimmed}...`;
    }
    return input;
  },
  furiganaToJSX: (input: string | undefined) => {
    if (!input) return "";
    return formattingUtils.htmlToJSX(formattingUtils.furiganaTemplateToHTML(input));
  },
  secondsToMinsAndSeconds: (secs: number) => {
    return dayjs.duration(secs, "seconds").format("mm:ss");
  },
};
