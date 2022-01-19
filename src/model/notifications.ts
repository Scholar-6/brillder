import { Brick } from "./brick";
import { Question } from "./question";

export interface Sender {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export enum NotificationType {
  Generic,
  BrickSubmittedForReview,
  BrickPublished,
  AssignedToEdit,
  NewCommentOnBrick,
  InvitedToPlayBrick,
  BrickAttemptSaved,
  ReturnedToAuthor,
  ReturnedToEditor,
  StudentAssignedBrick,
  RemindedToPlayBrick,
  DontKnow,
  TeacherInvitation,
}

export interface Notification {
  id: number;
  sender: Sender;
  title: string;
  text: string;
  type: NotificationType;
  read: boolean;
  timestamp: Date;
  brick?: Brick;
  question?: Question;

  expanded?: boolean // only for phones
}

export const notificationTypeColors = {
  [NotificationType.Generic]: "generic",
  [NotificationType.BrickSubmittedForReview]: "submitted-for-review",
  [NotificationType.BrickPublished]: "published",
  [NotificationType.AssignedToEdit]: "red",
  [NotificationType.NewCommentOnBrick]: "new-comment",
  [NotificationType.InvitedToPlayBrick]: "invited-to-play",
  [NotificationType.BrickAttemptSaved]: "published",
  [NotificationType.ReturnedToEditor]: "red",
  [NotificationType.ReturnedToAuthor]: "red",
  [NotificationType.StudentAssignedBrick]: "red",
  [NotificationType.RemindedToPlayBrick]: "red",
  [NotificationType.DontKnow]: "red",
  [NotificationType.TeacherInvitation]: "white",
};
