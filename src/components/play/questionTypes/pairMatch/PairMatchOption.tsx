import React from 'react';
import ListItem from '@material-ui/core/ListItem';

import { QuestionValueType } from 'components/build/buildQuestions/questionTypes/types';
import { Answer } from 'components/build/buildQuestions/questionTypes/pairMatchBuild/types';
import MathInHtml from '../../baseComponents/MathInHtml';
import PairMatchImageContent from './PairMatchImageContent';
import { Hint, HintStatus } from 'model/question';

interface OptionProps {
  index: number;
  item: any;
  isReview?: boolean;
  isPreview?: boolean;
  hint: Hint;
  state: any;
}

const PairMatchOption: React.FC<OptionProps> = (props) => {
  const { item, index } = props;

  let correct = false;
  if (props.state === 1) {
    correct = true;
  }

  const renderEachHint = (hint: Hint, i: number) => {
    if (hint.status === HintStatus.Each) {
      let value = hint.list[i];
      return (
        <div className="question-hint">
          <div className="bold inline"><p>Hint:</p></div> <MathInHtml className="inline" value={value} />
        </div>
      );
    }
    return '';
  }

  const renderOptionContent = (answer: Answer) => {
    if (answer.optionType && answer.optionType === QuestionValueType.Image) {
      return <PairMatchImageContent fileName={answer.optionFile} imageCaption={answer.imageCaption} />
    }
    return <MathInHtml value={answer.option} />;
  }

  let className = "pair-match-play-option";
  if (item.optionType === QuestionValueType.Image || item.answerType === QuestionValueType.Image) {
    className += " pair-match-image-choice";
  }
  if (item.optionType === QuestionValueType.Image) {
    className += " image-choice";
  }
  if (props.isReview && correct) {
    className += ' correct';
  }

  return (
    <ListItem key={index} className={className}>
      <div className="option-container">
        {renderOptionContent(item as any)}
        {props.isPreview ?
          renderEachHint(props.hint, index)
          : props.isReview &&
          renderEachHint(props.hint, index)
        }
      </div>
    </ListItem>
  );
}

export default PairMatchOption;
