import { stripHtml } from "components/build/questionService/ConvertService";

export function getBrillderTitle(brickTitle?: string) {
  let title = "Brillder";
  if (brickTitle) {
    title = stripHtml(brickTitle);
  }
  if (process.env.REACT_APP_BACKEND_HOST) {
    let isDev = process.env.REACT_APP_BACKEND_HOST.search('dev') >= 0;
    if (isDev) {
      title = "dev-" + title;
    }
  }
  return title;
}