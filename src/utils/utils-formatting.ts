export function getTextWithCondition(str: string, condition: RegExp | string) {
  const regexStr = new RegExp(condition);
  const result = str.match(regexStr);
  return result;
}

export function formatLine(str: string) {
  const removeLineBreakRegex = new RegExp(/[\r\n]+/g);
  const removeWhiteSpaceRegex = new RegExp(/\s/g);
  let result = null;
  result = str.replace(removeLineBreakRegex, '');
  result = result.replace(removeWhiteSpaceRegex, ' ');

  return result;
}

export function getTextBetweenUtag(str: string, regex: RegExp | string) {
  const regexStr = new RegExp(regex);
  const results = str.match(regexStr);
  if (results !== null && results.length > 0) {
    results.forEach((_, index) => {
      results[index] = results[index].replace('<u>', '');
      results[index] = results[index].replace('</u>', ' ');
    });
  }
  return results;
}

export function replaceString(str: string, strSub: string, strReplace: string) {
  const result = str.replace(strSub, strReplace);
  return result;
}

export function splitParagraphKanji(str: string) {
  let arr: string[] = [];
  if (!str) return arr;
  str = str.replace(/<\/rt><\/ruby>/g, '(A1)');
  arr = str.split('/');

  const newArr = arr.map((n) => n.replace(/\(A1\)/g, '</rt></ruby>'));
  return newArr;
}
