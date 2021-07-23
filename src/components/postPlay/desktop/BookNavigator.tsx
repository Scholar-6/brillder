import React from 'react';

import SpriteIcon from 'components/baseComponents/SpriteIcon';

import { PlayAttempt } from 'model/attempt';
import { Question } from 'model/question';


interface Props {
  attempt: PlayAttempt;
  questions: Question[];
  moveToQuestion(i: number): void;
}

const PageNavigator: React.FC<Props> = props => {
  const [ref] = React.useState(React.createRef<HTMLDivElement>())

  const scrollLeft = () => {
    const {current} = ref;
    if (current) {
      const step = (window.innerWidth / 100) * 5;
      current.scrollBy(-step, 0);
    }
  }

  const scrollRight = () => {
    const {current} = ref;
    if (current) {
      const step = (window.innerWidth / 100) * 5;
      current.scrollBy(step, 0);
    }
  }

  return (
    <div className="navigation-container">
      <div onClick={() => { }} className="contents-button flex-center">
        <div className="flex-center"><SpriteIcon name="list" /></div>
      </div>
      <div onClick={() => { }} className="nav-button flex-center"><SpriteIcon name="crosshair" /></div>
      <div onClick={() => { }} className="nav-button flex-center"><SpriteIcon name="file-text" /></div>

      <div onClick={scrollLeft} className="nav-button flex-center"><SpriteIcon name="arrow-left" /></div>
      <div className="nav-questions-container" ref={ref}>
        {props.questions.map((q, i) => <div className="question-tab flex-center" key={i} onClick={() => props.moveToQuestion(i)}>
          {i + 1} {props.attempt.answers[i].correct ? <SpriteIcon name="ok" className="text-theme-green" /> : <SpriteIcon name="cancel-custom" className="text-orange" />}
        </div>)}
      </div>
      <div onClick={scrollRight} className="nav-button flex-center"><SpriteIcon name="arrow-right" /></div>
    </div>
  );
}

export default PageNavigator;
