import moment from 'moment';

export const get_local_issue_time = (issueTime) => {
    if (moment.utc(issueTime, 'mm/dd/yyyy hh:mm:ss').isValid()) {
        return moment.utc(issueTime, 'MM/DD/YYYY hh:mm:ss').local().format("DD/MM/YYYY hh:mm A").toString();
    }
    else {
        let formattedDate = moment(issueTime).format('DD/MM/YYYY HH:MM A');
        if (formattedDate !== 'Invalid date') {
            return formattedDate;
        }
        return issueTime;
    }
}

export const get_local_issue_date = (issueTime) => {
    if (moment.utc(issueTime, 'mm/dd/yyyy hh:mm:ss').isValid()) {
        return moment.utc(issueTime, 'MM/DD/YYYY hh:mm:ss').local().format("DD/MM/YYYY").toString();
    }
    else {
        let formattedDate = moment(issueTime).format('DD/MM/YYYY');
        if (formattedDate !== 'Invalid date') {
            return formattedDate;
        }
        return issueTime;
    }
}