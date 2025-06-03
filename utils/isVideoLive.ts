export const isVideoLive = (): boolean => {
  const liveBadge = document.querySelector(
    ".ytp-live-badge.ytp-button.ytp-live-badge-is-livehead"
  );
  return liveBadge !== null && liveBadge.hasAttribute("disabled");
};
