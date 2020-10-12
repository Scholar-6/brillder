import React from "react";

interface ShortDescriptionProps {
  searchString: string;
  text: string;
}

const SearchText: React.FC<ShortDescriptionProps> = (props) => {
  const getMatches = (text: string, searchString: string) => {
    const matches:RegExpExecArray[] = [];
    const re = new RegExp(searchString, 'gi');
    let match = null;
    while ((match = re.exec(text)) != null) {
      matches.push(match);
    }
    return matches;
  }

  const prepareListOfTags = (text: string, matches: RegExpExecArray[]) => {
    const res = [];
    let start = 0;
    for (let match of matches) {
      let part = text.substr(start, match.index);
      res.push(<span>{part}</span>);
      res.push(<span className="search-highlight">{match[0]}</span>)
      start = match.index + match[0].length;
    }
    const lastPart = text.substr(start, text.length - 1);
    res.push(<span>{lastPart}</span>);
    return res;
  }

  if (props.searchString) {
    try {
      const matches = getMatches(props.text, props.searchString);
      const res = prepareListOfTags(props.text, matches);
      return <span>{res}</span>;
    } catch {
      console.log('propblem with highlighting search string');
    }
  }
  return <span>{props.text}</span>;
}

export default SearchText;
