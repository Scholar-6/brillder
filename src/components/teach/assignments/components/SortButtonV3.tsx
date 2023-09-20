import React from 'react';
import { Dialog, Radio } from '@material-ui/core';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { SortClassroom } from './TeachFilterSidebar';

export enum SortStudentV3 {
  Empty,
  Name,
  NumberOfCompleted
}

interface Props {
  sortBy: SortStudentV3;
  sort(sort: SortStudentV3): void;
}

const SortButtonV3: React.FC<Props> = ({ ...props }) => {
  const [clicked, setClicked] = React.useState(false);

  return (
    <div className="sort-v4y4">
      <SpriteIcon
        name="hero-sort-descending"
        onClick={() => setClicked(true)}
      />
      <div className="css-custom-tooltip">
        Sort
      </div>
      {clicked && <Dialog className="sort-dialog-ew33 sort-dialog-students" open={clicked} onClose={() => setClicked(false)}>
        <div className="popup-3rfw bold">
          <div className="no-click">Sort By</div>
          <div className="btn-sort" onClick={() => {
            props.sort(SortStudentV3.Name);
            setClicked(false);
          }}>
            <Radio checked={props.sortBy === SortStudentV3.Name} />
            A - Z
          </div>
          <div className="btn-sort" onClick={() => {
            props.sort(SortStudentV3.NumberOfCompleted);
            setClicked(false);
          }}>
            <Radio checked={props.sortBy === SortStudentV3.NumberOfCompleted} />
            Number of Completed
          </div>
        </div>
      </Dialog>}
    </div>
  );
}

export default SortButtonV3;
