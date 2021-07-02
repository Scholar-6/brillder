import React from "react";

export const QuillEditorContext = React.createContext<[string, Function]>(["", () => {}]);