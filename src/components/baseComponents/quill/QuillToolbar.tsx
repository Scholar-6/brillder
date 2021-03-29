import React from 'react';
import { Quill } from 'react-quill';
import QuillGlobalToolbarButton from './QuillGlobalToolbarButton';
import { RangeStatic } from 'quill';
import _ from 'lodash';
import QuillGlobalToolbarSelect from './QuillGlobalToolbarSelect';
import ImageUpload from './QuillImageUpload';

interface QuillToolbarProps {
    className?: string;
    quill: Quill | null;
    quillId?: string;
    toolbar: string[];
    enabled: string[];
}

const QuillToolbar: React.FC<QuillToolbarProps> = props => {
    const [id, setId] = React.useState<number>(0);
    const update = React.useCallback(() => setId(id => id + 1), [setId]);
    const toolbarNode = React.createRef<HTMLDivElement>();

    React.useEffect(() => {
        const onSelectChange = (range: RangeStatic) => {
            if(range) {
                update();
            }
        }
        props.quill?.on("selection-change", onSelectChange);
        return () => { props.quill?.off("selection-change", onSelectChange); }
    /*eslint-disable-next-line*/
    }, [props.quill]);


    const quillHandler = React.useCallback((format: string, value?: string) => {
        if(!props.quill) return;
        if(format === "image") {
            const imageUpload = props.quill.getModule("imageupload") as ImageUpload
            imageUpload.uploadHandler(toolbarNode.current);
            return true;
        }
        if(props.quill.getFormat()[format] === (value ?? true)) {
            props.quill.format(format, false, "user");
            return false;
        } else {
            props.quill.format(format, value ?? true, "user");
            return true;
        }
    }, [props.quill, toolbarNode]);

    /*eslint-disable-next-line*/
    const format = React.useMemo(() => props.quill?.getFormat(), [props.quill, id]);

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
        image: (props: any) => <QuillGlobalToolbarButton name="image" icon="image" {...props} />,
    }), []);

    return (
        <div className={`ql-custom-toolbar${props.quillId ? ` quill-${props.quillId}` : ""} ${props.className}`}>
            <div className="formats" ref={toolbarNode}>
                {props.toolbar.map((option, i) => {
                    const Item = toolbarItems[option]
                    return <Item
                        key={i}
                        handler={quillHandler}
                        format={format}
                        enabled={props.enabled.includes(option)}
                    />
                })}
            </div>
        </div>
    );
};

export default React.memo(QuillToolbar, _.isEqual);