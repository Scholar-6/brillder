import { RouteComponentProps } from 'react-router-dom';

import { Brick } from 'model/brick';


export interface ProFormaProps extends RouteComponentProps<any> {
  submitted: boolean,
  data: ProFormaSubmitData,
  bricks: Brick[],
  brick: Brick,
  submitProForm: Function,
  fetchBricks: Function,
  fetchBrick: Function,
}

export interface ProFormaState {
  id: number,
  subject: string,
  topic: string,
  subTopic: string,
  alternativeTopics: string,
  title: string,
  investigationBrief: string,
  preparationBrief: string,
  openQuestion: string,
  alternativeSubject: string,
}

export type ProFormaSubmitData = {
  subject: string,
  topic: string,
  subTopic: string,
  alternativeTopics: string,
  title: string,
  investigationBrief: string,
  preparationBrief: string,
  openQuestion: string,
  alternativeSubject: string,
}