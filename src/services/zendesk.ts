import map from "components/map";
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
  var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
  let div = innerDoc.querySelectorAll('#Embed')[0]

  // hide custom fields
  let widgetIframe = getWidgetIframe();
  var innerWidgetDoc = widgetIframe.contentDocument || widgetIframe.contentWindow.document;

  var css = `
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
    `;
  var head = innerWidgetDoc.head || innerWidgetDoc.getElementsByTagName('head')[0];
  var style = document.createElement('style');

  head.appendChild(style);

  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
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

const isProfilePage = (pathName: string) => pathName.search(map.UserProfile) >= 0;
const isViewAllPage = (pathName: string) => pathName === "/play/dashboard";
const isManageUsersPage = (pathName: string) => pathName === "/users";
const isPlayPage = (pathName: string) => {
  return pathName.search('/play/brick') >= 0;
}

/**
 * change zendesk button size
 * @param iframe Zendesk iframe
 * @param location Location - button size changing based on route
 */
function setZendeskMode(iframe: any, location: any) {
  const { pathname } = location;
  if (isMobile) {
    //setMobilePlayButton(iframe, pathname);
    return;
  }
  // #1332 small mode only in viewAll and manageUsers pages
  let isBigMode = true;
  let isIgnorePage = false;
  if (isViewAllPage(pathname) || isManageUsersPage(pathname) || isProfilePage(pathname)) {
    isBigMode = false;
  }

  if (isPlayPage(pathname)) {
    isIgnorePage = true;
  }

  try {
    if (isBigMode && !isIgnorePage) {
      //maximizeZendeskButton(iframe);
    } else if (!isIgnorePage) {
      //minimizeZendeskButton(iframe);
    }
  } catch { }
}

/**
 * Mount Zendesk. if mounted then just switch mode from small to big
 * @param location Location
 * @param zendeskCreated boolean - zendesk mounted or not
 * @param setZendesk (zendeskCreated: boolean):void - set mounted or umounted
 */
export function setupZendesk(location: any, zendeskCreated: boolean, setZendesk: Function) {
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
          setZendeskMode(iframe, location);
          clearInterval(interval);
        } catch {
          console.log('can`t get zendesk element');
        }
      }
    }, 100);
  } else {
    const iframe = getZendeskIframe();
    setZendeskMode(iframe, location);
  }
}

/**
 * Task #2782. For play on phone zendesk button should be smaller and fixed in footer.
 * Button size and position are from .\src\components\play\themes\BrickPageMobile.scss
 */
const setMobilePlayButton = (iframe: any, pathname: string) => {
  if (!isMobile && (isTablet || isIPad13)) {
    return;
  }

  if (!isPlayPage(pathname)) {
    return;
  }

  setMobilePlayButtonStyle(iframe);
}

const setMobilePlayButtonStyle = (iframe: any) => {
  if (!iframe) {
    iframe = getZendeskIframe();
    if (!iframe) { return; }
  }

  try {
    const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframe.style.display = 'flex';
    iframe.style.alignItems = 'center';
    iframe.style.justifyContent = 'center';
    // iframe.style.width = '12.5%';
    // iframe.style.height = '20vw';
    const div = innerDoc.querySelectorAll('#Embed > div')[0]
    div.style.position = 'absolute';
    div.style.bottom = '0';
    div.style.left = '0';
    div.style.marginLeft = '0';
    div.style.width = '100%';
    div.style.height = '80%';

    const button = innerDoc.getElementsByTagName("button")[0];
    button.style.maxWidth = '76vw';
    button.style.padding = '0';
    button.style.paddingLeft = '0';

    // make button full size and position
    const btnContent = button.getElementsByClassName("u-inlineBlock")[0];
    btnContent.style.display = 'flex';
    btnContent.style.alignItems = 'center';
    btnContent.style.justifyContent = 'center';
    btnContent.style.width = '100vw';
    btnContent.style.height = '100vw';
    btnContent.style.padding = '0';
    btnContent.style.paddingRight = "0";

    // removes help text
    const helpText = innerDoc.getElementsByClassName("label-3kk12");
    helpText[0].classList.add("minimized");

    // make icon fyll size
    const icon = innerDoc.getElementsByTagName('svg')[0];
    icon.style.height = '100%';
    icon.style.width = '100%';

    // hide icon white circle
    let g = icon.getElementById("Layer_4");
    let whiteCircle = g.children[g.children.length - 1];
    whiteCircle.style.fillOpacity = '0';
  } catch { }
}