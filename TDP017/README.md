# TDP017



## Android application


## Backend


## Frontend

A frontend was created to administrate data from the server and is made in REACT. For full manual of this wireframe please visit [https://create-react-app.dev/] (REACT homepage). The page is mostly made without hooks and try to follow ES6 as much as possible. Source code is located in folder frontend/admin-web-app. 

### Dependencies used

Following list show the dependencies
* react / react-dom / react-scripts   => For basic React features
* react-vis                           => Visualization of data
* xlsx                                => Convert json object to xlsx file
* @trendmicro/react-sidenav           => Boilerplate for a sidenav

### Start frontend in development mode

#### `npm install`

This script will install all dependencies used for this project. They will be installed under the folder node_modules. If the project has been cloned from a repository this script has to be run before working on the source code.

#### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### Deployment of frontend

There is a README.md file in folder /frontend/admin-web-app/ which describe a deployment.

## Source code comments - JS Doc

The project is prepared for JSDoc and all JS classes which are running in the background are all documented with this standard. More could be read at there [https://github.com/jsdoc/jsdoc] GitHub. No manual has been generated into the repo. 

### Possible error and how to remove them

#### Error: ENOSPC: System limit for number of file watchers reached

This could problem on Linux when your system file watchers reach its limit (8192). It's possible to increase this limit by:

Set temporary limit:
```bash
    $ sudo sysctl fs.inotify.max_user_watches=524288
    $ sudo sysctl -p
```

Set permanent limit:
```bash
    $ echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
    $ sudo sysctl -p
```

