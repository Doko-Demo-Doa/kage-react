import React from "react";
import ReactQuill from "react-quill";
import calloutRectLeft from "~/assets/svg/callout-rect-left.svg";

import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

export const Calllout: React.FC = () => {
  return (
    <div
      className="callout"
      style={{
        backgroundImage: `url(${calloutRectLeft})`,
        objectFit: "cover",
        width: "533px",
        height: "533px",
        position: "relative",
        transform: "scale(0.5)",
      }}
    >
      <ReactQuill
        style={{
          position: "absolute",
          top: "39px",
          left: "32px",
          width: "428px",
          height: "260px",
          border: "1px solid red",
        }}
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"],
          ],
        }}
        theme="bubble"
      />
    </div>
  );
};
