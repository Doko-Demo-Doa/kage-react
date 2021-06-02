import React, { useEffect } from "react";
import { MainLayout } from "~/_player/main-layout/main-layout";

import "react-perfect-scrollbar/dist/css/styles.css";
import "antd/dist/antd.css";
import { apiQuiz } from "~/datasource/remote/rest/rest-quiz";

const PlayerRoot: React.FC = () => {
  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    console.log(new URLSearchParams(window.location.search).get("quiz"));
    if (process.env.NODE_ENV === "production") {
      const resp = await apiQuiz.getQuizData("aa");
      console.log(resp);
    }
  }

  return <MainLayout />;
};

export default PlayerRoot;
