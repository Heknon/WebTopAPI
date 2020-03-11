import { AxiosInstance } from "axios";
import { defaultApiRoutes } from "../apiConfig";
import cheerio from 'cheerio';
import moment from 'moment';
import { Grade, Grades, GradeYear, GradeSemester } from "./DataObjects";
import { Lesson } from "../DataObjects";

export const constructGradeSemester = async (axios: AxiosInstance, studentYear: number, semester: number, onlyFilledGrades: boolean): Promise<GradeSemester> => {
    const req = await axios.post(defaultApiRoutes.grades(studentYear, semester === 1));
    const $ = cheerio.load(req.data);
    if ($($('div .center')[3]).text() === 'לא נמצאו נתונים') throw new Error("Couldn't find grade data for this year.");
    const grades = constructGradesFromHTML($, onlyFilledGrades);
    return {
        semester,
        latest: grades[0],
        oldest: grades[grades.length - 1],
        grades
    } as GradeSemester;
}

export const constructGradeYear = async (axios: AxiosInstance, studentYear: number, onlyFilledGrades: boolean): Promise<GradeYear> => {
    const sem1 = await constructGradeSemester(axios, studentYear, 1, onlyFilledGrades);
    const sem2 = await constructGradeSemester(axios, studentYear, 2, onlyFilledGrades);
    const grades = [sem1, sem2] as GradeSemester[];
    return {
        studentYear,
        latest: grades[1].latest,
        oldest: grades[0].oldest,
        grades
    } as GradeYear;
}

export const constructGrades = async (axios: AxiosInstance, onlyFilledGrades: boolean): Promise<Grades> => {
    const grades = [] as GradeYear[];
    try {
        await constructGradeYear(axios, 0, onlyFilledGrades).then(yr => grades.push(yr))
        await constructGradeYear(axios, 1, onlyFilledGrades).then(yr => grades.push(yr))
        await constructGradeYear(axios, 2, onlyFilledGrades).then(yr => grades.push(yr))
    } catch(e) {
        return {
            latest: grades[grades.length - 1].latest,
            oldest: grades[0].oldest,
            grades
        } as Grades;
    }
    return {
        latest: grades[grades.length - 1].latest,
        oldest: grades[0].oldest,
        grades
    } as Grades;
}


const constructGradesFromHTML = ($: CheerioStatic, onlyFilledGrades: boolean): Grade[] => {
    const grades = [] as Grade[];
    const gradeCards = $('.pupil-card-item');
    gradeCards.each((i, gradeCard) => {        
        if (gradeCard.children[0].children.length === 1 && onlyFilledGrades) return;

        const grade = {} as Grade;
        const gradeNum = Number.parseInt($(gradeCard.children[0].children[1]).text().match(/\d+/)![0]);
        const gradeDate = $(gradeCard.parent.prev).text().match(/\d+/g);
        const gradeDetails = $(gradeCard.children[1].children[0]).text().match(/^[^ \(]+|\(([^)]+)\)/g)!;

        grade.title = $(gradeCard.children[0].children[0]).text();
        grade.grade = gradeNum;
        grade.date = moment({
            year: Number.parseInt(gradeDate![2]),
            month: Number.parseInt(gradeDate![1]),
            day: Number.parseInt(gradeDate![0]),
        });
        const gradeDetailsLengthBiggerThan2 = gradeDetails.length > 2;
        grade.lesson = {
            subjectName: gradeDetails[0],
            teacherName: gradeDetailsLengthBiggerThan2 ? gradeDetails[2].replace(/\(|\)/g, '') : gradeDetails[1].replace(/\(|\)/g, '')
        } as Lesson;
        if (gradeDetailsLengthBiggerThan2) grade.lesson.level = Number.parseInt(/\d+/.exec(gradeDetails[1])![0]);
        if (gradeCard.children[1].children.length > 1) grade.weight = Number.parseInt(/\d+/.exec($(gradeCard.children[1].children[1]).text())![0]);
        grades.push(grade)
    });
    return grades;
}
