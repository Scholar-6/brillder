import React from 'react';
import YouTube, { Options as YoutubeOptions } from 'react-youtube';
import { Grid } from '@material-ui/core';
import { SetYoutubeClick, UnsetYoutubeClick } from 'localStorage/play';

interface YoutubeLinkProps {
  value: string;
}

const YoutubeLink: React.FC<YoutubeLinkProps> = (props) => {
  const [video, setVideo] = React.useState<any>();
  const [isValid, setIsValid] = React.useState(true);

  const videoId = React.useMemo(() => {
    const result = props.value.match(/https:\/\/www.youtube\.com\/embed\/([_\-0-9A-Za-z]{11})/);
    if(result) {
      return result[1];
    }
  }, [props.value]);

  let opts: YoutubeOptions = {
    playerVars: {
      playsinline: 0,
    }
  };

  const rememberYoutube = () => {
    SetYoutubeClick();
    setTimeout(() => {
      UnsetYoutubeClick();
    }, 2000);
  }

  if (isValid) {
    return (
      <div className="youtube-video" onClick={() => console.log('click')}>
        <YouTube
          videoId={videoId}
          opts={opts}
          onError={() => setIsValid(false)}
          onReady={(evt) => setVideo(evt.target)}
          onPlaybackQualityChange={rememberYoutube}
        />
      </div>
    );
  } else if (videoId) {
    let link = `https://www.youtube.com/watch?v=${videoId}`;
    return (
      <Grid container justify="center" className="youtube-link">
        <a href={link} rel="noopener noreferrer" target="_blank">Play on YouTube</a>
      </Grid>
    );
  } else {
    return <div />;
  }
}

export default YoutubeLink;
