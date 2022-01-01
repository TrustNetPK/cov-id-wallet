import moment from 'moment';

export const get_local_issue_time = (issueTime) => {
    let isValid = moment.utc(issueTime, 'mm/dd/yyyy hh:mm:ss').isValid();
    if (isValid) {
        return moment.utc(issueTime, 'MM/DD/YYYY hh:mm:ss').local().format("DD/MM/YYYY hh:mm A").toString();
    }
    else {
        return issueTime;
    }
}

export const get_local_issue_date = (issueTime) => {
    let isValid = moment.utc(issueTime, 'mm/dd/yyyy hh:mm:ss').isValid();
    console.log(isValid);
    if (isValid) {
        return moment.utc(issueTime, 'MM/DD/YYYY hh:mm:ss').local().format("DD/MM/YYYY").toString();
    }
    else {
        return issueTime;
    }
}