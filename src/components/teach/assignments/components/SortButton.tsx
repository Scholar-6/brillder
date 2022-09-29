import React from 'react';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { Dialog } from '@material-ui/core';

interface Props {
  asscending: boolean;
  sortByDate(): void;
  sortByName(): void;
  sortByAssignmets(): void;
}

const SortButton: React.FC<Props> = (props) => {
  const [clicked, setClicked] = React.useState(false);
  const [ascending, setAscending] = React.useState(true);
  return (
    <div className="sort-v4y4">
      <SpriteIcon
        name={
          ascending
            ? "hero-sort-descending"
            : "hero-sort-ascending"
        }
        onClick={() => setClicked(true)}
      />
      <div className="css-custom-tooltip">
        Sort
      </div>
      {clicked && <Dialog className="sort-dialog-classes sort-dialog-ew33" open={clicked} onClose={()=> setClicked(false)}>
        <div className="popup-3rfw bold">
          <div className="no-click">Sort By</div>
          <div className="btn-sort" onClick={() => {
            props.sortByDate();
            setClicked(false);
          }}>Date</div>
          <div className="btn-sort" onClick={() => {
            props.sortByName();
            setClicked(false);
          }}>A-Z</div>
          <div className="btn-sort last" onClick={() => {
            props.sortByAssignmets();
            setClicked(false);
          }}>Assignments</div>
        </div>
        </Dialog>}
    </div>
  );
}

export default SortButton;
