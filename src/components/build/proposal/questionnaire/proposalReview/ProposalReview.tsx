import React from "react";
import Grid from "@material-ui/core/Grid";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import EditIcon from '@material-ui/icons/Edit';

import { Brick } from "model/brick";
import './ProposalReview.scss';
import { useHistory } from "react-router-dom";


interface ProposalProps {
  brick: Brick;
  saveBrick():void;
}

const ProposalReview: React.FC<ProposalProps> = ({brick, saveBrick}) => {
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
      <Grid container direction="row" style={{ height: '100%' }} justify="center">
        <Grid className="back-button-container" container alignContent="center">
          {
            bookHovered
              ? <div className="back-button" onClick={() => history.push('/build/new-brick/length')} />
              : ""
          }
        </Grid>
        <div className="book-main-container">
        <Grid className="next-button-container" container alignContent="center">
          {
            bookHovered ? (
              <div>
                <div className="next-button" onClick={savingBrick}></div>
                <div className="button-text">
                  <div>START</div>
                  <div>BUILDING!</div>
                </div>
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
                      <EditIcon className="edit-icon" />
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
                  <Grid container justify="center" alignContent="center" style={{height: '100%'}}>
                    <div>
                      <div>YOUR</div>
                      <div>PROP</div>
                      <div>OSAL</div>
                    </div>
                  </Grid>
                </div>
              </div>
            </div>
          </div>
      </Grid>
    </div>
  );
}

export default ProposalReview;
