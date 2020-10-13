import React from "react";
import Grid from "@material-ui/core/Grid";
import { Brick, BrickLengthEnum } from "model/brick";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import HighlightHtml from "components/play/baseComponents/HighlightHtml";
import { PlayMode } from "components/play/model";

interface IntroPageProps {
  brick: Brick;
  color: string;
  moveToTitles(): void;
}

interface IntroductionState {
  prepExpanded: boolean;
  briefExpanded: boolean;
}

const IntroPage: React.FC<IntroPageProps> = ({brick, color, ...props}) => {
  const [state, setState] = React.useState({
    prepExpanded: false,
    briefExpanded: true,
  } as IntroductionState);

  const toggleBrief = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setState({ ...state, briefExpanded: !state.briefExpanded });
  };

  const togglePrep = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setState({ ...state, prepExpanded: !state.prepExpanded });
  };

  const renderHeader = (brick: Brick, color: string) => {
    return (
      <div className="intro-header">
        <h1 style={{ justifyContent: 'flex-start', marginTop: '2.4vh', marginBottom: '3vh', textAlign:'left'}}>
          {brick.title}
        </h1>
      </div>
    );
  };

  const renderBriefTitle = () => {
    return (
      <div className="expand-title" style={{marginTop: '4vh'}}>
        <span>Brief</span>
        <div className="centered text-white" onClick={e => toggleBrief(e)}>
          <div className={state.briefExpanded ? "round-icon b-green": "round-icon b-yellow"}>
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
            mode={PlayMode.Normal}
            onHighlight={() => {}}
          />
        </div>
      );
    }
    return "";
  };

  const renderPrepTitle = () => {
    let timeToSpend = 5;
    if (brick.brickLength === BrickLengthEnum.S40min) {
      timeToSpend = 10;
    } else if (brick.brickLength === BrickLengthEnum.S60min) {
      timeToSpend = 15;
    }

    return (
      <div className="expand-title">
        <span>Prep</span>
        <div className="centered text-white" onClick={e => togglePrep(e)}>
          <div className={state.prepExpanded ? "round-icon b-green": "round-icon b-yellow"}>
            <SpriteIcon name="arrow-down" className="arrow" />
          </div>
        </div>
        {!state.prepExpanded &&
          <em className="help-prep">
            Expand to start the timer. Aim to spend around {timeToSpend} minutes on this section.
          </em>
        }
      </div>
    );
  };

  const renderPrepExpandText = () => {
    if (state.prepExpanded) {
      return (
        <div className="expanded-text prep-box">
          <HighlightHtml
            value={brick.prep}
            mode={PlayMode.Normal}
            onHighlight={() => {}}
          />
        </div>
      );
    }
    return "";
  };

  return (
    <div className="page3-empty" onClick={props.moveToTitles} >
      <div className="flipped-page question-page play-preview-pages" style={{background: 'inherit'}}>
        {brick &&
          <Grid container direction="row">
            <div className="introduction-page" style={{paddingTop: '2.4vh'}}>
              {renderHeader(brick, color)}
              <p className="open-question">{brick.openQuestion}</p>
              <div className="intro-content">
                {renderBriefTitle()}
                {renderBriefExpandText()}
                {renderPrepTitle()}
                {renderPrepExpandText()}
              </div>
            </div>
          </Grid>
        }
      </div>
    </div>
  );
}

export default IntroPage;
