# parse-postgres

Example of how to run [parse-server](https://github.com/parse-community/parse-server) with [postgres](https://www.postgresql.org). This also includes [parse-dashboard](https://github.com/parse-community/parse-dashboard) for viewing/modifying your data. [GraphQL](https://graphql.org) is also enabled and the playground can be accessed via parse-dashboard. A modified example of Apple's [CareKit](https://github.com/carekit-apple/CareKit) sample app, [CareKitSample-ParseCareKit](https://github.com/netreconlab/CareKitSample-ParseCareKit), uses parse-postgres along with [ParseCareKit](https://github.com/netreconlab/ParseCareKit). To get started simply type:

```docker-compose up```

## HIPAA compliant parse-postgres
A parse-server BaaS such as this can be made HIPAA compliant by swapping out the "db" container for variants such as [postges](https://github.com/netreconlab/parse-postgres/blob/master/docker-compose.hipaa.yml)(included in this repo) or [mongo](https://github.com/netreconlab/hipaa_mongodb). To use a HIPAA compliant (includes the necessary auditing and logging. You will still need to: use nginx for a TLS proxy, mount to your own encrypted drive, and store the drive in a "safe" location, along with anything else HIPAA requires) version of parse-postgres, simply type:

```docker-compose -f docker-compose.hipaa.yml up```

If you would like to use the mongo version:

```docker-compose -f docker-compose.hipaa.mongo.yml up```

**Use at your own risk. There is not promise that this is HIPAA compliant and we are not responsible for any mishandling of your data**

## Getting started
- ```docker-compose up```
- or for HIPAA compliant version: ```docker-compose -f docker-compose.hipaa.yml up```

Imporant Note: On the very first run, the "parse-server"(which will show up as "parse_1" in the console) will sleep and error a few times because it can't connect to postgres (the "db") container. This is suppose to happen and is due to postgres needing to initialize, install the necessary extensions, and setup it's databases. Let it keep running and eventually you will see something like:

```db_1         | PostgreSQL init process complete; ready for start up.```

The parse-server container will automatically keep attempting to connect to the postgres container and when it's connected you will see: 

```
parse_1      | parse-server running on port 1337.
parse_1      | publicServerURL: http://localhost:1337/parse, serverURL: http://parse:1337/parse
parse_1      | GraphQL API running on http://localhost:1337/parsegraphql
parse_1      | info: Parse LiveQuery Server starts running
```
You may also see output such as the following in the console or log files: 

```
db_1         | 2020-03-18 21:59:21.550 UTC [105] ERROR:  duplicate key value violates unique constraint "pg_type_typname_nsp_index"
db_1         | 2020-03-18 21:59:21.550 UTC [105] DETAIL:  Key (typname, typnamespace)=(_SCHEMA, 2200) already exists.
db_1         | 2020-03-18 21:59:21.550 UTC [105] STATEMENT:  CREATE TABLE IF NOT EXISTS "_SCHEMA" ( "className" varChar(120), "schema" jsonb, "isParseClass" bool, PRIMARY KEY ("className") )
db_1         | 2020-03-18 21:59:21.550 UTC [106] ERROR:  duplicate key value violates unique constraint "pg_type_typname_nsp_index"
...
```

The lines above are output from parse because they attempt to configure the postgres database everytime. They will not hurt your database.

## Parse Server
Your parse-server is binded to all of your interfaces on port 1337/parse and be can be accessed as such, e.g. `http://localhost:1337/parse`.

The standard configuration can be modified to your liking by editing [index.js](https://github.com/netreconlab/parse-postgres/blob/master/index.js). Here you can add/modify things like push notifications, password resets, [adapters](https://github.com/parse-community/parse-server#available-adapters), etc. This file as an express app and some examples provided from parse can be found [here](https://github.com/parse-community/parse-server#using-expressjs). Note that there is no need to rebuild your image when modifying files in the "index.js" file since it is volume mounted, but you will need to restart the parse container for your changes to take effect.

### Configuring
Default values for environment variables: `PARSE_SERVER_APPLICATION_ID` and `PARSE_SERVER_MASTER_KEY` are provided in [docker-compose.yml](https://github.com/netreconlab/parse-postgres/blob/master/docker-compose.yml) for quick local deployment. If you plan on using this image to deploy in production, you should definitely change both values. Environment variables, `PARSE_SERVER_DATABASE_URI, PARSE_SERVER_URL, PORT, PARSE_PUBLIC_SERVER_URL, PARSE_SERVER_CLOUD, and PARSE_SERVER_MOUNT_GRAPHQL` should not be changed unles you are confident with configuring parse-server or else you image may not work properly. In particular, changing `PORT` should only be done in [.env](https://github.com/netreconlab/parse-postgres/blob/master/.env) and will also require you to change the port manually in the [parse-dashboard-config.json](https://github.com/netreconlab/parse-postgres/blob/master/parse-dashboard-config.json#L4) for both "serverURL" and "graphQLServerURL" to have the Parse Dashboard work correctly.

Other [parse-server environment variables](https://github.com/parse-community/parse-server/blob/master/src/Options/Definitions.js) can be set, but they require you to make additions/modifications to the [index.js](https://github.com/netreconlab/parse-postgres/blob/master/index.js).

### Cloud Code
For verfying and cleaning your data along with other added functionality, you can add [Cloud Code](https://docs.parseplatform.org/cloudcode/guide/) to the [cloud](https://github.com/netreconlab/parse-postgres/tree/master/cloud) folder. Note that there is no need to rebuild your image when modifying files in the "cloud" folder since this is volume mounted, but you may need to restart the parse container for your changes to take effect.

## Parse Dashboard
Parse-dashboard is binded to your localhost on port 4040 and can be accessed as such, e.g. `http://localhost:4040/`. The default login for the parse dashboard is username: "parse", password: "1234". For production you should change the password in the [postgres-dashboard-config.json](https://github.com/netreconlab/parse-postgres/blob/master/parse-dashboard-config.json#L14). Note that ideally the password should be hashed by using something like [bcrypt-generator](https://bcrypt-generator.com) and setting "useEncryptedPasswords": false". You can also add more users through this method.

### Configuring
As mentioned, the default address and port the parse-server dashboard is binded to is 127.0.0.1:4040:4040 which means it can only be accessed by your local machine. If you want to change this, you should do it [here](https://github.com/netreconlab/parse-postgres/blob/master/docker-compose.yml#L29). If you plan on using this image to deploy in production, it is recommended to run this behind a proxy and add the environment variable `PARSE_DASHBOARD_TRUST_PROXY=1` to the dashboard container. Note that since the parse dashboard is running in docker, the following should remain in the yml, `command: parse-dashboard --dev`.

## Postgres
The image used is [postgis](https://hub.docker.com/r/postgis/postgis) which is an extention built on top of the [official postgres image](https://hub.docker.com/_/postgres). Note that postgres is not binded to your interfaces and is only local to the docker virtual network. This was done on purpose as the parse and parse-desktop is already exposed. 

If you want to persist the data in the database, you can uncomment the volume lines in [docker-compose](https://github.com/netreconlab/parse-postgres/blob/master/docker-compose.yml#L41)

### Configuring
Default values for environment variables: `POSTGRES_PASSWORD, PG_PARSE_USER, PG_PARSE_PASSWORD, PG_PARSE_DB` are provided in [docker-compose.yml](https://github.com/netreconlab/parse-postgres/blob/master/docker-compose.yml) for quick local deployment. If you plan on using this image to deploy in production, you should definitely change `POSTGRES_PASSWORD, PG_PARSE_USER, PG_PARSE_PASSWORD`. Note that the postgres image provides a default user of "postgres" to configure the database cluster, you can change the password for the "postgres" user by changing `POSTGRES_PASSWORD`. There are plenty of [postgres environment variables](https://hub.docker.com/_/postgres) that can be modified. Environment variables should not be changed unles you are confident with configuring postgres or else you image may not work properly. Note that changes to the aforementioned paramaters will only take effect if you do them before the first build and run of the image. Afterwards, you will need to make all changes by connecting to the image typing:

```docker exec -u postgres -ti parse-postgres_db_1 bash```

You can then make modifications using [psql](http://postgresguide.com/utilities/psql.html). Through psql, you can also add multiple databases and users to support a number of parse apps. Note that you will also need to add the respecting parse-server containers (copy parse container in the .yml and rename to your new app) along with the added app in [postgres-dashboard-config.json](https://github.com/netreconlab/parse-postgres/blob/master/parse-dashboard-config.json).


## Is there a mongo version available?
The mongo version for this isn't shown as there are many examples online on how to deploy with mongo and mongo is part of the default documentation for [parse-server](https://github.com/parse-community/parse-server). The purpose of this repo is to show how to integrate with postgres and provide something out-of-the-box like [parse-server-example](https://github.com/parse-community/parse-server-example).


