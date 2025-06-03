import { createRoot, Root } from "react-dom/client";
import App from "../App";
import { getVideoId } from "../../utils/getVideoId";
import { isVideoLive } from "../../utils/isVideoLive";

let root: Root | null = null;
let waitForVideo: NodeJS.Timeout | null = null;

export const renderApp = (addingzone: HTMLElement) => {
  // Clear any existing polling timer
  if (waitForVideo !== null) {
    clearInterval(waitForVideo);
    waitForVideo = null;
  }

  waitForVideo = setInterval(() => {
    const video = document.querySelector(
      ".html5-video-container video"
    ) as HTMLVideoElement | null;
    const videoId = getVideoId();
    if (!video || !videoId) {
      return;
    }
    // Stop polling once video and ID are found
    if (waitForVideo !== null) {
      clearInterval(waitForVideo);
      waitForVideo = null;
    }
    // If it's a live video, unmount the React app and skip rendering
    if (isVideoLive()) {
      if (root) {
        root.unmount();
        root = null;
      }
      return;
    }
    let isDarkTheme = document.documentElement.hasAttribute("dark");
    if (!root) {
      root = createRoot(addingzone);
    }
    root.render(
      <App videoId={videoId} duration={video.duration} isDark={isDarkTheme} />
    );
  }, 500);
};
