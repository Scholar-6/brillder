// @ts-ignore
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
// @ts-ignore
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import { uploadFile } from "components/services/uploadFile";

class UploadImageCustom extends Plugin {
  editor: any = null;
  constructor(editor: any) {
    super(editor);
    this.editor = editor;
  }

  init() {
    const editor = this.editor;
    editor.ui.componentFactory.add("UploadImageCustom", (locale: any) => {
      const view = new ButtonView(locale);

      view.set({
        label: "jpg",
        withText: true,
        tooltip: true,
      });

      view.class = "upload-button-custom";

      view.on("execute", () => {
        let el = document.createElement("input");
        el.setAttribute("type", "file");
        el.setAttribute("accept", ".jpg, .jpeg, .png, .gif");
        el.click();

        editor.execute('uploading');

        // UPLOADING IMAGES TO BACKEND
        el.onchange = (files: any) => {
          if (el.files && el.files.length >= 0) {
            uploadFile(
              el.files[0] as File,
              (res: any) => {
                let fileName = res.data.fileName;
                editor.execute('uploaded');

                editor.model.change((writer: any) => {
                  const imageElement = writer.createElement("image", {
                    src: `${process.env.REACT_APP_BACKEND_HOST}/files/${fileName}`,
                  });
                  editor.model.insertContent(
                    imageElement,
                    editor.model.document.selection
                  );
                });
              },
              () => {}
            );
          }
        };
      });

      return view;
    });
  }
}

export default UploadImageCustom;
