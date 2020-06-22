db.createUser(
        {
            user: "parse",
            pwd: "parse",
            roles: [
                {
                    role: "readWrite",
                    db: "parse_hipaa"
                }
            ]
        }
);
