import React from "react";
import calloutRectLeft from "~/assets/svg/callout-rect-left.svg";

import "~/components/callout-matrix/callout-matrix.scss";

export const CalloutMatrix: React.FC = () => {
  return (
    <div className="callout-matrix" tabIndex={1}>
      {Array.from(Array(10).keys()).map((n, idx) => (
        <div className="callout-pick-cell" key={idx}>
          <img src={calloutRectLeft} alt="test" />
        </div>
      ))}
    </div>
  );
};
