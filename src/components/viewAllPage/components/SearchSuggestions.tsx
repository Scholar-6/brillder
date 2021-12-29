import React from 'react';

import { stripHtml } from 'components/build/questionService/ConvertService';
import { Author, Brick, KeyWord, Subject } from 'model/brick';
import { fileUrl } from 'components/services/uploadFile';
import routes from 'components/play/routes';

import SpriteIcon from 'components/baseComponents/SpriteIcon';


interface ResultObj {
  isTitleRes?: boolean;
  isAuthorRes?: boolean;
  isSubjectRes?: boolean;
  isKeyRes?: boolean;
  brick?: Brick;
  subject?: Subject;
  author?: Author;
  keyword?: KeyWord;
}

interface SearchSuggestionsProps {
  history: any;
  searchString: string;
  bricks: Brick[];
  keywords: KeyWord[];
  subjects: Subject[];

  filterByAuthor(a: Author): void;
  filterBySubject(s: Subject): void;
  filterByKeyword(k: KeyWord): void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = (props) => {
  let res: ResultObj[] = [];
  var searchString = props.searchString.toLocaleLowerCase();

  const getTitlesResult = () => {
    const titleRes = props.bricks.filter(b => stripHtml(b.title).toLowerCase().indexOf(searchString) >= 0);

    for (let brick of titleRes) {
      res.push({
        isTitleRes: true,
        brick: brick
      });
    }
  }

  const getAuthorResult = () => {
    const authorFirstNameRes = props.bricks.filter(b => stripHtml(b.author.firstName).toLowerCase().indexOf(searchString) >= 0);
    const authorLastNameRes = props.bricks.filter(b => stripHtml(b.author.lastName).toLowerCase().indexOf(searchString) >= 0);

    var resR: ResultObj[] = [];
    var united = [...authorFirstNameRes, ...authorLastNameRes];

    for (let el of united) {
      let found = resR.find(a => a.author && a.author.id == el.author.id);
      if (!found) {
        resR.push({ isAuthorRes: true, author: el.author });
      }
    }

    res = [...res, ...resR];
  }

  const getKeyResult = () => {
    const keysRes = props.keywords.filter(k => {
      return k.name.toLocaleLowerCase().indexOf(searchString) >= 0;
    });

    console.log(keysRes);

    for (let keyword of keysRes) {
      res.push({
        isKeyRes: true,
        keyword
      });
    }
  }

  const getSubjectResult = () => {
    const subjectsRes = props.subjects.filter(s => s.name.toLocaleLowerCase().indexOf(searchString) >= 0);


    for (let subject of subjectsRes) {
      res.push({
        isSubjectRes: true,
        subject
      });
    }
  }

  getTitlesResult();

  if (res.length < 10) {
    getAuthorResult();
    if (res.length < 10) {
      getKeyResult();
      if (res.length < 10) {
        getSubjectResult();
      }
    }
  }

  const suggestions = res.splice(0, 10);

  const renderAutorAvatar = (authorR: Author) => {
    if (authorR.profileImage) {
      return <img className="author-image" alt="b-imge" src={fileUrl(authorR.profileImage)} />
    }
    return <SpriteIcon name="user" />
  }

  const renderSubjectCircle = (subjectR: Subject) => {
    if (subjectR) {
      return <div className="circle" style={{ background: subjectR.color }} />
    }
    return '';
  }

  if (suggestions.length === 0) {
    return (
      <div className="search-suggestions">
        <div className="upper-line" />
        <div>Sorry, we couldn't find anything this time.</div>
      </div>
    );
  }

  const renderItem = (suggestion: ResultObj) => {
    const { brick, subject, author, keyword } = suggestion;
    if (suggestion.isTitleRes && brick) {
      return (
        <div onClick={() => props.history.push(routes.playCover(brick))}>
          <SpriteIcon name="logo" />
          {stripHtml(brick.title)}
          <SpriteIcon className="icon-status" name={brick.isCore ? "globe" : "key"} />
        </div>
      );
    } else if (suggestion.isSubjectRes && subject) {
      return (
        <div onClick={() => props.filterBySubject(subject)}>
          {renderSubjectCircle(subject)}
          {subject.name}
        </div>
      );
    } else if (suggestion.isAuthorRes && author) {
      return (
        <div onClick={() => props.filterByAuthor(author)}>
          {renderAutorAvatar(author)}
          {author.firstName} {author.lastName}
        </div>
      );
    } else if (suggestion.isKeyRes && keyword) {
      return (
        <div onClick={() => props.filterByKeyword(keyword)}>
          <SpriteIcon name="hash" className="keyword-icon" />
          {stripHtml(keyword.name)}
        </div>
      );
    }
  }

  return (
    <div className="search-suggestions">
      <div className="upper-line" />
      {suggestions.map(renderItem)}
    </div>
  );
}

export default SearchSuggestions;
