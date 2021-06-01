import React from "react";

import "~/_player/countdown/countdown.scss";

export const Countdown: React.FC = () => {
  return (
    <div className="clock-counter">
      <div className="no">Thời gian</div>
      <h3>32:33</h3>
    </div>
  );
};
