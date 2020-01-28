import React, { useState, useCallback } from 'react';
import update from 'immutability-helper';
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

interface DragTabsProps {
  questions: number[],
}

const DragableTabs: React.FC<DragTabsProps> = ({ questions }) => {
  const active = 0;
  const [cards, setCards] = useState([
    { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 },// { id: 5 }, { id: 6 }, { id: 7 },{ id: 8 },{ id: 9 },{ id: 10 } //,{ id: 11 },{ id: 12 },{ id: 13 },{ id: 14 },{ id: 15 },
  ])

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = cards[dragIndex]
      setCards(
        update(cards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        }),
      )
    },
    [cards],
  )

  const renderCard = (id: number, index: number) => {
    let titleClassNames = "drag-tile";
    let isActive = index == active;
    if (isActive) {
      titleClassNames += " active";
    }

    return (
      <GridListTile className={titleClassNames} style={{ border: '1px solid black' }} key={id}>
        <DragTab
          index={index}
          id={id}
          active={isActive}
          moveCard={moveCard}
        />
      </GridListTile>
    )
  }

  const classes = useStyles();

  let columns = cards.length + 2;

  if (columns > 10) {
    columns = 10;
  }

  const addQuestion = () => {
    console.log("add question to the end");
  }

  return (
    <div className={classes.root + " drag-tabs"}>
      <GridList cellHeight={40} className={classes.gridList} cols={columns}>
        {
          cards.map((card, i) => renderCard(card.id, i))
        }
        <GridListTile onClick={addQuestion} className={"drag-tile"} cols={2} style={{ border: '1px solid black' }}>
          <LastTab></LastTab>
        </GridListTile>
      </GridList>
    </div>
  )
}

export default DragableTabs