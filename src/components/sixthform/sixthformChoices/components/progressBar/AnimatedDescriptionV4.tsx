import React, { useEffect } from 'react';
import './ProgressBarSixthform.scss';

interface Props {
  step: number;
  description: string;
}

const AnimatedDescriptionV4: React.FC<Props> = (props) => {
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
      <div className="animating-right">
        <div className="font-20 text-center bold-italic animating title-6v2" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    );
  }

  return (
    <div className="animating-left">
      <div className="font-20 text-center bold-italic animating title-6v2" dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );
}

export default AnimatedDescriptionV4;
