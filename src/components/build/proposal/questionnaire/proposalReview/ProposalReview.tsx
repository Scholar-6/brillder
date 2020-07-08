import React from "react";
import Grid from "@material-ui/core/Grid";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { useHistory } from "react-router-dom";

import './ProposalReview.scss';
import { Brick } from "model/brick";
import { User } from "model/user";
import { BrickLengthEnum } from 'model/brick';
import { setBrillderTitle } from "components/services/titleService";

import MathInHtml from 'components/play/brick/baseComponents/MathInHtml';
import YoutubeAndMathInHtml from "components/play/brick/baseComponents/YoutubeAndMath";


interface ProposalProps {
  brick: Brick;
  user: User;
  saveBrick():void;
}

const ProposalReview: React.FC<ProposalProps> = ({brick, user, saveBrick}) => {
  const history = useHistory();

  const [bookHovered, setHover] = React.useState(false);

  const onBookHover = () => {
    setTimeout(() => setHover(true), 800);
  }

  const savingBrick = () => {
    saveBrick();
  }

  const renderAuthorRow = () => {
    const {author} = brick;
    if (!author) { return ''; }

    const {firstName, lastName} = author;

    return (
      <div className="names-row">
        {firstName ? firstName + ' ' : ''}
        {lastName ? lastName : ''}
      </div>
    );
  }

  if (brick.title) {
    setBrillderTitle(brick.title);
  }

  const getSpendTime = () => {
    let timeMinutes = 4;
    if (brick.brickLength === BrickLengthEnum.S40min) {
      timeMinutes = 8;
    } else if (brick.brickLength === BrickLengthEnum.S60min) {
      timeMinutes = 12;
    }
    return timeMinutes;
  }

  return (
    <div className="proposal-page">
      <Grid container direction="row" style={{ height: '100% !important' }} justify="center">
        <Grid className="back-button-container" container alignContent="center">
          <div className="back-button" onClick={() => history.push('/build/new-brick/length')} />
        </Grid>
        <Grid className="main-text-container">
          <h1>Your proposal has been saved!</h1>
          <h1>We've made a booklet for you</h1>
          <h1>to check all is in order.</h1>
          <div className="text-line-1"></div>
          <h2>Slide your mouse over the cover to</h2>
          <h2>open it. &nbsp;Click back to edit.</h2>
          <div className="text-line-2"></div>
          <div style={{fontSize: '2.2vw'}}>Aim to spend {getSpendTime()} minutes on this section.</div>
          <h2>When you're ready, start building!</h2>
        </Grid>
        <div className="book-main-container">
          <div className="book-container">
            <div className="book" onMouseOver={() => onBookHover()}>
              <div className="back"></div>
              <div className="page6">
                <div className="normal-page">
                  <div className="normal-page-container">
                  <Grid container justify="center">
                    <div className="edit-icon" />
                  </Grid>
                  <p className="text-title">2. Ideally, every brick should point to a bigger question.</p>
                  <p className="proposal-text">{brick.openQuestion}</p>
                  <p className="text-title">3. Outline the purpose of your brick.</p>
                  <div className="proposal-text">
                    <MathInHtml value={brick.brief} />
                  </div>
                  <p className="text-title">4. Create an engaging and relevant preparatory task.</p>
                  <div style={{fontWeight: 'normal'}}>
                    <YoutubeAndMathInHtml value={brick.prep} />
                  </div>
                  <p className="text-title brick-length">
                    5. Brick Length: <span className="brickLength">{brick.brickLength} mins.</span>
                  </p>
                  </div>
                </div>
              </div>
              <div className="page5">
                <div className="flipped-page">
                  <Grid container justify="center">
                    <FiberManualRecordIcon className="circle-icon" />
                  </Grid>
                  <div className="proposal-titles">
                    <div className="title">{brick.title}</div>
                    <div>{brick.subTopic}</div>
                    <div>{brick.alternativeTopics}</div>
                  </div>
                </div>
              </div>
              <div className="page4"></div>
              <div className="page3"></div>
              <div className="page2"></div>
              <div className="page1"></div>
              <div className="front">
                <div className="page-stitch">
                  <div className="vertical-line"></div>
                  <div className="horizontal-line top-line-1"></div>
                  <div className="horizontal-line top-line-2"></div>
                  <div className="horizontal-line bottom-line-1"></div>
                  <div className="horizontal-line bottom-line-2"></div>
                </div>
                <Grid container justify="center" alignContent="center" style={{height: '100%'}}>
                  <div>
                    <img alt="" src="/images/choose-login/logo.png" />
                    <div className="white-text">PROPOSAL</div>
                    {renderAuthorRow()}
                  </div>
                </Grid>
              </div>
            </div>
          </div>
          <Grid className="next-button-container" container alignContent="center">
            {
              bookHovered ? (
                <div>
                  <div className="next-button" onClick={savingBrick}></div>
                </div>
              ) : ""
            }
          </Grid>
        </div>
        <div className="red-right-block"></div>
      </Grid>
    </div>
  );
}

export default ProposalReview;
