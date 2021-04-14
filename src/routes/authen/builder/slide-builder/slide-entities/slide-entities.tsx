import { useState } from "react";
import clsx from "clsx";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import "~/routes/authen/builder/slide-builder/slide-entities/slide-entities.scss";

export function SlideEntities() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="side-holder" />

      <div className={clsx("slide-entities", expanded ? "slide-entities-expanded" : "")}>
        <div className="expand-btn" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
        </div>
        <div className="slide-entities-expandable">
          Animations
          {Array.from(Array(10).keys()).map((n, idx) => (
            <div className="callout-pick-cell" key={idx}>
              Test
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
