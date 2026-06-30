export function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}
export function getTomorrowISO() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}
