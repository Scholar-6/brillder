import React from 'react';
import SpriteIcon from 'components/baseComponents/SpriteIcon';

interface DeleteProps {
  label: string | undefined;
  cancel(): void;
  click(): void;
}

const AssignPopupHint: React.FC<DeleteProps> = (props) => {
  return (
    <div>
      <div className="popup-background"></div>
      <div className="popup-assign-top-f53">
        <div>
          <SpriteIcon name="cancel-custom" onClick={props.cancel} />
          You can browse our catalogue here to select a brick to assign to <span className="bold">{props.label ? props.label : ''}</span>
        </div>
        <div className="bottom-part-s42">
          <div>
            <SpriteIcon name="info-icon" />
          </div>
          <div className="text-s45">
            If you navigate away from the catalogue, your brick will be saved and can be accessed later from the Manage Classes page.
          </div>
          <div>
            <div className="btn btn-green" onClick={props.click}>OK</div>
          </div>
          <div className="triangle"></div>
        </div>
      </div>
    </div>
  );
}

export default AssignPopupHint;
