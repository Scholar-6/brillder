import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentWirisEditor from './DocumentWirisEditor';

describe("Document CKEditor", () => {
  it("should display the CKEditor interface.", () => {
    render(
        <DocumentWirisEditor
          disabled={false}
          data={""}
          onBlur={() => { }}
          onChange={() => { }}
        />
    );
  });
});
