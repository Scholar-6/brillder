## Hello from Sean!

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Development Version
All changes to development branch are automatically deployed to http://dev-brillder.scholar6.org

## Run Project


To run project run next commands:

### `npm install`
### `npm start`

## Run via https

### ($env:HTTPS = "true") -and (npm start)

## Run StoryBook

### `npm run storybook`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Play Folder Structure

play/brick/live/Live - (React function) which shuffle choices in components and will gather and store data from his children. Not refreshable.

play/brick/live/QuestionsComponent - (React function) which have stepper and swipable tabs with animation from material ui. Refreshing every time question changed.
(!!! Has reference for all questions !!!)

play/brick/live/QuestionLive (need to rename because will be for review too) - (React Class) component for each Question. Render inner components like text, image ... and unique component like Short Answer, SingleChoice and others.
(!!! Has reference for unique component (ShortAnswer, ...) !!!)

play/brick/live/comp folder containers basic components like Text Image Quote

play/brick/live/questionTypes - folder container unique (React Class) components like ShortAnswer PairAnswer and others