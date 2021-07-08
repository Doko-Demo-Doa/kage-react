import React, { useEffect, useRef } from "react";
import "~/routes/authen/preview/preview-route.scss";

export const PreviewRoute: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rootHtml = document.getElementsByTagName("html");
    if (rootHtml[0]) {
      const rHtml = rootHtml[0];
      rHtml.setAttribute("style", "width: 740px; height: 540px; overflow: hidden;");
    }

    divRef?.current?.focus();
  });

  return (
    <div className="preview-route" ref={divRef}>
      <iframe src="file:///Users/doko/Library/Caches/kage-cache/slide.html" />
    </div>
  );
};
