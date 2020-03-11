import { load as cheerioLoad } from 'cheerio';
import { TimeTableDay, TimeTable } from './DataObjects';
import { SchoolHour, Lesson } from '../DataObjects';
import { isStringNumber, dayNumberToString, constructTime } from '../utils';


/**
 * construct timetable type @see {TimeTable}
 * @param timetableHtml the timetable html of webtop from https://www.webtop.co.il/pupilCardData.aspx?viewID=10&id=0&year=0
 */
export function constructTimeTable(timetableHtml: string, removeEmptyHours: boolean): TimeTable {
    const $: CheerioStatic = cheerioLoad(timetableHtml);
    const tt: TimeTable = [null!, null!, null!, null!, null!, null!];
    const days = $('.scheduale-day-wrapper');
    const hourMap = getHourMap($);

    days.each((dayNum, day) => {
        const ttDay = {} as TimeTableDay;
        const todayClasses = [] as Lesson[];

        let currHour = {} as Lesson;
        let hourNum = 0;
        day.children.forEach((hourData, i) => {
            const hour = hourMap[hourNum];
            if ((i & 1) === 1) {
                if (hourData.children.length == 1) {
                    if (!removeEmptyHours) todayClasses.push(currHour);
                    currHour = {} as Lesson;
                } else {
                    const details = $(hourData.children[0]).text().split(',');
                    currHour.subjectName = details[0];
                    currHour.teacherName = details[1].trimLeft();
                    const room = details[2].slice(5, details[2].length);
                    currHour.room = isStringNumber(room) ? Number.parseInt(room) : room.trimLeft();
                    todayClasses.push(currHour);
                    currHour = {} as Lesson;
                }
                ++hourNum;
            } else {
                currHour.lessonSchoolBeginHour = hourNum;
                currHour.lessonStartTime = hour.from;
                currHour.lessonEndTime = hour.to;
            }
        });
        ttDay.day = dayNumberToString(dayNum + 1);
        ttDay.dayNum = dayNum + 1;
        ttDay.todayClasses = todayClasses;
        tt[dayNum] = ttDay;
    });

    return tt;
}

const getHourMap = ($: CheerioStatic): SchoolHour[] => {
    const times = Array<SchoolHour>();
    $("#day_1").children('.scheduale-hour-name').each((i, elem) => {
        const hoursStr = $(elem.children[1]).text();
        let hours = hoursStr.length <= 2 ? null : hoursStr.match(/\d{1,2}:\d{1,2}\d/g);

        if (hours === null && i === 12) hours = ['17:10', '17:55'];
        else if (hours === null && i === 13) hours = ['18:00', '18:45'];

        times.push({
            from: constructTime(hours![0]),
            to: constructTime(hours![1])
        });

    });
    return times;
}

