import React, { useEffect } from 'react';

import { stripHtml } from 'components/build/questionService/ConvertService';
import { Author, Brick, KeyWord, Subject } from 'model/brick';
import { fileUrl } from 'components/services/uploadFile';
import routes from 'components/play/routes';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { ReduxCombinedState } from 'redux/reducers';
import { connect } from 'react-redux';
import { User } from 'model/user';
import { checkAdmin } from 'components/services/brickService';
import { getSuggestedKeywords } from 'services/axios/brick';


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
  subjects: Subject[];

  user: User;

  filterByAuthor(a: Author): void;
  filterBySubject(s: Subject): void;
  filterByKeyword(k: KeyWord): void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = (props) => {
  const [suggestions, setSuggestions] = React.useState([] as any[]);
  var searchString = props.searchString.toLocaleLowerCase();
  
  const search = async () => {
    let res: ResultObj[] = [];

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
        /*eslint-disable-next-line*/
        let found = resR.find(a => a.author && a.author.id == el.author.id);
        if (!found) {
          resR.push({ isAuthorRes: true, author: el.author });
        }
      }
  
      res = [...res, ...resR];
    }

    const getKeyResult = async () => {
      const keysRes = await getSuggestedKeywords(searchString);
  
      if (keysRes) {
        for (let keyword of keysRes) {
          res.push({
            isKeyRes: true,
            keyword
          });
        }
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
        await getKeyResult();
        if (res.length < 10) {
          getSubjectResult();
        }
      }
    }

    setSuggestions(res.splice(0, 10));
  }

  useEffect(() => {
    search()
  }, [searchString]);

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

    const renderId = () => {
      if (brick && props.user && checkAdmin(props.user.roles)) {
        return <span className="light">{brick.id}</span>;
      }
    }

    if (suggestion.isTitleRes && brick) {
      return (
        <div onClick={() => props.history.push(routes.playCover(brick))}>
          <SpriteIcon name="logo" />
          {stripHtml(brick.title)}
          <SpriteIcon className="icon-status" name={brick.isCore ? "globe" : "key"} />
          {renderId()}
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


const mapState = (state: ReduxCombinedState) => ({
  user: state.user.user
});

const connector = connect(mapState);

export default connector(SearchSuggestions);
