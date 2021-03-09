import React from 'react';
import { ReactComponent as LatexIcon } from "assets/img/latex.svg";
import { Quill } from 'react-quill';
import QuillGlobalToolbarButton from './QuillGlobalToolbarButton';
import { QuillEditorContext } from './QuillEditorContext';
import { RangeStatic } from 'quill';
import _ from 'lodash';
import QuillGlobalToolbarSelect from './QuillGlobalToolbarSelect';
import ImageUpload from './QuillImageUpload';

const getReactPropsByNode = (node: any) => {
    for(const key in node) {
        if(key.startsWith("__reactInternalInstance$")) {
            return node[key]._debugOwner.memoizedProps;
        }
    }
    return null;
}

interface QuillGlobalToolbarProps {
    availableOptions: string[];
    // enabledOptions: string[];
}

const QuillGlobalToolbar: React.FC<QuillGlobalToolbarProps> = props => {
    const [id, setId] = React.useState<number>(0);
    const update = React.useCallback(() => setId(id => id + 1), [setId]);
    const [currentQuillId] = React.useContext(QuillEditorContext);
    const toolbarNode = React.createRef<HTMLDivElement>();

    const [quill, toolbar] = React.useMemo((): [Quill | null, string[]] => {
        const elements = document.getElementsByClassName("quill-id-" + currentQuillId);
        if(!(elements && elements.length > 0)) return [null, []];
        const element = elements[0];
        const editorElement = element.getElementsByClassName("quill")[0].getElementsByClassName("ql-container")[0];
        const newQuill = Quill.find(editorElement) as Quill;
        const reactProps = getReactPropsByNode(element);
        const toolbar = reactProps.toolbar;

        return [newQuill, toolbar];
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
        if(format === "image") {
            const imageUpload = quill.getModule("imageupload") as ImageUpload
            console.log(toolbarNode.current)
            imageUpload.uploadHandler(toolbarNode.current);
            return true;
        }
        if(quill.getFormat()[format] === (value ?? true)) {
            quill.format(format, false);
            return false;
        } else {
            quill.format(format, value ?? true);
            return true;
        }
    }, [quill, toolbarNode]);

    const format = React.useMemo(() => quill?.getFormat(), [quill, id]);

    const toolbarItems: { [key: string]: any } = React.useMemo(() => ({
        bold: (props: any) => <QuillGlobalToolbarButton name="bold" {...props} />,
        italic: (props: any) => <QuillGlobalToolbarButton name="italic" {...props} />,
        strikethrough: (props: any) => <QuillGlobalToolbarButton name="strike" {...props} />,
        fontColor: (props: any) => <QuillGlobalToolbarSelect name="color" {...props}>
          <option value="#C43C30">Red</option>
          <option value="#0681DB">Blue</option>
          <option value="#30C474">Green</option>
          <option value="#FF9D00">Yellow</option>
          <option value="#6A2E15">Brown</option>
          <option value="#4523FF">Purple</option>
          <option value="#FC7502">Orange</option>
        </QuillGlobalToolbarSelect>,
        subscript: (props: any) => <QuillGlobalToolbarButton name="script" value="sub" {...props} />,
        superscript: (props: any) => <QuillGlobalToolbarButton name="script" value="super" {...props} />,
        align: <select className="ql-align" />,
        blockQuote: (props: any) => <QuillGlobalToolbarButton name="blockquote" {...props} />,
        bulletedList: (props: any) => <QuillGlobalToolbarButton name="list" value="bullet" {...props} />,
        numberedList: (props: any) => <QuillGlobalToolbarButton name="list" value="ordered" {...props} />,
        latex: (props: any) => <QuillGlobalToolbarButton name="latex" {...props} />,
        image: (props: any) => <QuillGlobalToolbarButton name="image" {...props} />,
    }), []);

    return (
        <div className="ql-global-toolbar">
            <div className="ql-formats" ref={toolbarNode}>
                {props.availableOptions.map(option => {
                    const Item = toolbarItems[option]
                    return <Item
                        handler={quillHandler}
                        format={format}
                        enabled={toolbar.includes(option)}
                    />
                })}
            </div>
        </div>
    );
};

export default React.memo(QuillGlobalToolbar, _.isEqual);