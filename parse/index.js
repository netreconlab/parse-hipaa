// Example express application adding the parse-server module to expose Parse
// compatible API routes.

const express = require('express');
const { default: ParseServer, ParseGraphQLServer } = require('./lib/index');
const FSFilesAdapter = require('@parse/fs-files-adapter');
const GridFSBucketAdapter = require('./lib/Adapters/Files/GridFSBucketAdapter')
  .GridFSBucketAdapter;
var path = require('path');
var databaseUri = process.env.PARSE_SERVER_DATABASE_URI;

if (!databaseUri) {
  console.log('PARSE_SERVER_DATABASE_URI not specified, falling back to localhost.');
}

var allowNewClasses = false;
if (process.env.PARSE_SERVER_ALLOW_CLIENT_CLASS_CREATION == 'true'){
    allowNewClasses = true
}

//If you want to allow your server to accept files on postgres, you need to secure the file url links yourself
//Need to use local file adapter for postgres
var fileAdapter;
if (process.env.PARSE_SERVER_DATABASE_URI.indexOf('postgres') !== -1){
  filesAdapter = new FSFilesAdapter();
}else{
  filesAdapter = new GridFSBucketAdapter(
    databaseUri,
    {},
    process.env.PARSE_SERVER_ENCRYPTION_KEY
  );
}

const api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.PARSE_SERVER_CLOUD || __dirname + '/cloud/main.js',
  appId: process.env.PARSE_SERVER_APPLICATION_ID || 'myAppId',
  masterKey: process.env.PARSE_SERVER_MASTER_KEY || '', //Add your master key here. Keep it secret!
  //readOnlyMasterKey: process.env.PARSE_SERVER_READ_ONLY_MASTER_KEY,
  encryptionKey: process.env.PARSE_SERVER_ENCRYPTION_KEY,
  objectIdSize: parseInt(process.env.PARSE_SERVER_OBJECT_ID_SIZE) || 10,
  serverURL: process.env.PARSE_SERVER_URL || 'http://localhost:' +process.env.PORT + '/parse',  // Don't forget to change to https if needed
  publicServerURL: process.env.PARSE_PUBLIC_SERVER_URL || 'http://localhost:' +process.env.PORT + '/parse',
  verbose: process.env.VERBOSE,
  allowClientClassCreation: allowNewClasses,
  filesAdapter: filesAdapter,
  allowCustomObjectId: true,
  //Setup your push adatper
  /*push: {
    ios: [
      {
        pfx: '',
        topic: '',
        production: false
      }
    ]
  },
  auth: {
   apple: {
     client_id: "",
   },
   facebook: {
     appIds:
   }
  },*/
  liveQuery: {
    classNames: ["GameScore", "Book", "Author"] // List of classes to support for query subscriptions
  },
  verifyUserEmails: false,
  //Setup your mail adapter
  /*emailAdapter: {
    module: '@parse/simple-mailgun-adapter',
      /*options: {
        // The address that your emails come from
        fromAddress: '',
        // Your domain from mailgun.com
        domain: '',
        // Your API key from mailgun.com
        apiKey: '',
        // The template section
        templates: {
            passwordResetEmail: {
              subject: 'Reset your password',
              pathPlainText: path.join(__dirname, 'email-templates/password_reset_email.txt'),
              pathHtml: path.join(__dirname, 'email-templates/password_reset_email.html'),
              callback: (user) => {}//{ return { firstName: user.get('firstName') }}
            // Now you can use {{firstName}} in your templates
            },
            verificationEmail: {
              subject: 'Confirm your account',
              pathPlainText: path.join(__dirname, 'email-templates/verification_email.txt'),
              pathHtml: path.join(__dirname, 'email-templates/verification_email.html'),
                callback: (user) => {}//{ return { firstName: user.get('firstName') }}
                // Now you can use {{firstName}} in your templates
            },
            customEmailAlert: {
              subject: 'Urgent notification!',
              pathPlainText: path.join(__dirname, 'email-templates/custom_email.txt'),
              pathHtml: path.join(__dirname, 'email-templates/custom_email.html'),
            }
        }
    }
  },*/
  emailVerifyTokenValidityDuration: 2 * 60 * 60, // in seconds (2 hours = 7200 seconds)
  // set preventLoginWithUnverifiedEmail to false to allow user to login without verifying their email
  // set preventLoginWithUnverifiedEmail to true to prevent user from login if their email is not verified
  preventLoginWithUnverifiedEmail: false, // defaults to false
  // account lockout policy setting (OPTIONAL) - defaults to undefined
  // if the account lockout policy is set and there are more than `threshold` number of failed login attempts then the `login` api call returns error code `Parse.Error.OBJECT_NOT_FOUND` with error message `Your account is locked due to multiple failed login attempts. Please try again after <duration> minute(s)`. After `duration` minutes of no login attempts, the application will allow the user to try login again.
  accountLockout: {
    duration: 5, // duration policy setting determines the number of minutes that a locked-out account remains locked out before automatically becoming unlocked. Set it to a value greater than 0 and less than 100000.
    threshold: 3, // threshold policy setting determines the number of failed sign-in attempts that will cause a user account to be locked. Set it to an integer value greater than 0 and less than 1000.
  },
  // optional settings to enforce password policies
  /*passwordPolicy: {
    // Two optional settings to enforce strong passwords. Either one or both can be specified.
    // If both are specified, both checks must pass to accept the password
    // 1. a RegExp object or a regex string representing the pattern to enforce
    validatorPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, // enforce password with at least 8 char with at least 1 lower case, 1 upper case and 1 digit
    // 2. a callback function to be invoked to validate the password
    //validatorCallback: (password) => { return validatePassword(password) },
    validationError: 'Password must have atleast 8 characters and contain at least 1 digit.', // optional error message to be sent instead of the default "Password does not meet the Password Policy requirements." message.
    doNotAllowUsername: true, // optional setting to disallow username in passwords
    //maxPasswordAge: 90, // optional setting in days for password expiry. Login fails if user does not reset the password within this period after signup/last reset.
    maxPasswordHistory: 5, // optional setting to prevent reuse of previous n passwords. Maximum value that can be specified is 20. Not specifying it or specifying 0 will not enforce history.
    //optional setting to set a validity duration for password reset links (in seconds)
    resetTokenValidityDuration: 24*60*60, // expire after 24 hours
  }*/
});

// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_SERVER_MOUNT_PATH || '/parse';
app.use(mountPath, api.app);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please start the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
/*app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});
*/
if(process.env.PARSE_SERVER_MOUNT_GRAPHQL){
  const parseGraphQLServer = new ParseGraphQLServer(
    api,
    {
      graphQLPath: '/graphql',
      playgroundPath: '/playground'
    }
  );
  app.use('/parse', api.app); // (Optional) Mounts the REST API
  parseGraphQLServer.applyGraphQL(app); // Mounts the GraphQL API
}

//If you are not using ParseCareKit, set PARSE_USING_PARSECAREKIT to 0
if(process.env.PARSE_USING_PARSECAREKIT == "1"){
    createIndexes();
}

const host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, host, function() {
    console.log('parse-server running on port ' + port + '.');
    console.log('publicServerURL: ' + process.env.PARSE_PUBLIC_SERVER_URL + ', serverURL: ' + process.env.PARSE_SERVER_URL);
    console.log('REST API running on ' + process.env.PARSE_PUBLIC_SERVER_URL);
    if(process.env.PARSE_SERVER_MOUNT_GRAPHQL)
      console.log('GraphQL API running on ' + 'http://localhost:1337/graphql');
});

async function createIndexes(){
    await Parse.Cloud.run('ensureClassDefaultFieldsForParseCareKit');
    let adapter = api.config.databaseController.adapter;
    const indexEntityIdPostfix = '_entityId';
    const indexEffectiveDatePostfix = '_effectiveDate';
    
    const schema = {
      fields: {
        uuid: { type: 'String' }
      },
    };
    
    const versionedSchema = {
      fields: {
        uuid: { type: 'String' },
        entityId: { type: 'String' },
        effectiveDate: { type: 'Date' }
      },
    };
    
    await adapter.ensureUniqueness('Patient', versionedSchema, ['uuid'])
    .catch(error => console.log(error));
    await adapter.ensureIndex('Patient', versionedSchema, ['entityId'], 'Patient'+indexEntityIdPostfix, false)
    .catch(error => console.log(error));
    await adapter.ensureIndex('Patient', versionedSchema, ['effectiveDate'], 'Patient'+indexEffectiveDatePostfix, false)
    .catch(error => console.log(error));

    await adapter.ensureUniqueness('Contact', versionedSchema, ['uuid'])
    .catch(error => console.log(error));
    await adapter.ensureIndex('Contact', versionedSchema, ['entityId'], 'Contact'+indexEntityIdPostfix, false)
    .catch(error => console.log(error));
    await adapter.ensureIndex('Contact', versionedSchema, ['effectiveDate'], 'Contact'+indexEffectiveDatePostfix, false)
    .catch(error => console.log(error));
    
    await adapter.ensureUniqueness('CarePlan', versionedSchema, ['uuid'])
    .catch(error => console.log(error));
    await adapter.ensureIndex('CarePlan', versionedSchema, ['entityId'], 'CarePlan'+indexEntityIdPostfix, false)
    .catch(error => console.log(error));
    await adapter.ensureIndex('CarePlan', versionedSchema, ['effectiveDate'], 'CarePlan'+indexEffectiveDatePostfix, false)
    .catch(error => console.log(error));
    
    await adapter.ensureUniqueness('Task', versionedSchema, ['uuid'])
    .catch(error => console.log(error));
    await adapter.ensureIndex('Task', versionedSchema, ['entityId'], 'Task'+indexEntityIdPostfix, false)
    .catch(error => console.log(error));
    await adapter.ensureIndex('Task', versionedSchema, ['effectiveDate'], 'Task'+indexEffectiveDatePostfix, false)
    .catch(error => console.log(error));
    
    await adapter.ensureUniqueness('Outcome', versionedSchema, ['uuid'])
    .catch(error => console.log(error));
    await adapter.ensureIndex('Outcome', versionedSchema, ['entityId'], 'Outcome'+indexEntityIdPostfix, false)
    .catch(error => console.log(error));
    
    await adapter.ensureUniqueness('Clock', schema, ['uuid'])
    .catch(error => console.log(error));
    
    //Because of way ParseCareKit handles this class, comment out these checks
    /*
    await adapter.ensureUniqueness('OutcomeValue', schema, ['uuid'])
    .catch(error => console.log(error));
    
    await adapter.ensureUniqueness('Note', schema, ['uuid'])
    .catch(error => console.log(error));
    */
    
}

//If you are custimizing your own user schema, set PARSE_SET_USER_CLP to 0
if(process.env.PARSE_SET_USER_CLP == "1"){
    //Fire after 5 seconds to allow _User class to be created
    setTimeout(async function() {
      await Parse.Cloud.run('setUserClassLevelPermissions');
      if(process.env.PARSE_USING_PARSECAREKIT == "1"){
        Parse.Cloud.run('setAuditClassLevelPermissions');
      }
    },  3000);
}


// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);

/*
//Below is for SSL, but you should probably run this behind a proxy instead
var fs = require('fs');
var httpsServer = require('https').createServer({

  pfx: fs.readFileSync(''),
  ca: fs.readFileSync('')

}, app);

httpsServer.listen(port, host, function() {
    console.log('parse-server running on port ' + port + '.');
});
*/
