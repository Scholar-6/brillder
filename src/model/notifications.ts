import { Brick } from "./brick";
import { Question } from "./question";

export interface Sender {
  email: string;
  firstName: string;
  lastName: string;
}

export enum NotificationType {
  Generic,
  BrickSubmittedForReview,
  BrickPublished,
  AssignedToEdit,
  NewCommentOnBrick
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
}

export const notificationTypeColors = {
  [NotificationType.Generic]: "generic",
  [NotificationType.BrickSubmittedForReview]: "submitted-for-review",
  [NotificationType.BrickPublished]: "published",
  [NotificationType.AssignedToEdit]: "assigned-to-edit",
  [NotificationType.NewCommentOnBrick]: "new-comment",
};
