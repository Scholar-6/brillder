import React from 'react';

import './EmptyQP1.scss';

const EmptyQP1: React.FC<any> = () => {
  return (
    <div className="empty-QP1">
      <h2>Drag and Drop!</h2>
      <p>
        Add to your questions by dragging in
        the following components from the
        left side of the tab window (in red)
      </p>
      <table>
        <tbody>
          <tr>
            <td>T</td>
            <td>Text</td>
          </tr>
          <tr>
            <td>“ ”</td>
            <td>Quote</td>
          </tr>
          <tr style={{paddingTop: 0}}>
            <td style={{fontSize: '3.5vh'}}>jpg.</td>
            <td>Image</td>
          </tr>
          <tr>
            <td>
              <div className="centered">
                <img alt="" className="sound-image" src="/images/soundicon-dark-blue.png" />
              </div>
            </td>
            <td>Sound</td>
          </tr>
          <tr>
            <td className="graph-box">f(x)</td>
            <td>Graph</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default EmptyQP1;
