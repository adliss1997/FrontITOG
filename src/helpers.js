const MONTHS = [
  "янв", "фев", "мар", "апр", "мая", "июн",
  "июл", "авг", "сен", "окт", "ноя", "дек",
];

export function formatDateTime(iso) {
  const d = new Date(iso);
  const date = `${d.getDate()} ${MONTHS[d.getMonth()]}`;
  const time = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  return `${date}, ${time}`;
}

export function splitDate(iso) {
  const d = new Date(iso);
  return { day: d.getDate(), mon: MONTHS[d.getMonth()] };
}

export function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "только что";
  if (min < 60) return `${min} мин назад`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} ч назад`;
  return formatDateTime(iso);
}

export function initial(name) {
  return (name || "?").trim().charAt(0).toUpperCase();
}

export const STATUS_LABEL = {
  suggested: "предложена",
  reading: "читаем",
  finished: "прочитана",
};
