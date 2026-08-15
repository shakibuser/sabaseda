const persianFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  timeZone: "Asia/Tehran",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const persianDateTimeFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  timeZone: "Asia/Tehran",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatPersianDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return persianFormatter.format(date);
}

export function formatPersianDateTime(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return persianDateTimeFormatter.format(date);
}

export function toIsoDateTime(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString();
}
