import React from 'react';
import { Dialog, Radio } from '@material-ui/core';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { SortAssignment } from './TeachFilterSidebar';

interface Props {
  sortBy: SortAssignment;
  sort(sort: SortAssignment): void;
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
      {clicked && <Dialog className="sort-dialog-ew33 sort-dialog-assignments" open={clicked} onClose={()=> setClicked(false)}>
        <div className="popup-3rfw bold">
          <div className="no-click">Sort By</div>
          <div className="btn-sort" onClick={() => {
            props.sort(SortAssignment.Name);
            setClicked(false);
          }}>
            <Radio checked={props.sortBy === SortAssignment.Name} />
            A - Z
          </div>
          <div className="btn-sort" onClick={() => {
            props.sort(SortAssignment.Date);
            setClicked(false);
          }}>
            <Radio checked={props.sortBy === SortAssignment.Date} />
            Newest First
          </div>
          <div className="btn-sort" onClick={() => {
            props.sort(SortAssignment.DateInverse);
            setClicked(false);
          }}>
            <Radio checked={props.sortBy === SortAssignment.DateInverse} />
            Oldest First
          </div>
          <div className="btn-sort" onClick={() => {
            props.sort(SortAssignment.Custom);
            setClicked(false);
          }}>
            <Radio checked={props.sortBy === SortAssignment.Custom} />
            Custom
          </div>
        </div>
        </Dialog>}
    </div>
  );
}

export default SortButtonV2;
