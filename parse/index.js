// Example express application adding the parse-server module to expose Parse
// compatible API routes.

const { default: ParseServer, RedisCacheAdapter } = require('./lib');
const { GridFSBucketAdapter } = require('./lib/Adapters/Files/GridFSBucketAdapter');
const ParseAuditor = require('./node_modules/parse-auditor/src/index.js');
const express = require('express');
const path = require('path');
const cors = require('cors');
const FSFilesAdapter = require('@parse/fs-files-adapter');

const mountPath = process.env.PARSE_SERVER_MOUNT_PATH || '/parse';
const graphMountPath = process.env.PARSE_SERVER_GRAPHQL_PATH || '/graphql';
const dashboardMountPath = process.env.PARSE_DASHBOARD_MOUNT_PATH || '/dashboard';
const applicationId = process.env.PARSE_SERVER_APPLICATION_ID || 'myAppId';
const primaryKey = process.env.PARSE_SERVER_PRIMARY_KEY || 'myKey';
const redisURL = process.env.PARSE_SERVER_REDIS_URL || process.env.REDIS_TLS_URL || process.env.REDIS_URL;
const host = process.env.HOST || process.env.PARSE_SERVER_HOST || '0.0.0.0';
const port = process.env.PORT || 1337;
let serverURL = process.env.PARSE_SERVER_URL || 'http://localhost:' + process.env.PORT + mountPath;
let appName = 'myApp'; 
if ("NEW_RELIC_APP_NAME" in process.env) {
  require ('newrelic');
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
if (process.env.PARSE_SERVER_ENABLE == 'false') {
  enableParseServer = false
}

let startLiveQueryServer = true;
if (process.env.PARSE_SERVER_START_LIVE_QUERY_SERVER == 'false') {
  startLiveQueryServer = false
}

let startLiveQueryServerNoParse = false;
if (process.env.PARSE_SERVER_START_LIVE_QUERY_SERVER_NO_PARSE == 'true') {
  startLiveQueryServerNoParse = true
}

let enableDashboard = false;
if (process.env.PARSE_DASHBOARD_START == 'true') {
  enableDashboard = true
}

let verbose = false;
if (process.env.PARSE_VERBOSE == 'true') {
  verbose = true
}

let configuration;
const logsFolder = process.env.PARSE_SERVER_LOGS_FOLDER || './logs';
const fileMaxUploadSize = process.env.PARSE_SERVER_MAX_UPLOAD_SIZE || '20mb';
const cacheMaxSize = parseInt(process.env.PARSE_SERVER_CACHE_MAX_SIZE) || 10000;
const cacheTTL = parseInt(process.env.PARSE_SERVER_CACHE_TTL) || 5000;
const objectIdSize = parseInt(process.env.PARSE_SERVER_OBJECT_ID_SIZE) || 10;
const sessionLength = parseInt(process.env.PARSE_SERVER_SESSION_LENGTH) || 31536000;
const emailVerifyTokenValidityDuration = parseInt(process.env.PARSE_SERVER_EMAIL_VERIFY_TOKEN_VALIDITY_DURATION) || 24*60*60;
const accountLockoutDuration = parseInt(process.env.PARSE_SERVER_ACCOUNT_LOCKOUT_DURATION) || 5;
const accountLockoutThreshold = parseInt(process.env.PARSE_SERVER_ACCOUNT_LOCKOUT_THRESHOLD) || 5;
const maxPasswordHistory = parseInt(process.env.PARSE_SERVER_PASSWORD_POLICY_MAX_PASSWORD_HISTORY) || 5;
const resetTokenValidityDuration = parseInt(process.env.PARSE_SERVER_PASSWORD_POLICY_RESET_TOKEN_VALIDITY_DURATION) || 24*60*60;
const validationError = process.env.PARSE_SERVER_PASSWORD_POLICY_VALIDATION_ERROR || 'Password must have at least 8 characters, contain at least 1 digit, 1 lower case, 1 upper case, and contain at least one special character.';
const validatorPattern = process.env.PARSE_SERVER_PASSWORD_POLICY_VALIDATOR_PATTERN || /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
const triggerAfter = process.env.PARSE_SERVER_LOG_LEVELS_TRIGGER_AFTER || 'info';
const triggerBeforeError = process.env.PARSE_SERVER_LOG_LEVELS_TRIGGER_BEFORE_ERROR || 'error';
const triggerBeforeSuccess = process.env.PARSE_SERVER_LOG_LEVELS_TRIGGER_BEFORE_SUCCESS || 'info';
const playgroundPath = process.env.PARSE_SERVER_MOUNT_PLAYGROUND || '/playground';
const websocketTimeout = process.env.PARSE_LIVE_QUERY_SERVER_WEBSOCKET_TIMEOUT || 10 * 1000;
const cacheTimeout = process.env.PARSE_LIVE_QUERY_SERVER_CACHE_TIMEOUT || 5 * 1000;
const logLevel = process.env.PARSE_LIVE_QUERY_SERVER_LOG_LEVEL || 'INFO';
let primaryKeyIPs = process.env.PARSE_SERVER_PRIMARY_KEY_IPS || '172.16.0.0/12, 192.168.0.0/16, 10.0.0.0/8, 127.0.0.1, ::1';
primaryKeyIPs = primaryKeyIPs.split(", ");
let classNames = process.env.PARSE_SERVER_LIVEQUERY_CLASSNAMES || 'Clock, RevisionRecord';
classNames = classNames.split(", ");
let trustServerProxy = process.env.PARSE_SERVER_TRUST_PROXY || false;
if (trustServerProxy == 'true') {
  trustServerProxy = true;
}

let enableGraphQL = false;
if (process.env.PARSE_SERVER_MOUNT_GRAPHQL == 'true') {
  enableGraphQL = true
}

let allowNewClasses = false;
if (process.env.PARSE_SERVER_ALLOW_CLIENT_CLASS_CREATION == 'true') {
  allowNewClasses = true
}

let allowCustomObjectId = false;
if (process.env.PARSE_SERVER_ALLOW_CUSTOM_OBJECTID == 'true') {
  allowCustomObjectId = true
}

let enableSchemaHooks = false;
if (process.env.PARSE_SERVER_DATABASE_ENABLE_SCHEMA_HOOKS == 'true') {
  enableSchemaHooks = true
}

let useDirectAccess = false;
if (process.env.PARSE_SERVER_DIRECT_ACCESS == 'true') {
  useDirectAccess = true
}

let enforcePrivateUsers = false;
if (process.env.PARSE_SERVER_ENFORCE_PRIVATE_USERS == 'true') {
  enforcePrivateUsers = true
}

let fileUploadPublic = false;
if (process.env.PARSE_SERVER_FILE_UPLOAD_ENABLE_FOR_PUBLIC == 'true') {
  fileUploadPublic = true
}

let fileUploadAnonymous = true;
if (process.env.PARSE_SERVER_FILE_UPLOAD_ENABLE_FOR_ANONYMOUS_USER == 'false') {
  fileUploadAnonymous = false
}

let fileUploadAuthenticated = true;
if (process.env.PARSE_SERVER_FILE_UPLOAD_ENABLE_FOR_AUTHENTICATED_USER == 'false') {
  fileUploadAuthenticated = false
}

let fileExtensions = ['^[^hH][^tT][^mM][^lL]?$'];
if ("PARSE_SERVER_FILE_UPLOAD_FILE_EXTENSIONS" in process.env) {
  const extensions = process.env.PARSE_SERVER_FILE_UPLOAD_FILE_EXTENSIONS.split(", ");
  fileExtensions = extensions;
}

let enableAnonymousUsers = true;
if (process.env.PARSE_SERVER_ENABLE_ANON_USERS == 'false') {
  enableAnonymousUsers = false
}

let enableIdempotency = false;
if (process.env.PARSE_SERVER_ENABLE_IDEMPOTENCY == 'true') {
  enableIdempotency = true
}

let allowExpiredAuthDataToken = false;
if (process.env.PARSE_SERVER_ALLOW_EXPIRED_AUTH_DATA_TOKEN == 'true') {
  allowExpiredAuthDataToken = true
}

let emailVerifyTokenReuseIfValid = false;
if (process.env.PARSE_SERVER_EMAIL_VERIFY_TOKEN_REUSE_IF_VALID == 'true') {
  emailVerifyTokenReuseIfValid = true
}

let expireInactiveSessions = true;
if (process.env.PARSE_SERVER_EXPIRE_INACTIVE_SESSIONS == 'false') {
  expireInactiveSessions = false
}

let jsonLogs = false;
if (process.env.JSON_LOGS == 'true') {
  jsonLogs = true
}

let preserveFileName = false;
if (process.env.PARSE_SERVER_PRESERVE_FILE_NAME == 'true') {
  preserveFileName = true
}

let revokeSessionOnPasswordReset = true;
if (process.env.PARSE_SERVER_REVOKE_SESSION_ON_PASSWORD_RESET == 'false') {
  revokeSessionOnPasswordReset = false
}

let verifyUserEmails = false;
if (process.env.PARSE_SERVER_VERIFY_USER_EMAILS == 'true') {
  verifyUserEmails = true
}

let unlockOnPasswordReset = false;
if (process.env.PARSE_SERVER_ACCOUNT_LOCKOUT_UNLOCK_ON_PASSWORD_RESET == 'true') {
  unlockOnPasswordReset = true
}

let doNotAllowUsername = false;
if (process.env.PARSE_SERVER_PASSWORD_POLICY_DO_NOT_ALLOW_USERNAME == 'true') {
  doNotAllowUsername = true
}

let resetTokenReuseIfValid = false;
if (process.env.PARSE_SERVER_PASSWORD_POLICY_RESET_TOKEN_REUSE_IF_VALID == 'true') {
  resetTokenReuseIfValid = true
}

let preventLoginWithUnverifiedEmail = false;
if (process.env.PARSE_SERVER_PREVENT_LOGIN_WITH_UNVERIFIED_EMAIL == 'true') {
  preventLoginWithUnverifiedEmail = true
}

let mountPlayground = false;
if (process.env.PARSE_SERVER_MOUNT_PLAYGROUND == 'true') {
  mountPlayground = true;  
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

if ("PARSE_SERVER_DATABASE_URI" in process.env) {
  if (process.env.PARSE_SERVER_DATABASE_URI.indexOf('postgres') !== -1) {
    filesAdapter = new FSFilesAdapter(filesFSAdapterOptions);
  }
} else if ("DB_URL" in process.env) {
  if (process.env.DB_URL.indexOf('postgres') !== -1) {
    filesAdapter = new FSFilesAdapter(filesFSAdapterOptions);
    databaseUri = `${databaseUri}?ssl=true&rejectUnauthorized=false`;
  }  
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
}

if (Object.keys(filesAdapter).length === 0) {
  filesAdapter = new GridFSBucketAdapter(
    databaseUri,
    {},
    process.env.PARSE_SERVER_ENCRYPTION_KEY
  );
}

configuration = {
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.PARSE_SERVER_CLOUD || __dirname + '/cloud/main.js',
  appId: applicationId,
  masterKey: primaryKey,
  masterKeyIps: primaryKeyIPs,
  webhookKey: process.env.PARSE_SERVER_WEBHOOK_KEY,
  encryptionKey: process.env.PARSE_SERVER_ENCRYPTION_KEY,
  objectIdSize: objectIdSize,
  serverURL: serverURL,
  publicServerURL: publicServerURL,
  host: host,
  port: port,
  trustProxy: trustServerProxy,
  cacheMaxSize: cacheMaxSize,
  cacheTTL: cacheTTL,
  verbose: verbose,
  allowClientClassCreation: allowNewClasses,
  allowCustomObjectId: allowCustomObjectId,
  enableAnonymousUsers: enableAnonymousUsers,
  emailVerifyTokenReuseIfValid: emailVerifyTokenReuseIfValid,
  expireInactiveSessions: expireInactiveSessions,
  filesAdapter: filesAdapter,
  fileUpload: {
    enableForPublic: fileUploadPublic,
    enableForAnonymousUser: fileUploadAnonymous,
    enableForAuthenticatedUser: fileUploadAuthenticated,
    fileExtensions: fileExtensions,
  },
  maxUploadSize: fileMaxUploadSize,
  enableSchemaHooks: enableSchemaHooks,
  directAccess: useDirectAccess,
  allowExpiredAuthDataToken: allowExpiredAuthDataToken,
  enforcePrivateUsers: enforcePrivateUsers,
  jsonLogs: jsonLogs,
  logsFolder: logsFolder,
  preserveFileName: preserveFileName,
  revokeSessionOnPasswordReset: revokeSessionOnPasswordReset,
  sessionLength: sessionLength,
  // Setup your push adatper
  push: pushNotifications,
  auth: authentication,
  startLiveQueryServer: startLiveQueryServer,
  liveQuery: {
    classNames: classNames, // List of classes to support for query subscriptions
    websocketTimeout: websocketTimeout,
    cacheTimeout: cacheTimeout
  },
  mountGraphQL: enableGraphQL, 
  graphMountPath: graphMountPath,
  mountPlayground: mountPlayground,
  playgroundPath: playgroundPath,
  verifyUserEmails: verifyUserEmails,
  // Setup your mail adapter
  /*emailAdapter: {
    module: 'parse-server-api-mail-adapter',
      /*options: {
        // The address that your emails come from
        sender: '',
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
  emailVerifyTokenValidityDuration: emailVerifyTokenValidityDuration, // in seconds (2 hours = 7200 seconds)
  // set preventLoginWithUnverifiedEmail to false to allow user to login without verifying their email
  // set preventLoginWithUnverifiedEmail to true to prevent user from login if their email is not verified
  preventLoginWithUnverifiedEmail: preventLoginWithUnverifiedEmail, // defaults to false
  // account lockout policy setting (OPTIONAL) - defaults to undefined
  // if the account lockout policy is set and there are more than `threshold` number of failed login attempts then the `login` api call returns error code `Parse.Error.OBJECT_NOT_FOUND` with error message `Your account is locked due to multiple failed login attempts. Please try again after <duration> minute(s)`. After `duration` minutes of no login attempts, the application will allow the user to try login again.
  accountLockout: {
    duration: accountLockoutDuration, // duration policy setting determines the number of minutes that a locked-out account remains locked out before automatically becoming unlocked. Set it to a value greater than 0 and less than 100000.
    threshold: accountLockoutThreshold, // threshold policy setting determines the number of failed sign-in attempts that will cause a user account to be locked. Set it to an integer value greater than 0 and less than 1000.
    unlockOnPasswordReset: unlockOnPasswordReset,
  },
  // optional settings to enforce password policies
  passwordPolicy: {
    // Two optional settings to enforce strong passwords. Either one or both can be specified.
    // If both are specified, both checks must pass to accept the password
    // 1. a RegExp object or a regex string representing the pattern to enforce
    validatorPattern: validatorPattern, // enforce password with at least 8 char with at least 1 lower case, 1 upper case and 1 digit
    // 2. a callback function to be invoked to validate the password
    //validatorCallback: (password) => { return validatePassword(password) },
    validationError: validationError, // optional error message to be sent instead of the default "Password does not meet the Password Policy requirements." message.
    doNotAllowUsername: doNotAllowUsername, // optional setting to disallow username in passwords
    maxPasswordHistory: maxPasswordHistory, // optional setting to prevent reuse of previous n passwords. Maximum value that can be specified is 20. Not specifying it or specifying 0 will not enforce history.
    //optional setting to set a validity duration for password reset links (in seconds)
    resetTokenReuseIfValid: resetTokenReuseIfValid,
    resetTokenValidityDuration: resetTokenValidityDuration, // expire after 24 hours
  },
  logLevels: {
    triggerAfter: triggerAfter,
    triggerBeforeError: triggerBeforeError,
    triggerBeforeSuccess: triggerBeforeSuccess,
  }
};

if ("PARSE_SERVER_READ_ONLY_PRIMARY_KEY" in process.env) {
  configuration.readOnlyMasterKey = process.env.PARSE_SERVER_READ_ONLY_PRIMARY_KEY;
}

if (("PARSE_SERVER_REDIS_URL" in process.env) || ("REDIS_TLS_URL" in process.env) || ("REDIS_URL" in process.env)) {
  const redisOptions = { url: redisURL };
  configuration.cacheAdapter = new RedisCacheAdapter(redisOptions);
  // Set LiveQuery URL
  configuration.liveQuery.redisURL = redisURL; 
}

// Rate limiting
let rateLimit = false;
if (process.env.PARSE_SERVER_RATE_LIMIT == 'true') {
  rateLimit = true;  
}

if (rateLimit == true) {
  configuration.rateLimit = [];
  const firstRateLimit = {};
  firstRateLimit.requestPath = process.env.PARSE_SERVER_RATE_LIMIT_REQUEST_PATH || '*';
  firstRateLimit.errorResponseMessage = process.env.PARSE_SERVER_RATE_LIMIT_ERROR_RESPONSE_MESSAGE || 'Too many requests';
  firstRateLimit.requestCount = parseInt(process.env.PARSE_SERVER_RATE_LIMIT_REQUEST_COUNT) || 100;
  firstRateLimit.requestTimeWindow = parseInt(process.env.PARSE_SERVER_RATE_LIMIT_REQUEST_TIME_WINDOW) || 10 * 60 * 1000;
  if (process.env.PARSE_SERVER_RATE_LIMIT_INCLUDE_INTERNAL_REQUESTS == 'true') {
    firstRateLimit.includeInternalRequests = true;  
  }
  if (process.env.PARSE_SERVER_RATE_LIMIT_INCLUDE_PRIMARY_KEY == 'true') {
    firstRateLimit.includeMasterKey = true;  
  }
  if ("PARSE_SERVER_RATE_LIMIT_REQUEST_METHODS" in process.env) {
    const requestMethods = process.env.PARSE_SERVER_RATE_LIMIT_REQUEST_METHODS.split(", ");
    firstRateLimit.requestMethods = requestMethods;
  }
  configuration.rateLimit.push(firstRateLimit);
}

if ("PARSE_SERVER_GRAPH_QLSCHEMA" in process.env) {
  configuration.graphQLSchema = process.env.PARSE_SERVER_GRAPH_QLSCHEMA;
}

if ("PARSE_SERVER_ALLOW_HEADERS" in process.env) {
  configuration.allowHeaders = process.env.PARSE_SERVER_ALLOW_HEADERS;
}

if ("PARSE_SERVER_ALLOW_ORIGIN" in process.env) {
  configuration.allowOrigin = process.env.PARSE_SERVER_ALLOW_ORIGIN;
}

if ("PARSE_SERVER_MAX_LIMIT" in process.env) {
  configuration.maxLimit = parseInt(process.env.PARSE_SERVER_MAX_LIMIT);
}

if ("PARSE_SERVER_PASSWORD_POLICY_MAX_PASSWORD_AGE" in process.env) {
  configuration.passwordPolicy.maxPasswordAge = parseInt(process.env.PARSE_SERVER_PASSWORD_POLICY_MAX_PASSWORD_AGE);
}

if (enableIdempotency) {
  let paths = process.env.PARSE_SERVER_EXPERIMENTAL_IDEMPOTENCY_PATHS || '.*';
  paths = paths.split(", ");
  const ttl = process.env.PARSE_SERVER_EXPERIMENTAL_IDEMPOTENCY_TTL || 300;
  configuration.idempotencyOptions = {
    paths: paths,
    ttl: ttl
  };
}

let app = express();

// Enable All CORS Requests
app.use(cors());

// Redirect to https if on Heroku
app.use(function(request, response, next) {
  if (("NEW_RELIC_APP_NAME" in process.env) && !request.secure)
    return response.redirect("https://" + request.headers.host + request.url);
  next();
});

async function setupParseServer() {
  const parseServer = await ParseServer.startApp(configuration);
  app = parseServer.expressApp;

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

  setupDashboard();

  console.log('Public access: ' + url.hostname + ', Local access: ' + serverURL);
  console.log(`REST API running on ${url.href}`);
  if (startLiveQueryServer)
      console.log(`LiveQuery server is now available at ${url.href}`);
  if (enableGraphQL)
    console.log(`GraphQL API running on ${graphURL.href}`);
  if (enableDashboard)
    console.log(`Dashboard is now available at ${dashboardURL.href}`);

  if (process.env.PARSE_SERVER_USING_PARSECAREKIT == 'true') {
    const { CareKitServer } = require('parse-server-carekit');
    let shouldAudit = true;
    if (process.env.PARSE_SERVER_USING_PARSECAREKIT_AUDIT === 'false') {
      shouldAudit = false;
    }
    if (shouldAudit) {
      setAuditClassLevelPermissions();
    }
    let careKitServer = new CareKitServer(parseServer, shouldAudit);
    await careKitServer.setup();
  }
}

function setAuditClassLevelPermissions() {
  const auditCLP = {
    get: { requiresAuthentication: true },
    find: { requiresAuthentication: true },
    create: { },
    update: { requiresAuthentication: true },
    delete: { requiresAuthentication: true },
    addField: { },
    protectedFields: { }
  };
  // Don't audit '_Role' as it doesn't work.
  const modifiedClasses = ['_User', '_Installation', '_Audience', 'Clock', 'Patient', 'CarePlan', 'Contact', 'Task', 'HealthKitTask', 'Outcome', 'HealthKitOutcome', 'RevisionRecord'];
  const accessedClasses = ['_User', '_Installation', '_Audience', 'Clock', 'Patient', 'CarePlan', 'Contact', 'Task', 'HealthKitTask', 'Outcome', 'HealthKitOutcome', 'RevisionRecord'];
  ParseAuditor(modifiedClasses, accessedClasses, { classPostfix: '_Audit', useMasterKey: true, clp: auditCLP });
};

function setupDashboard() {
  if (enableDashboard) {
    const fs = require('fs');
    const ParseDashboard = require('parse-dashboard');

    const allowInsecureHTTP = process.env.PARSE_DASHBOARD_ALLOW_INSECURE_HTTP;
    const cookieSessionSecret = process.env.PARSE_DASHBOARD_COOKIE_SESSION_SECRET;
    const trustProxy = process.env.PARSE_DASHBOARD_TRUST_PROXY;

    if (trustProxy && allowInsecureHTTP) {
      console.log('Set only trustProxy *or* allowInsecureHTTP, not both.  Only one is needed to handle being behind a proxy.');
      process.exit(1);
    }

    let configFile = null;
    let configFromCLI = null;
    const configServerURL = process.env.PARSE_DASHBOARD_SERVER_URL || serverURL;
    const configGraphQLServerURL = process.env.PARSE_DASHBOARD_GRAPHQL_SERVER_URL || graphURL.href;
    const configPrimaryKey = process.env.PARSE_DASHBOARD_PRIMARY_KEY || primaryKey;
    const configAppId = process.env.PARSE_DASHBOARD_APP_ID || applicationId;
    const configAppName = process.env.PARSE_DASHBOARD_APP_NAME || appName;
    let configUsernames = process.env.PARSE_DASHBOARD_USERNAMES;
    let configUserPasswords = process.env.PARSE_DASHBOARD_USER_PASSWORDS;
    let configUserPasswordEncrypted = true;
    if (process.env.PARSE_DASHBOARD_USER_PASSWORD_ENCRYPTED == 'false') {
      configUserPasswordEncrypted = false;
    }
    
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
        if (configUsernames && configUserPasswords) {
          configUsernames = configUsernames.split(", ");
          configUserPasswords = configUserPasswords.split(", ");
          if (configUsernames.length == configUserPasswords.length) {
            let users = [];
            configUsernames.forEach((username, index) => {
              users.push({
                user: username,
                pass: configUserPasswords[index],
              });
            });
            configFromCLI.data.users = users;
            configFromCLI.data.useEncryptedPasswords = configUserPasswordEncrypted;
          } else {
            console.log('Dashboard usernames(' + configUsernames.length + ') ' + 'and passwords(' + configUserPasswords.length + ') must be the same size.');
            process.exit(1);
          }
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
          process.exit(1);
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

    if (enableParseServer == false) {
      if (allowInsecureHTTP || trustProxy) app.enable('trust proxy', trustProxy);
      config.data.trustProxy = trustProxy;
    } else {
      config.data.trustProxy = configuration.trustProxy;
    }

    const dashboardOptions = { allowInsecureHTTP, cookieSessionSecret };
    const dashboard = new ParseDashboard(config.data, dashboardOptions);
    app.use(dashboardMountPath, dashboard);
  }
}

if (enableParseServer) {
  setupParseServer();
} else {
  setupDashboard();
  const httpServer = require('http').createServer(app);

  if (startLiveQueryServerNoParse == true) {
    let liveQueryConfig = {
      appId: applicationId,
      masterKey: primaryKey,
      serverURL: serverURL,
      websocketTimeout: websocketTimeout,
      cacheTimeout: cacheTimeout,
      verbose: verbose,
      logLevel: logLevel,
    }
    
    if (("PARSE_SERVER_REDIS_URL" in process.env) || ("REDIS_TLS_URL" in process.env) || ("REDIS_URL" in process.env)) {
      liveQueryConfig.redisURL = redisURL; 
    }
  
    // This will enable the Live Query real-time server
    ParseServer.createLiveQueryServer(httpServer, liveQueryConfig, configuration);
  }

  httpServer.listen(port, host, function() {
    
    if (startLiveQueryServerNoParse)
      console.log(`LiveQuery server is now available at ${url.href}`);

    if (enableDashboard)
      console.log(`Dashboard is now available at ${dashboardURL.href}`);
  });
}
