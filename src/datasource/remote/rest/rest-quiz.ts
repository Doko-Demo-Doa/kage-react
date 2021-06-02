import { rest } from "~/datasource/remote/rest/rest";

export const apiQuiz = {
  getQuizData: (quizId: string) => rest.get(`quiz/${quizId}`, {}),
};
