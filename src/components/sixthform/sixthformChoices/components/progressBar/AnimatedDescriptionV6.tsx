import React, { useEffect } from 'react';
import './ProgressBarSixthform.scss';

interface Props {
  step: number;
  description: string;
}

const AnimatedDescriptionV6: React.FC<Props> = (props) => {
  const [description, setDescription] = React.useState(props.description);
  const [animateRight, setAnimateRight] = React.useState(false);
  const [prevStep, setPrevStep] = React.useState(props.step);

  useEffect(() => {
    if (props.step === 0 && prevStep === 0) { return; }
    setAnimateRight(true);
    setTimeout(() => {
      setAnimateRight(false);
      setDescription(props.description);
      setPrevStep(props.step);
    }, 400);
  }, [props.description]);

  if (animateRight) {
    return (
      <div className="relative animating-right">
        <div>
          <svg className="qoute-start-r324" viewBox="0 0 47 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.146 32.28C5.41533 32.28 3.41 31.5973 2.13 30.232C0.935334 28.7813 0.338 26.9467 0.338 24.728V22.936C0.338 19.4373 1.362 15.5973 3.41 11.416C5.458 7.14933 8.31667 3.43733 11.986 0.279999H20.562C18.002 3.01067 15.9113 5.61333 14.29 8.088C12.754 10.4773 11.6447 13.1653 10.962 16.152C12.6687 16.5787 13.906 17.3893 14.674 18.584C15.5273 19.7787 15.954 21.2293 15.954 22.936V24.728C15.954 26.9467 15.314 28.7813 14.034 30.232C12.8393 31.5973 10.8767 32.28 8.146 32.28ZM34.002 32.28C31.2713 32.28 29.266 31.5973 27.986 30.232C26.7913 28.7813 26.194 26.9467 26.194 24.728V22.936C26.194 19.4373 27.218 15.5973 29.266 11.416C31.314 7.14933 34.1727 3.43733 37.842 0.279999H46.418C43.858 3.01067 41.7673 5.61333 40.146 8.088C38.61 10.4773 37.5007 13.1653 36.818 16.152C38.5247 16.5787 39.762 17.3893 40.53 18.584C41.3833 19.7787 41.81 21.2293 41.81 22.936V24.728C41.81 26.9467 41.17 28.7813 39.89 30.232C38.6953 31.5973 36.7327 32.28 34.002 32.28Z" fill="#909CB6" fill-opacity="0.55" />
          </svg>
          <div className="font-24 text-center bold animating title-6v2" dangerouslySetInnerHTML={{ __html: description }} />
          <svg className="qoute-end-r324" viewBox="0 0 47 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M38.854 0.720001C41.5847 0.720001 43.59 1.40267 44.87 2.76801C46.0647 4.21867 46.662 6.05333 46.662 8.272V10.064C46.662 13.5627 45.638 17.4027 43.59 21.584C41.542 25.8507 38.6833 29.5627 35.014 32.72H26.438C28.998 29.9893 31.0887 27.3867 32.71 24.912C34.246 22.5227 35.3553 19.8347 36.038 16.848C34.3313 16.4213 33.094 15.6107 32.326 14.416C31.4727 13.2213 31.046 11.7707 31.046 10.064V8.272C31.046 6.05333 31.686 4.21867 32.966 2.76801C34.1607 1.40267 36.1233 0.720001 38.854 0.720001ZM12.998 0.720001C15.7287 0.720001 17.734 1.40267 19.014 2.76801C20.2087 4.21867 20.806 6.05333 20.806 8.272V10.064C20.806 13.5627 19.782 17.4027 17.734 21.584C15.686 25.8507 12.8273 29.5627 9.158 32.72H0.581997C3.142 29.9893 5.23266 27.3867 6.854 24.912C8.39 22.5227 9.49933 19.8347 10.182 16.848C8.47533 16.4213 7.238 15.6107 6.47 14.416C5.61666 13.2213 5.19 11.7707 5.19 10.064V8.272C5.19 6.05333 5.83 4.21867 7.11 2.76801C8.30466 1.40267 10.2673 0.720001 12.998 0.720001Z" fill="#909CB6" fill-opacity="0.55" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative animating-left">
      <div>
        <svg className="qoute-start-r324" viewBox="0 0 47 33" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.146 32.28C5.41533 32.28 3.41 31.5973 2.13 30.232C0.935334 28.7813 0.338 26.9467 0.338 24.728V22.936C0.338 19.4373 1.362 15.5973 3.41 11.416C5.458 7.14933 8.31667 3.43733 11.986 0.279999H20.562C18.002 3.01067 15.9113 5.61333 14.29 8.088C12.754 10.4773 11.6447 13.1653 10.962 16.152C12.6687 16.5787 13.906 17.3893 14.674 18.584C15.5273 19.7787 15.954 21.2293 15.954 22.936V24.728C15.954 26.9467 15.314 28.7813 14.034 30.232C12.8393 31.5973 10.8767 32.28 8.146 32.28ZM34.002 32.28C31.2713 32.28 29.266 31.5973 27.986 30.232C26.7913 28.7813 26.194 26.9467 26.194 24.728V22.936C26.194 19.4373 27.218 15.5973 29.266 11.416C31.314 7.14933 34.1727 3.43733 37.842 0.279999H46.418C43.858 3.01067 41.7673 5.61333 40.146 8.088C38.61 10.4773 37.5007 13.1653 36.818 16.152C38.5247 16.5787 39.762 17.3893 40.53 18.584C41.3833 19.7787 41.81 21.2293 41.81 22.936V24.728C41.81 26.9467 41.17 28.7813 39.89 30.232C38.6953 31.5973 36.7327 32.28 34.002 32.28Z" fill="#909CB6" fill-opacity="0.55" />
        </svg>
        <div className="font-24 text-center bold animating title-6v2" dangerouslySetInnerHTML={{ __html: description }} />
        <svg className="qoute-end-r324" viewBox="0 0 47 33" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M38.854 0.720001C41.5847 0.720001 43.59 1.40267 44.87 2.76801C46.0647 4.21867 46.662 6.05333 46.662 8.272V10.064C46.662 13.5627 45.638 17.4027 43.59 21.584C41.542 25.8507 38.6833 29.5627 35.014 32.72H26.438C28.998 29.9893 31.0887 27.3867 32.71 24.912C34.246 22.5227 35.3553 19.8347 36.038 16.848C34.3313 16.4213 33.094 15.6107 32.326 14.416C31.4727 13.2213 31.046 11.7707 31.046 10.064V8.272C31.046 6.05333 31.686 4.21867 32.966 2.76801C34.1607 1.40267 36.1233 0.720001 38.854 0.720001ZM12.998 0.720001C15.7287 0.720001 17.734 1.40267 19.014 2.76801C20.2087 4.21867 20.806 6.05333 20.806 8.272V10.064C20.806 13.5627 19.782 17.4027 17.734 21.584C15.686 25.8507 12.8273 29.5627 9.158 32.72H0.581997C3.142 29.9893 5.23266 27.3867 6.854 24.912C8.39 22.5227 9.49933 19.8347 10.182 16.848C8.47533 16.4213 7.238 15.6107 6.47 14.416C5.61666 13.2213 5.19 11.7707 5.19 10.064V8.272C5.19 6.05333 5.83 4.21867 7.11 2.76801C8.30466 1.40267 10.2673 0.720001 12.998 0.720001Z" fill="#909CB6" fill-opacity="0.55" />
        </svg>
      </div>
    </div>
  );
}

export default AnimatedDescriptionV6;
