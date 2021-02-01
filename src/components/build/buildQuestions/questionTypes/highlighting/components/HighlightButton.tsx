import React from 'react'

import './HighlightButton.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { HighlightMode } from '../model';


export interface Props {
  text: string;
  mode: HighlightMode;
  validationRequired: boolean;
  list: any[];
  switchMode(): void;
}

const HighlightButton: React.FC<Props> = props => {
  const renderIcon = () => {
    let className = 'w100 h100 active';
    if(props.mode) {
      className += ' text-white';
    }
    return <SpriteIcon name="highlighter" className={className} />;
  }

  let className = 'pencil-icon-container svgOnHover';

  if (props.validationRequired) {
    if (!props.text) {
      className += ' content-invalid';
    } else {
      let isValid = props.list.find(w => w.checked);
      if (!isValid) {
        className += ' content-invalid';
      } else {
        className += ' b-green';
      }
    }
  } else {
    if (props.mode) {
      className += ' b-green';
    } else {
      className += ' write-mode';
    }
  }

  return (
    <div className={className} onClick={props.switchMode}>
      {renderIcon()}
    </div>
  )
}

export default HighlightButton
