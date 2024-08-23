const updateURL = (newURL: string) => {
  window.history.pushState({}, "", newURL);
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

  const observer = new MutationObserver(() => {
    checkURLChange();
  });

  const observeIframe = () => {
    if (iframe.contentDocument?.body) {
      observer.observe(iframe.contentDocument.body, {
        childList: true,
        subtree: true,
      });
    }
  };

  iframe.addEventListener("load", observeIframe);

  observeIframe();

  const contentWindow = iframe.contentWindow;
  if (contentWindow) {
    const originalFetch = contentWindow.fetch;
    if (typeof originalFetch === "function") {
      (contentWindow as Window).fetch = function (
        input: RequestInfo | URL,
        init?: RequestInit
      ) {
        const result = originalFetch.call(this, input, init);
        result.then(() => {
          setTimeout(checkURLChange, 0);
        });
        return result;
      };
    }

    if ("XMLHttpRequest" in contentWindow) {
      const XHRConstructor = (contentWindow as Window & typeof globalThis)
        .XMLHttpRequest;
      const XHRPrototype = XHRConstructor.prototype;

      const originalXHROpen = XHRPrototype.open;
      XHRPrototype.open = function (
        this: XMLHttpRequest,
        method: string,
        url: string | URL,
        async: boolean = true,
        username?: string | null,
        password?: string | null
      ) {
        this.addEventListener("load", () => {
          setTimeout(checkURLChange, 0);
        });
        return originalXHROpen.call(
          this,
          method,
          url,
          async,
          username ?? undefined,
          password ?? undefined
        );
      };
    }
  }
};

const init = () => {
  const iframe = document.getElementById(
    "cafe_main"
  ) as HTMLIFrameElement | null;

  if (iframe) {
    console.log("Naver Cafe URL monitoring started");
    monitorIframeURL(iframe);
  } else {
    console.error("iframe with id 'cafe_main' not found");
  }
};

init();
