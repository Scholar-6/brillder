import React from "react";

export interface CommentChildProps {
  text: string;
}

const CommentText: React.FC<CommentChildProps> = (props) => {
  const [text, setText] = React.useState(props.text);
  const [htmlText, setHtmlText] = React.useState(urlify(props.text));

  function urlify(text: string) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
      return '<a href="' + url + '">' + url + '</a>';
    });
  }

  React.useEffect(() => {
    if (props.text != text) {
      setText(props.text);
      setHtmlText(urlify(props.text));
    }
  }, [props.text]);

  return (
    <span dangerouslySetInnerHTML={{__html: htmlText}} />
  );
};

export default CommentText;
