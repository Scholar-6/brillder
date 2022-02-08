import React from 'react';
import Checkbox from "@material-ui/core/Checkbox";
import SpriteIcon from './SpriteIcon';

interface Props {
  isSound?: boolean;
  validationRequired: boolean;
  permision: boolean | 1;
  setPermision(v: boolean | 1): void;
}

const CopyrightCheckboxes: React.FC<Props> = (props) => {
  const {permision, validationRequired} = props;
  
  return (
    <div className="light-font permision-buttons">
      <div onClick={() => props.setPermision(permision ? permision === true ? 1 : true : true)}>
        <div>
          <SpriteIcon name="globe" className="fgr-icon" />
          <Checkbox
            checked={permision === true}
            className={validationRequired ? "required" : ""}
          />
        </div>
          I am aware of licence restrictions around the publication of {props.isSound ? 'sounds' : 'images'} online. I have checked this {props.isSound ? 'sound' : 'image'} is available for use without such restriction or within Creative Commons criteria which allow commercial use.
      </div>
      <div onClick={() => props.setPermision(permision ? permision === true ? 1 : true : 1)}>
        <div>
        <SpriteIcon name="key" className="fgr-icon" />
          <Checkbox
            checked={permision === 1}
            className={validationRequired ? "required" : ""}
          />
        </div>
          I am creating a brick for educational use with my own students and can therefore use licensed {props.isSound ? 'sounds' : 'images'} consistent with the exemptions for education in the Copyright Designs and Patents Act, 1988.
      </div>
    </div>
  )
}

export default CopyrightCheckboxes;
