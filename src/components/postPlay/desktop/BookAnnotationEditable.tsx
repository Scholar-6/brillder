import React from "react";

const BookAnnotationEditable = React.memo(
  React.forwardRef(({ value, canEdit, onChangeRef }: { id: number, value: string, canEdit: boolean, onChangeRef: React.RefObject<(() => void) | undefined> }, ref) => {
    const onChange = React.useCallback(() => {
      if(!onChangeRef.current) return;
      onChangeRef.current();
    }, []);

    return (
      <i
        className="comment-text-editable"
        placeholder="Type your comment here..."
        ref={ref as any}
        contentEditable={canEdit}
        onInput={onChange}
        onBlur={onChange}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    )
  }),
  (prevProps, nextProps) => {
    const currentText = document.querySelector(`.comment-${nextProps.id} .comment-text-editable`)?.innerHTML;
    return nextProps.value === currentText;
  }
);

export default BookAnnotationEditable;