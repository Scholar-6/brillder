let _mtm:any = null;

export function setupMatomo() {
  if (process.env.REACT_APP_MATOMO_URL) {
    try {
      const windowLink = window as any;
      _mtm = windowLink._mtm = windowLink._mtm || [];
      _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
      const d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.type='text/javascript';
      g.async=true;
      g.src=process.env.REACT_APP_MATOMO_URL as string;
      console.log(process.env.REACT_APP_MATOMO_URL);
      if (s.parentNode) {
        s.parentNode.insertBefore(g,s);
      }
      g.onload = () => {
        console.log('matomo manager loaded (shouldn`t apper twice)');
      }
    } catch {
      console.log('There is no Matomo tracking endpoint.');
    }
  }
}

export function enableTracking() {
  if (_mtm) {
    try {
      _mtm.push({"event": "start-tracking"});
      _mtm.push({'tracking-enabled': true});
      console.log('matomo start tracking');
    } catch {
      console.log('matomo start tracking error');
    }
  }
}

export function trackSignUp() {
  if (_mtm) {
    try {
      _mtm.push({"event": "synthesis-signup"});
      console.log('matomo synthesis-signup event')
    } catch {
      console.log('matomo sign up tracking error');
    }
  }
}

export function disableTracking() {
  if (_mtm) {
    try {
      _mtm.push({"event": "stop-tracking"});
      _mtm.push({'tracking-enabled': false});
      console.log('matomo disable tracking');
    } catch {
      console.log('matomo disable tracking error');
    }
  }
}


