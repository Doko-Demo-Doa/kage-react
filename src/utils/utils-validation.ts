import { has } from "rambdax";

export const validationUtils = {
  isValidEmail: (email: string) => {
    if (!email) return false;
    const trimmed = email.trim();
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(trimmed);
  },
  // Module dùng để verify xem file quiz có đúng định dạng hay không.
  verifyQuiz: (inputJson: Record<string, unknown>): boolean => {
    if (!has("id", inputJson)) return false;
    if (!has("name", inputJson)) return false;
    if (!inputJson.syllabus) return false;
    if (!inputJson.instruction) return false;
    if (!has("passing_score", inputJson)) return false;

    return true;
  },
};
