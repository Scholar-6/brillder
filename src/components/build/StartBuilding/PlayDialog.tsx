import React from "react";
import Dialog from "@material-ui/core/Dialog";

import "./PlayDialog.scss";
import CoverAuthorRow from "components/play/cover/components/coverAuthorRow/CoverAuthorRow";
import CoverPlay from "components/play/cover/components/coverAuthorRow/CoverPlay";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import HoverHelp from "components/baseComponents/hoverHelp/HoverHelp";
import CoverImageComponent from "components/play/cover/CoverImage";
import KeyWordsPreview from "components/build/proposal/questionnaire/brickTitle/components/KeywordsPlay";
import { AcademicLevelLabels, Brick } from "model/brick";
import BrickTitle from "components/baseComponents/BrickTitle";
import DummyProgressbarCountdown from "components/play/baseComponents/timeProgressbar/DummyTimeProgressbar";
import { getPrepareTime } from "components/play/services/playTimes";
import { formatTwoLastDigits } from "components/services/brickService";
import map from "components/map";
import PrepHoverHelp from "../baseComponents/PrepHoverHelp";
import BriefHoverHelp from "../baseComponents/BriefHoverHelp";
import OpenQHoverHelp from "../baseComponents/OpenQHoverHelp";
import { stripHtml } from "../questionService/ConvertService";

interface DialogProps {
  isOpen: boolean;
  brick: Brick;
  history: any;
  close(): void;
}

enum PlayStatus {
  Cover = 1,
  Prep = 2,
}

const PlayDialog: React.FC<DialogProps> = (props) => {
  const { brick } = props;
  const [status, setStatus] = React.useState(PlayStatus.Cover);

  const close = () => {
    setStatus(PlayStatus.Cover);
    props.close();
  };

  const renderBrickCircle = () => {
    return (
      <div className="round-button-container">
        <div className="round-button" style={{ background: `${brick.subject?.color || '#B0B0AD'}` }} />
      </div>
    );
  }

  const renderCoverContent = () => {
    const briefText = stripHtml(brick.brief);

    return (
      <div>
        <div className="dialog-header cover-content">
          <h1><BrickTitle title={brick.title} /></h1>
          <div className="flex author-play-content">
            <CoverAuthorRow
              brick={brick}
              setBio={() => { }}
              setEditorBio={() => { }}
            />
            <HoverHelp>
              This is taken from the information you provide in your profile
              page, and should reflect your academic interests and credentials.
            </HoverHelp>
          </div>
          <div className="flex-center">
            <div className="hover-orange-text">
              Hover over the question marks for more information
            </div>
          </div>
          <div className="image-container centered">
            <CoverImageComponent brickId={-1} locked={true} data={{ value: brick.coverImage } as any} />
            <div className="cover-info-row">
              {renderBrickCircle()}
              <div className="subject-and-name">
                {brick.subject?.name}, Level {brick.academicLevel && AcademicLevelLabels[brick.academicLevel]}
              </div>
              <div className="keywords-row">
                <KeyWordsPreview keywords={brick.keywords} />
                <HoverHelp>
                  Keywords are best thought of as likely search terms, and are
                  ultimately curated by Publishers for each subject. For multi-word
                  keywords, separate words with a hyphen, eg. ‘19th-Century’
                </HoverHelp>
              </div>
              <div className="hover-area flex-center">
                <SpriteIcon name="help-circle-custom" />
                <div className="hover-content">
                  <div>Brillder focusses on universal concepts and topics, not specific exam courses.</div>
                  <br />
                  <div>LEVELS:</div>
                  <div className="container">
                    <div className="white-circle">I</div>
                    <div className="l-text">
                      <div>Foundation</div>
                      <div className="regular">For 15-16 yr-olds, equivalent to GCSE / IB Middle Years / High School Diploma</div>
                    </div>
                  </div>
                  <br />
                  <div className="container">
                    <div className="white-circle">II</div>
                    <div className="l-text">
                      <div>Core</div>
                      <div className="regular">For 17-18 yr-olds, equivalent to A-level / IB / High School Honors</div>
                    </div>
                  </div>
                  <br />
                  <div className="container">
                    <div className="white-circle">III</div>
                    <div className="l-text">
                      <div>Extension</div>
                      <div className="regular">College / Undergraduate level, to challenge Oxbridge (UK) or Advanced Placement (US) students</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="left-sidebar">
          <div className="brief-ellipsis">
            {briefText}
          </div>
          <CoverPlay onClick={() => setStatus(PlayStatus.Prep)} />
        </div>
      </div>
    );
  };

  const renderPrep = () => {
    return (
      <div className="dialog-header dialog-prep-content">
        <div className="flex">
          <OpenQHoverHelp />
          <div className="open-question" dangerouslySetInnerHTML={{ __html: brick.openQuestion }} />
        </div>
        <div className="space" />
        <div className="flex">
          <BriefHoverHelp />
          <div className="expand-title brief-title">
            <span>Brief</span>
            <div className="centered text-white">
              <div className="round-icon flex-center b-green">
                <SpriteIcon name="arrow-down" className="arrow" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex text-container">
          <div dangerouslySetInnerHTML={{ __html: brick.brief }} />
        </div>
        <div className="flex">
          <PrepHoverHelp />
          <div className="expand-title brief-title">
            <span>Prep</span>
            <div className="centered text-white">
              <div className="round-icon flex-center b-green">
                <SpriteIcon name="arrow-down" className="arrow" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex text-container">
          <div dangerouslySetInnerHTML={{ __html: brick.prep }} />
        </div>
      </div>
    );
  };

  const renderPrepFooter = () => {
    return (
      <div className="prep-footer">
        <div className="progressbar-container">
          <div className="time-container">
            <DummyProgressbarCountdown value={100} deadline={true} />
          </div>
          <div className="time-string">
            {formatTwoLastDigits(getPrepareTime(brick.brickLength))}:00
          </div>
        </div>
        <div className="button-container" onClick={() => props.history.push(map.ProposalSubjectLink)}>
          Exit & Start Building <SpriteIcon name="arrow-right" />
        </div>
      </div>
    );
  }

  return (
    <Dialog
      open={props.isOpen}
      onClose={close}
      className="dialog-box play-dialog"
    >
      {status === PlayStatus.Cover ? renderCoverContent() : renderPrep()}
      <SpriteIcon
        name="cancel-custom"
        className="dialog-close"
        onClick={close}
      />
      <div className="footer">
        {status === PlayStatus.Prep && renderPrepFooter()}
      </div>
    </Dialog>
  );
};

export default PlayDialog;
