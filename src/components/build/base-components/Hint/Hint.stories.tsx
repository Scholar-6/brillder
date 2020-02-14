import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Hint from "./Hint";

storiesOf("QuestionHintComponent", module)
  .add("HintWithoutValues", () => <Hint allAnswers={false} eachAnswer={false} hint="" onChange={() => {}} />)
  .add("HintWithText", () => <Hint allAnswers={false} eachAnswer={false} hint="Some text" onChange={() => {}} />)
  .add("HintWithAllAnswers", () => <Hint allAnswers={true} eachAnswer={false} hint="" onChange={() => {}} />);
