function toLocalISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTodayISO() {
  return toLocalISODate(new Date());
}

export function getTomorrowISO() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return toLocalISODate(date);
}
