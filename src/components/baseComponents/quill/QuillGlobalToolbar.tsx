import React from 'react';
import { ReactComponent as LatexIcon } from "assets/img/latex.svg";
import { Quill } from 'react-quill';
import QuillGlobalToolbarButton from './QuillGlobalToolbarButton';
import { QuillEditorContext } from './QuillEditorContext';
import { RangeStatic } from 'quill';
import _ from 'lodash';

interface QuillGlobalToolbarProps {
    availableOptions: string[];
    // enabledOptions: string[];
}

const QuillGlobalToolbar: React.FC<QuillGlobalToolbarProps> = props => {
    const [id, setId] = React.useState<number>(0);
    const update = React.useCallback(() => setId(id => id + 1), [setId]);
    const [currentQuillId] = React.useContext(QuillEditorContext);

    const quill = React.useMemo(() => {
        const elements = document.getElementsByClassName("quill-id-" + currentQuillId);
        if(!(elements && elements.length > 0)) return;
        const element = elements[0];
        const editorElement = element.getElementsByClassName("quill")[0].getElementsByClassName("ql-container")[0];
        const newQuill = Quill.find(editorElement) as Quill;

        return newQuill;
    }, [currentQuillId]);

    React.useEffect(() => {
        const onSelectChange = (range: RangeStatic) => {
            if(range) {
                update();
            }
        }
        quill?.on("selection-change", onSelectChange);
        return () => { quill?.off("selection-change", onSelectChange); }
    }, [quill]);


    const quillHandler = React.useCallback((format: string, value?: string) => {
        if(!quill) return;
        if(quill.getFormat()[format] === (value ?? true)) {
            quill.format(format, false);
            return false;
        } else {
            quill.format(format, value ?? true);
            return true;
        }
    }, [quill]);

    const format = React.useMemo(() => quill?.getFormat(), [quill, id]);

    const toolbarItems: { [key: string]: any } = React.useMemo(() => ({
        bold: <QuillGlobalToolbarButton name="bold" handler={quillHandler} format={format} />,
        italic: <QuillGlobalToolbarButton name="italic" handler={quillHandler} format={format} />,
        strikethrough: <button className="ql-strike" />,
        fontColor: <select className="ql-color">
          <option value="#C43C30">Red</option>
          <option value="#0681DB">Blue</option>
          <option value="#30C474">Green</option>
          <option value="#FF9D00">Yellow</option>
          <option value="#6A2E15">Brown</option>
          <option value="#4523FF">Purple</option>
          <option value="#FC7502">Orange</option>
        </select>,
        subscript: <button className="ql-script" value="sub" />,
        superscript: <button className="ql-script" value="super" />,
        align: <select className="ql-align" />,
        blockQuote: <button className="ql-blockquote" />,
        bulletedList: <QuillGlobalToolbarButton name="list" value="bullet" handler={quillHandler} format={format} />,
        numberedList: <button className="ql-list" value="ordered" />,
        latex: (<button className="ql-latex">
            <LatexIcon />
        </button>),
        image: <button className="ql-image" />,
    }), [quillHandler, format]);

    return (
        <div className="ql-global-toolbar">
            <div className="ql-formats">
                {props.availableOptions.map(option => toolbarItems[option])}
            </div>
        </div>
    );
};

export default React.memo(QuillGlobalToolbar, _.isEqual);