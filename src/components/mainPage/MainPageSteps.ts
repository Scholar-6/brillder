export default function getMainPageSteps(isStudent: boolean, isTeacher: boolean, isLibraryOrigin: boolean) {
  let steps:any = [];
  if (isTeacher) {
    return [
      {
        element: '.view-item-container',
        intro: `<p>Browse the catalogue, and assign your first brick to a new class</p>`,
      }
    ];
  }

  if (isStudent) {
    steps = [
      {
        emement: '',
        intro: `<p>We offer free accounts to participating UK libraries. Link your account at the end of this tutorial.</p>`
      },
      {
        element: '.view-item-container',
        intro: `<p>Click here to explore our catalogue and play academic challenges (“bricks”)</p>`,
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
        element: '.create-item-container',
        intro: `<p>Once you start getting the hang of “bricks”, you'll be able to have a go at building them.</p>`,
      },
      {
        emement: '',
        intro: `<p>Link your library account by filling in your details below.</p>`
      }
    ];
  }

  return steps;
}