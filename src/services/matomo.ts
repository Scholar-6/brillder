export function setupMatomo() {
  const windowLink = window as any;
  const _mtm = windowLink._mtm = windowLink._mtm || [];
  _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
  const d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.type='text/javascript';
  g.async=true;
  g.src='https://matomo.brillder.com/js/container_UkdV64XH.js';
  if (s.parentNode) {
    s.parentNode.insertBefore(g,s);
  }
  console.log('matomo manager downloaded');
}