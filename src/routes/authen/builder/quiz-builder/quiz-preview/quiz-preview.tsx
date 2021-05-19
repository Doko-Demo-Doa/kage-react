import React, { useState } from "react";

export const QuizPreview: React.FC = () => {
  const [isIntro, setIsIntro] = useState(true);

  return (
    <div className="quiz-preview">
      <div className="quiz-intro">Quiz Intro</div>
    </div>
  );
};
