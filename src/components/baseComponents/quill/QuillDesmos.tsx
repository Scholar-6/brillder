import Quill from "quill";
import { Quill as GlobalQuill } from "react-quill";

//@ts-ignore
import Desmos from 'desmos';

import "./QuillDesmos.scss";
import { Fab, SvgIcon, Tooltip } from "@material-ui/core";
import React from "react";
import ReactDOM from "react-dom";
import sprite from 'assets/img/icons-sprite.svg';
import { generateId } from "components/build/buildQuestions/questionTypes/service/questionBuild";

const Embed = GlobalQuill.import('blots/block/embed');

const QuillDesmosComponent: React.FC<{ openDialog(): void }> = (props) => {
    return (
        <>
            <Tooltip title="Add / Edit Expressions">
                <Fab onClick={props.openDialog} color="primary">
                    <SvgIcon fontSize="default">
                        <svg className="svg active">
                            {/*eslint-disable-next-line*/}
                            <use href={sprite + "#edit-outline"} />
                        </svg>
                    </SvgIcon>
                </Fab>
            </Tooltip>
        </>
    )
}

export class DesmosBlot extends Embed {
    static blotName = "desmos";
    static tagName = "div";
    static className = "quill-desmos";

    static create(value: any) {
        const node: Element = super.create();
        node.setAttribute("data-value", JSON.stringify(value));
        node.classList.add("blot-" + value.id.toString());

        const desmos = Desmos.GraphingCalculator(node, {
            fontSize: Desmos.FontSizes.VERY_SMALL,
            expressions: false,
            settingsMenu: false,
            lockViewport: true,
            pointsOfInterest: true,
            trace: true,
        });
        desmos.setState(value.graphState);

        return node;
    }

    static value(node: any) {
        var blot = JSON.parse(node.getAttribute("data-value"));
        return blot;
    }
}

GlobalQuill.register(DesmosBlot);

export default class DesmosModule {
    quill: Quill;
    openDialog: (value: any, blot?: DesmosBlot) => void;

    constructor(quill: Quill, options: any) {
        this.quill = quill;
        this.openDialog = options.openDialog;

        const toolbar = quill.getModule("toolbar");
        if(toolbar) {
            toolbar.addHandler("desmos", this.newGraphHandler.bind(this));
        }

        quill.on("editor-change", () => {
            document.querySelectorAll(".desmos-edit-button").forEach(button => {
                ReactDOM.unmountComponentAtNode(button);
                button.remove();
            });
            document.querySelectorAll<HTMLDivElement>(".quill-document-editor div.quill-desmos").forEach(el => {
                const editButton = document.createElement("div");
                editButton.classList.add("desmos-edit-button");
                editButton.setAttribute("contenteditable", "false");

                ReactDOM.render(
                    <QuillDesmosComponent openDialog={() => {
                        const blot = GlobalQuill.find(el);
                        const value = DesmosBlot.value(blot.domNode);
                        this.openDialog.bind(this)(value, blot);
                    }} />,
                    editButton
                );
                el.appendChild(editButton);
            });
        });
    }

    newGraphHandler() {
        this.createGraph({
            id: generateId(),
            graphState: null,
            graphSettings: {
                showSidebar: false,
                showSettings: false,
                allowPanning: false,
                trace: false,
                pointsOfInterest: false
            }
        });
    }

    createGraph(value: any) {
        const range = this.quill.getSelection(true);
        this.quill.insertEmbed(range.index, 'desmos', value);
    }

    updateGraph(value: any) {
        const leafNode = this.quill.root.querySelector(".quill-desmos.blot-" + value.id)!;
        const leaf = GlobalQuill.find(leafNode);
        if(leaf instanceof DesmosBlot) {
            const oldData = DesmosBlot.value(leaf.domNode);
            leaf.replaceWith("desmos", { ...oldData, ...value });
        }
    }
}

GlobalQuill.register("modules/desmos", DesmosModule);