// Example express application adding the parse-server module to expose Parse
// compatible API routes.
require ('newrelic');
const express = require('express');
const { default: ParseServer, ParseGraphQLServer, RedisCacheAdapter } = require('./lib/index');
const FSFilesAdapter = require('@parse/fs-files-adapter');
const GridFSBucketAdapter = require('./lib/Adapters/Files/GridFSBucketAdapter')
  .GridFSBucketAdapter;
const path = require('path');
const cors = require('cors');
const mountPath = process.env.PARSE_SERVER_MOUNT_PATH || '/parse';
const dashboardMountPath = process.env.PARSE_DASHBOARD_MOUNT_PATH || '/dashboard';
const graphMountPath = process.env.PARSE_SERVER_GRAPHQL_PATH || '/graphql';
const applicationId = process.env.PARSE_SERVER_APPLICATION_ID || 'myAppId';
const primaryKey = process.env.PARSE_SERVER_PRIMARY_KEY || 'myKey';
const redisURL = process.env.PARSE_SERVER_REDIS_URL || process.env.REDIS_TLS_URL || process.env.REDIS_URL;
let serverURL = process.env.PARSE_SERVER_URL || 'http://localhost:' + process.env.PORT + mountPath;
let appName = 'myApp'; 
if ("NEW_RELIC_APP_NAME" in process.env) {
  appName = process.env.NEW_RELIC_APP_NAME;
  if (!("PARSE_SERVER_URL" in process.env)) {
    serverURL = `https://${appName}.herokuapp.com${mountPath}`;
  }
}

const publicServerURL = process.env.PARSE_SERVER_PUBLIC_URL || serverURL;
const url = new URL(publicServerURL);
const graphURL = new URL(publicServerURL);
graphURL.pathname = graphMountPath;
const dashboardURL = new URL(publicServerURL);
dashboardURL.pathname = dashboardMountPath;

let enableParseServer = true;
if (process.env.PARSE_SERVER_ENABLE == 'false'){
  enableParseServer = false
}

let enableGraphQL = false;
if (process.env.PARSE_SERVER_MOUNT_GRAPHQL == 'true'){
  enableGraphQL = true
}

let startLiveQueryServer = true;
if (process.env.PARSE_SERVER_START_LIVE_QUERY_SERVER == 'false'){
  startLiveQueryServer = false
}

let enableDashboard = false;
if (process.env.PARSE_DASHBOARD_START == 'true'){
  enableDashboard = true
}

const app = express();

// Enable All CORS Requests
app.use(cors());

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(_req, res) {
  res.status(200).send('I dream of being a website. Please star the parse-hipaa repo on GitHub!');
});

// Redirect to https if on Heroku
app.use(function(request, response, next) {
  if (("NEW_RELIC_APP_NAME" in process.env) && !request.secure)
    return response.redirect("https://" + request.headers.host + request.url);

  next();
});

if (enableParseServer){
  const cacheMaxSize = parseInt(process.env.PARSE_SERVER_CACHE_MAX_SIZE) || 10000;
  const cacheTTL = parseInt(process.env.PARSE_SERVER_CACHE_TTL) || 5000;
  const objectIdSize = parseInt(process.env.PARSE_SERVER_OBJECT_ID_SIZE) || 10;

  let allowNewClasses = false;
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

  let enableIdempotency = false;
  if(process.env.PARSE_SERVER_ENABLE_IDEMPOTENCY == 'true'){
    enableIdempotency = true
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
      databaseUri = `${databaseUri}?ssl=true&rejectUnauthorized=false`;
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
    appId: applicationId,
    masterKey: primaryKey,
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

  if (("PARSE_SERVER_REDIS_URL" in process.env) || ("REDIS_TLS_URL" in process.env) || ("REDIS_URL" in process.env)) {
    const redisOptions = { url: redisURL };
    configuration.cacheAdapter = new RedisCacheAdapter(redisOptions);
    // Set LiveQuery URL
    configuration.liveQuery.redisURL = redisURL; 
  }

  if ("PARSE_SERVER_GRAPH_QLSCHEMA" in process.env) {
    configuration.graphQLSchema = process.env.PARSE_SERVER_GRAPH_QLSCHEMA;
  }

  if (enableIdempotency) {
    configuration.idempotencyOptions = {
      paths: [".*"],       // enforce for all requests
      ttl: 120             // keep request IDs for 120s
    };
  }
  
  const api = new ParseServer(configuration);
  
  // Serve the Parse API on the /parse URL prefix
  app.use(mountPath, api.app);

  if(enableGraphQL){
    const parseGraphQLServer = new ParseGraphQLServer(
      api,
      {
        graphQLPath: graphMountPath,
        playgroundPath: '/playground'
      }
    );
    parseGraphQLServer.applyGraphQL(app);
  }
  
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
}

if(enableDashboard){
  const fs = require('fs');
  const ParseDashboard = require('parse-dashboard');

  const allowInsecureHTTP = process.env.PARSE_DASHBOARD_ALLOW_INSECURE_HTTP;
  const cookieSessionSecret = process.env.PARSE_DASHBOARD_COOKIE_SESSION_SECRET;
  const trustProxy = process.env.PARSE_DASHBOARD_TRUST_PROXY;

  if (trustProxy && allowInsecureHTTP) {
    console.log('Set only trustProxy *or* allowInsecureHTTP, not both.  Only one is needed to handle being behind a proxy.');
    process.exit(-1);
  }

  let configFile = null;
  let configFromCLI = null;
  const configServerURL = process.env.PARSE_DASHBOARD_SERVER_URL || serverURL;
  const configGraphQLServerURL = process.env.PARSE_DASHBOARD_GRAPHQL_SERVER_URL || graphURL.href;
  const configPrimaryKey = process.env.PARSE_DASHBOARD_PRIMARY_KEY || primaryKey;
  const configAppId = process.env.PARSE_DASHBOARD_APP_ID || applicationId;
  const configAppName = process.env.PARSE_DASHBOARD_APP_NAME || appName;
  const configUserId = process.env.PARSE_DASHBOARD_USER_ID;
  const configUserPassword = process.env.PARSE_DASHBOARD_USER_PASSWORD;
  const configUserPasswordEncrypted = process.env.PARSE_DASHBOARD_USER_PASSWORD_ENCRYPTED || true;

  if (!process.env.PARSE_DASHBOARD_CONFIG) {
    if (configServerURL && configPrimaryKey && configAppId) {
      configFromCLI = {
        data: {
          apps: [
            {
              appId: configAppId,
              serverURL: configServerURL,
              masterKey: configPrimaryKey,
              appName: configAppName,
            },
          ]
        }
      };
      if (configGraphQLServerURL) {
        configFromCLI.data.apps[0].graphQLServerURL = configGraphQLServerURL;
      }
      if (configUserId && configUserPassword) {
        configFromCLI.data.users = [
          {
            user: configUserId,
            pass: configUserPassword,
          }
        ];
        configFromCLI.data.useEncryptedPasswords = configUserPasswordEncrypted;
      }
    } else if (!configServerURL && !configPrimaryKey && !configAppName) {
      configFile = path.join(__dirname, 'parse-dashboard-config.json');
    }
  } else {
    configFromCLI = {
      data: JSON.parse(process.env.PARSE_DASHBOARD_CONFIG)
    };
  }

  let config = null;
  let configFilePath = null;
  if (configFile) {
    try {
      config = {
        data: JSON.parse(fs.readFileSync(configFile, 'utf8'))
      };
      configFilePath = path.dirname(configFile);
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.log('Your config file contains invalid JSON. Exiting.');
        process.exit(1);
      } else if (error.code === 'ENOENT') {
        console.log('You must provide either a config file or required CLI options (app ID, Primary Key, and server URL); not both.');
        process.exit(3);
      } else {
        console.log('There was a problem with your config. Exiting.');
        process.exit(-1);
      }
    }
  } else if (configFromCLI) {
    config = configFromCLI;
  } else {
    //Failed to load default config file.
    console.log('You must provide either a config file or an app ID, Primary Key, and server URL. See parse-dashboard --help for details.');
    process.exit(4);
  }

  config.data.apps.forEach(app => {
    if (!app.appName) {
      app.appName = app.appId;
    }
  });

  if (config.data.iconsFolder && configFilePath) {
    config.data.iconsFolder = path.join(configFilePath, config.data.iconsFolder);
  }

  if (allowInsecureHTTP || trustProxy) app.enable('trust proxy');

  config.data.trustProxy = trustProxy;
  const dashboardOptions = { allowInsecureHTTP, cookieSessionSecret };
  const dashboard = new ParseDashboard(config.data, dashboardOptions);
  app.use(dashboardMountPath, dashboard);
}

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 1337;
const httpServer = require('http').createServer(app);
httpServer.listen(port, host, function() {
  if(enableParseServer){
    console.log('Public access: ' + url.hostname + ', Local access: ' + serverURL);
    console.log(`REST API running on ${url.href}`);
    if(enableGraphQL)
      console.log(`GraphQL API running on ${graphURL.href}`);
  }

  if (startLiveQueryServer)
    console.log(`LiveQuery server is now available at ${url.href}`);

  if(enableDashboard)
    console.log(`Dashboard is now available at ${dashboardURL.href}`);
});

if (startLiveQueryServer){
  let liveQueryConfig = {
    appId: applicationId,
    masterKey: primaryKey,
    serverURL: serverURL,
    websocketTimeout: 10 * 1000,
    cacheTimeout: 60 * 600 * 1000,
    verbose: true,
  }

  if (("PARSE_SERVER_REDIS_URL" in process.env) || ("REDIS_TLS_URL" in process.env) || ("REDIS_URL" in process.env)) {
    liveQueryConfig.redisURL = redisURL; 
  }

  // This will enable the Live Query real-time server
  ParseServer.createLiveQueryServer(httpServer, liveQueryConfig);
}