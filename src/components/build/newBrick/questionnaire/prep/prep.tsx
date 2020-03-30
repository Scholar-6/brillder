import React from "react";
import { Grid } from "@material-ui/core";
// @ts-ignore 
import CKEditor from '@ckeditor/ckeditor5-react';
// @ts-ignore 
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import ExitButton from '../../components/ExitButton';
import NextButton from '../../components/nextButton';
import PreviousButton from '../../components/previousButton';
import { NewBrickStep } from "../../model";
import './prep.scss';
import PhonePreview from "components/build/baseComponents/phonePreview/PhonePreview";

interface PrepProps {
  parentPrep: string;
  savePrep(prep: string):void;
}

const PrepPreviewComponent:React.FC<any> = ({data}) => {
  if (data) {
    return (
      <Grid container justify="center" alignContent="flex-start" className="prep-phone-preview">
        <img className="first-phone-image"
          alt="head"
          style={{height: '40%'}}
          src="/images/new-brick/prep.png">
        </img>
        <div className="typing-text" dangerouslySetInnerHTML={{ __html: data}}>
        </div>
      </Grid>
    )
  }
  return (
    <Grid container justify="center" alignContent="flex-start" className="prep-phone-preview">
      <img className="first-phone-image"
        alt="head"
        style={{height: '60%'}}
        src="/images/new-brick/prep.png">
      </img>
    </Grid>
  )
}

const PrepComponent: React.FC<PrepProps> = ({ parentPrep, savePrep }) => {
  let [prep, setPrep] = React.useState(parentPrep);

  console.log(prep);
 // prep = '<oembed url="http://front.scholar6.org/build/"><html>&lt;b&gt;awesome!&lt;/b&gt;</html></oembed>'
  
  return (
    <div className="tutorial-page prep-page">
      <ExitButton />
      <Grid container direction="row" style={{ height: '100%' }} alignItems="center">
        <Grid container justify="center" item xs={12} md={8} lg={8}>
          <Grid justify="center" container item xs={12} sm={9} md={8} lg={7}>
            <div className="left-card">
              <h1 className="only-tutorial-header">
                <p>Create an engaging and relevant</p>
                <p>preparatory task for your investigation.</p>
              </h1>
              <Grid justify="center" container item xs={12}>
                <div style={{ width: '84%' }}>
                  <CKEditor
                    editor={ClassicEditor}
                    data={prep}
                    config={{
                      toolbar: ['bold', 'link', 'mediaEmbed'],
                      mediaEmbed: { previewsInData: true }
                    }}
                    onChange={(e: any, editor: any) => {
                      let value = editor.getData();
                      setPrep(value)
                    }}
                  />
                </div>
              </Grid>
              <PreviousButton to="/build/new-brick/brief" />
              <p className="page-number">4 of 4</p>
              <NextButton step={NewBrickStep.Prep} canSubmit={true} data={prep} onSubmit={savePrep} />
            </div>
          </Grid>
        </Grid>
        <PhonePreview Component={PrepPreviewComponent} data={prep} />
      </Grid>
    </div>
  );
}

export default PrepComponent
