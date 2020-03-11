import { Moment } from "moment";

export type Inbox = InboxMessage[];


export interface InboxMessage {
    id: number,
    sender: MessageSender,
    date: Moment,
    subject: string
    read: boolean,
    hasAttachments: boolean,
    url: string
}


export interface MessageSender {
    name: string,
    type: MessageSenderType
}

export enum MessageSenderType {
    Pricipal = 'MessageSenderType.Principal',
    Teacher = 'MessageSenderType.Teacher',
    Pupil = 'MessageSenderType.Pupil'
}

export interface File {
    url: string,
    name: string
}

export interface Message {
    id: number,
    date: Moment,
    message: string,
    title: string,
    author: string,
    recievers: string[],
    files: File[]
}
