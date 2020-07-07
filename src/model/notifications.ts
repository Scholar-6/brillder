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
}

export const notificationTypeColors = {
    [NotificationType.Generic]: "#bdc2c8",
    [NotificationType.BrickSubmittedForReview]: "#ff9800",
    [NotificationType.BrickPublished]: "#00c86b",
    [NotificationType.AssignedToEdit]: "#d42c24",
    [NotificationType.NewCommentOnBrick]: "#006bfd",
};