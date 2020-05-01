import React from "react";
import Grid from "@material-ui/core/Grid";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import HomeButton from 'components/baseComponents/homeButton/HomeButton';
import { Brick } from "model/brick";
import './ProposalReview.scss';
import { useHistory } from "react-router-dom";
import { User } from "model/user";


interface ProposalProps {
  brick: Brick;
  user: User;
  saveBrick():void;
}

const ProposalReview: React.FC<ProposalProps> = ({brick, user, saveBrick}) => {
  const history = useHistory();

  const [bookHovered, setHover] = React.useState(false);

  const onBookHover = () => {
    setTimeout(() => {
      setHover(true);
    }, 800);
  }

  const savingBrick = () => {
    saveBrick();
  }

  return (
    <div className="proposal-page">
      <div style={{position: 'fixed', top: 0, left: 0, zIndex: 1000}}>
        <HomeButton link='/build' />
      </div>
      <Grid container direction="row" style={{ height: '100%' }} justify="center">
        <Grid className="back-button-container" container alignContent="center">
          {
            bookHovered
              ? <div className="back-button" onClick={() => history.push('/build/new-brick/length')} />
              : ""
          }
        </Grid>
        <Grid className="main-text-container">
          <h1>Your proposal has been saved!</h1>
          <h1>We've made a booklet for you</h1>
          <h1>to check all is in order.</h1>
          <div className="text-line-1"></div>
          <h2>Slide your mouse over the cover to</h2>
          <h2>open it. &nbsp;Click back to edit.</h2>
          <div className="text-line-2"></div>
          <h2>When you're ready, start building!</h2>
        </Grid>
        <div className="book-main-container">
          <Grid className="next-button-container" container alignContent="center">
            {
              bookHovered ? (
                <div>
                  <div className="next-button" onClick={savingBrick}></div>
                </div>
              ) : ""
            }
          </Grid>
          <div className="book-container">
            <div className="book" onMouseOver={() => onBookHover()}>
              <div className="back"></div>
              <div className="page6">
                <div className="normal-page">
                  <Grid container justify="center">
                    <div className="edit-icon" />
                  </Grid>
                  <p className="text-title">2. Ideally, every brick should point to a bigger question.</p>
                  <p className="proposal-text">{brick.openQuestion}</p>
                  <p className="text-title">3. Outline the purpose of your brick.</p>
                  <p className="proposal-text">{brick.brief}</p>
                  <p className="text-title">4. Create an engaging and relevant preparatory task.</p>
                  <p style={{fontWeight: 'normal'}} dangerouslySetInnerHTML={{ __html: brick.prep}}></p>
                  <p className="text-title">5. Brick Length: <span className="brickLength">{brick.brickLength} mins.</span></p>
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
                    <div className="names-row">{user.firstName} {user.lastName}</div>
                  </div>
                </Grid>
              </div>
            </div>
          </div>
        </div>
        <div className="red-right-block"></div>
        <div className="beta-text">BETA</div>
      </Grid>
    </div>
  );
}

export default ProposalReview;
