import React, { useEffect } from 'react'
import { Grid, Select, FormControl } from '@material-ui/core';
import { MenuItem } from "material-ui";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ReactSortable } from "react-sortablejs";

import QuestionComponents from './questionComponents/questionComponents';
import { getNonEmptyComponent } from '../questionService/ValidateQuestionService';
import './questionPanelWorkArea.scss';
import { QuestionTypeEnum, QuestionComponentTypeEnum, Question, QuestionTypeObj } from 'model/question';
import DragBox from './drag/dragBox';
import { HintState } from 'components/build/baseComponents/Hint/Hint';
import LockComponent from './lock/Lock';
import CommentPanel from 'components/baseComponents/comments/CommentPanel';
import CommingSoonDialog from 'components/baseComponents/dialogs/CommingSoon';
import { Comment, CommentLocation } from 'model/comments';
import { ReduxCombinedState } from 'redux/reducers';
import { connect } from 'react-redux';
import { User } from 'model/user';
import { TextComponentObj } from './components/Text/interface';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { Brick } from 'model/brick';


function SplitByCapitalLetters(element: string): string {
  return element.split(/(?=[A-Z])/).join(" ");
}

export interface QuestionProps {
  brickId: number;
  currentBrick: Brick;
  canEdit: boolean;
  question: Question;
  history: any;
  questionsCount: number;
  synthesis: string;
  validationRequired: boolean;
  comments: Comment[] | null;
  currentUser: User;
  isAuthor: boolean;
  initSuggestionExpanded: boolean;
  saveBrick(): void;
  setQuestion(index: number, question: Question): void;
  updateFirstComponent(component: TextComponentObj): void;
  updateComponents(components: any[]): void;
  setQuestionType(type: QuestionTypeEnum): void;
  nextOrNewQuestion(): void;
  getQuestionIndex(question: Question): number;
  setPreviousQuestion(): void;
  toggleLock(): void;
  undo(): void;
  redo(): void;
  locked: boolean;
}

const QuestionPanelWorkArea: React.FC<QuestionProps> = ({
  brickId, question, history, validationRequired, locked, getQuestionIndex, ...props
}) => {
  const [componentTypes, setComponentType] = React.useState([
    { id: 1, type: QuestionComponentTypeEnum.Text },
    { id: 2, type: QuestionComponentTypeEnum.Quote },
    { id: 3, type: QuestionComponentTypeEnum.Image },
    { id: 4, type: QuestionComponentTypeEnum.Sound },
    { id: 4, type: QuestionComponentTypeEnum.Graph }
  ]);
  const [isCommingSoonOpen, setCommingSoon] = React.useState(false);
  const [commentsShown, setCommentsShown] = React.useState(props.initSuggestionExpanded);
  const [workarea] = React.useState(React.createRef() as React.RefObject<HTMLDivElement>);
  const { type } = question;

  const setQuestionHint = (hintState: HintState) => {
    if (locked) { return; }
    const index = getQuestionIndex(question);
    const updatedQuestion = Object.assign({}, question) as Question;
    updatedQuestion.hint.value = hintState.value;
    updatedQuestion.hint.list = hintState.list;
    updatedQuestion.hint.status = hintState.status;
    props.setQuestion(index, updatedQuestion);
  }

  let typeArray: string[] = Object.keys(QuestionTypeObj);
  let index = getQuestionIndex(question);

  let showHelpArrow = false;
  if (index === 0 && props.isAuthor) {
    showHelpArrow = getNonEmptyComponent(question.components);
  }

  //#region Scroll
  const [canScroll, setScroll] = React.useState(false);

  useEffect(() => {
    const {current} = workarea;
    if (current) {
      if (current.scrollHeight > current.clientHeight) {
        if (!canScroll) {
          setScroll(true);
        }
      } else {
        if (canScroll) {
          setScroll(false);
        }
      }
    }
  });
  
  const scrollUp = () => {
    if (workarea.current) {
      workarea.current.scrollBy(0, -100);
    }
  }

  const scrollDown = () => {
    if (workarea.current) {
      let el = workarea.current;
      el.scrollBy(0, 100);
    }
  }
  //#endregion

  const getNumberOfReplies = () => {
    const replies = props.comments?.filter(comment => (comment.question?.id ?? -1) === question.id)
      .map(getLatestChild)
      .sort((a, b) => new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf());
    if (replies && replies.length > 0) {
      let currentIndex = 0;
      const latestAuthor = replies[0].author.id;
      while (currentIndex < replies.length
        && replies[currentIndex].author.id === latestAuthor) {
        currentIndex += 1;
      }
      const isCurrentUser = latestAuthor === props.currentUser.id;
      return isCurrentUser ? currentIndex : -currentIndex;
    } else {
      return 0;
    }
  }

  const getLatestChild = (comment: Comment) => {
    if (!comment.children || comment.children.length <= 0) {
      return comment;
    }
    const replies = comment.children.sort((a, b) => new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf());
    return replies[0];
  }

  const renderCommentButton = () => {
    let numberOfReplies = getNumberOfReplies();
    if (numberOfReplies !== 0) {
      return (
        <div className={"comment-button " + (numberOfReplies > 0 ? "has-replied" : "active") + " animated pulse-orange iteration-2 duration-1s"} onClick={() => setCommentsShown(!commentsShown)}>
          <div className="comments-icon svgOnHover">
            <SpriteIcon name="message-square" className="w60 h60 active" />
          </div>
          <div className="comments-count">
            {numberOfReplies > 0 ? numberOfReplies : -numberOfReplies}
          </div>
        </div>
      );
    }
    return (
      <div className={"comment-button"} onClick={() => setCommentsShown(!commentsShown)}>
        <div className="comments-icon svgOnHover">
          <SpriteIcon name="message-square" className="w60 h60 active" />
        </div>
        <div className="comments-plus svgOnHover">
          <SpriteIcon name="plus" className="w60 h60 active" />
        </div>
      </div>
    );
  }

  return (
    <MuiThemeProvider >
      <div className={showHelpArrow ? "build-question-page unselectable" : "build-question-page unselectable active"} style={{ width: '100%', height: '94%' }}>
        {showHelpArrow && <div className="help-arrow-text">Drag</div>}
        {showHelpArrow && <img alt="arrow" className="help-arrow" src="/images/investigation-arrow.png" />}
        <div className="top-scroll-area">
          <div className="top-button-container">
            <button className="btn btn-transparent svgOnHover" onClick={scrollUp}>
              <SpriteIcon name="arrow-up" className={`active text-theme-orange ${!canScroll && 'disabled'}`} />
            </button>
          </div>
        </div>
        <Grid container direction="row" className="build-question-column">
          <Grid container item xs={4} sm={3} md={3} alignItems="center" className="parent-left-sidebar">
            <div className="left-sidebar">
              <ReactSortable
                list={componentTypes}
                group={{ name: "cloning-group-name", pull: "clone" }}
                setList={setComponentType} sort={false}
              >
                <DragBox
                  locked={locked}
                  name="T"
                  label="TEXT"
                  className="text-box"
                  hoverMarginTop="-0.85vw"
                  value={QuestionComponentTypeEnum.Text}
                />
                <DragBox
                  locked={locked}
                  name="“ ”"
                  label="QUOTE"
                  hoverMarginTop="-1.5vw"
                  value={QuestionComponentTypeEnum.Quote}
                />
                <DragBox
                  locked={locked}
                  name="jpg"
                  label="IMAGE"
                  value={QuestionComponentTypeEnum.Image}
                />
                <DragBox
                  locked={locked}
                  isImage={true} src="/images/soundicon.png"
                  label="SOUND"
                  className="drag-box-name"
                  value={QuestionComponentTypeEnum.Sound}
                />
                <DragBox
                  locked={locked}
                  name="f(x)"
                  label="GRAPH"
                  className="graph-box"
                  value={QuestionComponentTypeEnum.Graph}
                />
              </ReactSortable>
            </div>
          </Grid>
          <Grid container item xs={5} sm={6} md={6} className="question-components-list" ref={workarea}>
            <QuestionComponents
              questionIndex={index}
              locked={locked}
              editOnly={!props.canEdit}
              brickId={brickId}
              history={history}
              question={question}
              validationRequired={validationRequired}
              saveBrick={props.saveBrick}
              updateFirstComponent={props.updateFirstComponent}
              updateComponents={props.updateComponents}
              setQuestionHint={setQuestionHint}
            />
          </Grid>
          <Grid container item xs={3} sm={3} md={3} direction="column" className="right-sidebar" alignItems="center">
            {commentsShown ?
              <Grid className="question-comments-panel" item container direction="row" justify="flex-start" xs>
                <CommentPanel
                  currentLocation={CommentLocation.Question}
                  currentBrick={props.currentBrick}
                  setCommentsShown={setCommentsShown}
                  haveBackButton={true}
                  currentQuestionId={question.id}
                />
              </Grid> :
              <Grid container item alignItems="center" style={{ height: '100%' }}>
                <Grid container item justify="center" style={{ height: "87%", width: '100%' }}>
                  {renderCommentButton()}
                  <Grid container direction="row" alignItems="center">
                    <Grid container justify="center" item sm={12}>
                      <FormControl variant="outlined">
                        <Select
                          className="select-question-type"
                          disabled={locked}
                          value={type}
                          inputProps={{
                            name: 'age',
                            id: 'age-native-simple',
                          }}
                          onChange={(e) => {
                            props.setQuestionType(parseInt(e.target.value as string) as QuestionTypeEnum);
                          }}
                        >
                          {
                            typeArray.map((typeName, i) => {
                              const type = QuestionTypeObj[typeName] as QuestionTypeEnum;
                              return (
                                <MenuItem key={i} value={type}>
                                  {SplitByCapitalLetters(typeName)}
                                </MenuItem>
                              )
                            })
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <LockComponent locked={locked} disabled={!props.canEdit} onChange={props.toggleLock} />
                  <Grid item container direction="row" justify="center">
                    <button className="btn" onClick={props.undo}>Undo</button>
                    <button className="btn" onClick={props.redo}>Redo</button>
                  </Grid>
                </Grid>
              </Grid>
            }
          </Grid>
        </Grid>
        <div className="bottom-scroll-area">
          <div className="bottom-button-container">
            <button className="btn btn-transparent svgOnHover" onClick={scrollDown}>
              <SpriteIcon name="arrow-down" className={`active text-theme-orange ${!canScroll && 'disabled'}`} />
            </button>
          </div>
        </div>
        <CommingSoonDialog isOpen={isCommingSoonOpen} close={() => setCommingSoon(false)} />
      </div>
    </MuiThemeProvider>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  currentUser: state.user.user,
  currentBrick: state.brick.brick,
  comments: state.comments.comments
});

const connector = connect(mapState);

export default connector(QuestionPanelWorkArea);
