db.createUser(
        {
            user: process.env.MONGO_PARSE_USER,
            pwd: process.env.MONGO_PARSE_PASSWORD,
            roles: [
                {
                    role: "readWrite",
                    db: process.env.MONGO_PARSE_DB
                }
            ]
        }
);
