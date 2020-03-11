import { SchoolHour, Lesson, Class } from "../DataObjects";
import { Moment } from "moment";

export interface Test {
    date: Moment,
    schoolHours: SchoolHour[] | string,
    name: string,
    type: string,
    room: string | number,
    subject: Lesson,
    classesWithTest: Class[]
}