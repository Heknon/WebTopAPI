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

export interface PersonalDetails {
    email: string,
    cellphone: string,
    emailUponUpdate: boolean | number,
    canReverifiedEmail: boolean,
    showMyCellphone: boolean | number,
    showMyEmail: boolean | number
}

export interface PushNotifications {
    pushNotification_messages: number,
    pushNotification_timetableChanges: number,
    pushNotification_timetableChangesEvents: number,
    pushNotification_timetableChangesTests: number,
    pushNotification_timetableChangesGeneralMessages: number,
    pushNotification_discipline: number,
    pushNotification_homework: number,
    pushNotification_grades: number,
    pushNotification_periodGrades: number,
    pushNotification_matriculationGrades: number,

}

export interface WebtopSecurityData {
    securityId: string,
    securityValue: string
}

export interface GradeResponse {
    eventName: string,
    eventType: string,
    date: string,
    subject: string,
    teacher: string
    grade: string
}

export interface EventResponse {
    // Event begin school hour
    hourNum: string,
    // Event end school hour
    hourEnd: string,
    // Name of start hour, formatted as: from-to  hourNum || 09:45-10:30  3
    hourName: string,
    // Name of end hour, formatted as: from-to  hourNum || 09:45-10:30  3
    hourEndName: string,
    // type of event such as - מבחנים
    hourType: string,
    // description of event, such as - מבחן יוד עברית (מבחן) לקבוצות: מור ורד, עברית,  י' 3
    description: string,
    // room it is occurring in
    room: string
}

export interface HomeworkResponse {
    // class name, example: אנגלית מואצת
    subject: string,
    /**
     * Name of hour, formatted as: from-to  hourNum || 09:45-10:30  3
     */
    hourName: string,
    // school hour it is occurring on
    hour: string,
    // happened or not התקיים
    status: string,
    // example: מבחן בלשון עברית
    lessonSubject: string,
    // what needs to be done
    homeWork: string
}

export interface LessonResponse {
    /**
     * Class number in day
     */
    hourNum: string,
    /**
     * Name of hour, formatted as: from-to  hourNum || 09:45-10:30  3
     */
    hourName: string,
    /**
     * Example:
     * 'אסמבלר, שטרקמן צבי, חדר: 218'
     * ClassName, TeacherName, Room: RoomNum
     */
    hourData: string[]
}

export interface WebTopUserData {
    id: number,
    key: string,
    name: string,
    type: string
}

export type WebTopUsersResponse = Promise<WebTopUserData[]>;
export type GradesResponse = Promise<GradeResponse[]>;
export type LessonsResponse = Promise<LessonResponse[]>;
export type EventsResponse = Promise<EventResponse[]>;
export type AllHomeworkResponse = Promise<HomeworkResponse[]>;
