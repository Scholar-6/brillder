import React from 'react';
import { Dialog, Radio } from '@material-ui/core';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { SortClassroom } from './TeachFilterSidebar';

interface Props {
  sortBy: SortClassroom;
  classroom?: string;
  sort(sort: SortClassroom): void;
}

const SortButtonV2: React.FC<Props> = ({ ...props }) => {
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
            props.sort(SortClassroom.Date);
            setClicked(false);
          }}>
            <Radio checked={props.sortBy === SortClassroom.Date} />
            Most Recent
          </div>
          <div className="btn-sort" onClick={() => {
            props.sort(SortClassroom.Name);
            setClicked(false);
          }}>
            <Radio checked={props.sortBy === SortClassroom.Name} />
            A - Z
          </div>
        </div>
        </Dialog>}
    </div>
  );
}

export default SortButtonV2;
