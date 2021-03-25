import React, { useEffect } from 'react';
import * as Y from "yjs";

import '../style.scss';
import './LineHighlightingBuild.scss'
import { UniqueComponentProps } from '../../types';

import PageLoader from 'components/baseComponents/loaders/pageLoader';
import { HighlightMode } from '../model';
import HighlightButton from '../components/HighlightButton';
import QuillEditor from 'components/baseComponents/quill/QuillEditor';


export interface Line {
  text: string;
  checked: boolean;
}

export interface LineHighlightingData {
  text: string;
  lines: Line[];
}

export interface LineHighlightingProps extends UniqueComponentProps {
  data: Y.Map<any>;
}

export const getDefaultLineHighlightingAnswer = (ymap: Y.Map<any>) => {
  ymap.set("text", new Y.Text());
  ymap.set("mode", HighlightMode.Input);
  ymap.set("lines", new Y.Array());
}

const LineHighlightingComponent: React.FC<LineHighlightingProps> = ({
  locked, data, validationRequired
}) => {
  useEffect(() => {
    if (!data.get("text")) { data.set("text", new Y.Text()); }
    if (!data.get("lines")) { data.set("lines", new Y.Array()); }
  }, [data]);

  const prepareLines = (text: string) => {
    if (!text) { return []; }

    let lines = text.split('\n');
    data.set("lines", new Y.Array());
    data.get("lines").push(lines.map(line => new Y.Map(Object.entries({ text: line, checked: false }))));
  }

  const switchMode = () => {
    if (locked) { return; }
    if (data.get("mode") === HighlightMode.Edit) {
      data.set("mode", HighlightMode.Input);
    } else {
      data.set("mode", HighlightMode.Edit);
      prepareLines(data.get("text").toString());
    }
  }

  const toggleLight = (index:number) => {
    if (locked) { return; }
    const line = data.get("lines").get(index);
    if(line) {
      line.set("checked", !line.get("checked"));
    }
  }

  const renderBox = () => {
    if (data.get("mode") === HighlightMode.Edit) {
      if (data.get("lines").length <= 0) {
        switchMode();
        return <PageLoader content="...Switching mode..." />;
      }
      return (
        <div className="hightlight-area">
          {
            data.get("lines").map((line: Y.Map<any>, i: number) =>
              <div key={i} className={line.get("checked") ? "line active" : "line"} onClick={() => {toggleLight(i)}}>
                {line.get("text").toString()}
              </div>
            )
          }
        </div>
      );
    }
    let className = "lines-input";
    if (validationRequired && !data.get("text").toString()) {
      className += " content-invalid"
    }
    return (
      <QuillEditor
        toolbar={[]}
        disabled={locked}
        className={className}
        sharedData={data.get("text")}
        placeholder="Enter Text Here..."
      />
    );
  }

  return (
    <div className="line-highlight-build">
      <div className="component-title">
        <div>Click the highlighter to select correct lines</div>
      </div>
      <HighlightButton
        mode={data.get("mode")}
        validationRequired={validationRequired}
        text={data.get("text").toString()}
        list={data.get("lines").toJSON()}
        switchMode={switchMode}
      />
      <div className="input-container">
        {renderBox()}
      </div>
    </div>
  )
}

export default React.memo(LineHighlightingComponent);
