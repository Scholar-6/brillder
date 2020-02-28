import React from 'react'
import { Grid, IconButton } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import './questionType.scss';
import { QuestionTypeEnum } from 'components/model/question';
import TypeButton from './TypeButton'


export interface QuestionTypeProps {
  questionType: QuestionTypeEnum,
  history: any,
  brickId: number,
  questionId: number,
  setQuestionType: Function
  setPreviousQuestion(): void
}

const QuestionTypePage: React.FC<QuestionTypeProps> = ({ questionType, history, brickId, questionId, setQuestionType, setPreviousQuestion }: QuestionTypeProps) => {
  if (questionType !== QuestionTypeEnum.None) {
    history.push(`/build/brick/${brickId}/build/investigation/question-component/${questionId}`);
  }

  const [type, setInnerType] = React.useState(QuestionTypeEnum.None);

  document.title = "Select First Question Type";

  const setCurrentType = (type: QuestionTypeEnum) => {
    setInnerType(type);
  }

  return (
    <div className="question-type">
      <div className="inner-question-type">
        <Grid container direction="row">
          <Grid item xs={4}>
            <TypeButton activeType={type} questionType={QuestionTypeEnum.ShortAnswer} setType={setCurrentType} labels={["S H O R T", "A N S W E R"]} isActive={false} />
          </Grid>
          <Grid item xs={4}>
            <TypeButton activeType={type} questionType={QuestionTypeEnum.ChooseOne} setType={setCurrentType} labels={["C H O O S E", "O N E"]} isActive={false} />
          </Grid>
          <Grid item xs={4}>
            <TypeButton activeType={type} questionType={QuestionTypeEnum.ChooseSeveral} setType={setCurrentType} labels={["C H O O S E", "S E V E R A L"]} isActive={false} />
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid item xs={6}>
            <TypeButton activeType={type} questionType={QuestionTypeEnum.VerticalShuffle} setType={setCurrentType} labels={["V E R T I C A L", "S H U F F L E"]} isActive={false} />
          </Grid>
          <Grid item xs={6}>
            <TypeButton activeType={type} questionType={QuestionTypeEnum.HorizontalShuffle} setType={setCurrentType} labels={["H O R I Z O N T A L", "S H U F F L E"]} isActive={false} />
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid item xs={4}>
            <TypeButton activeType={type} questionType={QuestionTypeEnum.PairMatch} setType={setCurrentType} labels={["P A I R", "M A T C H"]} isActive={false} />
          </Grid>
          <Grid item xs={4}>
            <TypeButton activeType={type} questionType={QuestionTypeEnum.Sort} setType={setCurrentType} labels={["S O R T"]} isActive={false} />
          </Grid>
          <Grid item xs={4}>
            <TypeButton activeType={type} questionType={QuestionTypeEnum.MissingWord} setType={setCurrentType} labels={["M I S S I N G", "W O R D"]} isActive={false} />
          </Grid>
        </Grid>
        <Grid container direction="row">
          <Grid item xs={6}>
            <TypeButton activeType={type} questionType={QuestionTypeEnum.WordHighlighting} setType={setCurrentType} labels={["W O R D", "H I G H L I G H T I N G"]} isActive={false} />
          </Grid>
          <Grid item xs={6}>
            <TypeButton activeType={type} questionType={QuestionTypeEnum.LineHighlighting} setType={setCurrentType} labels={["L I N E", "H I G H L I G H T I N G"]} isActive={false} />
          </Grid>
        </Grid>
      </div>
      <div className="round-button-container" style={{ position: 'absolute', right: 0, bottom: 0 }}>
        <IconButton className="new-question-button" aria-label="next" onClick={() => setQuestionType(type)}>
          <ArrowForwardIosIcon className="new-question-icon" />
        </IconButton>
      </div>
      <div className="round-button-container" style={{ position: 'absolute', left: 0, bottom: 0 }}>
        <IconButton className="new-question-button" aria-label="next" onClick={setPreviousQuestion}>
          <ArrowForwardIosIcon className="new-question-icon rotate-180" />
        </IconButton>
      </div>
    </div>
  );
}

export default QuestionTypePage
