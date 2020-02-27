import { storiesOf } from '@storybook/react';
import * as React from 'react';
import Image from "./Image";

storiesOf("QuestionComponent", module)
.add("Image", () => <Image locked={false}/>)
.add("ImageLocked", () => <Image locked={true}/>);
