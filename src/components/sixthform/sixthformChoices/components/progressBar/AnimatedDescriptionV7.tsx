import React, { useEffect } from 'react';
import './ProgressBarSixthform.scss';
import { isPhone } from 'services/phone';

interface Props {
  step: number;
  description: string;
}

const AnimatedDescriptionV7: React.FC<Props> = (props) => {
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
          <div className={`bold text-center animating title-6v2 ${isPhone() ? 'font-16' : 'font-24'}`} dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative animating-left">
        <div>
          <div className={`bold text-center animating title-6v2 ${isPhone() ? 'font-16' : 'font-24'}`} dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </div>
    </div>
  );
}

export default AnimatedDescriptionV7;
