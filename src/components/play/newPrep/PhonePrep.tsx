import React, { useEffect } from "react";

import { Brick } from "model/brick";
import { PlayMode } from "../model";
import { BrickFieldNames } from 'components/build/proposal/model';

import HighlightHtml from '../baseComponents/HighlightHtml';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import HighlightQuoteHtml from "../baseComponents/HighlightQuoteHtml";
import { isPhone } from "services/phone";
import TimeProgressbarV2 from "../baseComponents/timeProgressbar/TimeProgressbarV2";
import BrickTitle from "components/baseComponents/BrickTitle";

interface IntroductionProps {
  isPlayPreview?: boolean;
  endTime?: string;
  brick: Brick;
  location: any;
  history: any;

  setEndTime(endTime: string): void;
  moveNext(): void;

  cashAttempt?(): void;

  // only real play
  mode?: PlayMode;
  onHighlight?(name: BrickFieldNames, value: string): void;
}

export interface IntroductionState {
  isStopped: boolean;
  prepExpanded: boolean;
  briefExpanded: boolean;
  duration: any;
}

const PhonePrepPage: React.FC<IntroductionProps> = ({ brick, ...props }) => {
  const [state, setState] = React.useState({
    prepExpanded: true,
    isStopped: false,
    briefExpanded: false,
    duration: null,
  } as IntroductionState);

  useEffect(() => {
    const interval = setInterval(() => {
      if (props.cashAttempt) {
        props.cashAttempt();
      }
    }, 1000);
    return () => clearInterval(interval);
    /*eslint-disable-next-line*/
  }, [props.endTime]);

  const toggleBrief = () => {
    setState({ ...state, briefExpanded: !state.briefExpanded });
  };

  const togglePrep = () => {
    // phone has diferent logic.
    if (isPhone()) {
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
      return;
    }

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

  const renderMobileBriefTitle = () => {
    return (
      <div className="brief-title" style={{ marginTop: '4vh' }}>
        <span className="bold">Brief</span>
        <div className={state.briefExpanded ? "round-icon fill-green" : "round-icon fill-yellow"} onClick={toggleBrief}>
          <SpriteIcon name="circle-filled" className="circle" />
          <SpriteIcon name="arrow-down" className="arrow" />
        </div>
        {!state.briefExpanded && <span className="italic" onClick={toggleBrief}>Click to expand</span>}
      </div>
    );
  }

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
  };

  const renderPrepExpandText = () => {
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
  };

  return (
    <div className="brick-row-container real-introduction-page">
      <div className="brick-container">
        <div className="introduction-page">
          <div className="fixed-upper-b-title">
            <BrickTitle title={brick.title} />
          </div>
          <div className="introduction-info">
            <div className="time-container">
              <TimeProgressbarV2
                isIntro={true}
                onEnd={() => { }}
                endTime={props.endTime}
                setEndTime={props.setEndTime}
                brickLength={brick.brickLength}
              />
            </div>
          </div>
          <div className="introduction-content">
            <div className="fe-open-question" dangerouslySetInnerHTML={{ __html: brick.openQuestion }} />
            {renderMobileBriefTitle()}
            {state.briefExpanded && renderBriefExpandText()}
            {renderPrepTitle()}
            {state.prepExpanded && renderPrepExpandText()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhonePrepPage;
