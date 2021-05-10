import React from "react";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";

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
import KeyWordsComponent from "../proposal/questionnaire/brickTitle/KeyWords";
import { User } from "model/user";
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";
import BrickLength from "./BrickLength";
import Subjects from "./Subjects";
import brickActions from "redux/actions/brickActions";
import PlanPreviewComponent from "../baseComponents/phonePreview/plan/PlanPreview";
import DifficultySelect from "../proposal/questionnaire/brickTitle/DifficultySelect";
import { getSubjects } from "services/axios/subject";
import CoreSelect from "../proposal/questionnaire/brickTitle/CoreSelect";

export interface PlanProps {
  currentBrick: Brick;
  saveBrick(brick: Brick): void;
  user: User;
  locked: boolean;
  editOnly: boolean;
  initSuggestionExpanded?: boolean;
  selectFirstQuestion(): void;
}

const PlanPage: React.FC<PlanProps> = (props) => {
  const { currentBrick, locked } = props;

  const [apiSubjects, setApiSubjects] = React.useState([] as Subject[]);

  const [scrollArea] = React.useState(React.createRef() as React.RefObject<HTMLDivElement>);
  const [canScroll, setScroll] = React.useState(false);

  const [commentsShown, setCommentsShown] = React.useState(false);
  const editorIdState = React.useState("");

  React.useEffect(() => {
   getSubjects().then(allSubjects => {
     if (allSubjects) {
       setApiSubjects(allSubjects);
     }
   });
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
    console.log(currentBrick);
    return (changeFn: (brick: Brick) => Brick) => {
      console.log(currentBrick);
      const newBrick = changeFn(currentBrick);
      console.log(newBrick);
      props.saveBrick(newBrick);
    };
  }, [currentBrick, props.saveBrick]);

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
                    "image",
                    "table",
                  ]}
                />
                <Grid container direction="row" className="inner-quills" ref={scrollArea}>
                  <div className="title-quill-container">
                    <div className="header">Title</div>
                    <QuillEditor
                      data={currentBrick.title}
                      onChange={title => changeBrick((brick) => ({ ...brick, title }))}
                      placeholder="What is your brick about?"
                      disabled={locked}
                      toolbar={['italic']}
                    />
                  </div>
                  <KeyWordsComponent
                    disabled={locked}
                    keyWords={currentBrick.keywords}
                    onChange={keywords => changeBrick((brick) => ({ ...brick, keywords }))}
                  />
                  <div className="subject-select-container">
                    <Subjects
                      disabled={locked}
                      subjects={apiSubjects}
                      subjectId={currentBrick.subjectId}
                      onChange={subjectId => changeBrick((brick) => ({ ...brick, subjectId, subject: apiSubjects.find(sub => sub.id === subjectId) }))}
                    />
                    <CoreSelect disabled={locked} isCore={currentBrick.isCore} onChange={isCore => changeBrick((brick) => ({...brick, isCore}))} />
                  </div>
                  <div className="level-and-length-container">
                    <DifficultySelect
                      disabled={locked}
                      level={currentBrick.academicLevel}
                      onChange={academicLevel => changeBrick((brick) => ({ ...brick, academicLevel }))}
                    />
                    <BrickLength
                      disabled={locked}
                      brickLength={currentBrick.brickLength}
                      onChange={brickLength => changeBrick((brick) => ({ ...brick, brickLength }))}
                    />
                  </div>
                  <div className="open-question-container">
                    <div className="header">Open Question</div>
                    <QuillEditor
                      disabled={locked}
                      placeholder="Ideally, every brick should point to a bigger question."
                      data={currentBrick.openQuestion}
                      onChange={data => changeBrick((brick) => ({ ...brick, openQuestion: data }))}
                      toolbar={["bold", "italic", "latex"]}
                    />
                  </div>
                  <div className="brief-container">
                    <div className="header">Brief</div>
                    <QuillEditor
                      disabled={locked}
                      data={currentBrick.brief}
                      allowTables={true}
                      onChange={data => changeBrick((brick) => ({ ...brick, brief: data }))}
                      placeholder="Outline the purpose of this brick."
                      toolbar={[
                        "bold",
                        "italic",
                        "fontColor",
                        "latex",
                        "bulletedList",
                        "numberedList",
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
                      onChange={data => changeBrick((brick) => ({ ...brick, prep: data }))}
                      toolbar={[
                        "bold",
                        "italic",
                        "fontColor",
                        "latex",
                        "bulletedList",
                        "numberedList",
                        "blockQuote",
                        "image",
                        "video",
                        "table"
                      ]}
                      imageDialog={true}
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
                  <UndoButton undo={() => {}} canUndo={() => false} />
                  <RedoButton redo={() => {}} canRedo={() => false} />
                </div>
                <div className="comment-button-container">
                  <CommentButton
                    location={CommentLocation.Prep}
                    setCommentsShown={setCommentsShown}
                  />
                </div>
                <div style={{ width: "100%" }}></div>
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
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  currentBrick: state.brick.brick,
});

const mapDispatch = (dispatch: any) => ({
  saveBrick: (brick: Brick) => dispatch(brickActions.saveBrick(brick)),
});

const connector = connect(mapState, mapDispatch);

export default connector(React.memo(PlanPage));
