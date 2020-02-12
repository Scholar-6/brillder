import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Text from "./Text";

storiesOf("QuestionComponent", module)
  .add("Text", () => <Text/>);
