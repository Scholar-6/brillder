import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { Annotation, AnnotationLocation, PlayAttempt } from 'model/attempt';
import React from 'react';
import { BookState } from './PostDesktopPlay';
import "./BookAnnotationsPanel.scss";
import { generateId } from 'components/build/buildQuestions/questionTypes/service/questionBuild';
import { ReduxCombinedState } from 'redux/reducers';
import { connect } from 'react-redux';
import { User } from 'model/user';
import BookAnnotation from './BookAnnotation';
import { HighlightRef } from 'components/play/baseComponents/HighlightHtml';
import { useHistory } from 'react-router-dom';
import NewCommentPanel from 'components/baseComponents/comments/NewCommentPanel';
import CommentTypeToggle from 'components/baseComponents/CommentTypeToggle';

interface BookAnnotationsPanelProps {
  currentUser: User;

  state: BookState;
  questionIndex?: number;

  attempt?: PlayAttempt;
  setAttempt(attempt: PlayAttempt): void;

  highlightRef: React.RefObject<HighlightRef>;
}

const BookAnnotationsPanel: React.FC<BookAnnotationsPanelProps> = props => {
  const history = useHistory();

  const [mode, setMode] = React.useState(null as any);

  const location = React.useMemo(() => {
    switch (props.state) {
      case BookState.Brief: return AnnotationLocation.Brief;
      case BookState.Prep: return AnnotationLocation.Prep;
      case BookState.QuestionPage: return AnnotationLocation.Question;
      case BookState.Synthesis: return AnnotationLocation.Synthesis;
      default: return AnnotationLocation.Brief;
    }
  }, [props.state])

  const addAnnotation = React.useCallback(() => {
    let newAttempt = props.attempt;

    if (!newAttempt) return;
    if (!newAttempt.annotations) newAttempt.annotations = [];
    const newAnnotation: Annotation = {
      id: generateId(),
      location,
      priority: 0,
      questionIndex: props.questionIndex,
      text: "",
      timestamp: new Date(),
      user: props.currentUser,
      children: [],
    };
    newAttempt.annotations.push(newAnnotation);

    if (props.highlightRef.current) {
      props.highlightRef.current.createAnnotation(newAnnotation);
    }

    props.setAttempt(newAttempt);
    history.push("#" + newAnnotation.id);
    /*eslint-disable-next-line*/
  }, [props.attempt, props.setAttempt, location, props.questionIndex]);

  const createNewAnnotation = (text: string) => {
    let newAttempt = props.attempt;

    if (!newAttempt) return;
    if (!newAttempt.annotations) newAttempt.annotations = [];
    const newAnnotation: Annotation = {
      id: generateId(),
      location,
      priority: 0,
      questionIndex: props.questionIndex,
      text,
      timestamp: new Date(),
      user: props.currentUser,
      children: [],
    };
    newAttempt.annotations.push(newAnnotation);

    if (props.highlightRef.current) {
      props.highlightRef.current.createAnnotation(newAnnotation);
    }

    props.setAttempt(newAttempt);
    history.push("#" + newAnnotation.id);
  }

  const updateAnnotation = React.useCallback((annotation: Annotation) => {
    let newAttempt = props.attempt;

    if (!newAttempt) return;
    if (!newAttempt.annotations) return;

    const annotationIndex = newAttempt.annotations.findIndex(a => a.id === annotation.id);
    if (annotationIndex < 0) return;

    newAttempt.annotations[annotationIndex] = annotation;
    props.setAttempt(newAttempt);
    /*eslint-disable-next-line*/
  }, [props.attempt, props.setAttempt]);

  const deleteAnnotation = React.useCallback((annotation: Annotation) => {
    let newAttempt = props.attempt;

    if (!newAttempt) return;
    if (!newAttempt.annotations) return;

    const annotationIndex = newAttempt.annotations.findIndex(a => a.id === annotation.id);
    if (annotationIndex < 0) return;

    newAttempt.annotations.splice(annotationIndex, 1);

    if (props.highlightRef.current) {
      props.highlightRef.current.deleteAnnotation(annotation);
    }

    props.setAttempt(newAttempt);
    /*eslint-disable-next-line*/
  }, [props.attempt, props.setAttempt]);

  const addAnnotationReply = React.useCallback((annotation: Annotation, text: string) => {
    const newAnnotation: Annotation = {
      id: generateId(),
      location: annotation.location,
      priority: 0,
      questionIndex: annotation.questionIndex,
      text: text,
      timestamp: new Date(),
      user: props.currentUser,
    };

    updateAnnotation({
      ...annotation,
      children: [...annotation.children ?? [], newAnnotation],
    });
    /*eslint-disable-next-line*/
  }, [updateAnnotation]);

  const updateAnnotationReply = React.useCallback((annotation: Annotation, reply: Annotation) => {
    const updatedAnnotation = annotation;
    if (!updatedAnnotation.children) return;

    const idx = updatedAnnotation.children.findIndex(child => child.id === reply.id);
    if (idx <= -1) return;
    updatedAnnotation.children[idx] = reply;
    updateAnnotation(updatedAnnotation);
  }, [updateAnnotation]);

  const deleteAnnotationReply = React.useCallback((annotation: Annotation, replyId: number) => {
    const updatedAnnotation = annotation;
    if (!updatedAnnotation.children) return;

    const idx = updatedAnnotation.children.findIndex(child => child.id === replyId);
    if (idx <= -1) return;
    updatedAnnotation.children.splice(idx, 1);
    updateAnnotation(updatedAnnotation);
  }, [updateAnnotation]);

  const filteredAnnotations = props.attempt?.annotations?.filter(
    annotation => annotation.location === location && (annotation.location !== AnnotationLocation.Question || annotation.questionIndex === props.questionIndex)
  );

  if (!props.attempt || mode === null) {
    return <div className="right-part empty">
      <div className="first-button" onClick={() => setMode(1)}>
        <div className="gg-background" />
        <div className="grey-circle" onMouseDown={e => e.preventDefault()} >
          <SpriteIcon name="pen-tool" className="pen-icon" />
        </div>
        <div className="add-annotation-text">
          <span>Select text on the left and click<br /> here to add an annotation</span>
        </div>
      </div>
      <div className="second-button" onClick={() => setMode(2)}>
        <div className="gg-background" />
        <div className="grey-circle" onMouseDown={e => e.preventDefault()} >
          <SpriteIcon name="message-square" className="pen-icon" />
          <SpriteIcon name="plus-line-custom" className="pen-icon plus" />
        </div>
        <div className="add-annotation-text">
          <span>Add Annotation</span>
        </div>
      </div>
    </div>
  }

  return (
    <div className="annotations-no-scroll-panel">
      <div className="annotation-title bold">Notes and Comments</div>
      <div className="toggle-container">
        <CommentTypeToggle mode={mode} onSwitch={() => setMode(!mode)} />
      </div>
      <NewCommentPanel
        currentBrick={{ id: -1 } as any}
        currentLocation={-1}
        placeholder="Start typing"
        createComment={comment => createNewAnnotation(comment.text)}
      />
      <div className="right-part annotations-panel">

        {filteredAnnotations?.map(annotation => (
          <BookAnnotation
            key={annotation.id}
            annotation={annotation}
            updateAnnotation={updateAnnotation}
            deleteAnnotation={() => deleteAnnotation(annotation)}
            addAnnotationReply={text => addAnnotationReply(annotation, text)}
            updateAnnotationReply={(reply) => updateAnnotationReply(annotation, reply)}
            deleteAnnotationReply={(replyId) => deleteAnnotationReply(annotation, replyId)}
          />
        ))
        }
      </div>
    </div>
  );
};

const mapState = (state: ReduxCombinedState) => ({
  currentUser: state.user.user,
});

export default connect(mapState)(BookAnnotationsPanel);