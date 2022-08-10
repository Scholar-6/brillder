export default function getMainPageSteps(isStudent: boolean, isTeacher: boolean, isLibraryOrigin: boolean, library: any) {
  let steps: any = [];

  console.log(isLibraryOrigin);

  if (isStudent) {
    steps.push({
      element: '.view-item-container',
      intro: `<p>Click here to explore our catalogue and play academic challenges (“bricks”)</p>`,
    });

    if (!library) {
      steps.push({
        element: '.competition-arena-d54n',
        intro: isLibraryOrigin ? `<p>Discover our daily competitions here - play to win brills, which can be converted to prizes!</p>` : `<p>Discover our daily competitions here - play to win brills, which can be converted to real cash over time!</p>`,
      });
    }

    steps.push({
      element: '.brill-intro-container',
      intro: library
        ? `<p>The more “bricks” you play, and the better you do, the more “brills” you can earn. As a library user, if you earn enough you'll become one of our Brilliant Minds! We've given you 200 as a welcome gift!</p>`
        : `<p>The more “bricks” you play, and the better you do, the more “brills” you can earn. Then claim cash, and other prizes. We've given you 200 as a welcome gift!</p>`,
    });

    if (!library) {
      steps.push({
        element: '.desktop-credit-coins',
        intro: isLibraryOrigin
          ? `<p>As a library user, you don't need to spend credits to play bricks. But you can still use them to enter competitions.<br/>We've given you 5 free credits to get you started!</p>` : `<p>You need to spend credits to play bricks. Spend 1 credit to play a brick from the catalogue or 2 credits to enter a competition.<br/>We've given you 5 free credits to get you started!</p>`,
      });
    }

    steps.push({
      element: '.second-button.student-back-work',
      intro: isLibraryOrigin
        ? `<p>If your school uses Brillder, you can view your assignments here.</p>`
        : `<p>If a teacher has set you an assignment, you'll be able to access it here. A red circle with white numbers will show how many assignments you still have to complete.</p>`,
    });

    steps.push({
      element: '.my-library-button',
      intro: `<p>Every time you complete a brick, and score over 50%, a book will be added to your virtual library!</p>`,
    });

    steps.push({
      element: '.build-button-d71',
      intro: `<p>Once you start getting the hang of “bricks”, you can try building them yourself.</p>`,
    });
  }

  if (isTeacher) {
    return [
      {
        element: '.view-item-container',
        intro: `<p>Browse the catalogue, and assign your first brick to a new class</p>`,
      }
    ];
  }

  /*
  if (isLibraryOrigin) {
    steps.unshift({
      emement: '',
      intro: `<p>We offer free accounts to participating UK libraries. Link your account at the end of this tutorial.</p>`
    });
  }*/

  return steps;
}


// {
//   element: '.selector1', // css selector
//   intro: 'test 1', // tooltip content
//   position: 'right', // position of tooltip
//   tooltipClass: 'myTooltipClass', // css class of the tootip
//   highlightClass: 'myHighlightClass', // css class of the helperLayer
// },