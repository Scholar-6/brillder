import React from 'react'
import { Grid, Box } from '@material-ui/core';

import './questionType.scss';
import { QuestionType, QuestionTypeEnum } from 'components/model/question';
import TypeButton from './TypeButton'


export interface QuestionTypeProps {
  questionType: QuestionTypeEnum,
  history: any,
  brickId: number,
  questionId: number,
  setQuestionType: Function
}

function SplitByCapitalLetters(element: string): string {
  return element.split(/(?=[A-Z])/).join(" ");
}

function getTextPreview(type: string) {
  return SplitByCapitalLetters(type).toUpperCase();
}

const QuestionTypePage: React.FC<QuestionTypeProps> = ({ questionType, setQuestionType, history, brickId, questionId }: QuestionTypeProps) => {
  if (questionType !== QuestionTypeEnum.None) {
    console.log('redirect: ', `/build/brick/${brickId}/build/investigation/question-component/${questionId}`)
    history.push(`/build/brick/${brickId}/build/investigation/question-component/${questionId}`);
  }

  document.title = "Select First Question Type";

  const setType = (type: QuestionTypeEnum) => {
    setQuestionType(type);
  }

  return (
    <div className="question-type">
      <Grid container direction="row">
        <Grid item xs={4}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.ChooseOne} labels={["S H O R T", "A N S W E R"]} isActive={false} />
        </Grid>
        <Grid item xs={4}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.ChooseOne} labels={["C H O O S E", "O N E"]} isActive={false} />
        </Grid>
        <Grid item xs={4}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.ChooseSeveral} labels={["C H O O S E", "S E V E R A L"]} isActive={false} />
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={6}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.VerticalShuffle} labels={["V E R T I C A L", "S H U F F L E"]} isActive={false} />
        </Grid>
        <Grid item xs={6}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.HorizontalShuffle} labels={["H O R I Z O N T A L", "S H U F F L E"]} isActive={false} />
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={4}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.PairMatch} labels={["P A I R", "M A T C H"]} isActive={false} />
        </Grid>
        <Grid item xs={4}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.MissingWord} labels={["S O R T", "( C A T E G . )"]} isActive={false} />
        </Grid>
        <Grid item xs={4}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.MissingWord} labels={["M I S S I N G", "W O R D"]} isActive={false} />
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={6}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.WordHighlighting} labels={["W O R D", "H I G H L I G H T I N G"]} isActive={false} />
        </Grid>
        <Grid item xs={6}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.LineHighlighting} labels={["L I N E", "H I G H L I G H T I N G"]} isActive={false} />
        </Grid>
      </Grid>
    </div>
  );
}

export default QuestionTypePage
