import React from "react";
import { Delta, DeltaOperation } from "quill";

type TextBlockType = {
  quillDelta: DeltaOperation[];
};

export const TextBlock: React.FC<TextBlockType> = ({ quillDelta }) => {
  return <div className="quill-text-block"></div>;
};
