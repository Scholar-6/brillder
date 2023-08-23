import QuillBetterTable from "./QuillBetterTable";

export const getKeyboardBindings = () => {
  const bindings = QuillBetterTable.keyboardBindings;

  bindings.custom1 = {
    key: 'm',
    ctrlKey: true,
    // Handle ctrl+T
    handler: function () {
      if (this.quill.getFormat()["latex"] === true) {
        this.quill.format('latex', false, "user");
      } else {
        this.quill.format('latex', true, "user");
      }
    }
  }

  bindings.custom2 = {
    key: 'M',
    ctrlKey: true,
    // Handle ctrl+T
    handler: function () {
      if (this.quill.getFormat()["latex"] === true) {
        this.quill.format('latex', false, "user");
      } else {
        this.quill.format('latex', true, "user");
      }
    }
  }

  return bindings;
}