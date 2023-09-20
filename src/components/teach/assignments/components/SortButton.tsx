import React from 'react';
import { Dialog, Radio } from '@material-ui/core';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { SortClassroom } from './TeachFilterSidebar';
import { SetSortSidebarClassroom } from 'localStorage/assigningClass';

interface Props {
  sortBy: SortClassroom;
  classroom?: string;
  sort(sort: SortClassroom): void;
}

const SortButton: React.FC<Props> = ({ sortBy, sort, ...props }) => {
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
      {clicked && <Dialog className={"sort-dialog-ew33 " + props.classroom} open={clicked} onClose={()=> setClicked(false)}>
        <div className="popup-3rfw bold">
          <div className="no-click">Sort By</div>
          <div className="btn-sort" onClick={() => {
            sort(SortClassroom.Date)
            SetSortSidebarClassroom(SortClassroom.Date);
            setClicked(false);
          }}>
            <Radio checked={sortBy === SortClassroom.Date} />
            Most Recent</div>
          <div className="btn-sort" onClick={() => {
            sort(SortClassroom.Name);
            SetSortSidebarClassroom(SortClassroom.Name);
            setClicked(false);
          }}>
            <Radio checked={sortBy === SortClassroom.Name} />
            A - Z
          </div>
          <div className="btn-sort last" onClick={() => {
            sort(SortClassroom.Assignment);
            SetSortSidebarClassroom(SortClassroom.Assignment);
            setClicked(false);
          }}>
            <Radio checked={sortBy === SortClassroom.Assignment} />
            Most Assignments
          </div>
        </div>
        </Dialog>}
    </div>
  );
}

export default SortButton;
