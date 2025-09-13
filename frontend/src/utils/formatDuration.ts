export const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const remainingSeconds = duration % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};
