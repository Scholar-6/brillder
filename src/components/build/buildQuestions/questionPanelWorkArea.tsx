import React, { useEffect } from 'react'
import { Grid, Select, FormControl, MenuItem, MuiThemeProvider } from '@material-ui/core';
import { ReactSortable } from "react-sortablejs";

import QuestionComponents from './questionComponents/questionComponents';
import { getNonEmptyComponent } from '../questionService/ValidateQuestionService';
import './questionPanelWorkArea.scss';
import { QuestionTypeEnum, QuestionComponentTypeEnum, Question, QuestionTypeObj } from 'model/question';
import DragBox from './drag/dragBox';
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

import * as Y from "yjs";


function SplitByCapitalLetters(element: string): string {
  return element.split(/(?=[A-Z])/).join(" ");
}

export interface QuestionProps {
  brickId: number;
  currentBrick: Brick;
  canEdit: boolean;
  yquestion: Y.Doc;
  history: any;
  questionsCount: number;
  synthesis: Y.Text;
  validationRequired: boolean;
  comments: Comment[] | null;
  currentUser: User;
  isAuthor: boolean;
  initSuggestionExpanded: boolean;
  undoRedoService: UndoRedoService;
  setQuestionType(type: QuestionTypeEnum): void;
  nextOrNewQuestion(): void;
  getQuestionIndex(question: Y.Doc): number;
  setPreviousQuestion(): void;
  toggleLock(): void;
  undo(): void;
  redo(): void;
  locked: boolean;
  
  // phone preview
  componentFocus(index: number): void;
}

const QuestionPanelWorkArea: React.FC<QuestionProps> = ({
  brickId, yquestion, history, validationRequired, locked, getQuestionIndex, ...props
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

  const question = yquestion.getMap();
  const type = question.get("type");

  let typeArray: string[] = Object.keys(QuestionTypeObj);
  let index = getQuestionIndex(yquestion);

  let showHelpArrow = false;
  if (index === 0 && props.isAuthor) {
    showHelpArrow = getNonEmptyComponent((question.get("components") as Y.Array<any>).toJSON());
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
              question={yquestion}
              validationRequired={validationRequired}
              componentFocus={props.componentFocus}
            />
          </Grid>
          <Grid container item xs={3} sm={3} md={3} direction="column" className="right-sidebar" alignItems="flex-end">
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
                    questionId={question.get("id")}
                    setCommentsShown={() => setCommentsShown(true)}
                  />
                </div>
                <Grid container direction="row" alignItems="center">
                  <Grid container justify="center" item sm={12} className="select-type-container">
                    <FormControl variant="outlined">
                      Change Answer type here:
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
              </div>
            }
            <Grid className={`question-comments-panel ${!commentsShown && 'hidden'}`} item container direction="row" justify="flex-start" xs>
              <CommentPanel
                currentLocation={CommentLocation.Question}
                currentBrick={props.currentBrick}
                setCommentsShown={setCommentsShown}
                haveBackButton={true}
                currentQuestionId={question.get("id")}
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
  );
}

const mapState = (state: ReduxCombinedState) => ({
  currentUser: state.user.user,
  currentBrick: state.brick.brick,
  comments: state.comments.comments
});

const connector = connect(mapState);

export default connector(QuestionPanelWorkArea);
