import * as dateFns from "date-fns";

const format = (date: Date, format?: string) => {
  if (!format) {
    return `${formatDate(date)} at ${formatTime(date)} (${formatRelative(
      date
    )})`;
  }
  return dateFns.format(date, format);
};

const formatDate = (date: Date, showYear?: boolean) => {
  const formatStr = showYear ? "MMM d, yyyy" : "MMM d";
  return dateFns.format(date, formatStr);
};

const formatTime = (date: Date, showSeconds?: boolean) => {
  const formatStr = showSeconds ? "HH:mm:ss" : "HH:mm";
  return dateFns.format(date, formatStr);
};

const formatRelative = (date: Date, currentDate: Date = new Date()) => {
  return dateFns.formatDistance(date, currentDate, { addSuffix: true });
};

export const datetime = {
  format,
  formatDate,
  formatTime,
  formatRelative,
};
