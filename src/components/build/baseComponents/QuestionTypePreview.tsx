import React from "react";

import { QuestionTypeEnum } from "model/question";

import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";
import ShortAnswerPreview from "components/build/baseComponents/phonePreview/questionPreview/ShortAnswerPreview";
import ChooseOnePreview from "components/build/baseComponents/phonePreview/questionPreview/ChooseOnePreview";
import ChooseSeveralPreview from "components/build/baseComponents/phonePreview/questionPreview/ChooseSeveralPreview";
import VerticalShufflePreview from "components/build/baseComponents/phonePreview/questionPreview/VerticalShufflePreview";
import HorizontalShufflePreview from "components/build/baseComponents/phonePreview/questionPreview/HorizontalShufflePreview";


interface QuestionTypePreviewProps {
  activeQuestionType: QuestionTypeEnum;
  hoverQuestion: QuestionTypeEnum;
}

const QuestionTypePreview:React.FC<QuestionTypePreviewProps> = ({
  hoverQuestion, activeQuestionType
}) => {
  const getPreviewElement = (type: QuestionTypeEnum) => {
    if (type === QuestionTypeEnum.ShortAnswer) {
      return <PhonePreview Component={ShortAnswerPreview} />
    } else if (type === QuestionTypeEnum.ChooseOne) {
      return <PhonePreview Component={ChooseOnePreview} />
    } else if (type === QuestionTypeEnum.ChooseSeveral) {
      return <PhonePreview Component={ChooseSeveralPreview} />
    } else if (type === QuestionTypeEnum.VerticalShuffle) {
      return <PhonePreview Component={VerticalShufflePreview} />
    } else if (type === QuestionTypeEnum.HorizontalShuffle) {
      return <PhonePreview Component={HorizontalShufflePreview} />
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
        
  return <PhonePreview link={window.location.origin + "/logo-page"} />
}

export default QuestionTypePreview;
