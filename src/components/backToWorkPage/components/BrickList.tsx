import React from "react";

import { Brick } from 'model/brick';
import { User } from 'model/user';
import BrickBlock from '../../baseComponents/BrickBlock';

export interface BrickBlockItem {
  brick: Brick;
  index: number;
  row: number;
  key: number;
}

interface BrickListProps {
  data: any[];
  user: User;
  shown: boolean;
  history: any;
  handleDeleteOpen(brickId: number): void;
  handleMouseHover(index: number): void;
  handleMouseLeave(index: number): void;
}

const BrickListComponent: React.FC<BrickListProps> = props => {
  return (
    <div>
      {props.data.map(item => {
        const {brick} = item;
        let circleIcon = '';
        let iconColor = '';
        if (brick.editor && brick.editor.id === props.user.id) {
          circleIcon="edit-outline";
          iconColor = 'text-theme-dark-blue';
        }
        
        return <BrickBlock
          brick={item.brick}
          index={item.index}
          row={item.row}
          user={props.user}
          key={item.index}
          shown={props.shown}
          history={props.history}
          circleIcon={circleIcon}
          iconColor={iconColor}
          handleDeleteOpen={brickId => props.handleDeleteOpen(brickId)}
          handleMouseHover={() => props.handleMouseHover(item.key)}
          handleMouseLeave={() => props.handleMouseLeave(item.key)}
        />
      })}
    </div>
  );
}

export default BrickListComponent;
