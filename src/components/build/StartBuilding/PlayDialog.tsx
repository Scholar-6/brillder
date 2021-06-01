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

interface DialogProps {
  isOpen: boolean;
  brick: Brick;
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
    return (
      <div>
        <div className="dialog-header cover-content">
          <h1><BrickTitle title={brick.title} /></h1>
          <div className="flex">
            <CoverAuthorRow
              brick={brick}
              setBio={() => { }}
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
                    <div className="flex-center and-sign">&</div>
                    <div className="white-circle">III</div>
                    <div className="l-text">
                      <div>Core</div>
                      <div className="regular">For 17-18 yr-olds, equivalent to A-level / IB / High School Honors</div>
                    </div>
                  </div>
                  <br />
                  <div className="container">
                    <div className="white-circle">IV</div>
                    <div className="l-text">
                      <div>Extension</div>
                      <div className="regular">College / Undergraduate level, to challenge Oxbridge (UK) or Advanced Placement (US) students</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="keywords-row">
            <KeyWordsPreview keywords={brick.keywords} />
            <HoverHelp>
              Keywords are best thought of as likely search terms, and are
              ultimately curated by Publishers for each subject. For multi-word
              keywords, separate words with a hyphen, eg. ‘19th-Century’
            </HoverHelp>
          </div>
        </div>
        <div className="left-sidebar">
          <CoverPlay onClick={() => setStatus(PlayStatus.Prep)} />
        </div>
      </div>
    );
  };

  const renderPrep = () => {
    return (
      <div className="dialog-header dialog-prep-content">
        <div className="flex">
          <HoverHelp>
            We see education as being a mix of open questions and closed questions. A lot of emphasis is placed on the latter in traditional schooling. While it is undoubtedly necessary to build on fundamentals, it can be stifling for both teachers and learners not to go any further and engage in more holistic discussion. A good open question may be the title for an essay or seminar, and should invite a broader dialogue or appreciation of the subject at hand.
          </HoverHelp>
          <div className="open-question" dangerouslySetInnerHTML={{__html: brick.openQuestion}} />
        </div>
        <div className="space" />
        <div className="flex">
          <HoverHelp>
            Two or three sentences is often enough. This is the first page learners will see (after the cover), so aim to hook them - interesting anecdotes, problem statements and paradoxes are most welcome!
          </HoverHelp>
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
          <div dangerouslySetInnerHTML={{__html: brick.brief}} />
        </div>
        <div className="flex">
          <HoverHelp>
            This is a timed section, and though learners will not be moved on to the next section automatically, we recommend that you try to be fair with your estimation of how long this section will take. This will help learners apportion 20, 40, or 60 minutes to a brick and have the satisfaction of completing them within that timeframe. Within these lengths, it should be possible to allocate 5, 10, or 15 minutes respectively to complete the prep section.
          </HoverHelp>
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
          <div dangerouslySetInnerHTML={{__html: brick.prep}} />
        </div>
      </div>
    );
  };

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
      <div className="footer" />
    </Dialog>
  );
};

export default PlayDialog;
