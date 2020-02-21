import React from 'react'
import { Grid } from '@material-ui/core';

import './questionType.scss';
import { QuestionTypeEnum } from 'components/model/question';
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
  if (questionType !== QuestionTypeEnum.None && questionId) {
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
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.ShortAnswer} setType={setType} labels={["S H O R T", "A N S W E R"]} isActive={false} />
        </Grid>
        <Grid item xs={4}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.ChooseOne} setType={setType} labels={["C H O O S E", "O N E"]} isActive={false} />
        </Grid>
        <Grid item xs={4}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.ChooseSeveral} setType={setType} labels={["C H O O S E", "S E V E R A L"]} isActive={false} />
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={6}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.VerticalShuffle} setType={setType} labels={["V E R T I C A L", "S H U F F L E"]} isActive={false} />
        </Grid>
        <Grid item xs={6}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.HorizontalShuffle} setType={setType} labels={["H O R I Z O N T A L", "S H U F F L E"]} isActive={false} />
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={4}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.PairMatch} setType={setType} labels={["P A I R", "M A T C H"]} isActive={false} />
        </Grid>
        <Grid item xs={4}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.MissingWord} setType={setType} labels={["S O R T", "( C A T E G . )"]} isActive={false} />
        </Grid>
        <Grid item xs={4}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.MissingWord} setType={setType} labels={["M I S S I N G", "W O R D"]} isActive={false} />
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={6}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.WordHighlighting} setType={setType} labels={["W O R D", "H I G H L I G H T I N G"]} isActive={false} />
        </Grid>
        <Grid item xs={6}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.LineHighlighting} setType={setType} labels={["L I N E", "H I G H L I G H T I N G"]} isActive={false} />
        </Grid>
      </Grid>
    </div>
  );
}

export default QuestionTypePage
