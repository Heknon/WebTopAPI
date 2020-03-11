import axios, { AxiosInstance } from 'axios';
import { stringify as queryStringify } from 'query-string';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import { defaultApiRoutes, baseUrl, baseApiUrl, routes } from './apiConfig';
import { load as cheerioLoad } from 'cheerio';
import { constructTimeTable } from './TimeTable/TimeTable';
import { constructGrades, constructGradeSemester, constructGradeYear } from './Grades/Grades'
import { constructInbox } from './Inbox/Inbox';
import { constructMessage } from './Inbox/Message';
import { constructTestsLeft } from './TestsLeft/TestsLeft';
import { TimeTable } from './TimeTable/DataObjects';
import { constructTimeTableChanges } from './TimeTableChanges/TimeTableChanges';



export default class Client {
    id: string;
    password: string;
    _axiosInstance: AxiosInstance | null;
    _cookieJar: CookieJar | null;
    platform: string | null;
    constructor(id: string, password: string) {
        this.id = id;
        this.password = password;
        this._axiosInstance = null;
        this._cookieJar = null;
        this.platform = null;
    }

    /**
     * get the security necessary for logging in
     * @param {CheerioStatic} $ parsed html 
     * @returns {WebtopSecurityData}
     */
    _getSecurityData($: CheerioStatic): WebtopSecurityData {

        const keys = $("#captchaWrapper").children('input[type="hidden"]')[0];
        return {
            securityId: keys.attribs.id,
            securityValue: keys.attribs.value,
        };
    };

    /**
     * gets platform in use
     * @param {CheerioStatic} $ parsed html
     * @returns platform axios is using
     */
    _getPlatform($: CheerioStatic) {
        const platform = $('#platform').val();
        return platform;
    }

    async login() {
        this._cookieJar = new CookieJar();
        this._axiosInstance = axios.create({
            jar: this._cookieJar,
            withCredentials: true,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/43.0.2357.65 Mobile Safari/537.36'
            },
        });;
        axiosCookieJarSupport(this._axiosInstance);
        this._axiosInstance.defaults.jar = this._cookieJar;

        const html = (await this._axiosInstance.get(baseUrl)).data;
        const $ = cheerioLoad(html);
        const { securityId, securityValue } = this._getSecurityData($);

        const data = {
            'action': 'login',
            'rememberMe': 1,
            'captcha': '',
            'secondsToLogin': 23,
            'username': this.id,
            'password': this.password,
            [securityId]: securityValue
        };
        this.platform = this._getPlatform($);
        const loginReq = await this._axiosInstance.post(baseApiUrl(this.platform), queryStringify(data));
        if (loginReq.data.error !== undefined) throw new Error(loginReq.data.error);
        return loginReq; 
    }

    async logout() {
        const res = await this._axiosInstance!.post(baseApiUrl(this.platform), queryStringify({action: 'logout'}));
        if (res.status === 200) {
            this.platform = '';
            this._axiosInstance = null;
            this._cookieJar = null;
            return res;
        }
        throw new Error('Failed to logout')
    }

    /**
     * get all the grades of all 3 years of school
     * @param onlyFilledGrades if only to show grades that have been filled by a teacher. if false grades that haven't been filled will be set to -1
     */
    async getGrades(onlyFilledGrades: boolean = true) {
        return constructGrades(this._axiosInstance!, onlyFilledGrades);
    }

    /**
     * get the grades of a semester
     * @param semester the semester. 1 or 2.
     * @param studentYear the study year
     * @param onlyFilledGrades if only to show grades that have been filled by a teacher. if false grades that haven't been filled will be set to -1
     */
    async getSemesterGrades(studentYear = 0, semester = 0, onlyFilledGrades: boolean = true) {
        return constructGradeSemester(this._axiosInstance!, studentYear - 1, semester, onlyFilledGrades);
    }

    /**
     * get the grades of a year
     * @param studentYear the study year
     * @param onlyFilledGrades if only to show grades that have been filled by a teacher. if false grades that haven't been filled will be set to -1
     */
    async getYearGrades(studentYear = 0, onlyFilledGrades: boolean = true) {
        return constructGradeYear(this._axiosInstance!, studentYear - 1, onlyFilledGrades);
    }

    async getTodayLessons(): Promise<LessonResponse[]> {
        return (await this._axiosInstance!.get(defaultApiRoutes.todayTimetable)).data;
    }

    async getTodayEvents(): Promise<EventResponse[]> {
        return (await this._axiosInstance!.get(defaultApiRoutes.todayEvents)).data;
    }

    async getHomework(): Promise<HomeworkResponse[]> {
        return (await this._axiosInstance!.get(defaultApiRoutes.homework)).data;
    }

    /**
     * @param removeEmptyHours Remove hours which there are no lessons on from the response
     */
    async getTimeTable(removeEmptyHours: boolean = false): Promise<TimeTable> {
        const timetable = await this._axiosInstance!.get(routes.timetable);
        return constructTimeTable(timetable.data, removeEmptyHours);
    }

    async getTestLeftToDo() {
        const testsLeft = await this._axiosInstance!.get(routes.changesAndExams);
        return constructTestsLeft(testsLeft.data);
    }

    async getTimeTableChanges() {
        const changes = await this._axiosInstance!.get(routes.changesAndExams);
        return constructTimeTableChanges(changes.data);
    }

    async getMainPage() {
        return (await this._axiosInstance!.get(baseUrl)).data;
    }

    async getUsers(query: string): WebTopUsersResponse {
        return (await this._axiosInstance!.post(defaultApiRoutes.searchUsers, queryStringify({ value: query }))).data;
    }

    async getInbox(page: number) {
        return constructInbox((await this._axiosInstance!.get(routes.inbox(page))).data);
    }

    async getMessage(id: number) {
        return constructMessage((await this._axiosInstance!.get(routes.message(id))).data, id, this._axiosInstance!);
    }

    async getAllGradeUsers() {
        const gradeUsers = [] as WebTopUserData[];
        for (let index = 1488; index < 1515; index++) {
            const users = await this.getUsers(String.fromCharCode(index));
            for (const user of users) {
                if (!gradeUsers.includes(user)) gradeUsers.push(user);
            }
        }
        return gradeUsers;
    }
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

