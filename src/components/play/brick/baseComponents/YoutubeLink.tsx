import React, { Component } from 'react';
import axios from 'axios';


interface YoutubeLinkProps {
  value: string;
}

interface YoutubeLinkState {
  data: string;
  isValid: boolean;
  checked: boolean;
}

class YoutubeLink extends Component<YoutubeLinkProps, YoutubeLinkState> {
  constructor(props: YoutubeLinkProps) {
    super(props);

    let htmlElement = document.createElement("div");
    htmlElement.innerHTML = this.props.value;
    let link = htmlElement.children[0].children[0].getAttribute("data-oembed-url");
    if (link) {
      let version = this.getParameterByName('v', link);
      let youtubeAPIKey ='AIzaSyCPL4JJKanDADC6NIFjAFYoyjqkZBYEG4o';
      axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${version}&key=${youtubeAPIKey}&part=snippet,contentDetails,status`).then(res => {
        link = link ? link : '';
        if (res.data.items[0]) {
          let item = res.data.items[0];
          if (item.status.embeddable) {
            this.setState({data: props.value, isValid: true, checked: true});
            return;
          }
        }
        this.setFailed(link);
      });
    }

    this.state = {
      data: props.value,
      isValid: false,
      checked: false
    }
  }

  setFailed(link: string) {
    this.setState({ data: link, isValid: false, checked: true });
  }

  getParameterByName(name: string, url: string) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  render() {
    if (this.state.checked) {
      if (this.state.isValid) {
        return <div dangerouslySetInnerHTML={{ __html: this.state.data}} />;
      }
      return <div className="youtube-link"><a href={this.state.data}>{this.state.data}</a></div>;
    }
    return <div></div>;
  }
}

export default YoutubeLink;
