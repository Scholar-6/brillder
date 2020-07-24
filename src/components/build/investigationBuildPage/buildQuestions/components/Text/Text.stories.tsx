import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Text from "./Text";

const data = {
  value: "<p>Story book Text component</p>"
}

storiesOf("QuestionComponent", module)
  .add("Text", () => <Text locked={false} editOnly={false} index={1} data={data} save={()=>{}} validationRequired={false} updateComponent={() => {}} />)
  .add("TextLocked", () => <Text locked={true} editOnly={false} index={1} data={data} save={()=>{}} validationRequired={false} updateComponent={() => {}} />);