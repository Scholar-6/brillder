import React, { useEffect } from "react";
import queryString from 'query-string';
import moment from "moment";

import { Brick } from "model/brick";
import { rightKeyPressed } from "components/services/key";
import { isPhone } from "services/phone";
import { BrickFieldNames } from 'components/build/proposal/model';
import { PlayMode } from "../model";
import { getPrepareTime } from "../services/playTimes";

import SpriteIcon from "components/baseComponents/SpriteIcon";
import MathInHtml from "../baseComponents/MathInHtml";
import HighlightHtml from "../baseComponents/HighlightHtml";
import HighlightQuoteHtml from "../baseComponents/HighlightQuoteHtml";
import TimeProgressbarV2 from "../baseComponents/timeProgressbar/TimeProgressbarV2";
import routes from "../routes";
import {previewLive} from 'components/playPreview/routes';


export interface IntroductionState {
  isStopped: boolean;
  prepExpanded: boolean;
  briefExpanded: boolean;
  resume: boolean;
  duration: any;
}

interface Props {
  brick: Brick;
  history: any;

  isPreview?: boolean;

  mode?: PlayMode;
  onHighlight?(name: BrickFieldNames, value: string): void;
}

const NewPrepPage: React.FC<Props> = ({ brick, history, ...props }) => {
  const [startTime] = React.useState(moment());

  const [state, setState] = React.useState({
    prepExpanded: true,
    isStopped: false,
    briefExpanded: false,
    resume: false,
    duration: null,
  } as IntroductionState);

  const moveNext = () => {
    let link = routes.playPreInvesigation(brick.id);
    if (props.isPreview) {
      link = previewLive(brick.id);
    } else if (state.resume) {
      link = routes.playLive(brick.id);
    }
    history.push(link);
  }

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

  useEffect(() => {
    const values = queryString.parse(history.location.search);
    if (values.resume) {
      setState({...state, resume: true});
    }
  }, []);

  if (isPhone()) {
    return <div />;
  }

  const toggleBrief = () => {
    setState({ ...state, briefExpanded: !state.briefExpanded });
  };

  const togglePrep = () => {
    if (state.prepExpanded) {
      setState({
        ...state,
        isStopped: true,
        briefExpanded: true,
        prepExpanded: false,
      });
    } else {
      setState({
        ...state,
        isStopped: false,
        briefExpanded: false,
        prepExpanded: true,
      });
    }
  };

  const renderBriefTitle = () => {
    return (
      <div className="expand-title brief-title" style={{ marginTop: '4vh' }}>
        <span>Brief</span>
        <div className="centered text-white" onClick={toggleBrief}>
          <div className={state.briefExpanded ? "round-icon b-green" : "round-icon b-yellow"}>
            <SpriteIcon name="arrow-down" className="arrow" />
          </div>
          {!state.briefExpanded && <span className="italic">Click to expand</span>}
        </div>
      </div>
    );
  };

  const renderPrepTitle = () => {
    return (
      <div className="expand-title prep-title">
        <span>Prep</span>
        <div className="centered text-white" onClick={togglePrep}>
          <div className={state.prepExpanded ? "round-icon b-green" : "round-icon b-yellow"}>
            <SpriteIcon name="arrow-down" className="arrow" />
          </div>
        </div>
      </div>
    );
  };

  const renderBriefExpandText = () => {
    if (state.briefExpanded) {
      return (
        <div className="expanded-text">
          <HighlightHtml
            value={brick.brief}
            mode={props.mode}
            onHighlight={value => {
              if (props.onHighlight) {
                props.onHighlight(BrickFieldNames.brief, value)
              }
            }}
          />
        </div>
      );
    }
    return "";
  };

  const renderPrepExpandText = () => {
    if (state.prepExpanded) {
      return (
        <div className="expanded-text prep-box">
          <HighlightQuoteHtml
            value={brick.prep}
            mode={props.mode}
            onHighlight={value => {
              if (props.onHighlight) {
                props.onHighlight(BrickFieldNames.prep, value)
              }
            }}
          />
        </div>
      );
    }
    return "";
  };

  const minutes = getPrepareTime(brick.brickLength);

  return (
    <div className="brick-row-container live-container">
      <div className="fixed-upper-b-title q-brick-title" dangerouslySetInnerHTML={{ __html: brick.title }} />
      <div className="brick-container play-preview-panel live-page play-brief-page new-prep-page">
        <div className="introduction-page">
          <div className="scrollable">
            <div className="open-question">
              <MathInHtml value={brick.openQuestion} />
            </div>
            <div className="introduction-content">
              {renderBriefTitle()}
              {renderBriefExpandText()}
              {renderPrepTitle()}
              {renderPrepExpandText()}
            </div>
          </div>
          <div className="new-layout-footer" style={{ display: 'none' }}>
            <div className="time-container">
              <TimeProgressbarV2 isSynthesis={true} startTime={startTime} onEnd={() => { }} brickLength={brick.brickLength} />
            </div>
            <div className="minutes-footer">
              {minutes}:00
            </div>
            <div className="footer-space" />
            <div className="new-navigation-buttons">
              <div className="n-btn next" onClick={moveNext}>
                {state.resume ? 'Resume' : 'Investigation'}
                <SpriteIcon name="arrow-right" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPrepPage;
