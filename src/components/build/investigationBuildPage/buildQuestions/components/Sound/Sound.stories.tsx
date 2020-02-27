import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Sound from "./Sound";

storiesOf("QuestionComponent", module)
  .add("Sound", () => <Sound locked={false}/>);
