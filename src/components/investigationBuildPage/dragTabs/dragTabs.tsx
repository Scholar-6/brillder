import React, { useState, useCallback } from 'react';
import DragTab from './dragTab';
import update from 'immutability-helper';

import './dragTabs.scss';

interface DragTabsProps {
  questions: number[],
}

const DragTabs: React.FC<DragTabsProps> = ({ questions }) => {
  const [cards, setCards] = useState([
    {
      id: 1,
      text: '1',
    },
    {
      id: 2,
      text: '2',
    },
    {
      id: 3,
      text: '3',
    },
    {
      id: 4,
      text: 'Create some examples',
    },
    {
      id: 5,
      text:
        'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
    },
    {
      id: 6,
      text: '???',
    },
    {
      id: 7,
      text: 'PROFIT',
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
      <div>{cards.map((card, i) => renderCard(card, i))}</div>
    </div>
  )
}

export default DragTabs