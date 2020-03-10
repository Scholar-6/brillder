import React from 'react';

import './ChooseSeveral.scss';
import { Question } from "components/model/question";
import { Button, Box } from '@material-ui/core';


interface ChooseOneProps {
  question: Question;
  component: any;
}

const ChooseSeveral: React.FC<ChooseOneProps> = ({ question, component }) => {
  const [list, setActive] = React.useState(component.list);

  const chooseOne = (index:number) => {
    let updatedList = Object.assign([], list);
    updatedList[index].isActive = !updatedList[index].isActive;
    setActive(updatedList);
  }

  console.log(list)

  return (
    <Box boxShadow={3} className="choose-one-live">
      {
        component.list.map((input: any, index: number) =>
          <Button
            className={(list[index].isActive === true) ? "choose-choice active" : "choose-choice"}
            key={index}
            onClick={() => chooseOne(index)}>
            {input.value}
          </Button>
        )
      }
    </Box>
  );
}

export default ChooseSeveral;
