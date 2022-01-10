import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

const QuestionTabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      className="play-question-container"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </Typography>
  );
}

export default QuestionTabPanel;
