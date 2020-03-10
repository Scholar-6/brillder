import React from 'react';

import './ChooseOne.scss';
import { Question } from "components/model/question";
import { Button } from '@material-ui/core';


interface ChooseOneProps {
  question: Question;
  component: any;
}

const ChooseOne: React.FC<ChooseOneProps> = ({ question, component }) => {
  const [activeItem, setActive] = React.useState(-1);
  const chooseOne = (index:number) => {
    setActive(index);
  }

  console.log(activeItem)

  return (
    <div className="choose-one-live">
      {
        component.list.map((input: any, index: number) =>
          <Button
            className={(index === activeItem) ? "choose-choice active" : "choose-choice"}
            key={index}
            onClick={() => chooseOne(index)}>
            {input.value}
          </Button>
        )
      }
    </div>
  );
}

export default ChooseOne;
