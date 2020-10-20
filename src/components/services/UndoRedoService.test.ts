import UndoRedoService from "./UndoRedoService";

const mockChanges = [
    { forward: "a", backward: "" },
    { forward: "ab", backward: "a" },
    { forward: "abc", backward: "ab" },
    { forward: "abcd", backward: "abc" },
]

describe("undo / redo service", () => {
    beforeEach(() => {
        UndoRedoService.instance.clear();
    })

    it("should allow pushing changes", () => {
        // arrange (N/A)

        // act
        UndoRedoService.instance.push(mockChanges[0]);

        // assert
        // there should be no errors
    })

    it("should allow undo", () => {
        // arrange
        UndoRedoService.instance.push(mockChanges[0]);

        // act
        const result = UndoRedoService.instance.undo();

        // assert
        expect(result).toStrictEqual("");
    });

    it("should allow redo", () => {
        // arrange
        UndoRedoService.instance.push(mockChanges[0]);
        UndoRedoService.instance.undo();

        // act
        const result = UndoRedoService.instance.redo();

        // assert
        expect(result).toStrictEqual("a");
    });

    it("should allow multiple undos and redos", () => {
        // arrange
        UndoRedoService.instance.push(mockChanges[0]);
        UndoRedoService.instance.push(mockChanges[1]);
        UndoRedoService.instance.push(mockChanges[2]);
        UndoRedoService.instance.push(mockChanges[3]);

        // act
        const undo1 = UndoRedoService.instance.undo();
        const undo2 = UndoRedoService.instance.undo();
        const redo1 = UndoRedoService.instance.redo();
        const undo3 = UndoRedoService.instance.undo();
        const undo4 = UndoRedoService.instance.undo();
        const redo2 = UndoRedoService.instance.redo();
        const redo3 = UndoRedoService.instance.redo();

        // assert
        expect(undo1).toStrictEqual("abc");
        expect(undo2).toStrictEqual("ab");
        expect(redo1).toStrictEqual("abc");
        expect(undo3).toStrictEqual("ab");
        expect(undo4).toStrictEqual("a");
        expect(redo2).toStrictEqual("ab");
        expect(redo3).toStrictEqual("abc");
    });

    it("should clear the stack from the latest push", () => {
        // arrange
        UndoRedoService.instance.push(mockChanges[0]);
        UndoRedoService.instance.push(mockChanges[1]);
        UndoRedoService.instance.push(mockChanges[2]);
        UndoRedoService.instance.undo();

        // act
        UndoRedoService.instance.push(mockChanges[3]); // should clear mockChanges[2] from stack.
        const result = UndoRedoService.instance.redo(); // should be null.

        const undo1 = UndoRedoService.instance.undo(); // should be mockChanges[3].
        const undo2 = UndoRedoService.instance.undo(); // should be mockChanges[1].

        // assert
        expect(result).toBeNull();
        expect(undo1).toStrictEqual("abc");
        expect(undo2).toStrictEqual("a");
    })

    it("should return null if there's nothing to undo", () => {
        // arrange (N/A)

        // act
        const result = UndoRedoService.instance.undo();

        // assert
        expect(result).toBeNull();
    })

    it("should return null if there's nothing to redo", () => {
        // arrange (N/A)
        UndoRedoService.instance.push(mockChanges[0]);

        // act
        const result = UndoRedoService.instance.redo();

        // assert
        expect(result).toBeNull();
    })
});