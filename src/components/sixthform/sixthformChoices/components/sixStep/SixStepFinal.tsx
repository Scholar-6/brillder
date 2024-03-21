import SpriteIcon from "components/baseComponents/SpriteIcon";
import React, { useEffect } from "react";
import map from "components/map";

const confetti = require('canvas-confetti');

interface WelcomeProps {
  history: any;
}

const SixStepFinal: React.FC<WelcomeProps> = (props) => {

  const launchBigConfetti = () => {
    const colors = ['#0681db', '#ffd900', '#30c474'];

    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, colors };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval3: any = setInterval(function () {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval3);
      }

      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti.default(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti.default(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  }

  useEffect(() => {
    launchBigConfetti();
  }, []);

  return (
    <div className="question question-6 question-6-final">
      <div className="background-confetti-sixthform">
        <SpriteIcon name="confetti-sixthform" className="confeti-sixthform" />
      </div>
      <div className="background-opacity-s6" />
      <div className="abolute-final-s5">
        <div className="flex-center">
          <svg className="success-icon" viewBox="0 0 104 118" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32.9542 17.0131C31.669 18.482 31.8129 20.72 33.2867 22.0102C34.7556 23.3004 36.9936 23.1516 38.2838 21.6827C39.574 20.2089 39.4202 17.9758 37.9514 16.6856C36.4825 15.3954 34.2445 15.5443 32.9542 17.0131ZM50.3027 29.5679L39.7527 65.2077L55.6621 31.6124L50.3027 29.5679ZM75.7448 4.77091C76.7919 3.57994 76.6728 1.75879 75.4769 0.711725C74.2809 -0.335337 72.4597 -0.211318 71.4176 0.979652C70.3706 2.17558 70.4897 3.99184 71.6856 5.0389C72.8815 6.08596 74.6977 5.96685 75.7448 4.77091ZM43.3355 68.1752L79.7296 32.8728L73.5366 27.444L43.3355 68.1752ZM91.287 66.6369C89.9968 68.1057 90.1506 70.3437 91.6194 71.629C93.0883 72.9192 95.3264 72.7704 96.6166 71.3015C97.9018 69.8326 97.7529 67.5946 96.2841 66.3044C94.8102 65.0141 92.5722 65.163 91.287 66.6369ZM48.6998 73.0483L78.762 59.8781L76.0277 54.8363L48.6998 73.0483ZM102.978 37.1603C101.872 36.1927 100.194 36.3068 99.2318 37.4085C98.2641 38.5101 98.3733 40.1924 99.4799 41.1551C100.582 42.1227 102.259 42.0086 103.226 40.907C104.194 39.8004 104.085 38.128 102.978 37.1603Z" fill="#C43C30" />
            <path d="M81.3233 24.7168L83.492 30.8155L87.0103 25.3817L93.4812 25.2031L89.4021 20.1762L91.2333 13.9682L85.194 16.2906L79.8595 12.6334L80.2068 19.0943L75.0807 23.0444L81.3233 24.7168ZM23.5663 45.5488L27.1591 44.7201L29.8784 47.2161L30.206 43.539L33.4216 41.7277L30.0273 40.2837L29.2978 36.6661L26.8712 39.45L23.209 39.0282L25.1046 42.1942L23.5663 45.5488ZM61.1017 12.0726L60.268 5.65625L55.6778 10.2216L49.321 9.03069L52.2438 14.8019L49.1473 20.4838L55.5389 19.4864L59.9851 24.1857L61.0124 17.7942L66.8581 15.0203L61.1017 12.0726ZM22.7177 58.6197L19.9884 65.7357L31.7691 66.5446L22.7177 58.6197ZM70.9073 76.8713L69.0266 73.6954L67.652 77.1194L64.0494 77.9283L66.8829 80.2954L66.5405 83.9675L69.6667 82.0074L73.0511 83.4663L72.1529 79.8884L74.5845 77.1145L70.9073 76.8713ZM93.8286 48.6403L88.8017 48.7892L85.8292 44.735L84.4199 49.5584L79.6412 51.1315L83.7947 53.965L83.8095 58.9919L87.7943 55.9152L92.578 57.4535L90.8859 52.7194L93.8286 48.6403ZM37.2674 71.3631L18.331 70.0629L14.7581 79.3674L49.1027 81.7345L37.2674 71.3631ZM0 117.856L11.5673 111.563L2.64989 110.948L0 117.856ZM4.30731 106.631L18.8024 107.628L34.3843 99.1474L7.88019 97.3212L4.30731 106.631ZM13.1106 83.6946L9.53767 92.999L41.6243 95.2073L55.7274 87.5305L54.6059 86.5479L13.1106 83.6946Z" fill="#FFB11D" />
          </svg>
        </div>
        <div className="flex-center">
          <div className="bold font-58 question-text">
            Well done!
          </div>
        </div>
        <div className="flex-center">
          <div className="font-32 text-center">
            You’ve successfully completed the Course Selector Questionnaire.
          </div>
        </div>
        <div className="flex-center">
          <button className="outcome-btn font-24" onClick={() => {
            props.history.push(map.SixthformOutcome);
          }}>See my outcomes</button>
        </div>
      </div>
    </div>
  );
}

export default SixStepFinal;
