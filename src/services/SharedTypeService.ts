// @ts-ignore
import * as Y from "yjs";
import { Brick } from "model/brick";
import { Question } from "model/question";
import quillToHTML from "components/baseComponents/quill/QuillToHTML";

export const toRenderJSON = (type: Y.AbstractType<any> | any, exclude: string[] = []): any => {
    if(type instanceof Y.Doc) {
        const jsonDoc: any = {};
        type.share.forEach((value, key) => {
            if(!exclude.includes(key)) {
                jsonDoc[key] = toRenderJSON(value, exclude);
            }
        });
        return jsonDoc;
    } else if (type instanceof Y.Array) {
        return type.map(c => toRenderJSON(c, exclude));
    } else if (type instanceof Y.Map) {
        const jsonMap: any = {};
        type._map.forEach((item, key) => {
            if(!item.deleted && !exclude.includes(key)) {
                const v = item.content.getContent()[item.length-1];
                jsonMap[key] = toRenderJSON(v, exclude);
            }
        });
        return jsonMap;
    } else if (type instanceof Y.Text) {
        const delta = type.toDelta();
        return quillToHTML(delta);
    } else if (type instanceof Y.AbstractType) {
        return type.toJSON();
    } else {
        return type;
    }
}

export const convertBrick = (brick: Brick): Y.Doc => {
    const ydoc = new Y.Doc();
    const ybrick = ydoc.getMap("brick");

    ybrick.set("id", brick.id);
    ybrick.set("authorId", brick.author.id);

    const yeditors = new Y.Array();
    if(brick.editors) {
        yeditors.push(brick.editors.map((editor) => editor.id));
    }
    ybrick.set("editors", yeditors);

    ybrick.set("brickLength", brick.brickLength);
    ybrick.set("status", brick.status);
    ybrick.set("subjectId", brick.subjectId);
    ybrick.set("locked", brick.locked);
    ybrick.set("isCore", brick.isCore);
    ybrick.set("created", brick.created.valueOf());
    ybrick.set("updated", brick.updated.valueOf());
    ybrick.set("title", brick.title);
    ybrick.set("topic", brick.topic);
    ybrick.set("subTopic", brick.subTopic);
    ybrick.set("alternativeTopics", brick.alternativeTopics);

    const yopenquestion = new Y.Text();
    yopenquestion.insert(0, brick.openQuestion);
    ybrick.set("openQuestion", yopenquestion);

    const ybrief = new Y.Text();
    ybrief.insert(0, brick.brief);
    ybrick.set("brief", ybrief);

    const yprep = new Y.Text();
    yprep.insert(0, brick.prep);
    ybrick.set("prep", yprep);

    const ysynthesis = new Y.Text();
    ysynthesis.insert(0, brick.synthesis);
    ybrick.set("synthesis", ysynthesis);

    const yquestions = new Y.Array();
    yquestions.push(brick.questions.map(convertQuestion));
    ybrick.set("questions", yquestions);

    return ydoc;
};

export const convertQuestion = (question: Question): Y.Doc => {
    const yquestion = new Y.Doc();

    yquestion.getMap().set("id", question.id);
    yquestion.getMap().set("order", question.order);
    yquestion.getMap().set("type", question.type);

    if(question.contentBlocks) {
        const contentBlocks = JSON.parse(question.contentBlocks) as object[];
        yquestion.getMap().set("contentBlocks", convertObject(contentBlocks));
    } else {
        yquestion.getMap().set("hint", convertObject(question.hint));
        yquestion.getMap().set("firstComponent", convertObject(question.firstComponent));
        yquestion.getMap().set("components", convertArray(question.components));
    }

    return yquestion;
};

export const convertAny = (value: any, convertStrings: boolean = true, addId = true): Y.Map<any> | Y.Array<any> | Y.Text | any => {
    if (value === undefined) { return undefined; } else if (value === null) { return null; } else if (Array.isArray(value)) {
        return convertArray(value, convertStrings, addId);
    } else if (typeof(value) === "object") {
        return convertObject(value, convertStrings, addId);
    } else if (typeof(value) === "string" && convertStrings) {
        return convertString(value);
    } else {
        return value;
    }
};

export const convertObject = (obj: object, convertStrings: boolean = true, addId = true): Y.Map<any> => {
    if (obj === undefined) { return undefined as any; }
    const yobject = new Y.Map();

    Object.entries(obj).forEach(([key, value]) => {
        yobject.set(key, convertAny(value, convertStrings, addId));
    });

    if (!yobject.get("id") && addId) {
        yobject.set("id", Math.floor(Math.random() * 1024));
    } else if (yobject.get("id") && !addId) {
        yobject.delete("id");
    }

    return yobject;
};

export const convertArray = (arr: any[], convertStrings: boolean = true, addId = true): Y.Array<any> => {
    const yarray = new Y.Array();

    yarray.push(arr.map((value) => convertAny(value, convertStrings, addId)));

    return yarray;
};

export const convertString = (value: string): Y.Text => {
    const ytext = new Y.Text();
    ytext.insert(0, value);
    return ytext;
};