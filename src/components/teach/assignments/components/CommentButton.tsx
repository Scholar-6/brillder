import React from 'react';
import './CommentButton.scss';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { Annotation } from 'model/attempt';

interface Props {
  studentId: number;
  currentUser: any;
  students: any[];
  onClick(e: any): void;
}

const CommentButton: React.FC<Props> = (props) => {
  const {studentId, students} = props;
  const annotations = students.find(s => s.id === studentId)?.studentResult?.attempts.slice(-1)[0].annotations;
  const flattenAnnotation = (annotation: Annotation): Annotation[] => {
    const arr = [annotation];
    annotation.children?.forEach((a) => arr.push(...flattenAnnotation(a)))
    return arr;
  }
  const flattenedAnnotations: Annotation[] = [];
  annotations?.forEach((a:any) => flattenedAnnotations.push(...flattenAnnotation(a)));

  const latestAnnotation = flattenedAnnotations.sort((a: any, b: any) => new Date(b.timestamp) > new Date(a.timestamp) ? 1 : -1)[0];
  const className = latestAnnotation ?
    (latestAnnotation.user.id === props.currentUser.id ? " yellow" : " red")
    : "";

  console.log(annotations);

  return <div className={"teach-comment-button comment-icon" + className} onClick={props.onClick}>
    <SpriteIcon name="message-square" className="active" />
    <div className={"hover-background" + className} />
    <div className={"background " + className} />
    <span className="annotation-count">{students.find(s => s.id === studentId)?.studentResult?.attempts.slice(-1)[0].annotations?.length}</span>
    <div className="css-custom-tooltip bold">
      {annotations && annotations.length > 0 ? 'View Comments' : 'Add Comment'}
    </div>
  </div>;
}

export default CommentButton;
