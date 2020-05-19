import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Quote from "./Quote";

const data = {
  value: "<p>Story book Quote component</p>"
}

storiesOf("QuestionComponent", module)
  .add("Quote", () => <Quote locked={false} index={1} data={data} save={()=>{}} updateComponent={() => {}}/>);
