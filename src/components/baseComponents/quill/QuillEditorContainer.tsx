import React, { useEffect } from "react";
import QuillEditor from "components/baseComponents/quill/QuillEditor";


export interface ContainerProps {
  locked: boolean;
  object: any;
  fieldName: string;
  toolbar: string[];
  isValid?: boolean | null | undefined;
  placeholder: string;
  validationRequired: boolean;
  onBlur?(): void;
  onChange(value: string): void;
}

const QuillEditorContainer: React.FC<ContainerProps> = ({
  locked, object, fieldName, isValid, toolbar, validationRequired, placeholder, onChange, onBlur
}) => {
  const [refresh, setRefresh] = React.useState(false);

  // bad way but working
  // better do it inside quill editor and without timeout
  useEffect(() => {
    setRefresh(true);
    setTimeout(() => setRefresh(false), 100);
  }, [object]);

  if (refresh === true) {
    return <div />
  } else {
    return (
      <QuillEditor
        disabled={locked}
        data={object[fieldName]}
        validate={validationRequired}
        toolbar={toolbar}
        isValid={isValid}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={() => onBlur && onBlur()}
      />
    );
  }
};

export default QuillEditorContainer;
