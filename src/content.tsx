const updateURL = (newURL: string) => {
  if (newURL !== window.location.href) {
    window.history.pushState({}, "", newURL);
  }
};

const monitorIframeURL = (iframe: HTMLIFrameElement) => {
  let previousURL = "";

  const checkURLChange = () => {
    const iframeDocument = iframe.contentDocument;
    if (iframeDocument) {
      const currentURL = iframeDocument.URL;
      if (currentURL !== previousURL) {
        previousURL = currentURL;
        updateURL(currentURL);
      }
    }
  };
  setInterval(checkURLChange, 500);
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
