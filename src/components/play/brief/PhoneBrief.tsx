import React from "react";

import { Brick } from "model/brick";
import { PlayMode } from "../model";
import { getCompetitionsByBrickId } from "services/axios/competitions";
import { checkCompetitionActive } from "services/competition";

import HighlightHtml from '../baseComponents/HighlightHtml';
import SpriteIcon from "components/baseComponents/SpriteIcon";
import BrickTitle from "components/baseComponents/BrickTitle";
import CompetitionDialog from "../cover/components/CompetitionDialog";

interface Props {
  brick: Brick;
  user: User | undefined;

  competitionId: number;
  setCompetitionId(id: number): void;
  moveNext(): void;

  // only real play
  mode?: PlayMode;
}

export interface State {
  briefExpanded: boolean;
}

const PhoneBriefPage: React.FC<Props> = ({ brick, user, ...props }) => {
  const [competitionData, setCompetitionData] = React.useState(null as any);
  const [state, setState] = React.useState({ briefExpanded: true } as State);

  const getNewestCompetition = (competitions: any[]) => {
    let competition = null;
    for (const comp of competitions) {
      try {
        let isActive = checkCompetitionActive(comp)
        if (isActive) {
          competition = comp;
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
    /*eslint-disable-next-line*/
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
        <CompetitionDialog
          isOpen={competitionData.isOpen}
          user={user}
          onClose={() => setCompetitionData({ ...competitionData, isOpen: false })}
          onSubmit={() => {
            props.setCompetitionId(competitionData.competition.id);
            setCompetitionData({ ...competitionData, isOpen: false });
          }}
        />
      }
    </div>
  );
};

export default PhoneBriefPage;

