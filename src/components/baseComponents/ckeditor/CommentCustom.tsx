// @ts-ignore
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
// @ts-ignore
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
// @ts-ignore
import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
// @ts-ignore
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import ReactDOM from 'react-dom';
import CommentButton from '../comments/CommentButton';
import React from 'react';
// @ts-ignore
import { Provider } from 'react-redux';
import store from 'redux/store';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

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

class CommentCustom extends Plugin {

    static get requires() {
        return [ Widget ];
    }

    editor: any = null;

    constructor(editor: any) {
        super(editor);
        this.editor = editor;
    }

    init() {
        const editor = this.editor;
        this.defineSchema();
        this.defineConverters();

        editor.editing.mapper.on(
            'viewToModelPosition',
            viewToModelPositionOutsideModelElement( this.editor.model, (viewElement: any) => viewElement.hasClass( 'comment' ) )
        );

        editor.editing.view.document.on('delete', (evt: any, data: any) => {
            const items = Array.from<any>(editor.model.document.selection.getFirstRange().getItems())
            const filteredItems = items.filter(item => item.name === "comment");
            if(filteredItems.length > 0) {
                data.stopPropagation();
                data.preventDefault();
                evt.stop();
            }
        }, { priority: 'highest' });

        editor.ui.componentFactory.add('addComment', (locale: any) => {
            const view = new ButtonView(locale);

            view.set({
                label: "Add Comment",
                withText: true,
                tooltip: true
            });

            view.on('execute', () => {
                editor.model.change((writer: any) => {
                    const commentElement = writer.createElement('comment', {
                        commentId: 1,
                        text: "This is a comment."
                    });

                    editor.model.insertContent(commentElement);
                });
            });

            return view;
        });
    }

    defineSchema() {
        const schema = this.editor.model.schema;
        schema.register('comment', {
            allowWhere: "$text",
            isInline: true,
            isObject: true,
            allowAttributes: ['commentId', 'text']
        });
    }

    defineConverters() {
        const conversion = this.editor.conversion;

        conversion.for('upcast').elementToElement({
            view: {
                name: 'span',
                classes: ['comment']
            },
            model: (viewElement: any, modelWriter: any) => {

                return modelWriter.createElement('comment', {
                    commentId: parseInt(viewElement.getAttribute('data-id')),
                    text: viewElement.getAttribute('data-text')
                });
            }
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'comment',
            view: (modelItem: any, viewWriter: any) => {
                let commentId: number = modelItem.getAttribute('commentId');
                let commentText: string = modelItem.getAttribute('text');

                const wrapperElement = viewWriter.createContainerElement('span', {
                    class: 'comment'
                });

                const deleteComment = (commentId: number) => {
                    this.editor.model.change((writer: any) => {
                        writer.remove(modelItem);
                    });
                    this.editor.fire("comment-update");
                };

                const changeText = (id: number, text: string) => {
                    this.editor.model.change((writer: any) => {
                        writer.setAttribute('text', text, modelItem);
                    });
                    commentText = text;
                    this.editor.fire("comment-update");
                }

                const reactWrapper = viewWriter.createUIElement('span', {
                    class: 'comment__react-wrapper'
                }, function (domDocument: any) {
                    // @ts-ignore
                    const domElement = this.toDomElement(domDocument);

                    ReactDOM.render(
                        <Provider store={store}>
                            <ThemeProvider theme={theme}>
                                <CommentButton editable={true} commentId={commentId} text={commentText}
                                    deleteComment={deleteComment} changeText={changeText}/>
                            </ThemeProvider>
                        </Provider>,
                        domElement
                    );

                    return domElement;
                });
                viewWriter.insert(viewWriter.createPositionAt(wrapperElement, 0), reactWrapper);

                return toWidget(wrapperElement, viewWriter);
            }
        });

        conversion.for( 'dataDowncast' ).elementToElement({
            model: 'comment',
            view: (modelItem: any, viewWriter: any) => {
                const element = viewWriter.createContainerElement('span', {
                    class: 'comment',
                    'data-id': modelItem.getAttribute('commentId'),
                    'data-text': modelItem.getAttribute('text')
                });

                return element;
            }
        });
    }

}

export default CommentCustom;