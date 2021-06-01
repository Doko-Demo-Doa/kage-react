import React from "react";
import maru from "~/_player/assets/img/animal_quiz_neko_maru.png";
import batsu from "~/_player/assets/img/animal_quiz_neko_batsu.png";

import "~/_player/result-notification/result-notification.scss";

interface Props {
  isCorrect: boolean;
}

export const ResultNotification: React.FC<Props> = ({ isCorrect }) => {
  return (
    <div className="result-notification">
      <img alt="maru" className="maru-batsu" src={isCorrect ? maru : batsu} />
    </div>
  );
};
