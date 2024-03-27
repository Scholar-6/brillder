import React, { useEffect } from 'react';
import './ProgressBarSixthform.scss';

interface Props {
  step: number;
  title: string;
  description: string;
}

const AnimatedDescriptionV5: React.FC<Props> = (props) => {
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
          <div className="flex-center title-r3234 bold font-16">{props.title}</div>
          <div className="font-20 text-center bold animating title-6v2" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative animating-left">
      <div>
        <div className="flex-center title-r3234 bold font-16">{props.title}</div>
        <div className="font-20 text-center bold animating title-6v2" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </div>
  );
}

export default AnimatedDescriptionV5;
