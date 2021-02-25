import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { connect } from 'react-redux';

import { PlayMode } from '../model';
import map from 'components/map';
import { Brick } from 'model/brick';
import { User } from 'model/user';
import actions from "redux/actions/brickActions";
import { checkTeacherOrAdmin } from 'components/services/brickService';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import AssignPersonOrClassDialog from 'components/baseComponents/dialogs/AssignPersonOrClass';
import AssignSuccessDialog from 'components/baseComponents/dialogs/AssignSuccessDialog';
import AssignFailedDialog from 'components/baseComponents/dialogs/AssignFailedDialog';

interface FooterProps {
  brick: Brick;
  history: any;
  user: User;

  mode: PlayMode;
  setMode(mode: PlayMode): void;

  fetchBrick(brickId: number): void;
}

const PhonePlayFooter: React.FC<FooterProps> = (props) => {
  const {brick} = props;
  const [share, setShare] = React.useState(false);

  const [assign, setAssign] = React.useState(false);
  const [assignItems, setAssignItems] = React.useState([] as any[]);
  const [assignFailedItems, setAssignFailedItems] = React.useState([] as any[]);
  const [assignSuccess, setAssignSuccess] = React.useState(false);
  const [assignFailed, setAssignFailed] = React.useState(false);

  const [menuOpen, setMenu] = React.useState(false);
  const { history } = props;

  const setHighlightMode = () => {
    if (props.setMode) {
      if (props.mode === PlayMode.Highlighting) {
        props.setMode(PlayMode.Normal);
      } else {
        props.setMode(PlayMode.Highlighting);
      }
    }
  }

  const isIntro = () => {
    return history.location.pathname.slice(-6) === '/intro';
  }

  const renderPopups = () => {
    let canSee = false;
    try {
      canSee = checkTeacherOrAdmin(props.user);
    } catch { }

    return <div>
      {canSee && <div>
        <AssignPersonOrClassDialog
          isOpen={assign}
          success={(items: any[], failedItems: any[]) => {
            if (items.length > 0) {
              setAssign(false);
              setAssignItems(items);
              setAssignFailedItems(failedItems);
              setAssignSuccess(true);
            } else if (failedItems.length > 0) {
              setAssignFailedItems(failedItems);
              setAssignFailed(true);
            }
          }}
          close={() => setAssign(false)}
        />
        <AssignSuccessDialog
          isOpen={assignSuccess}
          brickTitle={brick.title}
          selectedItems={assignItems}
          close={() => {
            setAssignSuccess(false);
            if (assignFailedItems.length > 0) {
              setAssignFailed(true);
            }
          }}
        />
        <AssignFailedDialog
          isOpen={assignFailed}
          brickTitle={brick.title}
          selectedItems={assignFailedItems}
          close={() => {
            setAssignFailedItems([]);
            setAssignFailed(false);
          }}
        />
      </div>}
    </div>
  }

  return <div className="phone-play-footer">
    <SpriteIcon name="" />
    <SpriteIcon name="corner-up-left" onClick={() => history.push(map.ViewAllPage + `?subjectId=${brick.subject?.id}`)} />
    {isIntro() ? <SpriteIcon name="" /> : <SpriteIcon name="file-text" onClick={() => history.push(map.playIntro(brick.id))} />}
    <SpriteIcon name="highlighter" onClick={setHighlightMode} />
    <SpriteIcon name="" />
    <SpriteIcon name="more" className="rotate-90" onClick={() => setMenu(!menuOpen)} />
    <Menu
      className="phone-down-play-menu"
      keepMounted
      open={menuOpen}
      onClose={() => setMenu(false)}
    >
      <MenuItem onClick={() => {
        setShare(true);
        setMenu(false);
      }}>
        Share Brick
      </MenuItem>
      <MenuItem onClick={() => {
        setAssign(true);
        setMenu(false);
      }}>
        Assign Brick
      </MenuItem>
    </Menu>
    {renderPopups()}
  </div>;
}


const mapDispatch = (dispatch: any) => ({
  fetchBrick: (id: number) => dispatch(actions.fetchBrick(id)),
});

export default connect(null, mapDispatch)(PhonePlayFooter);
