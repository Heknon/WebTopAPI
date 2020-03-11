import { Lesson } from "../DataObjects";

export type TimeTable = Array<TimeTableDay>;

export interface TimeTableDay {
    day: string,
    dayNum: number,
    todayClasses: Lesson[]
}