const updateURL = (newURL: string) => {
  if (newURL !== window.location.href) {
    window.history.pushState({}, "", newURL);
  }
};

const monitorIframeURL = (iframe: HTMLIFrameElement) => {
  const iframeDocument = iframe.contentDocument;
  let previousURL = iframeDocument?.URL || "";

  const checkURLChange = () => {
    if (iframeDocument) {
      const currentURL = iframeDocument.URL;
      if (currentURL !== previousURL) {
        previousURL = currentURL;
        updateURL(currentURL);
      }
    }
  };

  iframe.contentWindow?.addEventListener("popstate", checkURLChange);
  iframe.contentWindow?.addEventListener("pushState", checkURLChange);
  iframe.contentWindow?.addEventListener("replaceState", checkURLChange);
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
