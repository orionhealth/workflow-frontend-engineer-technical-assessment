function initFetchMock(fetchMockInstance) {
  /*
   * Clinician Logins (Username & Password)
   * joshs vuuGfKkt
   * amyb qhZyuKGf
   */
  function generateId() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  function generateRandomDelay() {
    return Math.floor(Math.random() * 2000) + 500;
  }
  var SESSION_TOKEN_SESSION_STORAGE_KEY = 'session-token';
  var LOGGED_IN_USER_SESSION_STORAGE_KEY = 'logged-in-user';
  function generateErrorResponse(status, errorMessage) {
    return new Response(JSON.stringify({
      error: errorMessage
    }), {
      status: status
    });
  }
  var JOSH_SMITH_USERNAME = 'joshs';
  var JOSH_SMITH_BASIC_AUTH = 'Basic am9zaHM6dnV1R2ZLa3Q=';
  var JOSH_SMITH_DETAILS = {
    username: 'joshs',
    role: 'General Practitioner',
    title: 'Dr',
    firstName: 'Joshua',
    preferredName: 'Josh',
    familyName: 'Smith',
  };
  var JOSH_SMITH_PATIENTS = [{
    id: 'STEVEA-0012',
    name: 'Stevie Anderson'
  }, {
    id: 'STACY-1050',
    name: 'Stacy Peters'
  }];
  var JOSH_SMITH_PATIENT_DETAILS_BY_ID = {
    'STEVEA-0012': {
      firstName: 'Steve',
      preferredName: 'Stevie',
      familyName: 'Anderson',
      suffix: 'Jr.',
      age: 22,
      sex: 'Male'
    },
    'STACY-1050': {
      title: 'Miss',
      firstName: 'Stacy',
      middleName: 'Jane',
      familyName: 'Peters',
      age: 21,
      sex: 'Unknown'
    }
  };
  var AMY_BARKER_USERNAME = 'amyb';
  var AMY_BARKER_BASIC_AUTH = 'Basic YW15YjpxaFp5dUtHZg==';
  var AMY_BARKER_DETAILS = {
    username: 'amyb',
    role: 'Physician',
    firstName: 'Amy',
    familyName: 'Barker',
    suffix: 'M.D.',
  };
  var AMY_BARKER_PATIENTS = [{
    id: 'JAYC-8391',
    name: 'Jay Cooper'
  }, {
    id: 'BARB-1839',
    name: 'Barbara Johnson'
  }];
  var AMY_BARKER_PATIENT_DETAILS_BY_ID = {
    'JAYC-8391': {
      title: 'Mr.',
      firstName: 'James',
      preferredName: 'Jay',
      middleName: 'Shaun',
      familyName: 'Cooper',
      age: 17,
      sex: 'Indeterminate'
    },
    'BARB-1839': {
      title: 'Mrs.',
      firstName: 'Barbara',
      familyName: 'Johnson',
      age: 42,
      sex: 'Female'
    }
  };
  fetchMockInstance.post({
    url: 'path:/login',
    delay: generateRandomDelay()
  }, function (_path, opts, e) {
    var auth;
    if (opts.headers.hasOwnProperty('Authorization')) {
      auth = opts.headers.Authorization;
    } else if (opts.headers.get) {
      auth = opts.headers.get('Authorization');
    } else {
      return generateErrorResponse(400, 'Missing Authorization header with Basic Authentication');
    }
    if (auth === JOSH_SMITH_BASIC_AUTH) {
      window.sessionStorage.setItem(SESSION_TOKEN_SESSION_STORAGE_KEY, generateId());
      window.sessionStorage.setItem(LOGGED_IN_USER_SESSION_STORAGE_KEY, JOSH_SMITH_USERNAME);
      return new Response(204);
    }
    if (auth === AMY_BARKER_BASIC_AUTH) {
      window.sessionStorage.setItem(SESSION_TOKEN_SESSION_STORAGE_KEY, generateId());
      window.sessionStorage.setItem(LOGGED_IN_USER_SESSION_STORAGE_KEY, AMY_BARKER_USERNAME);
      return new Response(204);
    }
    return generateErrorResponse(400, 'You have provided incorrect credentials');
  }).get({
    url: 'path:/clinician-details',
    delay: generateRandomDelay()
  }, function (_path, opts) {
    var sessionToken = window.sessionStorage.getItem(SESSION_TOKEN_SESSION_STORAGE_KEY);
    if (sessionToken === null) {
      return generateErrorResponse(401, 'You must be logged in view your details');
    }
    var auth;
    if (opts.headers.hasOwnProperty('Authorization')) {
      auth = opts.headers.Authorization;
    } else if (opts.headers.get) {
      auth = opts.headers.get('Authorization');
    } else {
      return generateErrorResponse(401, 'Missing Authorization header');
    }
    if (auth !== sessionToken) {
      return generateErrorResponse(401, 'Incorrect credentials provided');
    }
    var loggedInUser = window.sessionStorage.getItem(LOGGED_IN_USER_SESSION_STORAGE_KEY);
    return new Response(JSON.stringify(loggedInUser === JOSH_SMITH_USERNAME ? JOSH_SMITH_DETAILS : AMY_BARKER_DETAILS), {
      status: 200
    });
  }).get({
    url: 'path:/patients',
    delay: generateRandomDelay()
  }, function (_path, opts) {
    var sessionToken = window.sessionStorage.getItem(SESSION_TOKEN_SESSION_STORAGE_KEY);
    if (sessionToken === null) {
      return generateErrorResponse(401, 'You must be logged in to view your patients');
    }
    var auth;
    if (opts.headers.hasOwnProperty('Authorization')) {
      auth = opts.headers.Authorization;
    } else if (opts.headers.get) {
      auth = opts.headers.get('Authorization');
    } else {
      return generateErrorResponse(401, 'Missing Authorization header');
    }
    if (auth !== sessionToken) {
      return generateErrorResponse(401, 'Incorrect credentials provided');
    }
    var loggedInUser = window.sessionStorage.getItem(LOGGED_IN_USER_SESSION_STORAGE_KEY);
    return new Response(JSON.stringify({
      patients: loggedInUser === JOSH_SMITH_USERNAME ? JOSH_SMITH_PATIENTS : AMY_BARKER_PATIENTS
    }), {
      status: 200
    });
  }).get({
    url: 'express:/patient-details/:patientId',
    delay: generateRandomDelay()
  }, function (path, opts) {
    var sessionToken = window.sessionStorage.getItem(SESSION_TOKEN_SESSION_STORAGE_KEY);
    if (sessionToken === null) {
      return generateErrorResponse(401, 'You must be logged in to view patient details');
    }
    var auth;
    if (opts.headers.hasOwnProperty('Authorization')) {
      auth = opts.headers.Authorization;
    } else if (opts.headers.get) {
      auth = opts.headers.get('Authorization');
    } else {
      return generateErrorResponse(401, 'Missing Authorization header');
    }
    if (auth !== sessionToken) {
      return generateErrorResponse(401, 'Incorrect credentials provided');
    }
    var loggedInUser = window.sessionStorage.getItem(LOGGED_IN_USER_SESSION_STORAGE_KEY);
    var patientId = new URL(path, window.location.origin).pathname.split('/').filter(Boolean).pop();
    if (loggedInUser === JOSH_SMITH_USERNAME && !JOSH_SMITH_PATIENTS.flatMap(function (patient) {
      return patient.id;
    }).includes(patientId) || loggedInUser === AMY_BARKER_USERNAME && !AMY_BARKER_PATIENTS.flatMap(function (patient) {
      return patient.id;
    }).includes(patientId)) {
      return generateErrorResponse(404, 'That patient does not exist');
    }
    return new Response(JSON.stringify(loggedInUser === JOSH_SMITH_USERNAME ? JOSH_SMITH_PATIENT_DETAILS_BY_ID[patientId] : AMY_BARKER_PATIENT_DETAILS_BY_ID[patientId]), {
      status: 200
    });
  });
  console.info('Successfully initialized the mock API.');
}
