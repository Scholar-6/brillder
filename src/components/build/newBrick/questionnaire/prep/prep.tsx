/*eslint no-useless-escape: "off"*/
import React from "react";
import { Grid } from "@material-ui/core";
// @ts-ignore 
import CKEditor from '@ckeditor/ckeditor5-react';
// @ts-ignore 
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import NextButton from '../../components/nextButton';
import PreviousButton from '../../components/previousButton';
import { NewBrickStep } from "../../model";
import './prep.scss';
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";

function PrepComponent({ parentState, setPrep }: any) {
  const [prepState, setPrepState] = React.useState('');

  return (
    <div className="tutorial-page prep-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={8} lg={8}>
          <Grid justify="center" container item xs={12} sm={9} md={10} lg={7}>
            <div className="left-card">
              <h1 className="only-tutorial-header">
                <p>Prep</p>
              </h1>
              <CKEditor
                editor={ClassicEditor}
                data={prepState}
                config={{ toolbar: ['bold', 'link'] }}
                onChange={(e: any, editor: any) => {
                  let value = editor.getData();
                  setPrepState(value)
                }}
              />
              <PreviousButton to="/build/new-brick/brief" />
              <NextButton step={NewBrickStep.Prep} canSubmit={true} data={prepState} />
            </div>
          </Grid>
        </Grid>
        <PhonePreview link={window.location.origin + '/logo-page'} />
      </Grid>
    </div>
  );
}

export default PrepComponent
