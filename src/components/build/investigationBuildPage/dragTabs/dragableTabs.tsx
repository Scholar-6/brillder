import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import GridListTile from '@material-ui/core/GridListTile';
import GridList from '@material-ui/core/GridList';

import './DragableTabs.scss';
import DragTab from './dragTab';
import LastTab from './lastTab';

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
  createNewQuestion: Function,
  moveQuestions: Function,
  selectQuestion: Function,
  removeQuestion: Function
}

const DragableTabs: React.FC<DragTabsProps> = ({ questions, createNewQuestion, moveQuestions, selectQuestion, removeQuestion }) => {

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const dragCard = questions[dragIndex]
    moveQuestions(dragIndex, hoverIndex, dragCard);
  }

  const renderQuestionTab = (questions: Question[], question: Question, index: number) => {
    let titleClassNames = "drag-tile-container";
    
    if (question.active) {
      titleClassNames += " active";
    }

    let nextQuestion = questions[index + 1];
    if (nextQuestion && nextQuestion.active) {
      titleClassNames += " pre-active";
    }

    return (
      <GridListTile className={titleClassNames} key={index}>
        <div className="drag-tile">
          <DragTab
            index={index}
            id={question.id}
            active={question.active}
            moveCard={moveCard}
            selectQuestion={selectQuestion}
            removeQuestion={removeQuestion}
          />
        </div>
      </GridListTile>
    )
  }

  const classes = useStyles();

  let columns = questions.length + 1;

  const addQuestion = () => {
    createNewQuestion();
  }

  return (
    <div className={classes.root + " drag-tabs"}>
      <GridList cellHeight={40} className={classes.gridList} cols={columns}>
        {
          questions.map((question, i) => renderQuestionTab(questions, question, i))
        }
        <GridListTile onClick={addQuestion} className={"drag-tile-container"} cols={1}>
          <div className={"drag-tile"} style={{marginLeft: '1px', height: '42px'}}>
            <LastTab columns={columns}></LastTab>
          </div>
        </GridListTile>
      </GridList>
    </div>
  )
}

export default DragableTabs