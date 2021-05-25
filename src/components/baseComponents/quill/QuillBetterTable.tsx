//@ts-ignore
import QuillBetterTable from "quill-better-table";
import "quill-better-table/dist/quill-better-table.css";
import { Quill as GlobalQuill } from "react-quill";

GlobalQuill.register({ "modules/better-table": QuillBetterTable }, true);

export default QuillBetterTable;
