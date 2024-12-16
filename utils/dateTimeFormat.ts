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
