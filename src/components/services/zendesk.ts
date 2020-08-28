import { isMobile } from "react-device-detect";

const getZendeskIframe = () => document.getElementById("launcher") as any;

const initZendeskStyling = (iframe: any) => {
  if (isMobile) { return; }
  var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
  let div = innerDoc.querySelectorAll('#Embed > div')[0]
  div.style.position = "absolute";
  div.style.width = '100%';
  div.style.height = '100%';
  let button = innerDoc.getElementsByTagName("button")[0];
  button.style.padding = 0;
  button.style.width = '100%';
  button.style.height = '100%';
  let btnContent = button.getElementsByClassName("u-inlineBlock")[0];
  btnContent.style.paddingRight = "0";
  let helpText = innerDoc.getElementsByClassName("label-3kk12");
  helpText[0].style.opacity = 1;
  helpText[0].style.fontSize = '15vw';
  let svg = innerDoc.getElementsByTagName("svg")[0];
  let svgSize = '48vh';
  svg.style.minWidth = svgSize;
  svg.style.minHeight = svgSize;
  svg.style.width = svgSize;
  svg.style.height = svgSize;
}

export function minimizeZendeskButton(iframe?: any) {
  if (isMobile) { return; }
  if (!iframe) {
    iframe = getZendeskIframe();
    if (!iframe) { return; }
  }
  var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
  let div = innerDoc.querySelectorAll('#Embed > div')[0]
  div.style.width = '42%';
  div.style.height = '100%';
  var button = innerDoc.getElementsByTagName("button")[0];
  button.style.paddingLeft = "11.6vw";
  let btnContent = button.getElementsByClassName("u-inlineBlock")[0];
  btnContent.style.padding = 0;
  let helpText = innerDoc.getElementsByClassName("label-3kk12");
  helpText[0].style.opacity = 0;
  helpText[0].style.width = 0;
}

export function maximizeZendeskButton(iframe?: any) {
  if (isMobile) { return; }
  if (!iframe) {
    iframe = getZendeskIframe();
    if (!iframe) { return; }
  }
  var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
  let div = innerDoc.querySelectorAll('#Embed > div')[0]
  div.style.width = '100%';
  div.style.height = '100%';
  let button = innerDoc.getElementsByTagName("button")[0];
  button.style.paddingLeft = '19.5vw';
  let btnContent = button.getElementsByClassName("u-inlineBlock")[0];
  btnContent.style.paddingRight = "7vw";
  let helpText = innerDoc.getElementsByClassName("label-3kk12");
  helpText[0].style.opacity = 1;
  helpText[0].style.width = "100%";
}

function addZendesk() {
  // #1473 need to double check if zendesk exists.
  let zendeskIframe = getZendeskIframe();
  if (zendeskIframe) { return; }

  var head = document.getElementsByTagName('head').item(0);
  if (head) {
    var script = document.createElement('script');
    script.setAttribute('id', 'ze-snippet');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute(
      'src',
      `https://static.zdassets.com/ekr/snippet.js?key=${
      process.env.REACT_APP_ZENDESK_ID
        ? process.env.REACT_APP_ZENDESK_ID
        : '1415bb80-138f-4547-9798-3082b781844a'
      }`
    );
    head.appendChild(script);
  }
}

const isProfilePage = (pathName: string) => pathName.search('/user-profile') >= 0;
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
  if (isMobile) { return; }
  // #1332 small mode only in viewAll and manageUsers pages
  let isBigMode = true;
  let isIgnorePage = false;
  const { pathname } = location;
  if (isViewAllPage(pathname) || isManageUsersPage(pathname) || isProfilePage(pathname)) {
    isBigMode = false;
  }
  
  if (isPlayPage(pathname)) {
    isIgnorePage = true;
  }

  try {
    if (isBigMode && !isIgnorePage) {
      maximizeZendeskButton(iframe);
    } else if (!isIgnorePage) {
      minimizeZendeskButton(iframe);
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