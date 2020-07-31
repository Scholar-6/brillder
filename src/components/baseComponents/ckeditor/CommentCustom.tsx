// @ts-ignore
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
// @ts-ignore
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
// @ts-ignore
import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
// @ts-ignore
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
//import store from 'redux/store';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

import './CommentCustom.scss';

const theme = createMuiTheme({
    palette: {
        primary: { main: "#0B3A7E" }
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 760,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
})

const CommentTypes = {
    comment: "comment",
    add: "add",
    delete: "delete",
    replace: "replace"
}

class CommentCustom extends Plugin {

    static get requires() {
        return [ Widget ];
    }

    editor: any = null;

    commentOnly: boolean;

    constructor(editor: any) {
        super(editor);
        this.editor = editor;

        this.commentOnly = editor.config.get("comments.commentOnly");
    }

    init() {
        const editor = this.editor;
        this.defineSchema();
        this.defineConverters();

        if(this.commentOnly) {
            this.setupCommenting();
        }
        
        editor.ui.componentFactory.add('addComment', (locale: any) => {
            const view = new ButtonView(locale);

            view.set({
                label: "Add Comment",
                withText: true,
                tooltip: true
            });

            view.on('execute', async () => {
                await editor.model.change(async (writer: any) => {
                    const currentSelection = editor.model.document.selection;

                    if(currentSelection.rangeCount === 0) {
                        return;
                    }

                    const currentRange = currentSelection.getFirstRange();

                    if(!currentRange.isFlat || currentRange.isCollapsed) {
                        return;
                    }

                    writer.setAttributes({
                        'commentId': 1,
                        'commentType': CommentTypes.comment
                    }, currentRange);
                });

                console.log(editor.model.document.toJSON());
            });

            return view;
        });
    }

    setupCommenting() {
        const editor = this.editor;

        editor.editing.view.document.on('delete', (evt: any, data: any) => {
            editor.model.change((writer: any) => {
                const selection = writer.createSelection(editor.model.document.selection);

                if(selection.isCollapsed) {
                    editor.model.modifySelection( selection, { direction: data.direction, unit: data.unit } );
                }

                for(const range of selection.getRanges()) {
                    writer.setAttributes({
                        commentId: 1,
                        commentType: CommentTypes.delete
                    }, range);
                }

                writer.setSelection(data.direction === "forward" ? selection.getLastPosition() : selection.getFirstPosition());
            });

            data.stopPropagation();
            data.preventDefault();
            evt.stop();
        }, { priority: 'highest' });

        editor.model.document.on('change:data', (evt: any, batch: any) => {
            const changes = editor.model.document.differ.getChanges();

            for(let change of changes) {
                if(change.type === "insert") {
                    if(change.name === "$text") {
                        editor.model.change((writer: any) => {
                            const firstPosition = change.position;
                            const secondPosition = firstPosition.getShiftedBy(change.length);
                            const range = writer.createRange(firstPosition, secondPosition);

                            writer.setAttributes({
                                commentId: 1,
                                commentType: CommentTypes.add
                            }, range);
                        });
                    } else if(change.name !== "paragraph") {
                        evt.stop();
                    }
                }
            }

            console.log(editor.model.document);
        });
    }

    defineSchema() {
        const schema = this.editor.model.schema;
        schema.register('comment', {
            allowWhere: "$text",
            allowContentOf: "$text",
            isInline: true,
            inheritAllFrom: '$text',
            allowAttributes: ['commentId']
        });

        schema.extend('$text', {
            allowAttributes: ['commentId', 'commentType']
        })
    }

    defineConverters() {
        this.defineConvertersForCommentId();
        this.defineConvertersForCommentType();
    }

    defineConvertersForCommentId() {
        const conversion = this.editor.conversion;

        conversion.for('upcast').elementToAttribute({
            view: {
                name: 'span',
                attributes: {
                    class: 'comment',
                    'data-id': /.+/
                }
            },
            model: {
                key: 'commentId',
                value: (viewElement: any) => viewElement.getAttribute('data-id')
            }
        });

        conversion.for('editingDowncast').attributeToElement({
            model: 'commentId',
            view: (commentId: any, viewWriter: any) => {
                return viewWriter.createAttributeElement('span', {
                    class: 'comment',
                    'data-id': commentId
                });
            }
        });

        conversion.for( 'dataDowncast' ).attributeToElement({
            model: 'commentId',
            view: (commentId: any, viewWriter: any) => {
                return viewWriter.createAttributeElement('span', {
                    class: 'comment',
                    'data-id': commentId
                });
            }
        });
    }

    defineConvertersForCommentType() {
        const conversion = this.editor.conversion;

        conversion.for('upcast').elementToAttribute({
            view: {
                name: 'span',
                attributes: {
                    class: 'comment',
                    'data-id': /.+/,
                    'data-type': /.+/
                }
            },
            model: {
                key: 'commentType',
                value: (viewElement: any) => viewElement.getAttribute('data-type')
            }
        });

        conversion.for('editingDowncast').attributeToElement({
            model: 'commentType',
            view: (commentType: any, viewWriter: any) => {
                return viewWriter.createAttributeElement('span', {
                    class: `comment-${commentType}`,
                });
            }
        });

        conversion.for( 'dataDowncast' ).attributeToElement({
            model: 'commentType',
            view: (commentType: any, viewWriter: any) => {
                return viewWriter.createAttributeElement('span', {
                    class: `comment-${commentType}`,
                });
            }
        });
    }

}

export default CommentCustom;