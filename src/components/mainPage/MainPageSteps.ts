export default function getMainPageSteps(isStudent: boolean, isTeacher: boolean, isLibraryOrigin: boolean) {
  let steps:any = [];

  if (isStudent) {
    steps = [
      {
        element: '.view-item-container',
        intro: `<p>Click here to explore our catalogue and play academic challenges (“bricks”)</p>`,
      }, {
        element: '.competition-arena-d54n',
        intro: `<p>Discover our daily competitions here - play to win brills, which can be converted to real cash over time!</p>`,
      }, {
        element: '.brill-intro-container',
        intro: `<p>The more “bricks” you play, and the better you do, the more “brills” you can earn. Then claim cash, and other prizes. We've given you 200 as a welcome gift!</p>`,
      }, {
        element: '.desktop-credit-coins',
        intro: `<p>You need to spend credits to play bricks. Spend 1 credit to play a brick from the catalogue or 2 credits to enter a competition.<br/>We've given you 5 free credits to get you started!</p>`,
      }, {
        element: '.second-button.student-back-work',
        intro: `<p>If a teacher has set you an assignment, you'll be able to access it here. A red circle with white numbers will show how many assignments you still have to complete.</p>`,
      }, {
        element: '.my-library-button',
        intro: `<p>Every time you complete a brick, and score over 50%, a book will be added to your very own virtual library!</p>`,
      }, {
        element: '.build-button-d71',
        intro: `<p>Once you start getting the hang of “bricks”, you'll be able to have a go at building them.</p>`,
      }
    ];
  }

  if (isTeacher) {
    return [
      {
        element: '.view-item-container',
        intro: `<p>Browse the catalogue, and assign your first brick to a new class</p>`,
      }
    ];
  }

  if (isLibraryOrigin) {
    steps.unshift({
      emement: '',
      intro: `<p>We offer free accounts to participating UK libraries. Link your account at the end of this tutorial.</p>`
    });
  }

  return steps;
}


// {
//   element: '.selector1', // css selector
//   intro: 'test 1', // tooltip content
//   position: 'right', // position of tooltip
//   tooltipClass: 'myTooltipClass', // css class of the tootip
//   highlightClass: 'myHighlightClass', // css class of the helperLayer
// },