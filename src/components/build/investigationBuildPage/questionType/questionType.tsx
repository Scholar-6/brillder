import React from 'react'
import { Grid, Box } from '@material-ui/core';

import './questionType.scss';
import { QuestionType, QuestionTypeEnum } from 'components/model/question';
import TypeButton from './TypeButton'


export interface QuestionTypeProps {
  questionType: QuestionTypeEnum,
  history: any,
  setQuestionType: Function
}

function SplitByCapitalLetters(element: string): string {
  return element.split(/(?=[A-Z])/).join(" ");
}

function getTextPreview(type: string) {
  return SplitByCapitalLetters(type).toUpperCase();
}

const QuestionTypePage: React.FC<QuestionTypeProps> = ({ questionType, setQuestionType, history }: QuestionTypeProps) => {
  if (questionType != null) {
    // history.push('build/brick/2/build/investigation/question-component/1');
  }
  let typeArray: string[] = Object.keys(QuestionType);

  document.title = "Select First Question Type";

  const setType = (type: QuestionTypeEnum) => {
    setQuestionType(type);
  }

  return (
    <div className="question-type">
      <Grid container direction="row" justify="center" className="card-description">
        Choose question type...
      </Grid>
      <Grid container direction="row">
        <Grid item xs={4}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.ChooseOne} labels={["S H O R T", "A N S W E R"]} isActive={false} />
        </Grid>
        <Grid item xs={4}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.ChooseOne} labels={["C H O O S E", "O N E"]} isActive={false} />
        </Grid>
        <Grid item xs={4}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.ChooseOne} labels={["C H O O S E", "S E V E R A L"]} isActive={false} />
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={6}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.ChooseOne} labels={["V E R T I C A L", "S H U F F L E"]} isActive={false} />
        </Grid>
        <Grid item xs={6}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.ChooseOne} labels={["H O R I Z O N T A L", "S H U F F L E"]} isActive={false} />
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={4}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.ChooseOne} labels={["P A I R", "M A T C H"]} isActive={false} />
        </Grid>
        <Grid item xs={4}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.ChooseOne} labels={["S O R T", "( C A T E G . )"]} isActive={false} />
        </Grid>
        <Grid item xs={4}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.ChooseOne} labels={["M I S S I N G", "W O R D"]} isActive={false} />
        </Grid>
      </Grid>
      <Grid container direction="row">
        <Grid item xs={6}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.ChooseOne} labels={["W O R D", "H I G H L I G H T I N G"]} isActive={false} />
        </Grid>
        <Grid item xs={6}>
          <TypeButton activeType={questionType} questionType={QuestionTypeEnum.ChooseOne} labels={["L I N E", "H I G H L I G H T I N G"]} isActive={false} />
        </Grid>
      </Grid>
    </div>
  );
}

export default QuestionTypePage
