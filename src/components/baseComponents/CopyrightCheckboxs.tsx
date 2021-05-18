import React from 'react';
import Checkbox from "@material-ui/core/Checkbox";

interface Props {
  validationRequired: boolean;
  permision: boolean | 1;
  setPermision(v: boolean | 1): void;
}

const CopyrightCheckboxes: React.FC<Props> = (props) => {
  const {permision, validationRequired} = props;
  return (
    <div className="light-font permision-buttons">
      <div onClick={() => props.setPermision(permision ? permision === true ? 1 : true : true)}>
        <Checkbox
          checked={permision === true}
          className={validationRequired ? "required" : ""}
        />
          I am aware of licence restrictions around the publication of images online. I have checked this image is available for use without such restriction or within Creative Commons criteria which allow commercial use.
          <span className="text-theme-orange">*</span>
      </div>
      <div onClick={() => props.setPermision(permision ? permision === true ? 1 : true : 1)}>
        <Checkbox
          checked={permision === 1}
          className={validationRequired ? "required" : ""}
        />
          I am creating a brick for educational use with my own students and can therefore use licensed images consistent with the exemptions for education in the Copyright Designs and Patents Act, 1988.
          <span className="text-theme-orange">*</span>
      </div>
    </div>
  )
}

export default CopyrightCheckboxes;
