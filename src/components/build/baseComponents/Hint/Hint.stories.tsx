import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Hint from "./Hint";

storiesOf("QuestionHintComponent", module)
  .add("HintWithoutValues", () => <Hint onChange={() => {}} />)
  .add("HintWithText", () => <Hint value="Some text" onChange={() => {}} />)
  .add("HintWithAllAnswers", () => <Hint status={1} onChange={() => {}} />);
