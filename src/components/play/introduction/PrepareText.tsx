import React from "react";
import { getPrepareTime } from "../services/playTimes";


interface IntroductionProps {
  brickLength: number;
}

const PrepareText: React.FC<IntroductionProps> = ({brickLength}) => {
  const prepare = getPrepareTime(brickLength);
  return <span>Set aside around {prepare} minutes to prepare</span>;
};

export default PrepareText;
