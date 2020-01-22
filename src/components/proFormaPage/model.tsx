import { RouteComponentProps } from 'react-router-dom';

export interface ProFormaProps extends RouteComponentProps<any> {
  data: ProFormaSubmitData,
  fetchProForm: Function,
  submitProForm: Function,
}
  
export type ProFormaState = {
  subject: string,
  topic: string,
  subTopic: string,
  alternativeTopics: string,
  proposedTitle: string,
  investigationBrief: string,
  preparationBrief: string,
}

export type ProFormaSubmitData = {
  subject: string,
  topic: string,
  subTopic: string,
  alternativeTopics: string,
  proposedTitle: string,
  investigationBrief: string,
  preparationBrief: string,
}