import React, { useState, useCallback } from 'react';
import update from 'immutability-helper';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import GridListTile from '@material-ui/core/GridListTile';
import GridList from '@material-ui/core/GridList';

import './DragableTabs.scss';
import DragTab from './dragTab';


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
  const [cards, setCards] = useState([
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
    {
      id: 6,
    },
    {
      id: 7,
    },
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


  const renderCard = (card: { id: number; text: string }, index: number) => {
    return (
      <GridListTile style={{border: '1px solid black'}} key={card.id}>
        <DragTab  
          key={card.id}
          index={index}
          id={card.id}
          text={card.id.toString()}
          moveCard={moveCard}
        />
      </GridListTile>
    )
  }

  const classes = useStyles();

  return (
    <div className={classes.root + " drag-tabs"}>
      <GridList cellHeight={40} className={classes.gridList} cols={cards.length}>
        {
          cards.map((card, i) => renderCard({id: card.id, text: ''}, i))
        }
      </GridList>
    </div>
  )
}

export default DragableTabs