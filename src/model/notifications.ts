export interface Sender {
    email: string;
    firstName: string;
    lastName: string;
}

export interface Notification {
    sender: Sender;
    title: string;
    text: string;
    read: boolean;
}