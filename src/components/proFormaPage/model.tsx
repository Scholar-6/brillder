import { RouteComponentProps } from 'react-router-dom';

export interface ProFormaProps extends RouteComponentProps<any> {
  submitted: boolean,
  data: ProFormaSubmitData,
  bricks: Brick[],
  fetchProForm: Function,
  submitProForm: Function,
  fetchBricks: Function,
}

export type Brick = {
  id: number,
  subject: string,
  topic: string,
  subTopic: string,
  alternativeTopics: string,
  title: string,
  investigationBrief: string,
  preparationBrief: string,
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
}

export type ProFormaSubmitData = {
  subject: string,
  topic: string,
  subTopic: string,
  alternativeTopics: string,
  title: string,
  investigationBrief: string,
  preparationBrief: string,
}