const updateURL = (newURL: string) => {
  if (newURL !== window.location.href) {
    window.history.pushState({}, "", newURL);
  }
};

const monitorIframeURL = (iframe: HTMLIFrameElement) => {
  let previousURL = iframe.contentWindow?.location.href || "";

  const onURLChange = () => {
    const currentURL = iframe.contentWindow?.location.href || "";
    if (currentURL !== previousURL) {
      previousURL = currentURL;
      updateURL(currentURL);
    }
  };

  iframe.contentWindow?.addEventListener("popstate", onURLChange);
  iframe.contentWindow?.addEventListener("pushState", onURLChange);
  iframe.contentWindow?.addEventListener("replaceState", onURLChange);
};

const init = () => {
  const iframe = document.getElementById("cafe_main") as HTMLIFrameElement;

  if (iframe) {
    iframe.addEventListener("load", () => {
      console.log("Naver Cafe URL started");
      monitorIframeURL(iframe);
    });
  }
};

init();
