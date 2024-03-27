import React, { useEffect } from 'react';
import './ProgressBarSixthform.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface Props {
  step: number;
  icon: string | undefined;
  description: string;
}

const AnimatedDescriptionV3: React.FC<Props> = (props) => {
  const [description, setDescription] = React.useState(props.description);
  const [animateRight, setAnimateRight] = React.useState(false);
  const [prevStep, setPrevStep] = React.useState(props.step);

  useEffect(() => {
    if (props.step === 0 && prevStep === 0) { return; }
    setAnimateRight(true);
    setTimeout(() => {
      setAnimateRight(false);
      setDescription(props.description);
      setPrevStep(props.step);
    }, 400);
  }, [props.description]);

  if (animateRight) {
    return (
      <div className="relative animating-right">
        <div>
          <div className="flex-center bold font-24">{props.icon ? <SpriteIcon name={props.icon} /> : ''}</div>
          <div className="font-32 text-center bold animating title-6v2">{description}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative animating-left">
      <div>
        <div className="flex-center bold font-24">{props.icon ? <SpriteIcon name={props.icon} /> : ''}</div>
        <div className="font-32 text-center bold animating title-6v2">{description}</div>
      </div>
    </div>
  );
}

export default AnimatedDescriptionV3;
