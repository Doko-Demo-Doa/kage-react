import { split } from "rambdax";
import parse, { HTMLReactParserOptions } from "html-react-parser";

export function getTextWithCondition(str: string, condition: RegExp | string) {
  const regexStr = new RegExp(condition);
  const result = str.match(regexStr);
  return result;
}

export function formatLine(str: string) {
  const removeLineBreakRegex = new RegExp(/[\r\n]+/g);
  const removeWhiteSpaceRegex = new RegExp(/\s/g);
  let result = null;
  result = str.replace(removeLineBreakRegex, "");
  result = result.replace(removeWhiteSpaceRegex, " ");

  return result;
}

export function getTextBetweenUtag(str: string, regex: RegExp | string) {
  const regexStr = new RegExp(regex);
  const results = str.match(regexStr);
  if (results !== null && results.length > 0) {
    results.forEach((_, index) => {
      results[index] = results[index].replace("<u>", "");
      results[index] = results[index].replace("</u>", " ");
    });
  }
  return results;
}

export function replaceString(str: string, strSub: string, strReplace: string) {
  const result = str.replace(strSub, strReplace);
  return result;
}

export function furiganaTemplateToHTML(inputStr: string) {
  if (inputStr.includes("{{") && inputStr.includes("}}")) {
    const ruby = inputStr
      .replace("{{", "<ruby>")
      .replace("}}", "</ruby>")
      .replace("((", "<rt>")
      .replace("))", "</rt>");
    return ruby;
  }

  return inputStr;
}

export function breakStringByLineBreaks(inputStr: string) {
  let resp = split(/\r?\n/, inputStr);
  if (resp.every((n) => !n)) {
    resp = resp.slice(0, -1);
  }
  return resp;
}

export function htmlToJSX(inputHtml: string, options?: HTMLReactParserOptions) {
  console.log(inputHtml);
  return parse(furiganaTemplateToHTML(inputHtml), options);
}
