import React from "react";

import { Dialog } from "@material-ui/core";
import { Brick } from "model/brick";
import { PlayMode } from "../model";

import HighlightHtml from '../baseComponents/HighlightHtml';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BrickTitle from "components/baseComponents/BrickTitle";
import { getCompetitionsByBrickId } from "services/axios/competitions";

interface Props {
  brick: Brick;

  competitionId: number;
  setCompetitionId(id: number): void;
  moveNext(): void;

  // only real play
  mode?: PlayMode;
}

export interface State {
  briefExpanded: boolean;
}

const PhoneBriefPage: React.FC<Props> = ({ brick, ...props }) => {
  const [competitionData, setCompetitionData] = React.useState(null as any);
  const [state, setState] = React.useState({ briefExpanded: true } as State);

  const getNewestCompetition = (competitions: any[]) => {
    let competition = null;
    const timeNow = new Date().getTime();
    for (const comp of competitions) {
      try {
        var start = new Date(comp.startDate).getTime();
        if (timeNow > start) {
          var end = new Date(comp.endDate).getTime();
          if (timeNow < end) {
            competition = comp;
          }
        }
      } catch {
        console.log('competition time can`t be parsed');
      }
    }
    return competition;
  }

  const getCompetitions = async () => {
    const res = await getCompetitionsByBrickId(brick.id);
    if (res && res.length > 0) {
      const competition = getNewestCompetition(res);
      if (competition) {
        setCompetitionData({ isOpen: true, competition });
      }
    }
  }

  React.useEffect(() => {
    if (props.competitionId <= 0) {
      getCompetitions();
    }
  }, []);

  const toggleBrief = () => {
    setState({ ...state, briefExpanded: !state.briefExpanded });
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

  const renderBriefExpandText = () => {
    return (
      <div className="expanded-text">
        <HighlightHtml
          value={brick.brief}
          mode={props.mode}
          onHighlight={() => { }}
        />
      </div>
    );
  };

  return (
    <div className="brick-row-container play-brief-page">
      <div className="brick-container">
        <div className="introduction-page">
          <div className="fixed-upper-b-title">
            <BrickTitle title={brick.title} />
          </div>
          <div className="introduction-content">
            <div className="fe-open-question" dangerouslySetInnerHTML={{ __html: brick.openQuestion }} />
            {renderMobileBriefTitle()}
            {state.briefExpanded && renderBriefExpandText()}
          </div>
        </div>
      </div>
      {competitionData &&
        <Dialog open={competitionData.isOpen} className="dialog-box phone-competition-dialog" onClick={() => setCompetitionData({ ...competitionData, isOpen: false })}>
          <div className="dialog-header">
            <div className="flex-center">
              <SpriteIcon name="star-empty" className="big-star" />
            </div>
            <div className="bold" style={{ textAlign: 'center' }}>
              This brick is part of a competition. <br />
              If you do well, you could win a prize!
            </div>
          </div>
          <div className="dialog-footer">
            <button className="btn btn-md bg-green text-white yes-button" onClick={() => {
              props.setCompetitionId(competitionData.competition.id);
              setCompetitionData({ ...competitionData, isOpen: false });
            }}>
              <span>Start Playing</span>
            </button>
          </div>
          <div className="italic bottom-link flex-center" style={{ textAlign: 'center' }}>
            <SpriteIcon name="eye-on" />
            <a rel="noopener noreferrer" href="https://brillder.com/brilliant-minds-prizes/" target="_blank">Learn more</a>
          </div>
        </Dialog>}
    </div>
  );
};

export default PhoneBriefPage;

