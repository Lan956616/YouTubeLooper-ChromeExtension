export const getVideoId = (): string | null => {
  const url = new URL(window.location.href);
  return url.searchParams.get("v");
};
