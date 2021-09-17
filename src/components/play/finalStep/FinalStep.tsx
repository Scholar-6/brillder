import React, { useEffect } from "react";
import { Grid, Hidden } from "@material-ui/core";
import { connect } from 'react-redux';

import "./FinalStep.scss";
import { Brick } from "model/brick";
import actions from "redux/actions/brickActions";

import ShareColumn from "./ShareColumn";
import AssignPersonOrClassDialog from 'components/baseComponents/dialogs/AssignPersonOrClass';
import AssignSuccessDialog from 'components/baseComponents/dialogs/AssignSuccessDialog';
import AssignFailedDialog from 'components/baseComponents/dialogs/AssignFailedDialog';
import AdaptBrickDialog from "components/baseComponents/dialogs/AdaptBrickDialog";
import axios from "axios";

import { User } from "model/user";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { rightKeyPressed } from "components/services/key";
import AssignBrickColumn from "./AssignBrickColumn";
import AdaptBrickColumn from "./AdaptBrickColumn";
import { checkTeacherOrAdmin } from "components/services/brickService";
import { isPhone } from "services/phone";
import BrickTitle from "components/baseComponents/BrickTitle";
import ShareDialogs from "./dialogs/ShareDialogs";
import GenerateCoverButton from "../baseComponents/sidebarButtons/GenerateCoverButton";

interface FinalStepProps {
  brick: Brick;
  user: User;
  history: any;
  moveNext(): void;
  fetchBrick(brickId: number): Promise<Brick | null>;
}

const FinalStep: React.FC<FinalStepProps> = ({
  brick,
  user,
  history,
  moveNext,
  fetchBrick
}) => {
  const [shareOpen, setShare] = React.useState(false);

  const [assign, setAssign] = React.useState(false);
  const [assignItems, setAssignItems] = React.useState([] as any[]);
  const [assignFailedItems, setAssignFailedItems] = React.useState([] as any[]);
  const [assignSuccess, setAssignSuccess] = React.useState(false);
  const [assignFailed, setAssignFailed] = React.useState(false);
  const [isAdaptBrickOpen, setIsAdaptBrickOpen] = React.useState(false);
  const [isAdapting, setIsAdapting] = React.useState(false);

  useEffect(() => {
    function handleMove(e: any) {
      if (rightKeyPressed(e)) {
        moveNext();
      }
    }

    document.addEventListener("keydown", handleMove, false);

    return function cleanup() {
      document.removeEventListener("keydown", handleMove, false);
    };
  });

  let canSee = false;
  try {
    canSee = checkTeacherOrAdmin(user);
  } catch { }

  let createBrickCopy = async function () {
    // prevent multiple clicking
    if (isAdapting) {
      return;
    }
    setIsAdapting(true);
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_HOST}/brick/adapt/${brick.id}`,
      {},
      { withCredentials: true }
    );
    const copyBrick = response.data as Brick;

    await fetchBrick(copyBrick.id);
    if (copyBrick) {
      history.push(`/build/brick/${copyBrick.id}/plan?bookHovered=true&copied=true`);
    } else {
      console.log('can`t copy');
    }
    setIsAdapting(false)
  }

  const renderActionColumns = () => {
    if (isPhone()) {
      return (
        <Grid className="share-row" container direction="row" justify="center">
          <div>
            <ShareColumn onClick={() => setShare(true)} />
            {canSee && <AssignBrickColumn onClick={() => setAssign(true)} />}
            {canSee && <GenerateCoverButton brick={brick} isFinal={true} />}
          </div>
        </Grid>
      );
    }
    return (
      <Grid className="share-row" container direction="row" justify="center">
        <ShareColumn onClick={() => setShare(true)} />
        {canSee && <AssignBrickColumn onClick={() => setAssign(true)} />}
        {canSee && <AdaptBrickColumn onClick={() => setIsAdaptBrickOpen(true)} />}
        {canSee && <GenerateCoverButton brick={brick} isFinal={true} />}
      </Grid>
    );
  }

  return (
    <div className="brick-row-container complete-container">
      <Hidden only={['xs']}>
        <div className="brick-container final-step-page">
          <Grid container direction="row">
            <Grid item xs={8}>
              <div className="introduction-page">
                <div className="intro-header">
                  <div className="left-brick-circle">
                    <div className="round-button">
                      <SpriteIcon name="check-icon-thin" className="active" />
                    </div>
                  </div>
                  <h2>All done!</h2>
                  <p>Well done for completing “<BrickTitle title={brick.title} />”!</p>
                  {renderActionColumns()}
                </div>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className="introduction-info">
                <div className="intro-text-row">
                </div>
                <div className="action-footer">
                  <div></div>
                  <div className="direction-info text-center">
                    <h2>Results</h2>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="play-preview svgOnHover roller-red"
                      onClick={moveNext}
                    >
                      <SpriteIcon name="arrow-right" className="w80 h80 active m-l-02" />
                    </button>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </Hidden>
      <Hidden only={['sm', 'md', 'lg', 'xl']}>
        <div className="brick-container mobile-final-step-page final-step-page">
          <div className="introduction-page">
            <div className="top-icon-container">
              <div className="icon-background">
                <SpriteIcon name="star" />
              </div>
            </div>
            <p>Well done for completing</p>
            <p className="gge-break-line">“<BrickTitle title={brick.title} />”!</p>
            {renderActionColumns()}
            <div className="introduction-info">
              <div className="intro-text-row"></div>
            </div>
          </div>
        </div>
      </Hidden>
      <ShareDialogs
        shareOpen={shareOpen}
        brick={brick}
        user={user}
        close={() => setShare(false)}
      />
      {canSee && <div>
        <AdaptBrickDialog
          isOpen={isAdaptBrickOpen}
          close={() => setIsAdaptBrickOpen(false)}
          submit={() => createBrickCopy()}
        /> </div>}
      {canSee && <div>
        <AssignPersonOrClassDialog
          isOpen={assign}
          history={history}
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
  );
};

const mapDispatch = (dispatch: any) => ({
  fetchBrick: (brickId: number) => dispatch(actions.fetchBrick(brickId)),
});

export default connect(null, mapDispatch)(FinalStep);
