import moment = require("moment");

export const baseUrl: string = 'https://www.webtop.co.il/mobilev2/';
export const baseApiUrl: Function = (platform: string) => `https://www.webtop.co.il/mobilev2/api/?platform=${platform}`;
export const apiAccessor: String = 'https://www.webtop.co.il/mobilev2/default.aspx?action';

export const defaultApiRoutes = {
    homework: `${apiAccessor}=loadHomeWork&userId=`,
    todayTimetable: `${apiAccessor}=loadShotefTimeTable&classCode=&classNum=&userId=`,
    todayEvents: `${apiAccessor}=shotefData&classCode=&classNum=&userId=`,
    grades: (studentYear: number, firstHalf: boolean) => `https://www.webtop.co.il/mobilev2/pupilCard.aspx?platform=ios&moduleID=6&studyYear=${studentYear}&studentID=undefined&divisionID=${firstHalf ? 2946 : 2948}`,
    inbox: {
        search: (searchQuery: string = '') => `https://www.webtop.co.il/mobilev2/messagesBox.aspx?view=inbox&searchQuery=${searchQuery}`,
        inbox: 'https://www.webtop.co.il/mobilev2/messagesBox.aspx?view=inbox',
        /**
         * POST REQUEST
         * FORM DATA
         * EXAMPLE:
         * ID=26312068 OR {ID: 26312068}
         */
        recipients: 'https://www.webtop.co.il/mobilev2/messagesBox.aspx?action=recipients',
        /**
         * POST REQUEST
         * FORM DATA
         * EXAMPLE:
         * IDs=25714320 OR {IDs: 25714320}
         * mass delete example: IDs: 25297630,25202096 OR IDs=25297630%2C25202096
         */
        deleteMessage: 'https://www.webtop.co.il/mobilev2/messagesBox.aspx?view=inbox&action=delete&folderID=0&labelID=0',
        /**
         * POST REQUEST
         * FORM DATA
         * EXAMPLE:
         * IDs=25714320 OR {IDs: 25714320}
         * mass delete example: IDs: 25297630,25202096 OR IDs=25297630%2C25202096
         */
        markAsRead: 'https://www.webtop.co.il/mobilev2/messagesBox.aspx?view=inbox&action=markAsRead&folderID=0&labelID=0',
        /**
         * POST REQUEST
         * FORM DATA
         * EXAMPLE:
         * IDs=25714320 OR {IDs: 25714320}
         * mass delete example: IDs: 25297630,25202096 OR IDs=25297630%2C25202096
         */
        markAsUnread: 'https://www.webtop.co.il/mobilev2/messagesBox.aspx?view=inbox&action=markAsUnread&folderID=0&labelID=0'
    },
    /**
     * POST REQUEST
     * FORM DATA
     * EXAMPLE:
     * type=teachers&value=pupilProTeachers OR {type: 'teachers', value: 'pupilProTeachers'}
     */
    users: 'https://www.webtop.co.il/mobilev2/messagesBox.aspx?action=getUsers',
    /**
     * POST REQUEST
     * FORM DATA
     * EXAMPLE:
     * value=אורי OR {value: 'אורי'}
     */
    searchUsers: 'https://www.webtop.co.il/mobilev2/messagesBox.aspx?action=searchUsers',
    /**
     * POST REQUEST
     * FORM DATA
     * EXAMPLE:
     * newPassword=password OR {newPassword: 'password'}
     */
    changePassword: 'https://www.webtop.co.il/mobilev2/settings.aspx?action=savePassword',
    /**
     * POST REQUEST
     * FORM DATA
     * EXAMPLE:
     * currentPassword=password&newUsername=username OR {currentPassword: 'password', newUsername: 'username'}
     */
    changeUsername: 'https://www.webtop.co.il/mobilev2/settings.aspx?action=saveUserName',
    /**
     * POST REQUEST
     * FORM DATA
     * EXAMPLE:
     * email=email&cellphone=number&emailUponUpdate=0&canReverifiedEmail=false&showMyCellphone=1&showMyEmail=1
     */
    changePersonalDetails: 'https://www.webtop.co.il/mobilev2/settings.aspx?action=savePersonalDetails',
    /**
     * POST REQUEST
     * FORM DATA
     * EXAMPLE:
     * pushNotification_messages=1&pushNotification_timetableChanges=1&pushNotification_timetableChangesEvents=1&pushNotification_timetableChangesTests=1&pushNotification_timetableChangesGeneralMessages=1&pushNotification_discipline=1&pushNotification_homework=1&pushNotification_grades=1&pushNotification_periodGrades=1&pushNotification_matriculationGrades=1
     */
    changePushNotifications: 'https://www.webtop.co.il/mobilev2/settings.aspx?action=savePushNotification'

}

export const routes = {
    timetable: 'https://www.webtop.co.il/mobilev2/shotefView.aspx?view=timetable',
    eventCalendar: (month: number) => `https://www.webtop.co.il/shotefMonthlyView.aspx?monthIndex=${month - new Date().getMonth() - 1}`,
    inbox: (page: number) => `https://www.webtop.co.il/mobilev2/messagesBox.aspx?view=inbox&searchQuery=&pageID=${page}`,
    message: (id: number) => `https://www.webtop.co.il/mobilev2/messagesBox.aspx?platform=ios&view=inbox&action=read&ID=${id}`,
    changesAndExams: 'https://www.webtop.co.il/shotefView.aspx'
}
