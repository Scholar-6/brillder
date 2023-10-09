import React, { useState } from "react";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import queryString from 'query-string';
// @ts-ignore
import { Steps } from 'intro.js-react';

import CommentPanel from "components/baseComponents/comments/CommentPanel";
import { CommentLocation } from "model/comments";
import { ReduxCombinedState } from "redux/reducers";

import { Brick, Subject } from "model/brick";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import CommentButton from "../baseComponents/commentButton/CommentButton";
import RedoButton from "../baseComponents/redoButton";
import UndoButton from "../baseComponents/UndoButton";
import QuillEditor from "components/baseComponents/quill/QuillEditor";
import { QuillEditorContext } from "components/baseComponents/quill/QuillEditorContext";
import QuillGlobalToolbar from "components/baseComponents/quill/QuillGlobalToolbar";
import KeyWordsComponent from "../proposal/questionnaire/brickTitle/components/KeyWords";
import { User } from "model/user";
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";
import BrickLength from "./BrickLength";
import Subjects from "./Subjects";
import brickActions from "redux/actions/brickActions";
import PlanPreviewComponent from "../baseComponents/phonePreview/plan/PlanPreview";
import CoreSelect from "../proposal/questionnaire/brickTitle/components/CoreSelect";
import { stripHtml } from "../questionService/ConvertService";
import StatusCircle from "../baseComponents/statusCircle/StatusCircle";
import QuillSimpleEditor from "components/baseComponents/quill/QuillSimpleEditor";
import LockComponent from "../buildQuestions/lock/Lock";
import { isAorPorE } from "components/services/brickService";
import QuillTitleEditor from "components/baseComponents/quill/QuillTitleEditor";
import DifficultySelectV2 from "../proposal/questionnaire/brickTitle/components/DifficultySelectV2";
import QuillOpenQuestionEditor from "components/baseComponents/quill/QuillOpenQuestionEditor";
import subjectActions from "redux/actions/subject";


export interface PlanProps {
  currentBrick: Brick;
  saveBrick(brick: Brick): Promise<Brick | null>;
  saveBrickField(brickId: number, fieldName: string, value: string): Promise<any>;
  user: User;
  history: any;
  locked: boolean;
  editOnly: boolean;
  validationRequired: boolean;
  toggleLock(): void;
  initSuggestionExpanded?: boolean;
  selectFirstQuestion(): void;
  setSaveFailed(): void;

  subjects: Subject[];
  getSubjects(): Promise<Subject[]>;
}

const PlanPage: React.FC<PlanProps> = (props) => {
  const { currentBrick, validationRequired, locked } = props;
  const [apiSubjects, setApiSubjects] = useState([] as Subject[]);

  let isAuthor = false;
  try {
    isAuthor = props.currentBrick.author.id === props.user.id;
  } catch { }

  const [adapted, setAdapted] = useState(null as any);

  const [scrollArea] = useState(React.createRef() as React.RefObject<HTMLDivElement>);
  const [canScroll, setScroll] = React.useState(false);

  const [commentsShown, setCommentsShown] = useState(false);
  const editorIdState = useState("");

  React.useEffect(() => {
  console.log('get subjects 12');
    if (props.subjects.length === 0) {
      props.getSubjects().then(allSubjects => {
        if (allSubjects) {
          setApiSubjects(allSubjects);
        }
      });
    } else {
      setApiSubjects(props.subjects);
    }
    const values = queryString.parse(props.history.location.search);
    if (values.copied) {
      setTimeout(() => {
        setAdapted(true);
      }, 600);
    }
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      let { current } = scrollArea;
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
    }, 100);
  }, [canScroll, scrollArea, props, setScroll]);

  const scrollUp = () => {
    const { current } = scrollArea;
    if (current) {
      current.scrollBy(0, -window.screen.height / 30);
    }
  }

  const scrollDown = () => {
    const { current } = scrollArea;
    if (current) {
      current.scrollBy(0, window.screen.height / 30);
    }
  }

  const changeBrick = React.useMemo(() => {
    return (changeFn: (brick: Brick) => Brick) => {
      const newBrick = changeFn(currentBrick);
      props.saveBrick(newBrick).then(res => {
        if (res === null) {
          props.setSaveFailed();
        }
      });
    };
    /*eslint-disable-next-line*/
  }, [currentBrick, props.saveBrick]);

  const changeBrickField = (brickId: number, fieldName: string, value: string) => {
    props.saveBrickField(brickId, fieldName, value).then(res => {
      if (res === null) {
        props.setSaveFailed();
      }
    });
  }

  /**
  * if Admin, Publisher or Editor than true
  * @returns 
  */
  const canSeeLock = () => {
    const { user } = props;
    const adminPublisherOrEditor = isAorPorE(currentBrick, user);
    if (adminPublisherOrEditor) {
      return true;
    }
    return false;
  }

  const renderLock = () => {
    if (currentBrick.isCore === true) {
      const canSee = canSeeLock();
      if (canSee) {
        return <LockComponent locked={locked} disabled={props.editOnly} onChange={props.toggleLock} />
      }
    }
    return ''
  }

  const getAlternativeSubject = (brick: Brick, alternateSubjectId: number | null) => {
    {
      const subject = apiSubjects.find(sub => sub.id === alternateSubjectId);
      if (!subject) {
        alternateSubjectId = null;
      }

      return {
        ...brick,
        alternateSubjectId,
        alternateSubject: apiSubjects.find(sub => sub.id === alternateSubjectId)
      }
    }
  }

  // preparing subjects
  let mainSubjects = [...apiSubjects];
  let alternativeSubjects = [...apiSubjects];
  if (currentBrick.subjectId) {
    alternativeSubjects = alternativeSubjects.filter(s => s.id !== currentBrick.subjectId);
  }
  if (currentBrick.alternateSubjectId) {
    mainSubjects = mainSubjects.filter(s => s.id !== currentBrick.alternateSubjectId);
  }

  return (
    <div className="question-type plan-page">
      <div className="top-scroll-area">
        <div className="top-button-container">
          <button className="btn btn-transparent svgOnHover" onClick={scrollUp}>
            <SpriteIcon
              name="arrow-up"
              className={`active text-theme-orange ${!canScroll && 'disabled'}`}
            />
          </button>
        </div>
      </div>
      <div className="inner-question-type">
        <Grid
          container
          direction="row"
          alignItems="stretch"
          style={{ height: "100%" }}
        >
          <Grid item xs className="plan-quill-container">
            <QuillEditorContext.Provider value={editorIdState}>
              <div className="p-edit-container">
                <QuillGlobalToolbar
                  disabled={locked}
                  availableOptions={[
                    "bold",
                    "italic",
                    "fontColor",
                    "superscript",
                    "subscript",
                    "strikethrough",
                    "latex",
                    "bulletedList",
                    "numberedList",
                    "blockQuote",
                    "align",
                    "image", "sound", "table", "desmos", "caps"
                  ]}
                />
                <Grid container direction="row" className="inner-quills" ref={scrollArea}>
                  <div className="title-quill-container">
                    <div className="header">Title</div>
                    <QuillTitleEditor
                      data={currentBrick.title}
                      onChange={title => changeBrickField(currentBrick.id, 'title', title)}
                      placeholder="What is your brick about?"
                      disabled={locked}
                      validate={validationRequired}
                      isValid={!!stripHtml(currentBrick.title)}
                      toolbar={['italic']}
                    />
                  </div>
                  <KeyWordsComponent
                    disabled={locked}
                    keyWords={currentBrick.keywords}
                    validate={!isAuthor && validationRequired}
                    onChange={keywords => changeBrick((brick) => ({ ...brick, keywords }))}
                  />
                  <div className="subject-level-group">
                    <div className="header-d342">Subject, Level and Length</div>
                    <div className="two-labels-d23">
                      <div>Main Subject</div>
                      <div>Alternate Subject</div>
                    </div>
                    <div className="subject-select-container">
                      <Subjects
                        disabled={locked}
                        subjects={mainSubjects}
                        subjectId={currentBrick.subjectId}
                        onChange={subjectId => changeBrick((brick) => ({ ...brick, subjectId, subject: apiSubjects.find(sub => sub.id === subjectId) }))}
                      />
                      <Subjects
                        disabled={locked}
                        subjects={[{ color: 'black', name: 'none' } as Subject, ...alternativeSubjects]}
                        subjectId={currentBrick.alternateSubjectId}
                        onChange={alternateSubjectId => changeBrick((brick) => getAlternativeSubject(brick, alternateSubjectId))}
                      />
                    </div>
                    <div className="three-labels-d23">
                      <div>Level</div>
                      <div>Length</div>
                      <div>Visibility</div>
                    </div>
                    <div className="level-and-length-container">
                      <DifficultySelectV2
                        disabled={locked}
                        level={currentBrick.academicLevel}
                        onChange={academicLevel => changeBrick((brick) => ({ ...brick, academicLevel }))}
                      />
                      <BrickLength
                        disabled={locked}
                        brickLength={currentBrick.brickLength}
                        onChange={brickLength => changeBrick((brick) => ({ ...brick, brickLength }))}
                      />
                      <CoreSelect disabled={locked || currentBrick.adaptedFrom} brickStatus={currentBrick.status} isCore={currentBrick.isCore} onChange={isCore => changeBrick((brick) => ({ ...brick, isCore }))} />
                    </div>
                  </div>
                  <div className="open-question-container">
                    <div className="header">Open Question</div>
                    <QuillOpenQuestionEditor
                      disabled={locked}
                      placeholder="Ideally, every brick should point to a bigger question."
                      data={currentBrick.openQuestion}
                      validate={validationRequired}
                      isValid={!!stripHtml(currentBrick.openQuestion)}
                      onChange={data => {
                        if (data.length < 250) {
                          changeBrickField(currentBrick.id, 'openQuestion', data);
                        }
                      }}
                      toolbar={["bold", "italic", "latex"]}
                    />
                  </div>
                  <div className="brief-container">
                    <div className="header">Brief</div>
                    <QuillSimpleEditor
                      disabled={locked}
                      data={currentBrick.brief}
                      allowTables={true}
                      allowLinks={true}
                      onChange={data => changeBrickField(currentBrick.id, 'brief', data)}
                      placeholder="Outline the purpose of this brick."
                      validate={validationRequired}
                      isValid={!!stripHtml(currentBrick.brief)}
                      toolbar={[
                        "bold",
                        "italic",
                        "fontColor",
                        "latex",
                        "bulletedList",
                        "numberedList",
                        "align",
                        "table"
                      ]}
                    />
                  </div>
                  <div className="prep-container">
                    <div className="header">Prep</div>
                    <QuillEditor
                      placeholder="Add engaging and relevant preparatory material."
                      disabled={locked}
                      data={currentBrick.prep}
                      onChange={data => changeBrickField(currentBrick.id, 'prep', data)}
                      validate={validationRequired}
                      allowDesmos={true}
                      isValid={!!stripHtml(currentBrick.prep)}
                      toolbar={[
                        "bold",
                        "italic",
                        "fontColor",
                        "latex",
                        "subscript",
                        "superscript",
                        "strikethrough",
                        "bulletedList",
                        "numberedList",
                        "blockQuote",
                        "image",
                        "video",
                        "table",
                        "align",
                        "sound", "desmos", "caps"
                      ]}
                      imageDialog={true}
                      soundDialog={true}
                      allowMediaEmbed={true}
                      allowLinks={true}
                      allowTables={true}
                    />
                  </div>
                </Grid>
              </div>
            </QuillEditorContext.Provider>
          </Grid>
          {!commentsShown && (
            <Grid
              container
              item
              xs={3}
              sm={3}
              md={3}
              direction="column"
              className="right-sidebar"
              alignItems="flex-end"
            >
              <div className="comments-sidebar-default">
                <div className="reundo-button-container">
                  <UndoButton undo={() => { }} canUndo={() => false} />
                  <RedoButton redo={() => { }} canRedo={() => false} />
                </div>
                <div className="comment-button-container">
                  <CommentButton
                    location={CommentLocation.Prep}
                    setCommentsShown={setCommentsShown}
                  />
                </div>
                <div style={{ width: "100%" }}></div>
              </div>
              {renderLock()}
              <div className="bs-circles-container">
                <StatusCircle status={currentBrick.status} isCore={currentBrick.isCore} />
              </div>
            </Grid>
          )}
          <Grid className={`plan-comments-panel ${!commentsShown && "hidden"}`} item>
            <CommentPanel
              currentLocation={CommentLocation.Prep}
              currentBrick={currentBrick}
              setCommentsShown={setCommentsShown}
              haveBackButton={true}
            />
          </Grid>
        </Grid>
      </div>
      <div className="bottom-scroll-area">
        <div className="bottom-button-container">
          <button className="btn btn-transparent svgOnHover" onClick={scrollDown}>
            <SpriteIcon
              name="arrow-down"
              className={`active text-theme-orange ${!canScroll && 'disabled'}`}
            />
          </button>
        </div>
      </div>
      <div className="fixed-build-phone">
        <PhonePreview
          Component={PlanPreviewComponent}
          prev={() => { }}
          next={props.selectFirstQuestion}
          prevDisabled={true}
          data={{ currentBrick: currentBrick, user: props.user }}
        />
      </div>
      {adapted &&
        <Steps
          enabled={adapted}
          steps={[{
            element: '.build-publish-button-container',
            intro: `<p>Once your changes are complete, click here to upload the adapted brick</p>`,
          }]}
          initialStep={0}
          // Called before exiting intro
          onExit={() => setAdapted(false)}
          // Callback when all steps are completed
          onComplete={() => setAdapted(false)}
          options={{
            nextLabel: 'Next',
            doneLabel: 'Next'
          }}
        />}
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  currentBrick: state.brick.brick,
  subjects: state.subjects.subjects,
});

const mapDispatch = (dispatch: any) => ({
  saveBrickField: (brickId: number, fieldName: string, value: string) => dispatch(brickActions.saveBrickField(brickId, fieldName, value)),
  saveBrick: (brick: Brick) => dispatch(brickActions.saveBrick(brick)),
  getSubjects: () => dispatch(subjectActions.fetchSubjects()),
});

const connector = connect(mapState, mapDispatch);

export default connector(React.memo(PlanPage));
