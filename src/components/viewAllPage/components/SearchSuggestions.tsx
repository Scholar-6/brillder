import React from 'react';

import { stripHtml } from 'components/build/questionService/ConvertService';
import { Brick } from 'model/brick';
import { fileUrl } from 'components/services/uploadFile';
import routes from 'components/play/routes';

import SpriteIcon from 'components/baseComponents/SpriteIcon';


interface ResultObj {
  isTitleRes?: boolean;
  isAuthorRes?: boolean;
  isSubjectRes?: boolean;
  isKeyRes?: boolean;
  brick: Brick;
}

interface SearchSuggestionsProps {
  history: any;
  searchString: string;
  bricks: Brick[];
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = (props) => {
  const res:ResultObj[] = [];
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

    for (let brick of authorFirstNameRes) {
      res.push({
        isAuthorRes: true,
        brick: brick
      });
    }

    for (let brick of authorLastNameRes) {
      res.push({
        isAuthorRes: true,
        brick: brick
      });
    }
  }

  const getKeyResult = () => {
    const keysRes = props.bricks.filter(b => {
      if (b.keywords) {
        return !!b.keywords.find(k => k.name.toLocaleLowerCase().indexOf(searchString) >= 0)
      }
      return false;
    });

    for (let brick of keysRes) {
      res.push({
        isKeyRes: true,
        brick: brick
      });
    }
  }

  const getSubjectResult = () => {
    const subjectsRes = props.bricks.filter(b => {
      if (b.subject) {
        return b.subject.name.toLocaleLowerCase().indexOf(searchString) >= 0;
      }
      return false;
    });

    for (let brick of subjectsRes) {
      res.push({
        isSubjectRes: true,
        brick: brick
      });
    }
  }

  getTitlesResult();

  if (res.length < 10) {
    getAuthorResult();
    if (res.length < 10) {
      getSubjectResult();
    }
  }

  const suggestions = res.splice(0, 10);

  const renderAutorAvatar = (loopBrick: Brick) => {
    if (loopBrick.author.profileImage) {
      return <img className="author-image" alt="b-imge" src={fileUrl(loopBrick.author.profileImage)} />
    }
    return <SpriteIcon name="user" />
  }

  const renderSubjectCircle = (loopBrick: Brick) => {
    if (loopBrick.subject) {
      return <div className="circle" style={{background: loopBrick.subject.color}} />
    }
    return '';
  }

  if (suggestions.length === 0) {
    return (
    <div className="search-suggestions">
      <div className="upper-line" />
      <div>no options</div>
    </div>
    );
  }

  return (
    <div className="search-suggestions">
      <div className="upper-line" />
      {suggestions.map(suggestion => <div onClick={() => props.history.push(routes.playCover(suggestion.brick))}>
        {suggestion.isTitleRes ? <SpriteIcon name="logo" /> : suggestion.isAuthorRes ? renderAutorAvatar(suggestion.brick) : suggestion.isKeyRes ? <SpriteIcon name='hash' /> : suggestion.isSubjectRes ? renderSubjectCircle(suggestion.brick) : ''}
          {stripHtml(suggestion.brick.title)}
        </div>
      )}
    </div>
  );
}

export default SearchSuggestions;
