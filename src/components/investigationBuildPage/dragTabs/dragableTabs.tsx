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
      border: '1px solid black',
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

  const renderQuestionTab = (question: Question, index: number) => {
    let titleClassNames = "drag-tile";
    if (question.active) {
      titleClassNames += " active";
    }

    return (
      <GridListTile className={titleClassNames} style={{ border: '1px solid black' }} key={index}>
        <DragTab
          index={index}
          id={question.id}
          active={question.active}
          moveCard={moveCard}
          selectQuestion={selectQuestion}
          removeQuestion={removeQuestion}
        />
      </GridListTile>
    )
  }

  const classes = useStyles();

  let columns = questions.length + 2;

  if (columns > 10) {
    columns = 10;
  }

  const addQuestion = () => {
    createNewQuestion();
  }

  return (
    <div className={classes.root + " drag-tabs"}>
      <GridList cellHeight={40} className={classes.gridList} cols={columns}>
        {
          questions.map((question, i) => renderQuestionTab(question, i))
        }
        <GridListTile onClick={addQuestion} className={"drag-tile"} cols={2} style={{ border: '1px solid black' }}>
          <LastTab></LastTab>
        </GridListTile>
      </GridList>
    </div>
  )
}

export default DragableTabs