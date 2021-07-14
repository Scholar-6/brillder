import React from 'react';
import SpriteIcon from 'components/baseComponents/SpriteIcon';


interface ReviewHintProps {
  correct: boolean;
}

const HintIcon: React.FC<ReviewHintProps> = ({ correct }) => {
  const renderIcon = () => {
    if (correct) {
      return (
        <div className="ged-phone-circle b-green">
          <SpriteIcon name="check-icon" />
        </div>
      );
    }
    return (
      <div className="ged-phone-circle b-red">
        <SpriteIcon name="cancel-custom" />
      </div>
    );
  }

  return (
    <div className="hint-icon-block">
      {renderIcon()}
    </div>
  )
}

export default HintIcon;
