# parse-hipaa 

[![](https://dockeri.co/image/netreconlab/parse-hipaa)](https://hub.docker.com/r/netreconlab/parse-hipaa)
[![build](https://github.com/netreconlab/parse-hipaa/actions/workflows/build.yml/badge.svg)](https://github.com/netreconlab/parse-hipaa/actions/workflows/build.yml)
[![build](https://github.com/netreconlab/parse-hipaa/actions/workflows/build-dashboard.yml/badge.svg)](https://github.com/netreconlab/parse-hipaa/actions/workflows/build-dashboard.yml)
[![release](https://github.com/netreconlab/parse-hipaa/actions/workflows/release.yml/badge.svg)](https://github.com/netreconlab/parse-hipaa/actions/workflows/release.yml)
[![release](https://github.com/netreconlab/parse-hipaa/actions/workflows/release-dashboard.yml/badge.svg)](https://github.com/netreconlab/parse-hipaa/actions/workflows/release-dashboard.yml)

---

![dashboard](https://user-images.githubusercontent.com/8621344/102236202-38f32080-3ec1-11eb-88d7-24e38e95f68d.png)

Run your own HIPAA & GDPR compliant [parse-server](https://github.com/parse-community/parse-server) with [PostgreSQL](https://www.postgresql.org) or [MongoDB](https://github.com/netreconlab/parse-hipaa/blob/main/docker-compose.mongo.yml). parse-hipaa also includes [parse-dashboard](https://github.com/parse-community/parse-dashboard) for viewing/modifying your data in the Cloud. Since [parse-hipaa](https://github.com/netreconlab/parse-hipaa) is a pare-server, it can be used for [iOS](https://docs.parseplatform.org/ios/guide/), [Android](https://docs.parseplatform.org/android/guide/), [Flutter](https://github.com/parse-community/Parse-SDK-Flutter/tree/master/packages/flutter#getting-started), and web based apps ([JS, React Native, etc](https://docs.parseplatform.org/js/guide/)). API's such as [GraphQL](https://docs.parseplatform.org/graphql/guide/) and [REST](https://docs.parseplatform.org/rest/guide/) are enabled by default in parse-hipaa and can be tested directly or via the "API Console" in the Parse Dashboard. See the [Parse SDK documentation](https://parseplatform.org/#sdks) for details and examples of how to leverage parse-hipaa for your language(s) of interest. parse-hipaa includes the necessary database auditing and logging for HIPAA compliance. 

`parse-hipaa` provides the following:
- [x] Auditing & logging at server-admin level (Parse) and at the database level (postgres or mongo)
- [x] The User class (and the ParseCareKit classes if you are using them) are locked down and doesn't allow unauthenticated access (the standard parse-server allows unauthenticated read access by default)
- [x] The creation of new Parse Classes and the addition of adding fields from the client-side are disabled. These can be created/added on the server-side using Parse Dashboard (the standard parse-server allows Class and field creation on the client-side by default)
- [x] Ready for encryption in transit - parse-hipaa and it's companion images are setup to run behind a proxy with files & directions on how to [complete the process](https://github.com/netreconlab/parse-hipaa#deploying-on-a-real-system) with Nginx and LetsEncrypt 
- [x] File uploads are only allowed by authenticated users (the standard parse-server allows unauthenticated uploads by default)
- [x] File uploads are encrypted with AES-256-GCM by default (the standard parse-server doesn't encrypt files by default)
- [x] ~~File uploads can be scanned for viruses and malware by [clamav](https://docs.clamav.net/manual/Installing/Docker.html) before they are saved to parse-hipaa local storage. If any virus or malware is detected the files won't be persisted to the file system~~ (this has been turned off by default. Examples of how to handle can be found in [files.js](https://github.com/netreconlab/parse-hipaa/blob/main/parse/cloud/files.js) and enabled in [main.js](https://github.com/netreconlab/parse-hipaa/blob/37f79bdb99781b634780b3af6a7e33e6beae44a0/parse/cloud/main.js#L8))

You will still need to setup the following on your own to be fully HIPAA & GDPR compliant:

- [ ] Encryption in transit - you will need to [complete the process](https://github.com/netreconlab/parse-hipaa#deploying-on-a-real-system)
- [ ] Encryption at rest - Mount to your own encrypted storage drive for your database (Linux and macOS have API's for this) and store the drive in a "safe" location
- [ ] Be sure to do anything else HIPAA & GDPR requires
- [ ] If you are hosting using a remote service like Heroku, you may need to pay for additional services such as [Shield Spaces](https://devcenter.heroku.com/articles/heroku-postgres-and-private-spaces)

The [CareKitSample-ParseCareKit](https://github.com/netreconlab/CareKitSample-ParseCareKit), uses parse-hipaa along with [ParseCareKit](https://github.com/netreconlab/ParseCareKit). 

**Use at your own risk. There is not promise that this is HIPAA compliant and we are not responsible for any mishandling of your data**

## What is inside parse-hipaa?

Parse-HIPAA is derived from the [parse-server image](https://hub.docker.com/r/parseplatform/parse-server) and contains the following additional packages:
- [parse-hipaa-dashboard](https://github.com/netreconlab/parse-hipaa-dashboard)
- [parse-server-carekit](https://github.com/netreconlab/parse-server-carekit)
- [clamscan](https://www.npmjs.com/package/clamscan)
- [newrelic](https://www.npmjs.com/package/newrelic) - automatically configured with Heroku deployments, needs additional configuration if you want to use elsewhere
- [parse-server-any-analytics-adapter](https://github.com/netreconlab/parse-server-any-analytics-adapter) - needs additional configuration if you want to use
- [@analytics/google-analytics](https://www.npmjs.com/package/@analytics/google-analytics) - needs additional configuration if you want to use
- [@analytics/google-analytics-v3](https://www.npmjs.com/package/@analytics/google-analytics-v3) - needs additional configuration if you want to use
- [@parse/s3-files-adapter](https://www.npmjs.com/package/@parse/s3-files-adapter) - needs additional configuration if you want to use
- [parse-server-api-mail-adapter](https://www.npmjs.com/package/parse-server-api-mail-adapter) - needs additional configuration if you want to use
- [mailgun.js](https://www.npmjs.com/package/mailgun.js) - needs additional configuration if you want to use

## Images
Images of parse-hipaa are automatically built for your convenience. Images can be found at the following locations:
- [Docker - Hosted on Docker Hub](https://hub.docker.com/r/netreconlab/parse-hipaa)
- [Singularity - Hosted on GitHub Container Registry](https://github.com/netreconlab/parse-hipaa/pkgs/container/parse-hipaa)

### Flavors and Tags

#### Production
- `latest` - Points to the newest released version. **This is smallest possible image of `parse-hipaa` and it does not contain [parse-hipaa-dashboard](https://github.com/netreconlab/parse-hipaa-dashboard)**
- `x.x.x` - Points to a specific released version. These version numbers match their respective [parse-server](https://github.com/parse-community/parse-server#flavors--branches) released versions. **This is smallest possible image of `parse-hipaa` and it does not contain [parse-hipaa-dashboard](https://github.com/netreconlab/parse-hipaa-dashboard)**
- `x.x.x-dashboard` - Points to a specific released version. These version numbers match their respective [parse-server](https://github.com/parse-community/parse-server#flavors--branches) released versions. This version of `parse-hipaa` is **built with [parse-hipaa-dashboard](https://github.com/netreconlab/parse-hipaa-dashboard) and is a larger image**


#### Development
- `main` - Points to the most up-to-date code and depends on the latest release of parse-server. This version of `parse-hipaa` is **built with [parse-hipaa-dashboard](https://github.com/netreconlab/parse-hipaa-dashboard)**. This tag can contain breaking changes
- `x.x.x-alpha/beta` - Points to most up-to-date code and depends on the respective [alha/beta releases of parse-server](https://github.com/parse-community/parse-server#flavors--branches). This version of parse-hipaa is **built with [parse-hipaa-dashboard](https://github.com/netreconlab/parse-hipaa-dashboard)**. This tag can contain breaking changes

### Recommendations
Any/all of the tagged servers can be used in combination with each other to build a [High Availability](https://en.wikipedia.org/wiki/High-availability_cluster)(HA) server-side application. For example, your HA cluster may consist of: (1) [nginx](https://www.nginx.com/resources/glossary/nginx/) reverse proxy/load balancer, (1) `x.x.x-dashboard` `parse-hipaa` server, (2) `x.x.x` `parse-hipaa` servers,  and (1) [Percona Monitor and Management](https://www.percona.com/software/database-tools/percona-monitoring-and-management) server.

#### Standard (without parse-hipaa-dashboard)
- `latest` or `x.x.x` - Use one or more of these images if you plan to have multiple `parse-hipaa` servers working together to create [HA](https://en.wikipedia.org/wiki/High-availability_cluster) or just need a stand-alone server. Note that if all of your `parse-hipaa` servers are `x.x.x`, you may want to add a stand-alone [parse-hipaa-dashboard](https://github.com/netreconlab/parse-hipaa-dashboard) or [parse-server-dashoard](https://github.com/parse-community/parse-dashboard)
    - See [docker-compose.yml](https://github.com/netreconlab/parse-hipaa/blob/main/docker-compose.yml) for an example
- `-dashboard` - Use one of these images only if you plan to have one stand-alone `parse-hipaa` server or you want one of your servers to also provide [parse-hipaa-dashboard](https://github.com/netreconlab/parse-hipaa-dashboard) ability
    - See [docker-compose-dashboard.yml](https://github.com/netreconlab/parse-hipaa/blob/main/docker-compose-dashboard.yml) for an example
- `main` or `x.x.x-alpha/beta` - Use only as a development server for testing/debugging the latest features. It is recommended not to use these tags for deployed systems

## Deployment
`parse-hipaa` can be easily deployed or tested remote or locally.

### Remote

#### Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

You can use the one-button-click deployment to quickly deploy to Heroko. **Note that this is non-HIPAA compliant when using Heroku's free services**, so you need to view [Heroku's compliance certifications](https://www.heroku.com/compliance), and upgrade your plans to [Shield Spaces](https://devcenter.heroku.com/articles/heroku-postgres-and-private-spaces). You can [view this document for detailed instructions](https://docs.google.com/document/d/1QDZ65k0DQaq33NdrYuOcC1T8RuCg1irM/edit?usp=sharing&ouid=116811443756382677101&rtpof=true&sd=true). **If you need a Parse Server Heroku deployment for non-ParseCareKit based apps, use the Heroku button on the [snapcat](https://github.com/netreconlab/parse-hipaa/tree/Snapchat#heroku-with-postgres) branch instead of this one.** Once you click the Heroku button do the following:

1. Select your **App name**
2. Under the **Config vars** section, fill in the following environment variables:
    - Set the value for `NEW_RELIC_APP_NAME` to the **App name** in step 1 
    - Add a value for `PARSE_DASHBOARD_USER_ID` so you can log into your Parse Dashboard 
    - Add the hash of your password as the value for `PARSE_DASHBOARD_USER_PASSWORD` so you can log into your Parse Dashboard. You can get the hash of your desired password from [bcrypt-generator.com](https://bcrypt-generator.com) 
    - You can leave all other **Config vars** as they are or modify them as needed
3. If you don't plan on using `parse-hipaa` with `ParseCareKit` you should set `PARSE_SERVER_USING_PARSECAREKIT=false` under **Config vars**. This will ensure that ParseCareKit classes/tables are not created on the parse-hipaa server
4. Scroll to the bottom of the page and press **Deploy app**
5. When finished you can access your respective server and dashboard by visiting **https://YOUR_APP_NAME.herokuapp.com/parse** or **https://YOUR_APP_NAME.herokuapp.com/dashboard**. The mount points are based on `PARSE_SERVER_MOUNT_PATH` and `PARSE_DASHBOARD_MOUNT_PATH`
6. Be sure to go to `Settings->Reveal Config Vars` to get your `PARSE_SERVER_APPLICATION_ID`. Add the `PARSE_SERVER_APPLICATION_ID` and **https://YOUR_APP_NAME.herokuapp.com/parse** as `applicationId` and `serverURL` respectively to your client app to connect your parse-hipaa server

#### Using your own files for Heroku deployment
1. Fork the parse-hipaa repo
2. Edit `heroku.yml` in your repo by changing `parse/Dockerfile.heroku` to `parse/Dockerfile`. This will build from your respective repo instead of using the pre-built docker image
3. You can now edit `parse/index.js` and `parse/cloud` as you wish
4. You can then follow the directions on heroku's site for [deployment](https://devcenter.heroku.com/articles/git) and [integration](https://devcenter.heroku.com/articles/github-integration)

### Local: Using Docker Image with Postgres or Mongo
By default, the `docker-compose.yml` uses [hipaa-postgres](https://github.com/netreconlab/hipaa-postgres/). The `docker-compose.mongo.yml` uses [hipaa-mongo](https://github.com/netreconlab/hipaa-mongo/). 

#### Postgres
To use the Postgres HIPAA compliant variant of parse-hipaa, simply type:

```docker-compose up```

#### Mongo
To use the Mongo HIPAA compliant variant of parse-hipaa, simply type:

```docker-compose -f docker-compose.mongo.yml up```

#### Postgres (Non-HIPAA Compliant)
If you would like to use a non-HIPAA compliant postgres version:

```docker-compose -f docker-compose.no.hipaa.yml up```

#### Mongo (Non-HIPAA Compliant)
A non-HIPAA compliant mongo version isn't provided as this is the default [parse-server](https://github.com/parse-community/parse-server#inside-a-docker-container) deployment and many examples of how to set this up already exist.

#### Getting started
parse-hipaa is made up of four (4) seperate docker images (you use 3 of them at a time) that work together as one system. It's important to set the environment variables for your parse-hipaa server. 

##### Environment Variables

For a complete list of enviroment variables, look at [app.json](https://github.com/netreconlab/parse-hipaa/blob/main/app.json).

###### netreconlab/parse-hipaa
```bash
PARSE_SERVER_APPLICATION_ID # Unique string value
PARSE_SERVER_PRIMARY_KEY # Unique string value
PARSE_SERVER_READ_ONLY_PRIMARY_KEY # Unique string value
PARSE_SERVER_ENCRYPTION_KEY # Unique string used for encrypting files stored by parse-hipaa
PARSE_SERVER_OBJECT_ID_SIZE # Integer value, parse defaults to 10, 32 is probably better for medical apps and large tables
PARSE_SERVER_DATABASE_URI # URI to connect to parse-hipaa. postgres://${PG_PARSE_USER}:${PG_PARSE_PASSWORD}@db:5432/${PG_PARSE_DB} or mongodb://${MONGO_PARSE_USER}:${MONGO_PARSE_PASSWORD}@db:27017/${MONGO_PARSE_DB}
PORT # Port for parse-hipaa, default is 1337
PARSE_SERVER_MOUNT_PATH: # Mounting path for parse-hipaa, default is /parse
PARSE_SERVER_URL # Server URL, default is http://parse:${PORT}/parse
PARSE_SERVER_PUBLIC_URL # Public Server URL, default is http://localhost:${PORT}/parse
PARSE_SERVER_CLOUD # Path to cloud code, default is /parse/cloud/main.js
PARSE_SERVER_MOUNT_GRAPHQL # Enable graphql, default is 'true'
PARSE_SET_USER_CLP # Set the Class Level Permissios of the _User schema so only authenticated users can access, default 1
PARSE_SERVER_ALLOW_CLIENT_CLASS_CREATION # String value of 'false' or 'true'. Prohibits class creation on the client side. Classes can still be created using Parse Dashboard by `useMasterKey`, default 'false'
PARSE_SERVER_ALLOW_CUSTOM_OBJECTID # Required to be true for ParseCareKit
PARSE_SERVER_ENABLE_SCHEMA_HOOKS # Keeps the schema in sync across all instances
PARSE_SERVER_DIRECT_ACCESS # Known to cause crashes when true on single instance of server and not behind public server
PARSE_SERVER_ENABLE_PRIVATE_USERS # Set to 'true' if new users should be created without public read and write access
PARSE_SERVER_USING_PARSECAREKIT # If you are not using ParseCareKit, set this to 'false', or else enable with 'true'. The default value is 'true'
PARSE_VERBOSE # Enable verbose output on the server
POSTGRES_PASSWORD: # Needed for wait-for-postgres.sh. Should be the same as POSTGRES_PASSWORD in netreconlab/hipaa-postgres
```

###### netreconlab/hipaa-postgres
```bash
POSTGRES_PASSWORD # Password for postgress db cluster
PG_PARSE_USER # Username for logging into PG_PARSE_DB
PG_PARSE_PASSWORD # Password for logging into PG_PARSE_DB
PG_PARSE_DB # Name of parse-hipaa database
```

###### netreconlab/hipaa-mongo
```bash
# Warning, if you want to make changes to the vars below they need to be changed manually in /scripts/mongo-init.js as the env vars are not passed to the script
MONGO_INITDB_ROOT_USERNAME # Username for mongo db. Username for logging into mongo db for parse-hipaa.
MONGO_INITDB_ROOT_PASSWORD # Password for mongo db. Password for logging into mongo db for parse-hipaa.
MONGO_INITDB_DATABASE # Name of mongo db for parse-hipaa
```

###### netreconlab/parse-hipaa-dashboard
```bash
PARSE_DASHBOARD_TRUST_PROXY: # Set this to 1 (or anything) if the dashboard is behind a proxy. Otherwise leave empty
PARSE_DASHBOARD_ALLOW_INSECURE_HTTP: # Set this to 1 (or anything) if not behind proxy and using the dashboard in docker. Note that either PARSE_DASHBOARD_ALLOW_INSECURE_HTTP or PARSE_DASHBOARD_TRUST_PROXY should be set at the same time, choose one or the other. Otherwise leave empty
PARSE_DASHBOARD_COOKIE_SESSION_SECRET: # Unique string. This should be constant across all deployments on your system
PARSE_DASHBOARD_MOUNT_PATH: # The default is "/dashboard". This needs to be exactly what you plan it to be behind the proxy, i.e. If you want to access cs.uky.edu/dashboard it should be "/dashboard"
```

###### parseplatform/parse-dashboard
```bash
PARSE_DASHBOARD_TRUST_PROXY: # Set this to 1 (or anything) if the dashboard is behind a proxy. Otherwise leave empty
PARSE_DASHBOARD_ALLOW_INSECURE_HTTP: # Set this to 1 (or anything) if not behind proxy and using the dashboard in docker. Note that either PARSE_DASHBOARD_ALLOW_INSECURE_HTTP or PARSE_DASHBOARD_TRUST_PROXY should be set at the same time, choose one or the other. Otherwise leave empty
PARSE_DASHBOARD_COOKIE_SESSION_SECRET: # Unique string. This should be constant across all deployments on your system
MOUNT_PATH: # The default is "/dashboard". This needs to be exactly what you plan it to be behind the proxy, i.e. If you want to access cs.uky.edu/dashboard it should be "/dashboard"
```

##### Starting up parse-hipaa

- For the default HIPAA compliant postgres version: ```docker-compose up```
- or for the HIPAA compliant mongo version: ```docker-compose -f docker-compose.mongo.yml up```
- or for the non-HIPAA compliant postgres version: ```docker-compose -f docker-compose.no.hipaa.yml up```
- A non-HIPAA compliant mongo version isn't provided in this repo as that's just a standard parse-server

Imporant Note: On the very first run, the "parse-server"(which will show up as "parse_1" in the console) will sleep and error a few times because it can't connect to postgres (the "db") container. This is suppose to happen and is due to postgres needing to configure and initialize, install the necessary extensions, and setup it's databases. Let it keep running and eventually you will see something like:

```bash
db_1         | PostgreSQL init process complete; ready for start up.
```

The parse-server container will automatically keep attempting to connect to the postgres container and when it's connected you will see: 

```bash
parse_1      | parse-server running on port 1337.
parse_1      | publicServerURL: http://localhost:1337/parse, serverURL: http://parse:1337/parse
parse_1      | GraphQL API running on http://localhost:1337/parsegraphql
parse_1      | info: Parse LiveQuery Server starts running
```

You may also see output such as the following in the console or log files: 

```bash
db_1         | 2020-03-18 21:59:21.550 UTC [105] ERROR:  duplicate key value violates unique constraint "pg_type_typname_nsp_index"
db_1         | 2020-03-18 21:59:21.550 UTC [105] DETAIL:  Key (typname, typnamespace)=(_SCHEMA, 2200) already exists.
db_1         | 2020-03-18 21:59:21.550 UTC [105] STATEMENT:  CREATE TABLE IF NOT EXISTS "_SCHEMA" ( "className" varChar(120), "schema" jsonb, "isParseClass" bool, PRIMARY KEY ("className") )
db_1         | 2020-03-18 21:59:21.550 UTC [106] ERROR:  duplicate key value violates unique constraint "pg_type_typname_nsp_index"
...
```

The lines above are console output from parse because they attempt to check and configure the postgres database if necessary. They doesn't hurt or slow down your parse-hipaa server.

### Local: Using Singularity Image with Postgres
There are equivalent [Singularity](https://sylabs.io/singularity/) images that can be configured in a similar fashion to Docker. The singularity images are hosted on GitHub Container Registry and can be found [here](https://github.com/netreconlab/parse-hipaa/pkgs/container/parse-hipaa). An example of of how to use this image can be found in [singularity-compose.yml](https://github.com/netreconlab/parse-hipaa/blob/main/singularity-compose.yml).

## Parse Server
Your parse-server is binded to all of your interfaces on port 1337/parse and be can be accessed as such, e.g. `http://localhost:1337/parse`.

The standard configuration can be modified to your liking by editing [index.js](https://github.com/netreconlab/parse-hipaa/blob/main/index.js). Here you can add/modify things like push notifications, password resets, [adapters](https://github.com/parse-community/parse-server#available-adapters), etc. This file as an express app and some examples provided from parse can be found [here](https://github.com/parse-community/parse-server#using-expressjs). Note that there is no need to rebuild your image when modifying files in the "index.js" file since it is volume mounted, but you will need to restart the parse container for your changes to take effect.

### Configuring
Default values for environment variables: `PARSE_SERVER_APPLICATION_ID` and `PARSE_SERVER_PRIMARY_KEY` are provided in [docker-compose.yml](https://github.com/netreconlab/parse-hipaa/blob/main/docker-compose.yml) for quick local deployment. If you plan on using this image to deploy in production, you should definitely change both values. Environment variables, `PARSE_SERVER_DATABASE_URI, PARSE_SERVER_URL, PORT, PARSE_SERVER_PUBLIC_URL, PARSE_SERVER_CLOUD, and PARSE_SERVER_MOUNT_GRAPHQL` should not be changed unles you are confident with configuring parse-server or else you image may not work properly. In particular, changing `PORT` should only be done in [.env](https://github.com/netreconlab/parse-hipaa/blob/main/.env) and will also require you to change the port manually in the [parse-dashboard-config.json](https://github.com/netreconlab/parse-hipaa/blob/main/parse/parse-dashboard-config.json#L4) for both "serverURL" and "graphQLServerURL" to have the Parse Dashboard work correctly.

#### Running in production for ParseCareKit
If you are plan on using parse-hipaa in production. You should run the additional scripts to create the rest of the indexes for optimized queries.

##### Postgres
If you are using `hipaa_postgres`, the `setup-parse-index.sh` is already in the container. You just have to run it. 

1. Log into your docker container, type: ```docker exec -u postgres -ti parse-hipaa_db_1 bash```
2. Run the script, type: ```./usr/local/bin/setup-parse-index.h```

If you are using your own postgres image, you should copy [setup-parse-index.sh](https://github.com/netreconlab/hipaa-postgres/blob/main/scripts/setup-parse-index.sh) to your container and complete the login and run steps above (be sure to switch `parse-hipaa_db_1` to your actual running container name on your system).

More information about configuring can be found on [hipaa-postgres](https://github.com/netreconlab/hipaa-postgres#configuring).

###### Idempotency
You most likely want to enable Idempotency. Read more about how to configure on [Parse Server](https://github.com/parse-community/parse-server#idempotency-enforcement). For Postgres, you can setup a [cron](https://en.wikipedia.org/wiki/Cron) or scheduler to run [parse_idempotency_delete_expired_records.sh](https://github.com/netreconlab/parse-hipaa/blob/main/parse/scripts/parse_idempotency_delete_expired_records.sh) at a desired frequency to remove stale data.

##### Mongo
Information about configuring can be found on [hipaa-mongo](https://github.com/netreconlab/hipaa-mongo).

###### Idempotency
You most likely want to enable Idempotency. Read more about how to configure on [Parse Server](https://github.com/parse-community/parse-server#idempotency-enforcement). For Postgres, you can setup a [cron](https://en.wikipedia.org/wiki/Cron) or scheduler to run [parse_idempotency_delete_expired_records.sh](https://github.com/netreconlab/parse-hipaa/blob/main/parse/scripts/parse_idempotency_delete_expired_records.sh) at a desired frequency to remove stale data.

#### Cloud Code
For verfying and cleaning your data along with other added functionality, you can add [Cloud Code](https://docs.parseplatform.org/cloudcode/guide/) to the [cloud](https://github.com/netreconlab/parse-hipaa/tree/main/parse/cloud) folder. Note that there is no need to rebuild your image when modifying files in the "cloud" folder since this is volume mounted, but you may need to restart the parse container for your changes to take effect.

## Viewing Your Data via Parse Dashboard

### Dashboard on Heroku
Follow the directions in the [parse-hipaa-dashboard](https://github.com/netreconlab/parse-hipaa-dashboard#remote) repo for one-button deployment of dashboard.

### Local (Docker or Singularity)

#### parseplatform/parse-dashboard (docker-compose.yml, docker-compose.no.hipaa.yml, docker-compose.mongo.yml)
Parse-Dashboard is binded to your `localhost` on port `4040` and can be accessed as such, e.g. http://localhost:4040/dashboard. The default login for the parse dashboard is username: "parse", password: "1234". For production you should change the usernames and passwords in the [postgres-dashboard-config.json](https://github.com/netreconlab/parse-hipaa/blob/main/parse/parse-dashboard-config.json#L13-L21). Note that the password is hashed by using [bcrypt-generator](https://bcrypt-generator.com) or similar. Authentication can also occur through [multi factor authentication](https://github.com/parse-community/parse-dashboard#multi-factor-authentication-one-time-password).

#### netreconlab/parse-hipaa-dashboard (docker-compose.dashboard.yml and docker-compose.mongo.dashboard.yml)
Parse-Hipaa-Dashboard is binded to your `localhost` on port `1337`, mounted to the `/dashboard` endpoint, and can be accessed as such, e.g. http://localhost:1337/dashboard. The default login for the parse dashboard is username: "parse", password: "1234". For production you should change the usernames and passwords in the [docker-compose.yml](https://github.com/netreconlab/parse-hipaa/blob/37f79bdb99781b634780b3af6a7e33e6beae44a0/docker-compose.yml#L30-L32) along with setting `PARSE_DASHBOARD_USER_PASSWORD_ENCRYPTED: 'true'`. Note that the password should be hashed using a [bcrypt-generator](https://bcrypt-generator.com) or similar. Authentication can also occur through [multi factor authentication](https://github.com/parse-community/parse-dashboard#multi-factor-authentication-one-time-password).

1. Open your browser and and depending on how your dashboard is mounted, go to http://localhost:4040/dashboard or http://localhost:1337/dashboard
2. Username: `parse` # You can use `parseRead` to login as a read only user
3. Password: `1234`
4. Be sure to refresh your browser to see new changes synched from your CareKitSample app

#### Configuring
If you plan on using this image to deploy in production, it is recommended to run this behind a proxy and add the environment variable `PARSE_DASHBOARD_TRUST_PROXY=1` to the dashboard container.

## Postgres
The image used is [postgis](https://hub.docker.com/r/postgis/postgis) which is an extention built on top of the [official postgres image](https://hub.docker.com/_/postgres). Note that postgres is not binded to your interfaces and is only local to the docker virtual network. This was done on purpose as the parse and parse-desktop is already exposed. 

If you want to persist the data in the database, you can uncomment the volume lines in [docker-compose](https://github.com/netreconlab/parse-hipaa/blob/main/docker-compose.yml#L41)

### Configuring
Default values for environment variables: `POSTGRES_PASSWORD, PG_PARSE_USER, PG_PARSE_PASSWORD, PG_PARSE_DB` are provided in [docker-compose.yml](https://github.com/netreconlab/parse-hipaa/blob/main/docker-compose.yml) for quick local deployment. If you plan on using this image to deploy in production, you should definitely change `POSTGRES_PASSWORD, PG_PARSE_USER, PG_PARSE_PASSWORD`. Note that the postgres image provides a default user of "postgres" to configure the database cluster, you can change the password for the "postgres" user by changing `POSTGRES_PASSWORD`. There are plenty of [postgres environment variables](https://hub.docker.com/_/postgres) that can be modified. Environment variables should not be changed unles you are confident with configuring postgres or else you image may not work properly. Note that changes to the aforementioned paramaters will only take effect if you do them before the first build and run of the image. Afterwards, you will need to make all changes by connecting to the image typing:

```docker exec -u postgres -ti parse-hipaa_db_1 bash```

You can then make modifications using [psql](http://postgresguide.com/utilities/psql.html). Through psql, you can also add multiple databases and users to support a number of parse apps. Note that you will also need to add the respecting parse-server containers (copy parse container in the .yml and rename to your new app) along with the added app in [postgres-dashboard-config.json](https://github.com/netreconlab/parse-hipaa/blob/main/parse/parse-dashboard-config.json).

## Deploying on a real system
The docker yml's here are intended to run behind a proxy that properly has ssl configured to encrypt data in transit. To create a proxy to parse-hipaa, nginx files are provided [here](https://github.com/netreconlab/parse-hipaa/tree/main/nginx/sites-enabled). Simply add the [sites-available](https://github.com/netreconlab/parse-hipaa/tree/main/nginx/sites-enabled) folder to your nginx directory and add the following to "http" in your nginx.conf:

```bash
http {
    include /usr/local/etc/nginx/sites-enabled/*.conf; # Add this line to end. This is for macOS, do whatever is appropriate on your system
}
```

Setup your free certificates using [LetsEncrypt](https://letsencrypt.org), follow the directions [here](https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/). Be sure to change the certificate and key lines to point to correct location in [default-ssl.conf](https://github.com/netreconlab/parse-hipaa/blob/main/nginx/sites-enabled/default-ssl.conf).

## Is there a mongo version available?
The mongo equivalent is available in this repo. The same steps as above. but use:

```docker-compose -f docker-compose.mongo.yml up```
