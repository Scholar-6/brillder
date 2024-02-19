# Brillder

## Introduction
This is the frontend repository for the Brillder application [https://brillder.com](https://brillder.com). It is public and open source on purpose as we are happy for people to fork and experiment, it also makes on boarding of new developers to our project. However it is important for investors, potential investors and other stakeholders to understand that the Apache 2.0 license on this repository does not allow others to use the Brillder brand and colours, also note that the backend is closed-source and the code is not accessible to the public. This frontend is only really useful when accessing content from the Brillder api [https://api.brillder.com](https://api.brillder.com) and all the content accessed from that API is copyrighted and under license with certain restrictions on how it can be accessed (i.e. you can only submit play attempts so many times before paying a subscription). 

For more information please see [https://brillder.com](https://brillder.com) or contact us on [hello@brillder.com](mailto:hello@brillder.com)

## Development Version
All changes to development branch are automatically deployed to http://dev-brillder.scholar6.org

## Run Project  

Run the project locally (Windows and Linux) and connect to the dev-api:
.

* Requires Git and NPM  
* `git clone git@github.com:Scholar-6/brillder`  
* `cd brillder`  
* add an entry to the hosts file   
** linux /etc/hosts  
** windows C:\Windows\System32\Drivers\etc\hosts  
`127.0.0.1 local-brillder.scholar6.org` 
* create .env file with the following values  
        REACT_APP_BACKEND_HOST=https://dev-api.brillder.com  
        REACT_APP_VERSION=$npm_package_version  
        # $npm_package_version points to the package.json 
        REACT_APP_DESMOS_API_KEY=dcb31709b452b1cf9dc26972add0fda6  
        HOST=local-brillder.brillder.com  
        PORT=3000  
        # comment the following out if running the backend locally
        HTTPS=true  
        REACT_APP_MATOMO_URL=https://matomo.brillder.com/js/container_UkdV64XH.js  
* `npm install`  
* `npm start`  
* Go to http://localbrillder.com:3000  
* If you do not have an account registered on https://app.brillder.com then click signup option  


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

.


## MAP
/back-to-work       - auto redirect to build learn or teach tab based on user roles


/play/dashboard        - view all page
/build/new-brick - create new brick page
/build/brick/{brickId}/investigation/question - investigation build page
