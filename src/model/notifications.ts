export interface Sender {
    email: string;
    firstName: string;
    lastName: string;
}

export interface Notification {
    id: number;
    sender: Sender;
    title: string;
    text: string;
    read: boolean;
}