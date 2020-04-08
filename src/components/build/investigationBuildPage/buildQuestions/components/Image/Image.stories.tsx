import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Image from "./Image";

storiesOf("QuestionComponent", module)
.add("Image", () => <Image data="" index={1} updateComponent={()=>{}} locked={false}/>)
.add("ImageLocked", () => <Image data="" index={1} updateComponent={()=>{}} locked={true}/>);
