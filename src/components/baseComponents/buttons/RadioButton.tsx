import { GENERAL_SUBJECT } from 'components/services/subject';
import React from 'react';
import SpriteIcon from '../SpriteIcon';

interface Props {
  checked: boolean | undefined;
  color: string;
  name: string;
}

const RadioButton: React.FC<Props> = ({checked, color, name}) => {
  const renderChecked = () => {
    if (name === GENERAL_SUBJECT) {
      color = '#001c58';
    }

    return (
      <div className="subject-border">
        <SpriteIcon name="radio" className="radio-checked" style={{ color, fill: color }} />
      </div>
    );
  }

  const renderDefault = () => {
    return (
      <div className="subject-no-border">
        <div className="filter-circle" style={{ background: color }} />
      </div>
    );
  }

  if (checked) {
    return renderChecked();
  }
  return renderDefault();
}

export default RadioButton;
