This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Development Version
All changes to development branch are automatically deployed to http://dev-brillder.scholar6.org


## Run Project  

Run the project locally (Windows and Linux) and connect to the dev-api:

* Requires Git and NPM  
* `git clone git@github.com:Scholar-6/brillder`  
* `cd brillder`  
* add an entry to the hosts file   
** linux /etc/hosts  
** windows C:\Windows\System32\Drivers\etc\hosts  
`127.0.0.1 local-brillder.scholar6.org` 
* create .env file with the following values  
        REACT_APP_BACKEND_HOST=https://dev-api.brillder.com  
        REACT_APP_ZENDESK_ID=33210b3d-b3d5-43ba-9b07-70acce8c10b6  
        REACT_APP_VERSION=$npm_package_version  
        # $npm_package_version points to the package.json 
        REACT_APP_BUILD_AUTO_SAVE_DELAY=500  
        REACT_APP_DESMOS_API_KEY=dcb31709b452b1cf9dc26972add0fda6  
        REACT_APP_STRIPE_PK=
        HOST=local-brillder.brillder.com  
        PORT=3000  
        HTTPS=true  
* `npm install`  
* `npm start`  
* Go to http://local-brillder.scholar6.org:3000  
* If you do not have an account registered on https://dev-brillder.scholar6.org then click signup option  

## Available Scripts

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


## MAP
/back-to-work       - auto redirect to build learn or teach tab based on user roles

/play/dashboard        - view all page
/build/new-brick - create new brick page
/build/brick/{brickId}/investigation/question - investigation build page