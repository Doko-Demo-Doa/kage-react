import React from "react";
import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";
import { QuizBuilderToolbar } from "~/routes/authen/builder/quiz-builder/quiz-builder-toolbar/quiz-builder-toolbar";

import "~/routes/authen/builder/quiz-builder/quiz-builder.scss";

export const QuizBuilder: React.FC = () => {
  return (
    <div className="quiz-builder">
      <QuizBuilderToolbar />
      <div className="main-slide-builder">
        <ReactQuill
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["clean"],
            ],
          }}
          theme="snow"
        />
      </div>
    </div>
  );
};
