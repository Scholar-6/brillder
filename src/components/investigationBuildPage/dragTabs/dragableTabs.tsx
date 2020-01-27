import React, { useState, useCallback } from 'react';
import DragTab from './dragTab';
import update from 'immutability-helper';

import './DragableTabs.scss';

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
      <DragTab
        key={card.id}
        index={index}
        id={card.id}
        text={card.id.toString()}
        moveCard={moveCard}
      />
    )
  }

  return (
    <div className="drag-tabs">
      {cards.map((card, i) => renderCard({id: card.id, text: ''}, i))}
    </div>
  )
}

export default DragableTabs