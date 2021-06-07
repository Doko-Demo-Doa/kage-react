import React from "react";
import { AnswerResultType } from "~/typings/types";

import maru from "~/_player/assets/img/animal_quiz_neko_maru.png";
import batsu from "~/_player/assets/img/animal_quiz_neko_batsu.png";
import tsunami from "~/_player/assets/img/business_syakai_aranami.png";

import "~/_player/result-notification/result-notification.scss";

interface Props {
  type?: AnswerResultType;
}

export const ResultNotification: React.FC<Props> = ({ type }) => {
  function getImg() {
    if (type === "correct") return maru;
    if (type === "incorrect") return batsu;
    return tsunami;
  }

  function getSubtitle() {
    if (type === "correct") return "Chính xác!";
    if (type === "incorrect") return "Chưa chính xác";
    if (type === "timeout") return "Hết thời gian!";
    return "";
  }

  return (
    <div className="result-notification">
      <h1>{getSubtitle()}</h1>
      <img alt="maru" className="maru-batsu" src={getImg()} />
    </div>
  );
};
