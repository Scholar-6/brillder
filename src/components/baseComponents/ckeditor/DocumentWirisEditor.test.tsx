import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentWirisEditor from './DocumentWirisEditor';

describe("notification panel", () => {
  it("should display a list of notifications", () => {
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