import React from 'react'
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';

import './SynthesisPage.scss';


export interface SynthesisProps {
  locked: boolean;
  synthesis: string;
  onSynthesisChange(text: string): void
}

interface SynthesisState {
  synthesis: string;
}

class SynthesisPage extends React.Component<SynthesisProps, SynthesisState> {
  constructor(props: SynthesisProps) {
    super(props);
    this.state = {
      synthesis: props.synthesis
    }
  }
  onSynthesisChange(text: string) {
    this.setState({synthesis: text});
    this.props.onSynthesisChange(text);
  }
  render() {
    return (
      <div className="question-type synthesis-page">
        <div className="inner-question-type">
          <DocumentWirisCKEditor
            disabled={this.props.locked}
            data={this.state.synthesis}
            placeholder=""
            toolbar={[
              'bold', 'italic', 'fontColor',
              'superscript', 'subscript', 'strikethrough',
              'mathType', 'chemType', 'insertTable', 'alignment',
              'bulletedList', 'numberedList', 'uploadImageCustom', 'addComment'
            ]}
            defaultAlignment="justify"
            onBlur={() => { }}
            onChange={(text) => this.onSynthesisChange(text)}
          />
        </div>
      </div>
    );
  }
}

export default SynthesisPage
