import React from 'react';
import { WordHighlightingData } from './wordHighlighting';

interface PoemProps {
  state: WordHighlightingData;
  update(): void;
}

const PoemToggle: React.FC<PoemProps> = ({state, update}) => {
  let className = 'poem-toggle';
  if (state.isPoem) {
    className += ' active';
  }
  return (
    <div className={className} onClick={() => {
      state.isPoem = !state.isPoem;
      update();
    }}>
      br
    </div>
  );
}

export default PoemToggle;
