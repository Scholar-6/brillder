import React from "react";

const BookAnnotationEditable = React.memo(
  React.forwardRef(({ value, canEdit, onChangeRef, focusEditable }: { id: number, value: string, canEdit: boolean, onChangeRef: React.RefObject<(() => void) | undefined>, focusEditable(): void }, ref) => {
    const onChange = React.useCallback(() => {
      if(!onChangeRef.current) return;
      onChangeRef.current();
    }, []);

    return <>
      <i
        className="comment-text-editable"
        placeholder="Type your comment"
        ref={ref as any}
        contentEditable={canEdit}
        onInput={onChange}
        onBlur={onChange}
        dangerouslySetInnerHTML={{ __html: value }}
      />
      <i className="placeholder" onClick={focusEditable}>Type your comment</i>
    </>
  }),
  (prevProps, nextProps) => {
    const currentText = document.querySelector(`.comment-${nextProps.id} .comment-text-editable`)?.innerHTML;
    return nextProps.value === currentText;
  }
);

export default BookAnnotationEditable;