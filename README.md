# Tasks And Workflow Frontend Engineer Technical Assessment

The intent of this technical assessment is for you to build a frontend web application which allows clinicians to login and view their patients.

We have developed a mock API for use in implementing the features of the app.

Don't worry if you are unable to complete all of the features of the app. We are mainly interested in seeing your approach to designing and implementing a quality frontend web application.

You should spend 2-4 hours on this challenge but this is a general guide - not a rule. You are free to submit your response as you like.

## Submitting Your Response

You may submit your response in a variety of ways:

- Send us a link to your public Git repository containing your code (preferred)
- Send us a link to a private Git repository with a link for us to have view permissions
- Send us a zip file of your code

Please include instructions in the README on how to run your app. Ideally, it should be as simple as `npm start`. Also, feel free to include any justifications for design decisions you've 

## Tech Stack

You may use whatever technologies you would like to implement your app, but here is the tech stack we use:

- React
- Material UI
- TypeScript
- Create React App

And here is a link to an example containing the above technologies, which may be used to kickstart your app: https://github.com/mui/material-ui/tree/master/examples/create-react-app-with-typescript (requires at least Node.js v16).

## Instructions

This section explains the tasks you must perform and provides hints and details on how to do it.

For each task, reference the [Mock API](#mock-api-documentation) and [Models](#models) sections to understand how to call each endpoint and what the response formats are.

Here is a diagram showing a UI wireframe of the app:

![UI wireframe](ui-wireframe.png)

### Login Page

Your first task is to develop the login page.

The login page needs a username field, a password field, and a login button.

You must use the `/login` endpoint of our [Mock API](#mock-api-documentation) to perform the login. Note that the login endpoint uses [Basic Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization#basic_authentication) which is based on the username and password to perform the login.

Our mock API works with the following two clinicians with the following login credentials:

| username | password |
| -------- | -------- |
| joshs    | vuuGfKkt |
| amyb     | qhZyuKGf |

Upon logging in, the mock API will make a randomly-generated session token available in the browser's [Session Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) under the key: `session-token`. When calling any of the other secure endpoints, you must use it as the value of the request's `Authorization` header.

### Dashboard

After logging in, a clinician should see another screen which will contain their details, their patients, and their patient's details. The top left of the dashboard should say "Clinical Portal".

#### Viewing Clinician Details

The clinician must be able to see their details in the top right of the dashboard.

You must use the `/clinician-details` secure endpoint of our [Mock API](#mock-api-documentation) to retrieve the details of the logged in clinician.

You must display the clinician's formatted name, their role.

If they have a preferred name, their formatted name is:

`<title> (<preferredName>) <middleName> <familyName> <suffix>`

Otherwise, their formatted name is:

`<title> <middleName> <familyName> <suffix>`

#### Viewing a Clinician's Patients

In the middle of the dashboard, the clinician must be able to see a tabbed view of their patients.

You must use the `/patients` secure endpoint of our [Mock API](#mock-api-documentation) to retrieve the patients for the currently logged in clinician.

You must display the IDs and names of the patients in the following format:

`<name> (<id>)`

#### Viewing Details of a Clinician's Patient

When a specific patient is selected in the tabbed view mentioned above, the clinician must be able to see that patient's details.

You must use the `/patient-details/:patientId` secure endpoint of our [Mock API](#mock-api-documentation) to retrieve the details of a specific patient.

You must display all of the information for the patient, and you must format their name in the same way that the clinician's name is formatted.

## Mock API

In order to faciliate this technical challenge, we have provided a [documented Mock API](#mock-api-documentation).

You must add the `fetch-mock` library as a dependency in your app (for example: `npm install --save fetch-mock`) and you must copy and paste the contents of the [Mock API Source file](mock-api-source.js) into your app and then you must call it to initialize the mock API. ES6 Example:

```javascript
import fetchMock from 'fetch-mock';
import initFetchMock from './initFetchMock';
initFetchMock(fetchMock);
```

After this has been done, your `fetch` function will be mocked so that you can call our [Mock API](#mock-api-documentation). For example:

```javascript
fetch('/login'); // will return a mocked promise
```

## Mock API Documentation

| Description                       | URL                           | HTTP Method | Request Headers                                                                                                                             | Success Response Format (Code + Body)           | Error Response Format (Code + Body)                                                                                                                                  |
| --------------------------------- | ----------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Login                             | `/login`                      | `POST`      | [Basic Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization#basic_authentication) `Authorization` header | `204` - empty body                              | `400` if you have not provided an `Authorization` header in your request or if the credentials provided in it are incorrect                                          |
| Retrieve a Clinician's Details    | `/clinician-details`          | `GET`       | `Authorization` header with a valid session token                                                                                           | `200` - [Clinician Details](#clinician-details) | `401` if you are not logged or if you have not provided a valid session token                                                                                        |
| Retrieve Patients for a Clinician | `/patients`                   | `GET`       | `Authorization` header with a valid session token                                                                                           | `200` - [Patient List](#patient-list)           | `401` if you are not logged or if you have not provided a valid session token                                                                                        |
| Retrieve Patient Details          | `/patient-details/:patientId` | `GET`       | `Authorization` header with a valid session token                                                                                           | `200` - [Patient Details](#patient-details)     | `401` if you are not logged or if you have not provided a valid session token<br>`404` if the requested patient does not exist for the currently logged in clinician |

### Models

Note that these models are represented in TypeScript. The properties containing a `?` symbol are optional. Properties ending with `[]` represent an array of those properties.

#### Clinician Details

```typescript
{
  username: string;
  role: string;
  title?: string;
  firstName: string;
  preferredName?: string;
  middleName?: string;
  familyName: string;
  suffix?: string;
}
```

#### Patient List

```typescript
{
  patients: {
    id: string;
    name: string;
  }
  [];
}
```

#### Patient Details

```typescript
{
  title?: string;
  firstName: string;
  preferredName?: string;
  middleName?: string;
  familyName: string;
  suffix?: string;
  age: number;
  sex: 'Male' | 'Female' | 'Unknown' | 'Indeterminate';
}
```

#### Error Responses

All error response streams will be [JSON-parsable](https://developer.mozilla.org/en-US/docs/Web/API/Response/json) and will be in the following format:

```javascript
{
  httpStatusCode: number;
  errorMessage: string;
}
```
