import React, { Component } from 'react';
import YouTube from 'react-youtube';
import { Grid } from '@material-ui/core';

interface YoutubeLinkProps {
  value: string;
}

interface YoutubeLinkState {
  isValid: boolean;
}

class YoutubeLink extends Component<YoutubeLinkProps, YoutubeLinkState> {
  constructor(props: YoutubeLinkProps) {
    super(props);

    this.state = {
      isValid: true
    }
  }

  getVideoLink(el: string) {
    let htmlElement = document.createElement("div");
    htmlElement.innerHTML = this.props.value;
    console.log(htmlElement);
    let link = '' as any;
    if (htmlElement && htmlElement.children[0] && htmlElement.children[0].children[0] && htmlElement.children[0].children[0].getAttribute("data-oembed-url")) {
      link = htmlElement.children[0].children[0].getAttribute("data-oembed-url");
    }
    return link ? link : '';
  }

  getVersion(el: string) {
    let link = this.getVideoLink(el);
    if (link) {
      let version = this.getParameterByName('v', link);
      return version ? version : '';
    }
    return '';
  }

  getParameterByName(name: string, url: string) {
    if (!url) url = window.location.href;
    /*eslint-disable-next-line*/
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  render() {
    const version = this.getVersion(this.props.value);
    if (this.state.isValid) {
      return <div className="youtube-video"> <YouTube
        videoId={version}
        onError={() => {
          this.setState({isValid: false});
        }}
      /></div>;
    } else {
      let link = this.getVideoLink(this.props.value);
      return (
        <Grid container justify="center" className="youtube-link">
          <a href={link} rel="noopener noreferrer" target="_blank">Play on YouTube</a>
        </Grid>
      );
    }
  }
}

export default YoutubeLink;
