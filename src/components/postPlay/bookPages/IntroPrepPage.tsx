import React from "react";
import Grid from "@material-ui/core/Grid";
import { Brick } from "model/brick";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import HighlightHtml from "components/play/baseComponents/HighlightHtml";
import { PlayMode } from "components/play/model";

interface IntroPageProps {
  brick: Brick;
  color: string;
  onClick(): void;
}

interface IntroductionState {
  prepExpanded: boolean;
}

const IntroPage: React.FC<IntroPageProps> = ({ brick, color, ...props }) => {
  const [state, setState] = React.useState({
    prepExpanded: true,
  } as IntroductionState);

  const togglePrep = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setState({ ...state, prepExpanded: !state.prepExpanded });
  };

  const renderPrepTitle = () => {
    return (
      <div className="expand-title">
        <span>Prep</span>
        <div className="centered text-white" onClick={e => {
          togglePrep(e);
          e.stopPropagation();
          e.preventDefault();
        }}>
          <div className={state.prepExpanded ? "round-icon b-green" : "round-icon b-yellow"}>
            <SpriteIcon name="arrow-down" className="arrow" />
          </div>
        </div>
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
            onHighlight={() => { }}
          />
        </div>
      );
    }
    return "";
  };

  return (
    <div className="book-page introduction-prep" onClick={props.onClick} >
      <div className="question-page play-preview-pages" style={{ background: 'inherit' }}>
        {brick &&
          <Grid container direction="row">
            <div className="introduction-page" style={{ paddingTop: '2.4vh' }}>
              <div className="introduction-content">
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
