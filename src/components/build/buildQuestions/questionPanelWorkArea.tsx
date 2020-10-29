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
import UndoRedoService from 'components/services/UndoRedoService';
import CommentButton from '../baseComponents/commentButton/CommentButton';


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
  undoRedoService: UndoRedoService;
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
          <Grid container item xs={3} sm={3} md={3} direction="column" className="right-sidebar" alignItems="flex-end">
          {!commentsShown &&
              <Grid container item alignItems="center" style={{ height: '100%' }}>
                <Grid container item justify="center" style={{ height: "87%", width: '100%' }}>
                  <Grid item container direction="row" justify="space-evenly">
                    <button className="btn btn-transparent svgOnHover undo-button" onClick={props.undo}>
                      <SpriteIcon
                        name="undo"
                        className={`w100 h100 active ${props.undoRedoService.canUndo() && "text-theme-orange"}`}
                      />
                    </button>
                    <button className="btn btn-transparent svgOnHover redo-button" onClick={props.redo}>
                      <SpriteIcon
                        name="redo"
                        className={`w100 h100 active ${props.undoRedoService.canRedo() && "text-theme-orange"}`}
                      />
                    </button>
                  </Grid>
                  <CommentButton
                    location={CommentLocation.Question}
                    questionId={question.id}
                    setCommentsShown={() => setCommentsShown(true)}
                  />
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
                </Grid>
              </Grid>
            }
            <Grid className={`question-comments-panel ${!commentsShown && 'hidden'}`} item container direction="row" justify="flex-start" xs>
              <CommentPanel
                currentLocation={CommentLocation.Question}
                currentBrick={props.currentBrick}
                setCommentsShown={setCommentsShown}
                haveBackButton={true}
                currentQuestionId={question.id}
              />
            </Grid>
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
