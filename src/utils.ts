import { Time, SchoolHour, Class } from "./DataObjects";
import moment = require("moment");

/**
 * wrapper for for loop
 * @param from from what number
 * @param to to what number (-1)
 * @param callback function to be called on each `i`
 */
export const forloop = (from: number, to: number, callback: Function) => {
    for (let i = from; i < to; i++) {
        callback(i);
    }
}


export const dayNumberToString = (dayNum: number) => {
    switch (dayNum) {
        case 1:
            return 'Sunday';
        case 2:
            return 'Monday';
        case 3:
            return 'Tuesday';
        case 4:
            return 'Wednesday';
        case 5:
            return 'Thursday';
        case 6:
            return 'Friday';
        default:
            return 'Saturday';
    }
}

export const isStringNumber = (str: string) => {
    return !Number.isNaN(Number.parseInt(str));
}

export const inboxSenderTypeFromString = (str: string) => {
    switch (str) {
        case 'מורה':
            return 'MessageSenderType.Teacher';
        case 'מנהלת בית הספר':
            return 'MessageSenderType.Principal';
        case 'תלמיד':
            return 'MessageSenderType.Pupil';
        default:
            return 'N/A';
    }
}

export const constructTime = (time: string) => {
    const extractedTime = time.match(/(\d{1,2}):(\d{1,2}?\d)/)!;
    return {
        hour: Number.parseInt(extractedTime[1]),
        minute: Number.parseInt(extractedTime[2])
    } as Time;
}

export const extractDateFromString = (str: string) => {
    const date = str.match(/(\d{2})\/(\d{2})\/(\d{2,4})/)!;
    return moment({ year: Number.parseInt(date[3]), month: Number.parseInt(date[2]), day: Number.parseInt(date[1]) });
}

export const constructSchoolHour = (from: string, to: string) => {
    return {
        from: constructTime(from),
        to: constructTime(to)
    } as SchoolHour;
}

export const extractSchoolHoursFromString = (str: string) => {
    const extractedTimes = str.match(/(\d{1,2}):(\d{1,2}?\d)/g)!;

    if (extractedTimes === null) return 'כל היום'

    const hours = Array<SchoolHour>();

    let currHour = {} as SchoolHour;
    for (let index = 0; index < extractedTimes.length; index++) {
        const extractedTime = extractedTimes[index];
        const time = constructTime(extractedTime);

        if ((index & 1) === 0) {
            currHour.from = time;
        } else {
            currHour.to = time;
            hours.push(currHour);
            currHour = {} as SchoolHour;
        }
    }

    return hours;

}

export const extractClassFromString = (str: string, level: number) => {
    const matches = str.match(/([^ ]{1,2})' (\d)/)!;
    const a = {
        grade: classToNumber(matches[1]),
        number: Number.parseInt(matches[2]),
    } as Class;
    if (level !== -1) a.level = level;
    return a;
}

export const extractClassesFromString = (str: string) => {
    const studyGroups = str.match(/([^ ]{1,2})' (\d)/g)!;
    const level = str.match(/\([^\d]*(\d+)[^\d]*\)/);
    const arr = Array<Class>();

    for (let index = 0; index < studyGroups.length; index++) {
        const element = studyGroups[index];
        arr.push(extractClassFromString(element, level !== null ? Number.parseInt(level[1]) : -1));
    }

    return arr;
}

export const stripHTML = (html: string) => html.replace(/(<([^>]+)>)/ig, '');

export const classToNumber = (str: string) => {
    if (str.length < 2) return str.charCodeAt(0) - 1487;
    switch (str) {
        case 'יא':
            return 11;
        case 'יב':
            return 12;
    }
}
