import React, { useEffect } from 'react';

enum ChoiceEnum {
  Never = 1,
  Sometimes,
  ALot
}

interface Props {
  currentChoice: ChoiceEnum;
  firstLabel: string,
  middleLabel: string,
  lastLabel: string,
  onClick(choice: ChoiceEnum): void;
}

const ThreeButtons: React.FC<Props> = (props) => {
  let [currentChoice, setCurrentChoice] = React.useState<ChoiceEnum>(props.currentChoice);

  useEffect(() => {
    setCurrentChoice(props.currentChoice);
  }, [props.currentChoice]);

  const renderBtn = (choice: ChoiceEnum, realChoice: ChoiceEnum, className: string, label: string) => {
    const isEmpty = choice === null;
    const isActive = choice === realChoice;
    return (
      <div
        className={`btn ${isEmpty ? 'empty' : isActive ? 'active' : "not-active"} ${className}`}
        onClick={() => {
          setCurrentChoice(realChoice);
          setTimeout(() => props.onClick(realChoice), 350)
        }}
        dangerouslySetInnerHTML={{ __html: label }}
      />
    )
  }

  return (
    <div className="btns-container-r32 font-20 bold flex-center">
      {renderBtn(currentChoice, ChoiceEnum.Never, "btn-red", props.firstLabel)}
      {renderBtn(currentChoice, ChoiceEnum.Sometimes, "btn-orange",  props.middleLabel)}
      {renderBtn(currentChoice, ChoiceEnum.ALot, "btn-green", props.lastLabel)}
    </div>
  );
}


export default ThreeButtons;
