import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Hint from "./Hint";

storiesOf("QuestionHintComponent", module)
  .add("HintWithoutValues", () => <Hint index={1} locked={false} editOnly={false} list={[]} save={() => {}} onChange={() => {}} />)
  .add("HintWithText", () => <Hint index={1} locked={false} editOnly={false} list={[]} value="Some text" save={() => {}} onChange={() => {}} />)
  .add("HintLocked", () => <Hint index={1} locked={true} editOnly={false} list={[]} value="Some text" save={() => {}} onChange={() => {}} />)
  .add("HintWithAllAnswers", () => <Hint index={1} locked={false} editOnly={false} list={[]} status={1} save={() => {}} onChange={() => {}} />);
