import { load as cheerioLoad } from 'cheerio';
import { extractDateFromString, extractSchoolHoursFromString, stripHTML } from '../utils';
import { TimeTableChange } from './DataObjects';


export const constructTimeTableChanges = (html: string): TimeTableChange[] => {
    const $ = cheerioLoad(html);
    const changesHtml = $('#changesData > tr');
    const changes = Array<TimeTableChange>();

    changesHtml.each((changeNum, changeHtml) => {
        const change = {} as TimeTableChange;
        const details = Array<string>();

        change.date = extractDateFromString($(changeHtml.children[0]).text());
        change.schoolHours = extractSchoolHoursFromString($(changeHtml.children[1]).text());
        
        changeHtml.children[2].children.forEach((e, i) => {
            const txt = $(e).text();
            if (txt.length !== 0) details.push(txt);
        });
        change.details = details.join(' ')

        changes.push(change);

    });

    return changes;

}



