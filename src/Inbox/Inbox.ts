import { load as cheerioLoad } from 'cheerio';
import moment from 'moment';
import { InboxMessage, Inbox, MessageSender } from './DataObjects';
import { inboxSenderTypeFromString } from '../utils';

export const constructInbox = (html: string): Inbox => {
    const $ = cheerioLoad(html);
    const messageItems = $('.message-item');
    const inbox = [] as Inbox;

    messageItems.each((messageNum, message$) => {
        const message = {} as InboxMessage;
        const date = $(message$.children[2].children[0].children[0].children[1]).text().match(/\d+/g);
        const sender = $(message$.children[2].children[0].children[0].children[0]).text().match(/(\((.*?)\))|(.+(?= \())/g);

        message.id = Number.parseInt(message$.children[0].children[0].children[0].attribs.value);
        message.read = message$.children[1].children[0].attribs.class.includes("hidden");
        message.hasAttachments = message$.children[1].children.length > 1;
        message.url = message$.children[2].children[0].attribs.href;
        message.subject = $(message$.children[2].children[0].children[1]).text();
        message.date = moment({ year: Number.parseInt('20' + date![2]), month: Number.parseInt(date![1]), day: Number.parseInt(date![0]) });
        message.sender = { name: sender![0], type: inboxSenderTypeFromString(sender![1].replace(/\(|\)/g, '')) } as MessageSender;

        inbox.push(message);
    });

    return inbox;
}





