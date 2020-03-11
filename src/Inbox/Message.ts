import { load as cheerioLoad } from 'cheerio';
import moment from 'moment';
import { AxiosInstance } from 'axios';
import { stringify } from 'query-string'
import { Message, File } from './DataObjects';
import { stripHTML } from '../utils';


export const constructMessage = async (html: string, id: number, axios: AxiosInstance) => {
    const $ = cheerioLoad(html);
    const message = {} as Message;
    const recievers = await (await axios.post('https://www.webtop.co.il/mobilev2/messagesBox.aspx?action=recipients', stringify({ ID: id }))).data.split(', ');
    const files = [] as File[];
    const date = $('#messageData > div:nth-child(3) > p.date-sub-text').text().match(/(\d{1,2}):(\d{1,2}\d)|(\d+)/g);
    const hours = date![3].match(/(\d{1,2}):(\d{1,2}\d)/);

    const fileFields = $('.attach-file-field');
    fileFields.each((fileNum, fileField) => {
        const file = {} as File;
        file.url = fileField.children[1].attribs.href;
        file.name = $(fileField.children[0].children[1]).text();
        files.push(file);
    });

    message.id = id;
    message.files = files;
    message.recievers = recievers;
    message.message = stripHTML($('#messageData > div.content.single-message').text());
    message.title = $('#messageData > div:nth-child(3) > p.bold-text').text();
    message.author = $('#messageData > div:nth-child(1) > p.bold-text').text().match(/(?<=(: )).+/)![0];
    message.date = moment({ year: Number.parseInt(date![2]), month: Number.parseInt(date![1]), day: Number.parseInt(date![0]), hour: Number.parseInt(hours![1]), minute: Number.parseInt(hours![2]) });
    
    return message;
}
