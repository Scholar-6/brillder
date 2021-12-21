import { isIPad13, isMobile, isTablet } from "react-device-detect";
import { isPhone } from "./phone";

declare global {
  interface Window { zESettings: any; }
}

const getZendeskIframe = () => document.getElementById("launcher") as any;
const getWidgetIframe = () => document.getElementById("webWidget") as any;

const attachStyleCss = (iframe: any, path: string) => {
  try {
    const cssLink = document.createElement("link");
    cssLink.href = path;
    cssLink.rel = "stylesheet";
    cssLink.type = "text/css";
    const innnerDoc = iframe.contentDocument || iframe.contentWindow;
    innnerDoc.head.appendChild(cssLink);
  } catch (e) {
    console.log('can`t attach zendesk styles', e);
  }
}

const initZendeskStyling = (iframe: any) => {
  if (isPhone()) {
    attachStyleCss(iframe, '/zendesk/zendesk_mobile.css');
  } else if (isTablet || isIPad13) {
    attachStyleCss(iframe, '/zendesk/zendesk_tablet.css');
  } else {
    attachStyleCss(iframe, '/zendesk/zendesk_desktop.css');
  }
  if (isMobile) { return; }
}

const initZendeskPopupStyling = () => {
  let success = false;
  // hide custom fields
  try {
    const widgetIframe = getWidgetIframe();
    const innerWidgetDoc = widgetIframe.contentDocument || widgetIframe.contentWindow.document;
    const css = `
      input[name='key:${process.env.REACT_APP_ZENDESK_AGENT_FIELD}'],
      input[name='key:${process.env.REACT_APP_ZENDESK_SCREEN_SIZE_FIELD}']
        {
          margin: 0;
          padding: 0;
          border: none;
          height: 0;
          min-height: 0;
          overflow: hidden;
          pointer-events: none;
          cursor: not-allowed;
  
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      button[data-garden-id="buttons.icon_button"] {
        content: url("/zendesk/close-image.svg");
      }
    `;
    const head = innerWidgetDoc.head || innerWidgetDoc.getElementsByTagName('head')[0];
    const style = document.createElement('style');

    head.appendChild(style);

    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    success = true;
    console.log('attached styles to zendesk widget');
  } catch {
    console.log('can`t find zendesk widget')
  }
  return success;
}

export function minimizeZendeskButton(iframe?: any) {
  if (isMobile) { return; }
  if (!iframe) {
    iframe = getZendeskIframe();
    if (!iframe) { return; }
  }
  var innerDoc = iframe.contentDocument || iframe.contentWindow.document;

  let div = innerDoc.querySelectorAll('#Embed')[0]
  if (div) {
    div.classList.add("minimized");
  }
}

export function maximizeZendeskButton(iframe?: any) {
  if (isMobile) { return; }
  if (!iframe) {
    iframe = getZendeskIframe();
    if (!iframe) { return; }
  }
  var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
  let div = innerDoc.querySelectorAll('#Embed')[0]
  div.classList.remove("minimized");
}

function addZendesk() {
  // #1473 need to double check if zendesk exists.
  const zendeskIframe = getZendeskIframe();
  if (zendeskIframe) { return; }

  var head = document.getElementsByTagName('head').item(0);
  if (head) {
    window.zESettings = {
      cookies: false,
      webWidget: {
        chat: {
          prechatForm: {
            greeting: {
              '*': 'Please fill out the form below to chat with us',
              fr: "S'il vous plaît remplir le formulaire ci-dessous pour discuter avec nous"
            },
            departmentLabel: {
              '*': 'Select a department',
              fr: "S'il vous plaît remplir le formulaire ci-dessous pour discuter avec nous"
            }
          }
        }
      }
    } as any;
    const script = document.createElement('script');
    script.setAttribute('id', 'ze-snippet');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute(
      'src',
      `https://static.zdassets.com/ekr/snippet.js?key=${process.env.REACT_APP_ZENDESK_ID
        ? process.env.REACT_APP_ZENDESK_ID
        : '33210b3d-b3d5-43ba-9b07-70acce8c10b6'}`
    );
    head.appendChild(script);

    // prefill zendesk fields
    window.zESettings = {
      cookies: false,
      webWidget: {
        contactForm: {
          fields: [
            {
              id: process.env.REACT_APP_ZENDESK_SCREEN_SIZE_FIELD,
              prefill: { '*': `height: ${window.screen.height} width: ${window.screen.width}` }
            },
            {
              id: process.env.REACT_APP_ZENDESK_AGENT_FIELD,
              prefill: { '*': window.navigator.userAgent }
            }
          ]
        }
      }
    };
  }
}

// if form submitted click to "Go Back" button to move back
function messageSent() {
  var interval2 = setInterval(() => {
    try {
      const iframe = getWidgetIframe();
      if (iframe) {
        var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        var footer = innerDoc.getElementsByTagName('footer')[0];
        console.log(footer);
        if (footer && footer.children[0]) {
          var button = footer.children[0].children[1];
          button.onclick = function () {
            var waitTimes = 0;
            // wait untill popup open wait only 3 times
            var interval3 = setInterval(() => {
              waitTimes+= 1;
              if (waitTimes > 9) {
                clearInterval(interval3);
              }
              const iframe = getWidgetIframe();
              if (iframe) {
                var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                // looking for button
                try {
                var tagv3 = innerDoc.getElementById("Embed").children[3].children[0].children[0];
                if (tagv3.children[1]) {
                  var container = tagv3.children[1].children[0];
                  console.log(container.children[2].children[0]);
                  var backButtonV5 = container.children[2].children[0];
                  console.log(backButtonV5.innerHTML);
                  if (backButtonV5.ineerHTML != 'Send') {
                    console.log('click')
                    backButtonV5.click();
                  }
                  //clearInterval(interval3);
                }
              } catch { }
              }
            }, 250);
          }
          console.log(button);
          clearInterval(interval2);
        }
      }
    } catch (e) {
      console.log('can`t find zendesk button inside form', e);
      clearInterval(interval2);
    }
  }, 300);
}

/**
 * Mount Zendesk. if mounted then just switch mode from small to big
 * @param location Location
 * @param zendeskCreated boolean - zendesk mounted or not
 * @param setZendesk (zendeskCreated: boolean):void - set mounted or umounted
 */
export function setupZendesk(zendeskCreated: boolean, setZendesk: Function) {
  if (!zendeskCreated) {
    console.log('create zendesk iframe. (this log can`t appear twice)');
    setZendesk(true);
    addZendesk();

    // check untill zendesk is mounted
    const interval = setInterval(() => {
      const iframe = getZendeskIframe();
      if (iframe) {
        try {
          initZendeskStyling(iframe);
          clearInterval(interval);
          var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
          var buttons = innerDoc.getElementsByTagName('button');
          if (buttons.length === 1) {
            buttons[0].onclick = function () {
              const widgetInterval = setInterval(() => {
                const success = initZendeskPopupStyling();
                if (success) {
                  messageSent();
                  console.log('success');
                  clearInterval(widgetInterval);
                }
              }, 100);
            }
          } else {
            console.log('can`t find zendesk button');
          }
        } catch {
          console.log('can`t get zendesk element');
        }
      }
    }, 100);
  }
}


export function hideZendesk() {
  var dd = getZendeskIframe();
  if (dd) {
    dd.style.display = 'none';
  } else {
    setTimeout(() => {
      var dd = getZendeskIframe();
      if (dd) {
        dd.style.display = 'none';
      } else {
        setTimeout(() => {
          var dd = getZendeskIframe();
          if (dd) {
            dd.style.display = 'none';
          } else {
            setTimeout(() => {
              var dd = getZendeskIframe();
              if (dd) {
                dd.style.display = 'none';
              } else {
                console.log('can`t hide zendesk');
              }
            }, 1000);
          }
        }, 500);
      }
    }, 200);
  }
}

export function showZendesk() {
  var dd = getZendeskIframe();
  if (dd) {
    dd.style.display = 'block';
  } else {
    setTimeout(() => {
      var dd = getZendeskIframe();
      if (dd) {
        dd.style.display = 'block';
      } else {
        setTimeout(() => {
          var dd = getZendeskIframe();
          if (dd) {
            dd.style.display = 'block';
          }
        }, 500);
      }
    }, 200);
  }
}