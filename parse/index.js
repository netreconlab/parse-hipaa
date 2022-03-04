// Example express application adding the parse-server module to expose Parse
// compatible API routes.

const express = require('express');
const { default: ParseServer, ParseGraphQLServer, RedisCacheAdapter } = require('./lib/index');
const FSFilesAdapter = require('@parse/fs-files-adapter');
const GridFSBucketAdapter = require('./lib/Adapters/Files/GridFSBucketAdapter')
  .GridFSBucketAdapter;
const path = require('path');
const cors = require('cors');
const mountPath = process.env.PARSE_SERVER_MOUNT_PATH || '/parse';
const graphMountPath = process.env.PARSE_SERVER_GRAPHQL_PATH || '/graphql';
const serverURL = process.env.PARSE_SERVER_URL || 'http://localhost:' + process.env.PORT + mountPath;
const publicServerURL = process.env.PARSE_SERVER_PUBLIC_URL || serverURL;
const cacheMaxSize = parseInt(process.env.PARSE_SERVER_CACHE_MAX_SIZE) || 10000;
const cacheTTL = parseInt(process.env.PARSE_SERVER_CACHE_TTL) || 5000;
const objectIdSize = parseInt(process.env.PARSE_SERVER_OBJECT_ID_SIZE) || 10;

const allowNewClasses = false;
if (process.env.PARSE_SERVER_ALLOW_CLIENT_CLASS_CREATION == 'true'){
  allowNewClasses = true
}

let allowCustomObjectId = false;
if (process.env.PARSE_SERVER_ALLOW_CUSTOM_OBJECTID == 'true'){
  allowCustomObjectId = true
}

let enableSchemaHooks = false;
if (process.env.PARSE_SERVER_ENABLE_SCHEMA_HOOKS == 'true'){
  enableSchemaHooks = true
}

let useDirectAccess = false;
if (process.env.PARSE_SERVER_DIRECT_ACCESS == 'true'){
  useDirectAccess = true
}

let enforcePrivateUsers = false;
if (process.env.PARSE_SERVER_ENABLE_PRIVATE_USERS == 'true'){
  enforcePrivateUsers = true
}

let verbose = false;
if (process.env.PARSE_VERBOSE == 'true'){
  verbose = true
}

let enableGraphQL = false;
if (process.env.PARSE_SERVER_MOUNT_GRAPHQL == 'true'){
  enableGraphQL = true
}

let fileUploadPublic = false;
if (process.env.PARSE_SERVER_FILE_UPLOAD_PUBLIC == 'true'){
  fileUploadPublic = true
}

let fileUploadAnonymous = true;
if (process.env.PARSE_SERVER_FILE_UPLOAD_ANONYMOUS == 'false'){
  fileUploadAnonymous = false
}

let fileUploadAuthenticated = true;
if (process.env.PARSE_SERVER_FILE_UPLOAD_AUTHENTICATED == 'false'){
  fileUploadAuthenticated = false
}

let enableAnonymousUsers = true;
if (process.env.PARSE_SERVER_ENABLE_ANON_USERS == 'false'){
  enableAnonymousUsers = false
}

let pushNotifications = process.env.PARSE_SERVER_PUSH || {};
let authentication = process.env.PARSE_SERVER_AUTH_PROVIDERS || {}; 

let databaseUri = process.env.PARSE_SERVER_DATABASE_URI || process.env.DB_URL;
if (!databaseUri) {
  console.log('PARSE_SERVER_DATABASE_URI or DB_URL not specified, falling back to localhost.');
}

// Need to use local file adapter for postgres
let filesAdapter = {};
let filesFSAdapterOptions = {}
if ("PARSE_SERVER_ENCRYPTION_KEY" in process.env) {
   filesFSAdapterOptions.encryptionKey = process.env.PARSE_SERVER_ENCRYPTION_KEY;
}

if ("PARSE_SERVER_S3_BUCKET" in process.env) {
  filesAdapter = {
    "module": "@parse/s3-files-adapter",
    "options": {
      "bucket": process.env.PARSE_SERVER_S3_BUCKET,
      "region": process.env.PARSE_SERVER_S3_BUCKET_REGION || 'us-east-2',
      "ServerSideEncryption": process.env.PARSE_SERVER_S3_BUCKET_ENCRYPTION || 'AES256', //AES256 or aws:kms, or if you do not pass this, encryption won't be done
    }
  }
} else if ("PARSE_SERVER_DATABASE_URI" in process.env) {
  if (process.env.PARSE_SERVER_DATABASE_URI.indexOf('postgres') !== -1) {
    filesAdapter = new FSFilesAdapter(filesFSAdapterOptions);
  }
} else if ("DB_URL" in process.env) {
  if (process.env.DB_URL.indexOf('postgres') !== -1) {
    filesAdapter = new FSFilesAdapter(filesFSAdapterOptions);
    databaseUri = `${databaseUri}?ssl=true` // &rejectUnauthorized=false`;
  }  
}

if (Object.keys(filesAdapter).length === 0) {
  filesAdapter = new GridFSBucketAdapter(
    databaseUri,
    {},
    process.env.PARSE_SERVER_ENCRYPTION_KEY
  );
}

let configuration = {
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.PARSE_SERVER_CLOUD || __dirname + '/cloud/main.js',
  appId: process.env.PARSE_SERVER_APPLICATION_ID || 'myAppId',
  masterKey: process.env.PARSE_SERVER_PRIMARY_KEY || 'myKey',
  readOnlyMasterKey: process.env.PARSE_SERVER_READ_ONLY_PRIMARY_KEY || 'myOtherKey',
  encryptionKey: process.env.PARSE_SERVER_ENCRYPTION_KEY,
  objectIdSize: objectIdSize,
  serverURL: serverURL,
  publicServerURL: publicServerURL,
  cacheMaxSize: cacheMaxSize,
  cacheTTL: cacheTTL,
  verbose: verbose,
  allowClientClassCreation: allowNewClasses,
  allowCustomObjectId: allowCustomObjectId,
  enableAnonymousUsers: enableAnonymousUsers,
  filesAdapter: filesAdapter,
  fileUpload: {
    enableForPublic: fileUploadPublic,
    enableForAnonymousUser: fileUploadAnonymous,
    enableForAuthenticatedUser: fileUploadAuthenticated,
  },
  enableSchemaHooks: enableSchemaHooks,
  directAccess: useDirectAccess,
  enforcePrivateUsers: enforcePrivateUsers,
  // Setup your push adatper
  push: pushNotifications,
  auth: authentication,
  liveQuery: {
    classNames: ["Clock"] // List of classes to support for query subscriptions
  },
  verifyUserEmails: false,
  // Setup your mail adapter
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
    //validatorCallback: (password) => { return validatePassword(password) },
    validationError: 'Password must have at least 8 characters, contain at least 1 digit, 1 lower case, 1 upper case, and contain at least one special character.', // optional error message to be sent instead of the default "Password does not meet the Password Policy requirements." message.
    doNotAllowUsername: true, // optional setting to disallow username in passwords
    //maxPasswordAge: 90, // optional setting in days for password expiry. Login fails if user does not reset the password within this period after signup/last reset.
    maxPasswordHistory: 5, // optional setting to prevent reuse of previous n passwords. Maximum value that can be specified is 20. Not specifying it or specifying 0 will not enforce history.
    //optional setting to set a validity duration for password reset links (in seconds)
    resetTokenValidityDuration: 24*60*60, // expire after 24 hours
  }
};

if ("PARSE_SERVER_REDIS_URL" in process.env) {
  const redisOptions = { url: process.env.PARSE_SERVER_REDIS_URL };
  configuration.cacheAdapter = new RedisCacheAdapter(redisOptions);
  // Set LiveQuery URL
  configuration.liveQuery.redisURL = process.env.PARSE_SERVER_REDIS_URL; 
}

if ("PARSE_SERVER_GRAPH_QLSCHEMA" in process.env) {
  configuration.graphQLSchema = process.env.PARSE_SERVER_GRAPH_QLSCHEMA;
}

const api = new ParseServer(configuration);

const app = express();

// Enable All CORS Requests
app.use(cors());

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
app.use(mountPath, api.app);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(_req, res) {
  res.status(200).send('I dream of being a website. Please star the parse-hipaa repo on GitHub!');
});

if(enableGraphQL){
  const parseGraphQLServer = new ParseGraphQLServer(
    api,
    {
      graphQLPath: graphMountPath,
      playgroundPath: '/playground'
    }
  );
  app.use(mountPath, api.app); // (Optional) Mounts the REST API 
  parseGraphQLServer.applyGraphQL(app); // Mounts the GraphQL API
}

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 1337;
const httpServer = require('http').createServer(app);
httpServer.listen(port, host, function() {
  console.log('parse-hipaa is running on port ' + port + '.');
  console.log('Public access: ' + publicServerURL + ', Local access: ' + serverURL);
  console.log('REST API running on ' + publicServerURL);
  if(enableGraphQL)
    console.log('GraphQL API running on ' + graphMountPath);
});

async function createIndexes(){
  const adapter = api.config.databaseController.adapter;
  const indexEntityIdPostfix = '_entityId';
  const indexRemoteIdPostfix = '_remoteId';
  const indexEffectiveDatePostfix = '_effectiveDate';
  const indexUpdatedDatePostfix = '_updatedDate';
  const indexCreatedAtPostfix = '_createdAt';
  const indexLogicalClockPostfix = '_logicalClock';

  const parseSchema = {
    fields: {
      createdAt: { type: 'Date' }
    },
  };

  const schema = {
    fields: {
      uuid: { type: 'String' },
      createdAt: { type: 'Date' }
    },
  };
  
  const versionedSchema = {
    fields: {
      entityId: { type: 'String' },
      remoteID: { type: 'String' },
      effectiveDate: { type: 'Date' },
      updatedDate: { type: 'Date' },
      createdAt: { type: 'Date' },
      logicalClock: { type: 'Number' }
    },
  };

  try {
    await adapter.ensureIndex('Patient', versionedSchema, ['entityId'], 'Patient'+indexEntityIdPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Patient', versionedSchema, ['remoteID'], 'Patient'+indexRemoteIdPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Patient', versionedSchema, ['effectiveDate'], 'Patient'+indexEffectiveDatePostfix, false)
  } catch(error) { console.log(error); } 

  try {
    await adapter.ensureIndex('Patient', versionedSchema, ['updatedDate'], 'Patient'+indexUpdatedDatePostfix, false)
  } catch(error) { console.log(error); } 

  try {
    await adapter.ensureIndex('Patient', versionedSchema, ['createdAt'], 'Patient'+indexCreatedAtPostfix, false)
  } catch(error) { console.log(error); } 

  try {
    await adapter.ensureIndex('Patient', versionedSchema, ['logicalClock'], 'Patient'+indexLogicalClockPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Patient_Audit', schema, ['createdAt'], 'Patient_Audit'+indexCreatedAtPostfix, false)
  } catch(error) { console.log(error); } 

  try {
    await adapter.ensureIndex('Contact', versionedSchema, ['entityId'], 'Contact'+indexEntityIdPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Contact', versionedSchema, ['effectiveDate'], 'Contact'+indexEffectiveDatePostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Contact', versionedSchema, ['updatedDate'], 'Contact'+indexUpdatedDatePostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Contact', versionedSchema, ['createdAt'], 'Contact'+indexCreatedAtPostfix, false)
  } catch(error) { console.log(error); } 

  try {
    await adapter.ensureIndex('Contact', versionedSchema, ['logicalClock'], 'Contact'+indexLogicalClockPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Contact_Audit', schema, ['createdAt'], 'Contact_Audit'+indexCreatedAtPostfix, false)
  } catch(error) { console.log(error); }
    
  try {
    await adapter.ensureIndex('CarePlan', versionedSchema, ['entityId'], 'CarePlan'+indexEntityIdPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('CarePlan', versionedSchema, ['effectiveDate'], 'CarePlan'+indexEffectiveDatePostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('CarePlan', versionedSchema, ['updatedDate'], 'CarePlan'+indexUpdatedDatePostfix, false)
  } catch(error) { console.log(error); } 

  try {
    await adapter.ensureIndex('CarePlan', versionedSchema, ['createdAt'], 'CarePlan'+indexCreatedAtPostfix, false)
  } catch(error) { console.log(error); } 

  try {
    await adapter.ensureIndex('CarePlan', versionedSchema, ['logicalClock'], 'CarePlan'+indexLogicalClockPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('CarePlan_Audit', schema, ['createdAt'], 'CarePlan_Audit'+indexCreatedAtPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Task', versionedSchema, ['entityId'], 'Task'+indexEntityIdPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Task', versionedSchema, ['effectiveDate'], 'Task'+indexEffectiveDatePostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Task', versionedSchema, ['updatedDate'], 'Task'+indexUpdatedDatePostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Task', versionedSchema, ['createdAt'], 'Task'+indexCreatedAtPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Task', versionedSchema, ['logicalClock'], 'Task'+indexLogicalClockPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Task_Audit', schema, ['createdAt'], 'Task_Audit'+indexCreatedAtPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('HealthKitTask', versionedSchema, ['entityId'], 'HealthKitTask'+indexEntityIdPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('HealthKitTask', versionedSchema, ['effectiveDate'], 'HealthKitTask'+indexEffectiveDatePostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('HealthKitTask', versionedSchema, ['updatedDate'], 'HealthKitTask'+indexUpdatedDatePostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('HealthKitTask', versionedSchema, ['createdAt'], 'HealthKitTask'+indexCreatedAtPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('HealthKitTask', versionedSchema, ['logicalClock'], 'HealthKitTask'+indexLogicalClockPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('HealthKitTask_Audit', schema, ['createdAt'], 'HealthKitTask_Audit'+indexCreatedAtPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Outcome', versionedSchema, ['entityId'], 'Outcome'+indexEntityIdPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Outcome', versionedSchema, ['updatedDate'], 'Outcome'+indexUpdatedDatePostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Outcome', versionedSchema, ['createdAt'], 'Outcome'+indexCreatedAtPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Outcome', versionedSchema, ['logicalClock'], 'Outcome'+indexLogicalClockPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Outcome_Audit', schema, ['createdAt'], 'Outcome_Audit'+indexCreatedAtPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureUniqueness('Clock', schema, ['uuid'])
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Clock', schema, ['createdAt'], 'Outcome'+indexCreatedAtPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('Clock_Audit', schema, ['createdAt'], 'Clock_Audit'+indexCreatedAtPostfix, false)
  } catch(error) { console.log(error); }

  try {
    await adapter.ensureIndex('_User', schema, ['createdAt'], '_User'+indexCreatedAtPostfix, false)
  } catch(error) { console.log(error); }
}

if(process.env.PARSE_SERVER_USING_PARSECAREKIT == 'true'){
  Parse.Cloud.run('ensureClassDefaultFieldsForParseCareKit');
}

// If you are custimizing your own user schema, set PARSE_SET_USER_CLP to `false`
if(process.env.PARSE_SET_USER_CLP == 'true'){
    //Fire after 3 seconds to allow _User class to be created
    setTimeout(async function() {
      await Parse.Cloud.run('setParseClassLevelPermissions');
      if(process.env.PARSE_SERVER_USING_PARSECAREKIT == 'true'){
        await Parse.Cloud.run('setAuditClassLevelPermissions');
        createIndexes();
      }
    }, 3000);
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
