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


interface PrepProps {
  parentPrep: string;
  savePrep(prep: string):void;
}

const PrepComponent: React.FC<PrepProps> = ({ parentPrep, savePrep }) => {
  const [prep, setPrep] = React.useState(parentPrep);

  return (
    <div className="tutorial-page prep-page">
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={8} lg={8}>
          <Grid justify="center" container item xs={12} sm={9} md={10} lg={7}>
            <div className="left-card">
              <h1 className="only-tutorial-header">
                <p>Create an engaging and relevant preparatory task for your investigation.</p>
              </h1>
              <Grid justify="center" container item xs={12}>
                <div style={{ width: '90%' }}>
                  <CKEditor
                    editor={ClassicEditor}
                    data={prep}
                    config={{ toolbar: ['bold', 'link'] }}
                    onChange={(e: any, editor: any) => {
                      let value = editor.getData();
                      setPrep(value)
                    }}
                  />
                </div>
              </Grid>
              <PreviousButton to="/build/new-brick/brief" />
              <p className="page-number">4 of 6</p>
              <NextButton step={NewBrickStep.Prep} canSubmit={true} data={prep} onSubmit={savePrep} />
            </div>
          </Grid>
        </Grid>
        <PhonePreview link={window.location.origin + '/logo-page'} />
      </Grid>
    </div>
  );
}

export default PrepComponent
