import React, { useEffect } from "react";
import { MainLayout } from "~/_player/main-layout/main-layout";
import { apiQuiz } from "~/datasource/remote/rest/rest-quiz";
import { QuizPlayerContext, qpStore } from "~/mobx/quiz-player";

import "react-h5-audio-player/lib/styles.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "antd/dist/antd.css";

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
    <QuizPlayerContext.Provider value={qpStore}>
      <MainLayout />
    </QuizPlayerContext.Provider>
  );
};

export default PlayerRoot;
