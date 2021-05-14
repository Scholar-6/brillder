import React, { Component } from 'react';
import YouTube, { Options as YoutubeOptions } from 'react-youtube';
import { Grid } from '@material-ui/core';
import { isPhone } from 'services/phone';

interface YoutubeLinkProps {
  value: string;
}

const YoutubeLink: React.FC<YoutubeLinkProps> = (props) => {
  const [video, setVideo] = React.useState<any>();
  const container = React.useRef<HTMLDivElement | null>(null);
  const [isValid, setIsValid] = React.useState(true);

  const videoId = React.useMemo(() => {
    const result = props.value.match(/https:\/\/www.youtube\.com\/embed\/([_\-0-9A-Za-z]{11})/);
    if(result) {
      return result[1];
    }
  }, [props.value]);

  const onPlay = React.useCallback((evt) => {
    if(isPhone()) {
      const iframe = container.current?.querySelector("iframe");
      if(!iframe) return;
      iframe.requestFullscreen?.();
      window.screen.orientation.lock("landscape");
    }
  }, [video]);

  const opts: YoutubeOptions = {
    playerVars: {
      playsinline: 0,
    }
  }

  if (isValid) {
    return (
      <div className="youtube-video" ref={container}>
        <YouTube
          ref={(el) => setVideo(el)}
          videoId={videoId}
          opts={opts}
          onError={() => setIsValid(false)}
          onPlay={onPlay}
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
