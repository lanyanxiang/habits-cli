import dateFns from "date-fns";

const format = (date: Date, format: string) => {
  return dateFns.format(date, format);
};

const formatDate = (date: Date, showYear?: boolean) => {
  const formatStr = showYear ? "MMM D, yyyy" : "MMM D";
  return dateFns.format(date, formatStr);
};

const formatTime = (date: Date, showSeconds?: boolean) => {
  const formatStr = showSeconds ? "HH:mm:ss" : "HH:mm";
  return dateFns.format(date, formatStr);
};

const formatRelative = (date: Date, currentDate: Date = new Date()) => {
  return dateFns.formatDistance(currentDate, date, { addSuffix: true });
};

export const datetime = {
  format,
  formatDate,
  formatTime,
  formatRelative,
};
