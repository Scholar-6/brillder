import React, { useEffect } from 'react';
import './ProgressBarSixthform.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface Props {
  step: number;
  description: string;
}

const AnimatedDescription: React.FC<Props> = (props) => {
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
    }, 500);
  }, [props.description]);

  /*
  if (step === 0) {
    return (
      <div className="relative">
        <div className="flex-center bold font-24"><SpriteIcon name="heart-six" /> I love...</div>
        <div className="font-32 text-center bold animating title-6v2">{description}</div>
      </div>
    );
  }*/

  if (animateRight) {
    return (
      <div className="relative animating-right">
        <div className="flex-center bold font-24"><SpriteIcon name="heart-six" /> I love...</div>
        <div className="font-32 text-center bold animating title-6v2">{description}</div>
      </div>
    );
  }

  return (
    <div className="relative animating-left">
      <div className="flex-center bold font-24"><SpriteIcon name="heart-six" /> I love...</div>
      <div className="font-32 text-center bold animating title-6v2">{description}</div>
    </div>
  );
}

export default AnimatedDescription;
