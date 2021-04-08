import { has } from "rambdax";

export function isValidEmail(email: string) {
  if (!email) return false;
  const trimmed = email.trim();
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(trimmed);
}

export function isValidLink(str: string) {
  const pattern = new RegExp("^(https?:\\/\\/)?" // protocol
    + "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" // domain name
    + "((\\d{1,3}\\.){3}\\d{1,3}))" // OR ip (v4) address
    + "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" // port and path
    + "(\\?[;&a-z\\d%_.~+=-]*)?" // query string
    + "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator
  return !!pattern.test(str);
}

export function isValidValidationCode(code: string) {
  if (!code) return false;
  if (code.length !== 6) return false;
  return (/^\d+$/.test(code));
}

export function isValidPassword(password: string) {
  if (!password) return false;
  if (password.length < 6) return false;
  return true;
}

export function isValidPhone(phoneNumber: string) {
  const regexStr = /(^0[0-9])\d{8,11}$/g;
  if (!phoneNumber) return false;
  let phoneWithLeadingZero = phoneNumber.startsWith("0") ? phoneNumber : `0${phoneNumber}`;
  phoneWithLeadingZero = phoneWithLeadingZero
    .replace(/\s/g, "")
    .replace(/\D/g, "")
    .replace(/[&\\#,()$~%.'":*?<>{}]/g, "");
  return RegExp(
    regexStr,
  ).test(phoneWithLeadingZero);
}

export function isNumberOnly(str: string) {
  if (!str) return true;
  if (/^\d+$/.test(str)) return true;
  return false;
}

export function isValidDateOfBirth(dateOfBirth: string) {
  const re = /(19|20)\d\d$[- /.]^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])/;
  return re.test(dateOfBirth);
}

// Module dùng để verify xem file quiz có đúng định dạng hay không.

export const verifyQuiz = (inputJson: Record<string, unknown>): boolean => {
  if (!has("id", inputJson)) return false;
  if (!has("name", inputJson)) return false;
  if (!inputJson.syllabus) return false;
  if (!inputJson.instruction) return false;
  if (!has("passing_score", inputJson)) return false;

  return true;
};
