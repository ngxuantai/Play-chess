export const timerFormat = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

export const formatMinsToHour = (mins: number) => {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  return `${hours}:${minutes}`;
};

export const formatDateTimeVN = (dateStr: string) => {
  const date = new Date(dateStr);

  const vietnamTime = new Date(date.getTime() - 7 * 60 * 60 * 1000);

  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("vi-VN", options).format(vietnamTime);
};
