import React from "react";

import { QuestionTypeEnum } from "model/question";

import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";
import ShortAnswerPreview from "components/build/baseComponents/phonePreview/questionPreview/ShortAnswerPreview";
import ChooseOnePreview from "components/build/baseComponents/phonePreview/questionPreview/ChooseOnePreview";
import ChooseSeveralPreview from "components/build/baseComponents/phonePreview/questionPreview/ChooseSeveralPreview";
import VerticalShufflePreview from "components/build/baseComponents/phonePreview/questionPreview/VerticalShufflePreview";
import HorizontalShufflePreview from "components/build/baseComponents/phonePreview/questionPreview/HorizontalShufflePreview";
import LogoPage from "components/logoPage/logoPage";
import PairMatchPreview from "./phonePreview/questionPreview/PairMatchPreview";


interface QuestionTypePreviewProps {
  activeQuestionType: QuestionTypeEnum;
  hoverQuestion: QuestionTypeEnum;
  nextQuestion(): void;
  prevQuestion(): void;
}

const QuestionTypePreview:React.FC<QuestionTypePreviewProps> = ({
  hoverQuestion, activeQuestionType, ...props
}) => {
  const getPreviewElement = (type: QuestionTypeEnum) => {
    if (type === QuestionTypeEnum.ShortAnswer) {
      return <PhonePreview Component={ShortAnswerPreview} next={props.nextQuestion} prev={props.prevQuestion} />
    } else if (type === QuestionTypeEnum.ChooseOne) {
      return <PhonePreview Component={ChooseOnePreview} next={props.nextQuestion} prev={props.prevQuestion} />
    } else if (type === QuestionTypeEnum.ChooseSeveral) {
      return <PhonePreview Component={ChooseSeveralPreview} next={props.nextQuestion} prev={props.prevQuestion} />
    } else if (type === QuestionTypeEnum.VerticalShuffle) {
      return <PhonePreview Component={VerticalShufflePreview} next={props.nextQuestion} prev={props.prevQuestion} />
    } else if (type === QuestionTypeEnum.HorizontalShuffle) {
      return <PhonePreview Component={HorizontalShufflePreview} next={props.nextQuestion} prev={props.prevQuestion} />
    } else if (type === QuestionTypeEnum.PairMatch) {
      return <PhonePreview Component={PairMatchPreview} next={props.nextQuestion} prev={props.prevQuestion} />
    }
    return null;
  }
    
  let preview = getPreviewElement(hoverQuestion);
  if (preview) {
    return preview;
  }
  preview = getPreviewElement(activeQuestionType);
  if (preview) {
    return preview;
  }
        
  return <PhonePreview Component={LogoPage} next={props.nextQuestion} prev={props.prevQuestion} />
}

export default QuestionTypePreview;
