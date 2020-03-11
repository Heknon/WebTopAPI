import { load as cheerioLoad } from 'cheerio';
import { isStringNumber, extractDateFromString, extractSchoolHoursFromString, extractClassesFromString } from '../utils';
import { Test } from './DataObjects';
import { Lesson } from '../DataObjects';



export const constructTestsLeft = (html: string): Test[] => {
    const $ = cheerioLoad(html);
    const examsHtml = $('#examsData > tr');
    const tests = Array<Test>();

    examsHtml.each((examNum, examHtml) => {
        const test = {} as Test;
        const studyGroupsStr = $(examHtml.children[4]).text();
        const studyGroups = studyGroupsStr.match(/([^,]+)/g)!;
        const room = $(examHtml.children[5]).text();

        test.date = extractDateFromString($(examHtml.children[0]).text());
        test.schoolHours = extractSchoolHoursFromString($(examHtml.children[1]).text());
        test.name = $(examHtml.children[2]).text();
        test.type = $(examHtml.children[3]).text();
        test.subject = {
            teacherName: studyGroups[0],
            subjectName: studyGroups[1].trimLeft(),
        } as Lesson;
        test.classesWithTest = extractClassesFromString(studyGroups[2]);
        if (room.trim() !== '') test.room = isStringNumber(room) ? Number.parseInt(room) : room;
        tests.push(test);
    });

    return tests;
}

