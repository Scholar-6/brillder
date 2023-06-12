import React from 'react';
import ListItem from '@material-ui/core/ListItem';

import { fileUrl } from 'components/services/uploadFile';
import { QuestionValueType } from 'components/build/buildQuestions/questionTypes/types';
import { Hint, HintStatus } from 'model/question';
import HintBox from 'components/play/baseComponents/HintBox';
import { ComponentAttempt } from 'components/play/model';

import MathInHtml from '../../baseComponents/MathInHtml';
import Audio from 'components/build/buildQuestions/questionTypes/sound/Audio';
import PairMatchImageContent from './PairMatchImageContent';

interface OptionProps {
  index: number;
  item: any;
  isReview?: boolean;
  isPreview?: boolean;
  attempt?: ComponentAttempt<any>;
  hint: Hint;
  state: any;
}

const PairMatchOption: React.FC<OptionProps> = (props) => {
  const { item, index } = props;

  let correct = false;
  if (props.state === 1) {
    correct = true;
  }
  if (props.isReview && props.attempt?.correct) {
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
          {answer.valueFile &&
          <div className="flex-align image-container-v4">
            <img
              alt="" src={fileUrl(answer.optionFile)} width="100%"
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
            />
          </div>}
          <Audio src={answer.optionSoundFile} />
          <div>{answer.optionSoundCaption ? answer.optionSoundCaption : ''}</div>
        </div>
      );
    }
    return <MathInHtml value={answer.option} className="text-answer" />;
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

  if (item.answerType === QuestionValueType.Sound && item.valueFile) {
    className += " sound-with-image";
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
