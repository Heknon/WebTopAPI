import { Moment } from "moment";
import { Lesson } from "../DataObjects";

export interface Grade {
    title: string,
    lesson: Lesson,
    grade: number,
    weight: number,
    date: Moment
}

export interface GradeSemester {
    semester: number,
    latest: Grade,
    oldest: Grade,
    grades: Grade[]
}

export interface GradeYear {
    studentYear: number,
    latest: Grade,
    oldest: Grade,
    grades: GradeSemester[]
}

export interface Grades {
    latest: Grade,
    oldest: Grade,
    grades: GradeYear[]
}