import React, { useState } from "react";

import "~/routes/authen/builder/quiz-builder/quiz-preview/quiz-preview.scss";

export const QuizPreview: React.FC = () => {
  const [isIntro] = useState(false);

  return (
    <div className="quiz-preview">
      {isIntro ? (
        <div className="quiz-intro">Quiz Intro</div>
      ) : (
        <div className="quiz-main">
          <h2 className="quiz-content">彼女は、毎日_____アイスクリームがすきです。</h2>
        </div>
      )}
    </div>
  );
};
