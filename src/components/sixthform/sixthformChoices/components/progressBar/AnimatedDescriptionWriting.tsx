import React, { useEffect } from 'react';
import './ProgressBarSixthform.scss';

interface Props {
  step: number;
  title: string;
  description: string;
}

const AnimatedDescriptionWriting: React.FC<Props> = (props) => {
  const [title, setTitle] = React.useState(props.title);
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
      setTitle(props.title);
    }, 500);
  }, [props.description]);

  if (animateRight) {
    return (
      <div className="relative animating-right">
        <div>
          <div className="font-24 text-center bold animating title-6v2" dangerouslySetInnerHTML={{ __html: title }} />
          <div className="font-16 text-center animating title-6v2" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative animating-left">
      <div>
      <div className="font-24 text-center bold animating title-6v2" dangerouslySetInnerHTML={{ __html: title }} />
        <div className="font-16 text-center animating title-6v2" dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </div>
  );
}

export default AnimatedDescriptionWriting;
