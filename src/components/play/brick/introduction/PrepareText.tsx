import React from "react";


interface IntroductionProps {
  brickLength: number;
}

const PrepareText: React.FC<IntroductionProps> = ({brickLength}) => {
  let prepare = 5;

  if (brickLength === 40) {
    prepare = 10;
  } else if (brickLength === 60) {
    prepare = 15;
  }

  return <span>Set aside around {prepare} minutes to prepare</span>;
};

export default PrepareText;
