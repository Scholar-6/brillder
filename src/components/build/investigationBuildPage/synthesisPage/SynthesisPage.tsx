import React from 'react'
import DocumentWirisCKEditor from 'components/baseComponents/ckeditor/DocumentWirisEditor';

import './SynthesisPage.scss';
import { Grid } from '@material-ui/core';
import CommentPanel from 'components/baseComponents/comments/CommentPanel';


export interface SynthesisProps {
  locked: boolean;
  editOnly: boolean;
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
          <Grid container direction="row" alignItems="stretch">
            <Grid item xs={8}>
              <DocumentWirisCKEditor
                disabled={this.props.locked}
                editOnly={this.props.editOnly}
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
            </Grid>
            <Grid item xs>
              <CommentPanel />
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default SynthesisPage
