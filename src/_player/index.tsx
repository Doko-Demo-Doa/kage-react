import React, { useEffect } from "react";
import { MainLayout } from "~/_player/main-layout/main-layout";
import { apiQuiz } from "~/datasource/remote/rest/rest-quiz";
import { QuizPlayerContext, QuizPlayerStore } from "~/mobx/quiz-player";

const sample = require("~/_player/assets/quiz-sample.json");

import "react-h5-audio-player/lib/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "antd/dist/antd.css";

const qps = new QuizPlayerStore(sample.quizzes.length);

const PlayerRoot: React.FC = () => {
  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    if (process.env.NODE_ENV === "production") {
      const resp = await apiQuiz.getQuizData("aa");
      console.log(resp);
    }
  }

  return (
    <QuizPlayerContext.Provider value={qps}>
      <MainLayout />
    </QuizPlayerContext.Provider>
  );
};

export default PlayerRoot;
