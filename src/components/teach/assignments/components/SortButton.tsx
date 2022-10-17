import React from 'react';
import { Dialog, Radio } from '@material-ui/core';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { SortClassroom } from './TeachFilterSidebar';

interface Props {
  sort: SortClassroom;
  sortByDate(): void;
  sortByName(): void;
  sortByAssignmets(): void;
}

const SortButton: React.FC<Props> = ({ sort, ...props }) => {
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
      {clicked && <Dialog className="export-dialog-ew35" open={clicked} onClose={()=> setClicked(false)}>
        <div className="popup-3rfw bold">
          <div className="no-click">Sort By</div>
          <div className="btn-sort" onClick={() => {
            props.sortByDate();
            setClicked(false);
          }}>
            <Radio checked={sort === SortClassroom.Date} />
            Most Recent</div>
          <div className="btn-sort" onClick={() => {
            props.sortByName();
            setClicked(false);
          }}>
            <Radio checked={sort === SortClassroom.Name} />
            A - Z</div>
          <div className="btn-sort last" onClick={() => {
            props.sortByAssignmets();
            setClicked(false);
          }}>
            <Radio checked={sort === SortClassroom.Assignment} />
            Most Assignments</div>
        </div>
        </Dialog>}
    </div>
  );
}

export default SortButton;
