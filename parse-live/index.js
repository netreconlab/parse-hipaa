
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
var filesAdapter;
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
  serverURL: process.env.PARSE_SERVER_URL || 'http://localhost:' +process.env.PORT + '/parse',  // Don't forget to change to https if needed
  publicServerURL: process.env.PARSE_PUBLIC_SERVER_URL || 'http://localhost:' +process.env.PORT + '/parse',
  verbose: process.env.VERBOSE,
  filesAdapter: filesAdapter,
  liveQuery: {
    classNames: ["Activity", "Post"] // List of classes to support for query subscriptions
  },
  /*liveQueryServerOptions = {
    appId: process.env.PARSE_SERVER_APPLICATION_ID,
    masterKey: process.env.PARSE_SERVER_MASTER_KEY,
    keyPairs: {
      masterKey: process.env.PARSE_SERVER_MASTER_KEY
    },
    serverURL: process.env.PARSE_SERVER_URL,
    websocketTimeout: 10 * 1000,
    cacheTimeout: 60 * 600 * 1000,
    logLevel: 'VERBOSE',
    redisURL: process.env.PARSE_SERVER_REDIS_URL,
    redisOptions: { socket_keepalive: true,
      db: process.env.PARSE_LIVEQUERY_SERVER_REDIS_DB }
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

const host = process.env.HOST || '0.0.0.0';
var port = process.env.LIVE_QUERY_PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, host, function() {
    console.log('parse-server running on port ' + port + '.');
    console.log('publicServerURL: ' + process.env.PARSE_PUBLIC_SERVER_URL + ', serverURL: ' + process.env.PARSE_SERVER_URL);
});
