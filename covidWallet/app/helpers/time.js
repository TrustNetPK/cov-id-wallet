import moment from 'moment';

export const get_local_issue_time = (issueTime) => {
  if (moment.utc(issueTime, 'mm/dd/yyyy hh:mm:ss').isValid()) {
    return moment
      .utc(issueTime, 'MM/DD/YYYY hh:mm:ss')
      .local()
      .format('DD/MM/YYYY HH:mm')
      .toString();
  } else {
    let formattedDate = moment(issueTime).format('DD/MM/YYYY HH:mm');
    if (formattedDate !== 'Invalid date') {
      return formattedDate;
    }
    return issueTime;
  }
};

export const get_local_issue_date = (issueTime) => {
  if (moment.utc(issueTime, 'mm/dd/yyyy hh:mm:ss').isValid()) {
    return moment
      .utc(issueTime, 'MM/DD/YYYY hh:mm:ss')
      .local()
      .format('DD/MM/YYYY')
      .toString();
  } else {
    let formattedDate = moment(issueTime).format('DD/MM/YYYY');
    if (formattedDate !== 'Invalid date') {
      return formattedDate;
    }
    return issueTime;
  }
};

export const changeDateFormat = (date) => {
  return moment(date).format('DD/MM/YYYY');
};

export const formatDateWithHyphen = (date) => {
  return moment(date).format('DD-MM-YYYY');
};

export const get_local_date_time = (date) => {
  return moment(date).format('DD/MM/YYYY hh:mm A');
};
