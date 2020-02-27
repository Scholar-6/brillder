import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Hint from "./Hint";

storiesOf("QuestionHintComponent", module)
  .add("HintWithoutValues", () => <Hint locked={false} onChange={() => {}} />)
  .add("HintWithText", () => <Hint locked={false} value="Some text" onChange={() => {}} />)
  .add("HintLocked", () => <Hint locked={true} value="Some text" onChange={() => {}} />)
  .add("HintWithAllAnswers", () => <Hint locked={false} status={1} onChange={() => {}} />);
