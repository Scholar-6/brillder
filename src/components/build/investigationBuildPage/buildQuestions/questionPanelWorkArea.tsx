import React from 'react'
import { Grid, Select, FormControl, SvgIcon } from '@material-ui/core';
import { MenuItem } from "material-ui";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ReactSortable } from "react-sortablejs";

import sprite from "assets/img/icons-sprite.svg";
import QuestionComponents from './questionComponents/questionComponents';
import { getNonEmptyComponent } from '../questionService/ValidateQuestionService';
import './questionPanelWorkArea.scss';
import { QuestionTypeEnum, QuestionComponentTypeEnum, Question, QuestionTypeObj } from 'model/question';
import DragBox from './drag/dragBox';
import { HintState } from 'components/build/baseComponents/Hint/Hint';
import LockComponent from './lock/Lock';
import CommentPanel from 'components/baseComponents/comments/CommentPanel';
import CommingSoonDialog from 'components/baseComponents/dialogs/CommingSoon';
import { Comment } from 'model/comments';
import { ReduxCombinedState } from 'redux/reducers';
import { connect } from 'react-redux';
import { User } from 'model/user';


function SplitByCapitalLetters(element: string): string {
  return element.split(/(?=[A-Z])/).join(" ");
}

export interface QuestionProps {
  brickId: number;
  canEdit: boolean;
  question: Question;
  history: any;
  questionsCount: number;
  synthesis: string;
  validationRequired: boolean;
  comments: Comment[] | null;
  currentUser: User;
  initSuggestionExpanded: boolean;
  saveBrick(): void;
  setQuestion(index: number, question: Question): void;
  updateComponents(components: any[]): void;
  setQuestionType(type: QuestionTypeEnum): void;
  nextOrNewQuestion(): void;
  getQuestionIndex(question: Question): number;
  setPreviousQuestion(): void;
  toggleLock(): void;
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
  const [scrollShown, setScroll] = React.useState(false);
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
  if (index === 0) {
    showHelpArrow = getNonEmptyComponent(question.components);
  }

  const showScrollArrows = () => setScroll(true);
  const hideScrollArrows = () => setScroll(false);

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

  const getCommentCount = () => {
    return props.comments?.filter(comment => // count comments...
      (comment.question?.id ?? -1) === question.id && // on the correct question...
      comment.readBy.filter(user => user.id === props.currentUser.id).length === 0 // and where it has not been read.
    ).length ?? 0
  }

  const renderCommentButton = () => {
    let count = getCommentCount();
    if (count >= 1) {
      return (
        <div className="comment-button" onClick={() => setCommentsShown(!commentsShown)}>
          <SvgIcon>
            <svg className="svg">
              {/*eslint-disable-next-line*/}
              <use href={sprite + "#message-square"} />
            </svg>
          </SvgIcon>
          <div className="comments-count">
            {getCommentCount()}
          </div>
        </div>
      );
    }
    return (
      <div className="comment-button" onClick={() => setCommentsShown(!commentsShown)}>
        <SvgIcon>
          <svg className="svg">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#message-square"} />
          </svg>
        </SvgIcon>
        <div className="comments-plus">
          <svg className="svg">
            {/*eslint-disable-next-line*/}
            <use href={sprite + "#plus"} />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <MuiThemeProvider >
      <div className={showHelpArrow ? "build-question-page" : "build-question-page active"} style={{ width: '100%', height: '94%' }}>
        {
          showHelpArrow ? <img alt="" className="help-arrow" src="/images/investigation-arrow.png" /> : ""
        }
        <div className="top-scroll-area">
          <div className="top-button-container">
            {
              scrollShown ? <button className="btn btn-transparent svgOnHover" onClick={scrollUp}>
                <svg className="svg active">
                  {/*eslint-disable-next-line*/}
                  <use href={sprite + "#arrow-up"} className="text-theme-orange" />
                </svg>
              </button> : ""
            }
          </div>
        </div>
        <Grid container justify="center" className="build-question-column" item xs={12}>
          <Grid container direction="row" style={{ height: '100%' }}>
            <Grid container item xs={4} sm={3} md={3} alignItems="center" className="parent-left-sidebar">
              <Grid container item xs={12} className="left-sidebar" alignItems="center">
                <ReactSortable
                  list={componentTypes}
                  group={{ name: "cloning-group-name", pull: "clone" }}
                  setList={setComponentType} sort={false}
                >
                  <DragBox
                    locked={locked}
                    name="T" fontSize="3.4vw" label="T E X T"
                    hoverMarginTop="0vw"
                    fontFamily="Brandon Grotesque Bold"
                    value={QuestionComponentTypeEnum.Text}
                    className="text-box"
                  />
                  <DragBox
                    locked={locked}
                    name="“ ”" fontSize="2.5vw" label="Q U O T E"
                    hoverMarginTop="-0.65vw"
                    fontFamily="Brandon Grotesque Bold"
                    letterSpacing="0.625vw"
                    marginLeft="0.3vw"
                    value={QuestionComponentTypeEnum.Quote}
                  />
                  <DragBox
                    locked={locked}
                    name=".jpg" fontSize="2.5vw" label="I M A G E"
                    hoverMarginTop="1vw"
                    marginTop="-2.8vw"
                    fontFamily="Brandon Grotesque Bold"
                    value={QuestionComponentTypeEnum.Image}
                  />
                  <DragBox
                    locked={locked}
                    isImage={true} src="/images/soundicon.png"
                    label="S O U N D"
                    hoverMarginTop="0.5vw"
                    fontFamily="Brandon Grotesque Bold"
                    value={QuestionComponentTypeEnum.Sound}
                  />
                </ReactSortable>
                <DragBox
                  locked={true}
                  name="f(x)" fontSize="2.5vw" label="G R A P H"
                  fontFamily="Brandon Grotesque Bold Italic"
                  hoverMarginTop="0.9vw"
                  marginTop="-1vw"
                  className="disabled"
                  onClick={() => setCommingSoon(true)}
                  value={QuestionComponentTypeEnum.Graph}
                />
              </Grid>
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
                updateComponents={props.updateComponents}
                setQuestionHint={setQuestionHint}
              />
            </Grid>
            <Grid container item xs={3} sm={3} md={3} direction="column" className="right-sidebar" alignItems="center">
              {commentsShown ?
                <Grid className="question-comments-panel" item container direction="row" justify="flex-start" xs>
                  <CommentPanel setCommentsShown={setCommentsShown} haveBackButton={true} currentQuestionId={question.id} />
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
                                return <MenuItem style={{ fontFamily: 'Brandon Grotesque Regular' }} key={i} value={type}>{SplitByCapitalLetters(typeName)}</MenuItem>
                              })
                            }
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <LockComponent locked={locked} disabled={!props.canEdit} onChange={props.toggleLock} />
                  </Grid>
                </Grid>
              }
            </Grid>
          </Grid>
        </Grid>
        <div className="bottom-scroll-area">
          {
            scrollShown
              ? <div className="bottom-button-container">
                <button className="btn btn-transparent svgOnHover" onClick={scrollDown}>
                  <svg className="svg active">
                    <use href={sprite + "#arrow-down"} className="text-theme-orange" />
                  </svg>
                </button>
                <div className="scroll-text">
                  <span>Click again to hide</span>
                  <button className="btn btn-transparent svgOnHover" onClick={hideScrollArrows}>
                    <svg className="svg active">
                      <use href={sprite + "#eye-on"} className="text-theme-orange" />
                    </svg>
                  </button>
                </div>
              </div>
              :
              <div className="bottom-button-container">
                <div className="scroll-text">
                  <span>Trouble scrolling? Click the eye to show up/down arrows</span>
                  <button className="btn btn-transparent svgOnHover" onClick={showScrollArrows}>
                    <svg className="svg active">
                      <use href={sprite + "#eye-off"} className="text-gray" />
                    </svg>
                  </button>
                </div>
              </div>
          }
        </div>
        <CommingSoonDialog isOpen={isCommingSoonOpen} close={() => setCommingSoon(false)} />
      </div>
    </MuiThemeProvider>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  currentUser: state.user.user,
  comments: state.comments.comments
});

const connector = connect(mapState);

export default connector(QuestionPanelWorkArea);
