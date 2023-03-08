import React from 'react'
import { Grid, Select, FormControl, MenuItem } from '@material-ui/core';
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
import UndoButton from '../baseComponents/UndoButton';
import RedoButton from '../baseComponents/redoButton';
import StatusCircle from '../baseComponents/statusCircle/StatusCircle';
import { isAorPorE } from 'components/services/brickService';


function SplitByCapitalLetters(element: string): string {
  return element.split(/(?=[A-Z])/).join(" ");
}

export interface QuestionProps {
  brick: Brick;
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
  saveQuestion(question: Question): void;
  setQuestion(index: number, question: Question): void;
  updateFirstComponent(component: TextComponentObj): Question | undefined;
  updateComponents(components: any[]): Question | undefined;
  setQuestionType(type: QuestionTypeEnum): void;
  nextOrNewQuestion(): void;
  getQuestionIndex(question: Question): number;
  setPreviousQuestion(): void;
  toggleLock(): void;
  undo(): void;
  redo(): void;
  locked: boolean;

  // phone preview
  componentFocus(index: number): void;
}

const QuestionPanelWorkArea: React.FC<QuestionProps> = ({
  brick, question, history, validationRequired, locked, getQuestionIndex, ...props
}) => {
  const [componentTypes, setComponentType] = React.useState([
    { id: 1, type: QuestionComponentTypeEnum.Text },
    //{ id: 2, type: QuestionComponentTypeEnum.Quote },
    //{ id: 3, type: QuestionComponentTypeEnum.Image },
    { id: 4, type: QuestionComponentTypeEnum.Sound },
    { id: 5, type: QuestionComponentTypeEnum.Graph }
  ]);
  const [isCommingSoonOpen, setCommingSoon] = React.useState(false);
  const [commentsShown, setCommentsShown] = React.useState(props.initSuggestionExpanded);
  const [workarea] = React.useState(React.createRef() as React.RefObject<HTMLDivElement>);
  const { type } = question;

  const setQuestionHint = (hintState: HintState): Question => {
    if (locked) { return question; }
    const index = getQuestionIndex(question);
    const updatedQuestion = Object.assign({}, question) as Question;
    updatedQuestion.hint.value = hintState.value;
    updatedQuestion.hint.list = hintState.list;
    updatedQuestion.hint.status = hintState.status;
    props.setQuestion(index, updatedQuestion);
    return updatedQuestion;
  }

  let typeArray: string[] = Object.keys(QuestionTypeObj);
  let index = getQuestionIndex(question);

  let showHelpArrow = false;
  if (index === 0 && props.isAuthor) {
    showHelpArrow = getNonEmptyComponent(question.components);
  }

  //#region Scroll
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

  /**
   * if Admin, Publisher or Editor than true
   * @returns 
   */
  const canSeeLock = () => {
    const { currentUser } = props;
    const adminPublisherOrEditor = isAorPorE(brick, currentUser);
    if (adminPublisherOrEditor) {
      return true;
    }
    return false;
  }

  const renderLock = () => {
    if (brick.isCore === true) {
      const canSee = canSeeLock();
      if (canSee) {
        return <LockComponent locked={locked} disabled={!props.canEdit} onChange={props.toggleLock} />
      }
    }
    return ''
  }

  return (
    <div key={question?.id} className={showHelpArrow ? "build-question-page" : "build-question-page active"} style={{ width: '100%', height: '94%' }}>
      {showHelpArrow && <div className="help-arrow-text">Drag</div>}
      {showHelpArrow && <img alt="arrow" className="help-arrow" src="/images/investigation-arrow.png" />}
      <div className="top-scroll-area">
        <div className="top-button-container">
          <button className="btn btn-transparent svgOnHover" onClick={scrollUp}>
            <SpriteIcon name="arrow-up" className="active text-theme-orange" />
          </button>
        </div>
      </div>
      <Grid container direction="row" className="build-question-column">
        <Grid container item xs={4} sm={3} md={3} alignItems="center" className="parent-left-sidebar">
          <div className="left-sidebar">
            <ReactSortable
              key={question.brickQuestionId}
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
              {/* 
                <DragBox
                  locked={locked}
                  name="“ ”"
                  label="QUOTE"
                  hoverMarginTop="-1.5vw"
                  value={QuestionComponentTypeEnum.Quote}
                />*/}
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
        <Grid container item xs={5} sm={6} md={6} className="question-components-list">
          <QuestionComponents
            questionIndex={index}
            locked={locked}
            scrollRef={workarea}
            editOnly={!props.canEdit}
            brickId={brick.id}
            history={history}
            question={question}
            validationRequired={validationRequired}
            componentFocus={props.componentFocus}
            saveQuestion={props.saveQuestion}
            updateFirstComponent={props.updateFirstComponent}
            updateComponents={props.updateComponents}
            setQuestionHint={setQuestionHint}
          />
        </Grid>
        <div className="right-sidebar">
          {!commentsShown &&
            <div className="comments-sidebar-default">
              <div className="reundo-button-container">
                <UndoButton
                  undo={props.undo}
                  canUndo={() => props.undoRedoService.canUndo()}
                />
                <RedoButton
                  redo={props.redo}
                  canRedo={() => props.undoRedoService.canRedo()}
                />
              </div>
              <div className="comment-button-container">
                <CommentButton
                  location={CommentLocation.Question}
                  questionId={question.id}
                  setCommentsShown={() => setCommentsShown(true)}
                />
              </div>
              <Grid container direction="row" alignItems="center">
                <Grid container justifyContent="center" item sm={12} className="select-type-container">
                  <FormControl variant="outlined">
                    <div className="flex-center"><SpriteIcon name="feather-refresh" /> <div>Change Answer Type</div></div>
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
              {renderLock()}
              <StatusCircle status={brick.status} isCore={brick.isCore} />
            </div>
          }
          <Grid className={`question-comments-panel ${!commentsShown && 'hidden'}`} item container direction="row" justifyContent="flex-start" xs>
            <CommentPanel
              isHidden={!commentsShown}
              currentLocation={CommentLocation.Question}
              currentBrick={brick}
              setCommentsShown={setCommentsShown}
              haveBackButton={true}
              currentQuestionId={question.id}
            />
          </Grid>
        </div>
      </Grid>
      <div className="bottom-scroll-area">
        <div className="bottom-button-container">
          <button className="btn btn-transparent svgOnHover" onClick={scrollDown}>
            <SpriteIcon name="arrow-down" className="active text-theme-orange" />
          </button>
        </div>
      </div>
      <CommingSoonDialog isOpen={isCommingSoonOpen} close={() => setCommingSoon(false)} />
    </div>
  );
}

const mapState = (state: ReduxCombinedState) => ({
  currentUser: state.user.user,
  comments: state.comments.comments
});

const connector = connect(mapState);

export default connector(QuestionPanelWorkArea);
