import { renderApp } from "./render/renderApp";
let lastUrl: string = "";

const observer = new MutationObserver(() => {
  // Triggered when any element is added/removed under body
  const currentUrl = window.location.href;
  let addingZone = document.querySelector("#adding-zone") as HTMLElement | null;
  // Skip if URL hasn't changed and the zone is already rendered
  if (currentUrl === lastUrl && addingZone) return;

  lastUrl = currentUrl;
  // Try to find the video title section
  const titleElement = document.querySelector("#above-the-fold #title");
  if (!titleElement) return;
  if (!addingZone) {
    addingZone = document.createElement("div");
    addingZone.id = "adding-zone";
    titleElement.after(addingZone);
  }
  // Render the React app
  renderApp(addingZone);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
