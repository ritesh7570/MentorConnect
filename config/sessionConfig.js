const session = require("express-session");
const MongoStore = require("connect-mongo");

const sessionConfig = (mongoUrl, secret) => {
  return session({
    store: MongoStore.create({
      mongoUrl, // ✅ Correct usage
      touchAfter: 24 * 3600 // optional: reduce writes to DB
    }),
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  });
};

module.exports = sessionConfig;
