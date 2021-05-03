import React from "react";
import calloutRectLeft from "~/assets/svg/callout-rect-left.svg";

type Props = {
  name: "callout-rect-left" | "callout-cloud-right" | "callout-cloud-left";
};

export const Calllout: React.FC<Props> = () => {
  return (
    <div
      className="callout"
      style={{
        backgroundImage: `url(${calloutRectLeft})`,
        objectFit: "contain",
        backgroundSize: "contain",
        width: "300px",
        height: "300px",
        position: "relative",
      }}
    />
  );
};
