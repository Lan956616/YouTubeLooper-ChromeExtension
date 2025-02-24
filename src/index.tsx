import { createRoot, Root } from "react-dom/client";
import App from "./App";

let lastUrl: string = "";
let root: Root | null = null;
let waitForVideo: NodeJS.Timeout | null = null;

//從網址獲取YT影片ID 
const getVideoId = (): string | null => {
  const url = new URL(window.location.href);
  return url.searchParams.get("v");
};
//判斷影片是否是直播
const isVideoLive = (): boolean => {
  const liveBadge = document.querySelector(".ytp-live-badge.ytp-button.ytp-live-badge-is-livehead");
  return liveBadge !== null && liveBadge.hasAttribute("disabled");
};

const renderApp = (addingzone: HTMLElement) => {
  // 確保之前的 setInterval 被清除
  if (waitForVideo !== null) {
    clearInterval(waitForVideo);
    waitForVideo = null;
  }

  waitForVideo = setInterval(() => {
    const video = document.querySelector(".html5-video-container video") as HTMLVideoElement | null;
    // 取得 YouTube 影片 ID
    const videoId = getVideoId();
    if (!video || !videoId) { return }
    if (waitForVideo !== null) {
      clearInterval(waitForVideo);
      waitForVideo = null;
    }
    // 若是直播影片不要渲染App組件
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
    root.render(<App videoId={videoId} duration={video.duration} isDark={isDarkTheme} />);

  }, 500);
};

const observer = new MutationObserver(() => {
  //若body 子元素 或孫子元素有變動時
  //找到新增的按鍵區域
  let addingZone = document.querySelector("#adding-zone") as HTMLElement | null;
  //若網址跟lastUrl不一樣 或 沒有addingzone元素
  if (window.location.href !== lastUrl || !addingZone) {
    //更新lastUrl
    lastUrl = window.location.href;
    //找到影片的標題
    const titleElement = document.querySelector("#above-the-fold #title");
    if (titleElement && !addingZone) {
      addingZone = document.createElement("div");
      addingZone.id = "adding-zone";
      titleElement.after(addingZone);
      renderApp(addingZone);
    } else if (titleElement && addingZone) {
      //只需更新App組件
      renderApp(addingZone);
    }
  } else {
    //網址跟lastUrl一樣 也有addingZone時 return
    return
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

