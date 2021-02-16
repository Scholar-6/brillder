import React from "react";
import Grid from "@material-ui/core/Grid";
import { Brick } from "model/brick";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import HighlightHtml from "components/play/baseComponents/HighlightHtml";
import { PlayMode } from "components/play/model";
import MathInHtml from "components/play/baseComponents/MathInHtml";
import './IntroBriefPage.scss';

interface IntroPageProps {
  brick: Brick;
  color: string;
  onClick(): void;
}

const IntroPage: React.FC<IntroPageProps> = ({ brick, color, ...props }) => {
  const renderHeader = (brick: Brick, color: string) => {
    return (
      <div className="intro-header">
        <h1 style={{ justifyContent: 'flex-start', marginTop: '2.4vh', marginBottom: '3vh', textAlign: 'left' }}>
          {brick.title}
        </h1>
      </div>
    );
  };

  const renderBriefTitle = () => {
    return (
      <div className="expand-title" style={{ marginTop: '4vh' }}>
        <span>Brief</span>
        <div className="centered text-white">
          <div className="round-icon b-green">
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
          mode={PlayMode.Normal}
          onHighlight={() => { }}
        />
      </div>
    );
  };

  return (
    <div className="book-page introduction-brief" onClick={props.onClick} >
      <div className="flipped-page question-page play-preview-pages" style={{ background: 'inherit' }}>
        {brick &&
          <Grid container direction="row">
            <div className="introduction-page" style={{ paddingTop: '2.4vh' }}>
              {renderHeader(brick, color)}
              <div className="open-question"><MathInHtml value={brick.openQuestion} /></div>
              <div className="introduction-content">
                {renderBriefTitle()}
                {renderBriefExpandText()}
              </div>
            </div>
          </Grid>
        }
      </div>
    </div>
  );
}

export default IntroPage;
