import React from "react";
import calloutRectLeft from "~/assets/svg/callout-rect-left.svg";
import calloutCloudLeft from "~/assets/svg/callout-cloud-left.svg";
import calloutCloudRight from "~/assets/svg/callout-cloud-right.svg";

import "~/components/callout-matrix/callout-matrix.scss";

const collection = [
  calloutRectLeft,
  calloutCloudLeft,
  calloutCloudRight
];

export const CalloutMatrix: React.FC = () => {
  return (
    <div className="callout-matrix" tabIndex={1}>
      {collection.map((n, idx) => (
        <div className="callout-pick-cell" key={idx}>
          <img src={n} alt="callout-image" />
        </div>
      ))}
    </div>
  );
};
