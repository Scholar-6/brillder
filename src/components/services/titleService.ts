
export function setBrillderTitle() {
  document.title = "Brillder";
  if (process.env.REACT_APP_BACKEND_HOST) {
    let isDev = process.env.REACT_APP_BACKEND_HOST.search('dev') >= 0;
    if (isDev) {
      document.title = "dev-Brillder";
    }
  }
}