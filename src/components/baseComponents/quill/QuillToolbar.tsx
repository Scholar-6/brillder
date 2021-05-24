import React from 'react';
//import { Quill as GlobalQuill } from 'react-quill';
import QuillToolbarButton from './QuillToolbarButton';
import QuillToolbarColorSelect from './QuillToolbarColorSelect';
import QuillToolbarAlignSelect from './QuillToolbarAlignSelect';
import Quill, { RangeStatic } from 'quill';
import _ from 'lodash';
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
        if(props.quill.getFormat()[format] === (value ?? true) || value === "left") {
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
        bold: (props: any) => <QuillToolbarButton name="bold" {...props} />,
        italic: (props: any) => <QuillToolbarButton name="italic" {...props} />,
        strikethrough: (props: any) => <QuillToolbarButton name="strike" {...props} />,
        fontColor: (props: any) => <QuillToolbarColorSelect name="color" {...props}>
            <option value="#C43C30">Red</option>
            <option value="#0681DB">Blue</option>
            <option value="#30C474">Green</option>
            <option value="#FF9D00">Yellow</option>
            <option value="#6A2E15">Brown</option>
            <option value="#4523FF">Purple</option>
            <option value="#FC7502">Orange</option>
            <option value="#001C58">DarkBlue</option>
        </QuillToolbarColorSelect>,
        subscript: (props: any) => <QuillToolbarButton name="script" value="sub" {...props} />,
        superscript: (props: any) => <QuillToolbarButton name="script" value="super" {...props} />,
        align: (props: any) => <QuillToolbarAlignSelect name="align" {...props}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
            <option value="justify">Justify</option>
        </QuillToolbarAlignSelect>,
        blockQuote: (props: any) => <QuillToolbarButton name="blockquote" {...props} />,
        bulletedList: (props: any) => <QuillToolbarButton name="list" value="bullet" {...props} />,
        numberedList: (props: any) => <QuillToolbarButton name="list" value="ordered" {...props} />,
        latex: (props: any) => <QuillToolbarButton name="latex" {...props} />,
        image: (props: any) => <QuillToolbarButton name="image" icon="image" {...props} />,
        table: (props: any) => <QuillToolbarButton name="table" {...props} />,
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