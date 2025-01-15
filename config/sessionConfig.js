const session = require("express-session");
const MongoStore = require("connect-mongo");

const sessionConfig = (mongoUrl, secret) => {
  return {
    store: MongoStore.create({
      mongoUrl,
      secret,
      touchAfter: 24 * 3600, // Delay write to the store for a day
    }),
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  };
};

module.exports = sessionConfig;
