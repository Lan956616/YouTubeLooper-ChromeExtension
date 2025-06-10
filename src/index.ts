import { renderApp } from "./render/renderApp";
let lastUrl: string = "";
let isAppMounted = false;
let waitInterval: NodeJS.Timeout | null = null;
let count: number = 1;

const observer = new MutationObserver(() => {
  console.log(`第${count}次進入觀察`);
  count++;
  // Triggered when any element is added/removed under body
  const currentUrl = window.location.href;
  // Skip if URL hasn't changed
  if (currentUrl === lastUrl) {
    console.log(`same url`);
    return;
  }
  lastUrl = currentUrl;
  isAppMounted = false;
  waitForTitle(currentUrl);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

const waitForTitle = (targetUrl: string) => {
  // Clear any existing polling timer
  if (waitInterval !== null) {
    clearInterval(waitInterval);
    waitInterval = null;
  }
  let retries = 0;
  const maxRetries = 20;
  waitInterval = setInterval(() => {
    if (window.location.href !== targetUrl) {
      console.log("網址變了，中止等待");
      clearInterval(waitInterval!);
      waitInterval = null;
      return;
    }
    // Try to find the video title section
    const titleElement = document.querySelector("#above-the-fold #title");
    if (!titleElement) {
      retries++;
      if (retries > maxRetries) {
        console.log("超過重試次數，放棄等待");
        clearInterval(waitInterval!);
        waitInterval = null;
      }
      return;
    }
    clearInterval(waitInterval!);
    waitInterval = null;
    checkAddingZone(titleElement, targetUrl);
  }, 500);
};

const checkAddingZone = (titleElement: Element, targetUrl: string) => {
  if (window.location.href !== targetUrl || isAppMounted) return;
  let addingZone = document.querySelector("#adding-zone") as HTMLElement | null;
  if (!addingZone) {
    addingZone = document.createElement("div");
    addingZone.id = "adding-zone";
    titleElement.after(addingZone);
  }
  renderApp(addingZone, targetUrl);
  isAppMounted = true;
};
