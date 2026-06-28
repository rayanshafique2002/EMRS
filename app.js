var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passportSetup = require("./config/passportSetup");
var cookieSession = require("cookie-session");
var compression = require("compression");
var helmet = require("helmet");
var passport = require("passport");
var cors = require("cors");
require("dotenv").config();

var app = express();
var isProduction = process.env.NODE_ENV === "production";
var defaultOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];
var configuredOrigins = (process.env.CORS_ORIGINS || process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map(function (origin) {
    return normalizeOrigin(origin);
  })
  .filter(Boolean);
var allowedOrigins = Array.from(new Set(defaultOrigins.map(normalizeOrigin).concat(configuredOrigins)));

function normalizeOrigin(origin) {
  return String(origin || "").trim().replace(/\/+$/, "");
}

function isAllowedOrigin(origin) {
  var normalizedOrigin = normalizeOrigin(origin);

  if (!normalizedOrigin) {
    return true;
  }

  if (allowedOrigins.indexOf(normalizedOrigin) !== -1) {
    return true;
  }

  if (!isProduction && /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(normalizedOrigin)) {
    return true;
  }

  return false;
}

//For defense against well known web vulnerabilities
app.use(helmet());

//For compression
app.use(compression());

//Configure CORS for frontend origins that own authenticated sessions.
var corsOptions = {
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin not allowed by CORS: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

//Add cookie sessions of 1 hour
app.use(
  cookieSession({
    maxAge: 1 * 1000 * 60 * 60,
    keys: [process.env.KEY || "development-session-key-change-me"],
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })
);

//Initialize passport
app.use(passport.initialize());
app.use(passport.session());

//Routes
var patientRouter = require("./routes/patient");
var doctorRouter = require("./routes/doctor");
var adminRouter = require("./routes/admin");
var authRouter = require("./routes/auth");

app.use(logger("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRouter);
app.use("/patient", patientRouter);
app.use("/doctor", doctorRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  var status = err.status || 500;
  res.status(status).json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});

module.exports = app;
