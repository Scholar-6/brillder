import React from 'react';

const LevelHelpContent: React.FC<any> = () => {
  return (
    <div className="flex-content">
      <div>
        Brillder focusses on universal concepts and topics, not
        specific exam courses.
      </div>
      <br />
      <div>LEVELS:</div>
      <div className="container">
        <div className="white-circle">I</div>
        <div className="l-text">
          <div>Foundation</div>
          <div className="regular">
            For 15-16 yr-olds, equivalent to GCSE / IB Middle
            Years / High School Diploma
          </div>
        </div>
      </div>
      <br />
      <div className="container">
        <div className="white-circle">II</div>
        <div className="l-text">
          <div>Core</div>
          <div className="regular">
            For 17-18 yr-olds, equivalent to A-level / IB / High
            School Honors
          </div>
        </div>
      </div>
      <br />
      <div className="container">
        <div className="white-circle">III</div>
        <div className="l-text">
          <div>Extension</div>
          <div className="regular">
            College / Undergraduate level, to challenge Oxbridge
            (UK) or Advanced Placement (US) students
          </div>
        </div>
      </div>
    </div>
  );
}

export default LevelHelpContent;
