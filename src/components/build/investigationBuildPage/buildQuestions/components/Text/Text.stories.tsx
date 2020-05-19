import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Text from "./Text";

const data = {
  value: "<p>Story book Text component</p>"
}

storiesOf("QuestionComponent", module)
  .add("Text", () => <Text locked={false} index={1} data={data} save={()=>{}} updateComponent={() => {}} />)
  .add("TextLocked", () => <Text locked={true} index={1} data={data} save={()=>{}} updateComponent={() => {}} />);