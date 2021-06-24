import React from 'react';
//import { Quill as GlobalQuill } from 'react-quill';
import QuillToolbarButton from './QuillToolbarButton';
import QuillToolbarColorSelect from './QuillToolbarColorSelect';
import QuillToolbarAlignSelect from './QuillToolbarAlignSelect';
import Quill, { RangeStatic } from 'quill';
import _ from 'lodash';
import ImageUpload from './QuillImageUpload';
import DesmosModule from './QuillDesmos';
import { QuillValidColors } from './QuillEditor';
import QuillCapitalization from './QuillCapitalization';
import LineStyleDialog from 'components/build/buildQuestions/questionTypes/highlighting/wordHighlighting/LineStyleDialog';

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

    const [lineStyleDialogOpen, setLineStyleDialogOpen] = React.useState(false);

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
        if(format === "desmos") {
            const desmos = props.quill.getModule("desmos") as DesmosModule;
            desmos.newGraphHandler();
            return true;
        }
        if(format === "table") {
            const betterTable = props.quill.getModule("better-table");
            betterTable.insertTable(2, 2);
            console.log(props.quill.getContents());
            return true;
        }
        if(format === "caps") {
            const capitalization = props.quill.getModule("capitalization") as QuillCapitalization;
            capitalization.format(value);
            return true;
        }
        if(props.quill.getFormat()[format] === (value ?? true) || value === "left") {
            props.quill.format(format, false, "user");
            return false;
        } else {
            if(format === "blockquote") {
                if(props.quill.getFormat()[format]) {
                    props.quill.format(format, false, "user");
                } else {
                    setLineStyleDialogOpen(true);
                }
            } else {
                props.quill.format(format, value ?? true, "user");
            }
            return true;
        }
    }, [props.quill, toolbarNode]);

    const blockQuoteFormat = React.useCallback((noBreakLines: boolean) => {
        if(!props.quill) return;

        props.quill.format("blockquote", { noBreakLines }, "user");
        setLineStyleDialogOpen(false);
    }, [props.quill, setLineStyleDialogOpen]);

    const format = React.useMemo(() => {
        const selection = props.quill?.getSelection(false);
        console.log(selection);
        if(selection) {
            return props.quill?.getFormat(selection ?? undefined);
        } else {
            return null;
        }
    //eslint-disable-next-line
    }, [props.quill, id]);

    const toolbarItems: { [key: string]: any } = React.useMemo(() => ({
        bold: (props: any) => <QuillToolbarButton name="bold" {...props} />,
        italic: (props: any) => <QuillToolbarButton name="italic" {...props} />,
        strikethrough: (props: any) => <QuillToolbarButton name="strike" {...props} />,
        fontColor: (props: any) => <QuillToolbarColorSelect name="color" {...props}>
            {Object.entries(QuillValidColors).map(([k, v]) => <option key={k} value={v}>{k}</option>)}
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
        desmos: (props: any) => <QuillToolbarButton name="desmos" {...props} />,
        caps: (props: any) => <QuillToolbarAlignSelect name="caps" {...props} format={{ caps: "title" }}>
            <option value="upper">Upper</option>
            <option value="lower">Lower</option>
            <option value="title">Title</option>
        </QuillToolbarAlignSelect>,
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
            {props.toolbar.includes("blockQuote") && (
                <LineStyleDialog
                    isOpen={lineStyleDialogOpen}
                    submit={blockQuoteFormat}
                />
            )}
        </div>
    );
};

export default React.memo(QuillToolbar, _.isEqual);