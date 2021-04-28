import React from "react";
import { AnimationType } from "~/common/static-data";
import { SlideBlockType } from "~/typings/types";

import "~/routes/authen/builder/slide-builder/slide-entities/animation-entity/animation-entity.scss";

type AnimationEntityProps = {
  id: string;
  animationType: AnimationType;
  blockId: string;
  blocks: Partial<SlideBlockType>[];
};

export const AnimationEntity: React.FC<AnimationEntityProps> = () => {
  return <div className="animation-entity"></div>;
};
