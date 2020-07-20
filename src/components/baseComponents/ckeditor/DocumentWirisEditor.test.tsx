import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentWirisEditor from './DocumentWirisEditor';
import { Provider } from 'react-redux';

describe("notification panel", () => {
  it("should display a list of notifications", () => {
    render(
      <Provider>
        <DocumentWirisEditor
          disabled={false}
          data={""}
          onBlur={() => { }}
          onChange={() => { }}
        />
      </Provider>
    );
  });
});