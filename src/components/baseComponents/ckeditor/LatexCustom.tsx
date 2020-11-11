// @ts-nocheck
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import AttributeCommand from '@ckeditor/ckeditor5-basic-styles/src/attributecommand';
import "./LatexCustom.scss";
import sprite from "assets/img/icons-sprite.svg";

export default class LatexCustom extends Plugin {
    static get requires() {
        return [Widget];
    }

    editor: any = null;

    constructor(editor: any) {
        super(editor);
        this.editor = editor;
    }

    init() {
        this.defineSchema();
        this.defineConverters();
        this.defineToolbar();

        this.editor.editing.mapper.on(
            'viewToModelPosition',
            viewToModelPositionOutsideModelElement( this.editor.model, (viewElement: any) => viewElement.hasClass( 'placeholder' ) )
        );
    }

    defineSchema() {
        const schema = this.editor.model.schema;

        // schema.register('latex', {
        //     allowWhere: "$text",
        //     isInline: true,
        //     isObject: true,
        //     allowAttributes: ["code"]
        // });

        schema.extend("$text", {
            allowAttributes: ["latex"]
        })
    }

    defineConverters() {
        const conversion = this.editor.conversion;

        // Cast view to model.
        conversion.for('upcast').elementToAttribute({
            view: {
                name: 'span',
                attributes: {
                    class: 'latex',
                },
            },
            model: {
                key: 'latex',
                value: true
            },
        });

        // Cast model to view (data)
        conversion.for('dataDowncast').attributeToElement({
            model: 'latex',
            view: {
                name: 'span',
                classes: 'latex'
            },
        });

        // Cast model to view (editing)
        conversion.for('editingDowncast').attributeToElement({
            model: 'latex',
            view: {
                name: 'span',
                classes: 'latex-edit'
            },
        });
    }

    defineToolbar() {
        this.editor.commands.add('addLatex', new AttributeCommand(this.editor, 'latex'));

        this.editor.ui.componentFactory.add('latex', (locale: any) => {
            const command = this.editor.commands.get('addLatex');
            const view = new ButtonView(locale);

            view.set({
                label: "TeX",
                withText: true,
                tooltip: true,
                isToggleable: true,
                class: "latex-button-custom"
            });

            view.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );
            
            this.listenTo(view, 'execute', () => {
                console.log("button pressed");
                this.editor.execute('addLatex');
            });

            return view;
        });
    }
}