import React from 'react';
import ListItem from '@material-ui/core/ListItem';

import { QuestionValueType } from 'components/build/buildQuestions/questionTypes/types';
import MathInHtml from '../../baseComponents/MathInHtml';
import PairMatchImageContent from './PairMatchImageContent';
import { Hint, HintStatus } from 'model/question';
import Audio from 'components/build/buildQuestions/questionTypes/sound/Audio';
import HintBox from 'components/play/baseComponents/HintBox';

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
      let className = "question-hint";
      if (correct) {
        className += ' correct';
      }
      return (
        <div className={className}>
          <HintBox correct={correct} value={value} />
        </div>
      );
    }
    return '';
  }

  const renderOptionContent = (answer: any) => {
    if (answer.optionType && answer.optionType === QuestionValueType.Image) {
      return <PairMatchImageContent
        fileName={answer.optionFile}
        imageCaption={answer.imageOptionCaption ?? answer.imageCaption}
        imageSource={answer.imageOptionSource ?? answer.imageSource}
      />
    } else if (answer.optionType && answer.optionType === QuestionValueType.Sound) {
      return (
        <div style={{ width: '100%' }}>
          <Audio src={answer.optionSoundFile} />
          <div>{answer.optionSoundCaption ? answer.optionSoundCaption : 'Click to select'}</div>
        </div>
      );
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
