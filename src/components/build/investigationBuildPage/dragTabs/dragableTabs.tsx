import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import GridListTile from '@material-ui/core/GridListTile';
import GridList from '@material-ui/core/GridList';
import { ReactSortable } from "react-sortablejs";

import './DragableTabs.scss';
import DragTab from './dragTab';
import LastTab from './lastTab';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: '100%',
      flexWrap: 'nowrap',
      margin: '0 !important',
      overflow: 'hidden',
      transform: 'translateZ(0)',
    },
    gridListTile: {
      'text-align': 'center'
    }
  }),
);

interface Question {
  id: number,
  active: boolean,
  type: number
}

interface DragTabsProps {
  questions: Question[],
  isSynthesisPage: boolean,
  createNewQuestion: Function,
  setQuestions(questions: any): void
  selectQuestion: Function,
  removeQuestion: Function
} 

const DragableTabs: React.FC<DragTabsProps> = ({
  questions, createNewQuestion, selectQuestion, isSynthesisPage,
  removeQuestion, setQuestions,
}) => {
  const renderQuestionTab = (questions: Question[], question: Question, index: number, comlumns: number) => {
    let titleClassNames = "drag-tile-container";
    let cols = 2;
    if (question.active) {
      titleClassNames += " active";
      cols = 3;
    }

    let nextQuestion = questions[index + 1];
    if (nextQuestion && nextQuestion.active) {
      titleClassNames += " pre-active";
    }

    let width = (100 * 2) / (comlumns - 2);
    if (question.active) {
      width = (100 * 3) / (comlumns - 2);
    }

    if (isSynthesisPage) {
      width = (100 * 2) / (comlumns - 2);
    }

    console.log(comlumns)

    return (
      <GridListTile className={titleClassNames} key={index} cols={cols} style={{display:'inline-block', width: `${width}%`}}>
        <div className="drag-tile">
          <DragTab
            index={index}
            id={question.id}
            active={question.active}
            selectQuestion={selectQuestion}
            removeQuestion={removeQuestion}
          />
        </div>
      </GridListTile>
    )
  }

  const classes = useStyles();

  let columns = (questions.length * 2) + 3;

  if (isSynthesisPage) {
    columns = (questions.length * 2) + 2;
  }

  const addQuestion = () => {
    if (!isSynthesisPage) {
      createNewQuestion();
    }
  }

  return (
    <div className={classes.root + " drag-tabs"}>
      <GridList cellHeight={40} className={classes.gridList} cols={columns}>
        <ReactSortable
          list={questions}
          style={{width: '100%', marginTop: '+1px', padding: 0, height: '100% '}}
          group="tabs-group"
          setList={setQuestions}>
          {
            questions.map((question, i) => renderQuestionTab(questions, question, i, columns))
          }
        </ReactSortable>
        <GridListTile
          onClick={addQuestion}
          className={"drag-last-tile-container " + (isSynthesisPage ? "synthesis-tab" : "")}
          cols={2}
        >
          <Grid className={"drag-tile"} container alignContent="center" justify="center">
            <LastTab columns={columns} isSynthesis={isSynthesisPage}></LastTab>
          </Grid>
        </GridListTile>
      </GridList>
    </div>
  )
}

export default DragableTabs
