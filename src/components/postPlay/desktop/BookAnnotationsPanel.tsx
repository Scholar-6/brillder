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

  const location = React.useMemo(() => {
    switch(props.state) {
      case BookState.Brief: return AnnotationLocation.Brief;
      case BookState.Prep: return AnnotationLocation.Prep;
      case BookState.QuestionPage: return AnnotationLocation.Question;
      case BookState.Synthesis: return AnnotationLocation.Synthesis;
      default: return AnnotationLocation.Brief;
    }
  }, [props.state])

  const addAnnotation = React.useCallback(() => {
    let newAttempt = props.attempt;

    if(!newAttempt) return;
    if(!newAttempt.annotations) newAttempt.annotations = [];
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

    if(props.highlightRef.current) {
      props.highlightRef.current.createAnnotation(newAnnotation);
    }

    props.setAttempt(newAttempt);
    history.push("#" + newAnnotation.id);
  }, [props.attempt, props.setAttempt, location, props.questionIndex]);

  const updateAnnotation = React.useCallback((annotation: Annotation) => {
    let newAttempt = props.attempt;

    if(!newAttempt) return;
    if(!newAttempt.annotations) return;

    const annotationIndex = newAttempt.annotations.findIndex(a => a.id === annotation.id);
    if(annotationIndex < 0) return;

    newAttempt.annotations[annotationIndex] = annotation;
    props.setAttempt(newAttempt);
  }, [props.attempt, props.setAttempt]);

  const deleteAnnotation = React.useCallback((annotation: Annotation) => {
    let newAttempt = props.attempt;

    if(!newAttempt) return;
    if(!newAttempt.annotations) return;

    const annotationIndex = newAttempt.annotations.findIndex(a => a.id === annotation.id);
    if(annotationIndex < 0) return;

    newAttempt.annotations.splice(annotationIndex, 1);

    if(props.highlightRef.current) {
      props.highlightRef.current.deleteAnnotation(annotation);
    }

    props.setAttempt(newAttempt);
  }, [props.attempt, props.setAttempt]);

  const addAnnotationReply = React.useCallback((annotation: Annotation) => {
    const newAnnotation: Annotation = {
      id: generateId(),
      location: annotation.location,
      priority: 0,
      questionIndex: annotation.questionIndex,
      text: "",
      timestamp: new Date(),
      user: props.currentUser,
    };

    updateAnnotation({
      ...annotation,
      children: [...annotation.children ?? [], newAnnotation],
    });
  }, [updateAnnotation]);

  const updateAnnotationReply = React.useCallback((annotation: Annotation, reply: Annotation) => {
    const updatedAnnotation = annotation;
    if(!updatedAnnotation.children) return;

    const idx = updatedAnnotation.children.findIndex(child => child.id === reply.id);
    if(idx <= -1) return;
    updatedAnnotation.children[idx] = reply;
    updateAnnotation(updatedAnnotation);
  }, [updateAnnotation]);

  const deleteAnnotationReply = React.useCallback((annotation: Annotation, replyId: number) => {
    const updatedAnnotation = annotation;
    if(!updatedAnnotation.children) return;

    const idx = updatedAnnotation.children.findIndex(child => child.id === replyId);
    if(idx <= -1) return;
    updatedAnnotation.children.splice(idx, 1);
    updateAnnotation(updatedAnnotation);
  }, [updateAnnotation]);

  if(!props.attempt || !props.attempt?.annotations?.filter(annotation => annotation.location === location).length) {
    return <div className="right-part empty">
      <div className="grey-circle" onMouseDown={e => e.preventDefault()} onClick={addAnnotation}>
        <SpriteIcon name="pen-tool" className="pen-icon" />
      </div>
      <div className="add-annotation-text">
        <span>+ Add Annotation</span>
      </div>
    </div>
  }

	return (
		<div className="right-part annotations-panel">
			{props.attempt?.annotations
        .filter(annotation => annotation.location === location)
        .map(annotation => (
          <BookAnnotation
            key={annotation.id}
            annotation={annotation}
            updateAnnotation={updateAnnotation}
            deleteAnnotation={() => deleteAnnotation(annotation)}
            addAnnotationReply={() => addAnnotationReply(annotation)}
            updateAnnotationReply={(reply) => updateAnnotationReply(annotation, reply)}
            deleteAnnotationReply={(replyId) => deleteAnnotationReply(annotation, replyId)}
          />
        ))
      }
      <div className="add-annotation-text" onMouseDown={e => e.preventDefault()} onClick={addAnnotation}>
        <div className="grey-circle">
          <SpriteIcon name="pen-tool" className="pen-icon" />
        </div>
        <span>Add Annotation</span>
      </div>
		</div>
	);
};

const mapState = (state: ReduxCombinedState) => ({
  currentUser: state.user.user,
});

export default connect(mapState)(BookAnnotationsPanel);