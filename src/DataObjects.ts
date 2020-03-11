export interface SchoolHour {
    from: Time,
    to: Time
}

export interface Lesson {
    teacherName: string,
    subjectName: string,
    level: number,
    room: string | number,
    lessonStartTime: Time,
    lessonEndTime: Time,
    lessonSchoolBeginHour: number
}

export interface Time {
    hour: number,
    minute: number
}

export interface Class {
    grade: number,
    number: number,
    level: number
}
