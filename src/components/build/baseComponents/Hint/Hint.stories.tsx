import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Hint from "./Hint";

storiesOf("QuestionHintComponent", module)
  .add("HintWithoutValues", () => <Hint locked={false} list={[]} onChange={() => {}} />)
  .add("HintWithText", () => <Hint locked={false} list={[]} value="Some text" onChange={() => {}} />)
  .add("HintLocked", () => <Hint locked={true} list={[]} value="Some text" onChange={() => {}} />)
  .add("HintWithAllAnswers", () => <Hint locked={false} list={[]} status={1} onChange={() => {}} />);
