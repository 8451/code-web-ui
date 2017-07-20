# CodeWebUi

![MainPage](https://github.8451.com/storage/user/490/files/1ad3219e-6d5b-11e7-8971-16a536264ce9)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.3.

## Setup

NPM is needed for work on this project.  If you do not have NPM, download it [here](https://www.npmjs.com/). Run `npm install` prior to working on the project in order to get all needed dependencies.

## Development server

Run `ng serve --proxy-config proxy.conf.json` or `npm start` for a dev server. Navigate to `http://loclhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Dependent Services

The web application will default to referencing the service and BFF in the CI environment.  This ensures all changes in the local web application are using the most up-to-date accepted versions of the service and BFF. In order to run CoDE-Web-UI completely locally, you will need the latest version of the following services running:

* MongoDB
    - Open a terminal and run `mongod` in order to start your local mongo service.
* code-bff on port 8090
    - In `proxy.conf.json` change the target to `localhost:8090/api`. Do not push this change.
    - Additional configuration is needed in the BFF so that it references the local service. See the readme `code-bff` for further help.
* code-service on port 8080

## CI Location

The current version of `develop` will be running in the CI environment at [http://code-web-ui.ci.cfapps.int.8451.com](http://code-web-ui.ci.cfapps.int.8451.com).

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test -sr` (no code coverage) or `ng test -sr -cc` (with code coverage) to execute the unit tests via [Karma](https://karma-runner.github.io). If you need all test when a file is changed, run `ng test`.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Deployment Instructions

**Note:** Use the azure-deploy.py file provided in the services repository

**You may need to update `src/web.config` to proxy to the correct BFF endpoint.**

**Just modify `<action type="Rewrite" url="https://code-bff.azurewebsites.net/api/v1/{R:1}" logRewrittenUrl="true" />`
to point to the correct url**.

```sh
ng build --aot -prod
python3 azure-deploy.py -d dist/ --host ${AZURE_HOST} -u code-web-ui\\${DEPLOY_USER} -xdt applicationHost.xdt
```
