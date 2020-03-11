import { SchoolHour } from "../DataObjects";
import { Moment } from "moment";

export interface TimeTableChange {
    date: Moment,
    schoolHours: SchoolHour[] | string,
    details: string
}