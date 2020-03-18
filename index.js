// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
const { default: ParseServer, ParseGraphQLServer } = require('parse-server');
var path = require('path');
var databaseUri = process.env.PARSE_SERVER_DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('PARSE_SERVER_DATABASE_URI not specified, falling back to localhost.');
}

const api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.PARSE_SERVER_CLOUD || __dirname + '/cloud/main.js',
  appId: process.env.PARSE_SERVER_APPLICATION_ID || 'myAppId',
  masterKey: process.env.PARSE_SERVER_MASTER_KEY || '', //Add your master key here. Keep it secret!
  //readOnlyMasterKey: process.env.PARSE_SERVER_READ_ONLY_MASTER_KEY,
  serverURL: process.env.PARSE_SERVER_URL || 'http://localhost:' +process.env.PORT + '/parse',  // Don't forget to change to https if needed
  publicServerURL: process.env.PARSE_PUBLIC_SERVER_URL || 'http://localhost:' +process.env.PORT + '/parse',
  verbose: process.env.VERBOSE,
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
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
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
  passwordPolicy: {
    // Two optional settings to enforce strong passwords. Either one or both can be specified.
    // If both are specified, both checks must pass to accept the password
    // 1. a RegExp object or a regex string representing the pattern to enforce
    validatorPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, // enforce password with at least 8 char with at least 1 lower case, 1 upper case and 1 digit
    // 2. a callback function to be invoked to validate the password
    validatorCallback: (password) => { return validatePassword(password) },
    validationError: 'Password must contain at least 1 digit.', // optional error message to be sent instead of the default "Password does not meet the Password Policy requirements." message.
    doNotAllowUsername: true, // optional setting to disallow username in passwords
    maxPasswordAge: 90, // optional setting in days for password expiry. Login fails if user does not reset the password within this period after signup/last reset.
    maxPasswordHistory: 5, // optional setting to prevent reuse of previous n passwords. Maximum value that can be specified is 20. Not specifying it or specifying 0 will not enforce history.
    //optional setting to set a validity duration for password reset links (in seconds)
    resetTokenValidityDuration: 24*60*60, // expire after 24 hours
  }
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
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

if(process.env.PARSE_SERVER_MOUNT_GRAPHQL){
  const parseGraphQLServer = new ParseGraphQLServer(
    api,
    {
      graphQLPath: '/graphql',
      playgroundPath: '/playground'
    }
  );
  //app.use('/parse', parseServer.app); // (Optional) Mounts the REST API
  parseGraphQLServer.applyGraphQL(app); // Mounts the GraphQL API
}

const host = process.env.HOST || '0.0.0.0';
var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, host, function() {
    console.log('parse-server running on port ' + port + '.');
    console.log('publicServerURL: ' + process.env.PARSE_PUBLIC_SERVER_URL + ', serverURL: ' + process.env.PARSE_SERVER_URL);
    if(process.env.PARSE_SERVER_MOUNT_GRAPHQL)
      console.log('GraphQL API running on ' + process.env.PARSE_PUBLIC_SERVER_URL + 'graphql');
});

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

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpsServer);
*/
