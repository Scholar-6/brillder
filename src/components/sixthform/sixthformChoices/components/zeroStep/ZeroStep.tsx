import React, { Component } from "react";

import WelcomePage from "./welcomePage/WelcomePage";
import Step1Name from "./Step1Name";
import Step1Email from "./Step1Email";
import ZeroWelcome from "./ZeroWelcome";


enum SubStep {
  Welcome = 1,
  Start,
  Name,
  Email
}

interface SecondQuestionProps {
  answer: any;
  saveAnswer(answer: any): void;
  moveNext(answer: any): void;
}

interface SecondQuestionState {
  subStep: SubStep;
  email: string;
  firstName: string;
  lastName: string;
  nameCorrected: boolean;
  emailCorrected: boolean;
  popup: boolean;
}

class ZeroStep extends Component<SecondQuestionProps, SecondQuestionState> {
  constructor(props: SecondQuestionProps) {
    super(props);

    let subStep = SubStep.Welcome;


    let firstName = '';
    let lastName = '';
    let nameCorrected = false;
    let email = '';
    let emailCorrected = false;

    if (props.answer && props.answer.answer) {
      const { answer } = props.answer;

      if (answer.firstName) {
        firstName = answer.firstName;
      }
      if (answer.lastName) {
        lastName = answer.lastName;
      }
      if (answer.nameCorrected) {
        nameCorrected = answer.nameCorrected;
      }

      if (answer.email) {
        email = answer.email;
      }
      if (answer.emailCorrected) {
        emailCorrected = answer.emailCorrected;
      }

      if (answer.subStep) {
        subStep = answer.subStep;
      }
    }


    this.state = {
      subStep,
      email,
      firstName,
      lastName,
      nameCorrected,
      emailCorrected,
      popup: false
    }
  }


  getAnswer() {
    return {
      email: this.state.email,
      emailCorrected: this.state.emailCorrected,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      nameCorrected: this.state.nameCorrected,
      subStep: this.state.subStep,
    }
  }

  moveNext() {
    this.props.moveNext(this.getAnswer());
  }

  render() {
    if (this.state.subStep === SubStep.Email) {
      const saveEmailAnswer = (email: string, emailCorrected: boolean) => {
        this.setState({ email, emailCorrected });
        const answer = this.getAnswer();
        answer.email = email;
        answer.emailCorrected = emailCorrected;
        this.props.saveAnswer(answer);
      }
      return <Step1Email
        email={this.state.email}
        emailCorrected={this.state.emailCorrected}
        moveNext={(email, emailCorrected) => {
          this.setState({ email, emailCorrected });
          const answer = this.getAnswer();
          answer.email = email;
          answer.emailCorrected = emailCorrected;
          this.props.moveNext(answer);
        }}
        moveBack={(email, emailCorrected) => {
          this.setState({ subStep: SubStep.Name });
          saveEmailAnswer(email, emailCorrected);
        }}
      />
    } else if (this.state.subStep === SubStep.Name) {
      const saveNameAnswer = (firstName: string, lastName: string, nameCorrected: boolean) => {
        this.setState({ firstName, lastName, nameCorrected });
        const answer = this.getAnswer();
        answer.firstName = firstName;
        answer.lastName = lastName;
        answer.nameCorrected = nameCorrected;
        this.props.saveAnswer(answer);
      }
      return <Step1Name
        firstName={this.state.firstName}
        lastName={this.state.lastName}
        nameCorrected={this.state.nameCorrected}
        moveNext={(firstName, lastName, nameCorrected) => {
          this.setState({ subStep: SubStep.Email });
          saveNameAnswer(firstName, lastName, nameCorrected);
        }}
        moveBack={(firstName, lastName, nameCorrected) => {
          this.setState({ subStep: SubStep.Start });
          saveNameAnswer(firstName, lastName, nameCorrected);
        }}
      />
    } else if (this.state.subStep === SubStep.Start) {
      return <ZeroWelcome
        moveNext={() => this.setState({ subStep: SubStep.Name })}
        moveBack={() => this.setState({ subStep: SubStep.Welcome })}
      />
    }

    return <WelcomePage moveNext={() => this.setState({ subStep: SubStep.Start })} />;
  }
}

export default ZeroStep;
