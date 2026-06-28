const db = require("../db/dbConnector");
const bcrypt = require("bcryptjs");
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
const loginAttempts = new Map();

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function cleanName(name) {
  return String(name || "").trim().slice(0, 100);
}

function tooManyAttempts(email) {
  const key = email || "unknown";
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const current = (loginAttempts.get(key) || []).filter((time) => now - time < windowMs);
  current.push(now);
  loginAttempts.set(key, current);
  return current.length > 10;
}

// Request appending middlware : This will append user's id from patient table into the request object
const verifyRegistration = function (req, res) {
  return new Promise(function (resolve, reject) {
    const { id, role } = req.user;
    if (role === "patient") {
      db.oneOrNone(
        "select patient.id from patient,login where login.id=$1 and login.email = patient.email;",
        [id]
      )
        .then((data) => {
          if (data) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          reject(Error(err));
        });
    } else {
      resolve(false);
    }
  });
};

//Logs out the user and ends the session
exports.logout = function (req, res) {
  if (typeof req.logout === "function") {
    req.logout();
  }
  req.session = null;
  res.json({
    status: "ok",
  });
};

// Returns the current signed-in user's display details for the UI.
exports.currentUser = async function (req, res) {
  if (!req.user) {
    res.status(401).json({ status: "error", message: "Not authenticated" });
    return;
  }

  try {
    const { role, email } = req.user;

    if (role === "doctor") {
      const doctor = await db.oneOrNone(
        "select f_name, l_name, email from doctor where email = $1;",
        [email]
      );

      res.json({
        status: "ok",
        user: {
          role,
          email,
          displayName: doctor
            ? [doctor.f_name, doctor.l_name].filter(Boolean).join(" ") || doctor.email
            : email,
        },
      });
      return;
    }

    if (role === "patient") {
      const patient = await db.oneOrNone(
        "select f_name, l_name, email from patient where email = $1;",
        [email]
      );

      res.json({
        status: "ok",
        user: {
          role,
          email,
          displayName: patient
            ? [patient.f_name, patient.l_name].filter(Boolean).join(" ") || patient.email
            : email,
        },
      });
      return;
    }

    res.json({
      status: "ok",
      user: {
        role,
        email,
        displayName: email,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Failed to load current user" });
  }
};

//Handles user redirect after google authentication is completed
exports.googleRedirect = function (req, res) {
  const role = req.user.role;

  if (role === "patient") {
    verifyRegistration(req, res).then((isRegistered) => {
      if (isRegistered) {
        res.redirect(`${CLIENT_ORIGIN}/p/dashboard`);
      } else {
        res.redirect(`${CLIENT_ORIGIN}/newprofile`);
      }
    });
  } else if (role === "doctor") {
    res.redirect(`${CLIENT_ORIGIN}/d/dashboard`);
  } else if (role === "admin") {
    res.redirect(`${CLIENT_ORIGIN}/a/dashboard`);
  } else {
    console.log("ERROR: UNKNOWN ROLE TYPE");
    res.redirect(CLIENT_ORIGIN);
  }
};

//Handles user redirect after facebook authentication is completed
exports.facebookRedirect = function (req, res) {
  const role = req.user.role;

  if (role === "patient") {
    verifyRegistration(req, res).then((isRegistered) => {
      if (isRegistered) {
        res.redirect(`${CLIENT_ORIGIN}/p/dashboard`);
      } else {
        res.redirect(`${CLIENT_ORIGIN}/newprofile`);
      }
    });
  } else if (role === "doctor") {
    res.redirect(`${CLIENT_ORIGIN}/d/dashboard`);
  } else if (role === "admin") {
    res.redirect(`${CLIENT_ORIGIN}/a/dashboard`);
  } else {
    console.log("ERROR: UNKNOWN ROLE TYPE");
    res.redirect(CLIENT_ORIGIN);
  }
};

//Checks if person accessing patient route is authenticated
exports.authPatient = function (req, res) {
  //Check if session is present
  if (!req.user) {
    const ret = {
      hasSession: false,
      isRegistered: false,
    };
    res.json(ret);
    return;
  }

  //Check if the user is a patient
  if (req.user.role !== "patient") {
    const ret = {
      hasSession: false,
      isRegistered: false,
    };
    res.json(ret);
  } else {
    //Check if user is registered
    verifyRegistration(req, res).then((isRegistered) => {
      if (isRegistered) {
        const ret = {
          hasSession: true,
          isRegistered: true,
        };
        res.json(ret);
      } else {
        const ret = {
          hasSession: true,
          isRegistered: false,
        };
        res.json(ret);
      }
    });
  }
};

//Checks if person accessing doctor route is authenticated as doctor
exports.authDoctor = function (req, res) {
  //Check if session is present
  if (!req.user) {
    const ret = {
      hasSession: false,
    };
    res.json(ret);
    return;
  }

  //Check if the user is a doctor
  if (req.user.role !== "doctor") {
    const ret = {
      hasSession: false,
    };
    res.json(ret);
  } else {
    const ret = {
      hasSession: true,
    };
    res.json(ret);
  }
};

//Checks if person accessing admin route is authenticated as admin
exports.authAdmin = function (req, res) {
  //Check if session is present
  if (!req.user) {
    const ret = {
      hasSession: false,
    };
    res.json(ret);
    return;
  }

  //Check if the user is a admin
  if (req.user.role !== "admin") {
    const ret = {
      hasSession: false,
    };
    res.json(ret);
  } else {
    const ret = {
      hasSession: true,
    };
    res.json(ret);
  }
};

// Initialize credentials table once on startup
async function initializeCredentialsTable() {
  try {
    console.log("Initializing credentials table...");
    await db.none(
      `CREATE TABLE IF NOT EXISTS credentials (
        id SERIAL PRIMARY KEY,
        login_id INTEGER REFERENCES login(id) ON DELETE CASCADE,
        password_hash VARCHAR(255) NOT NULL
      );`
    );
    console.log("Credentials table initialized successfully");
  } catch (err) {
    console.error("Error initializing credentials table:", err);
  }
}

// Call initialization when module loads
initializeCredentialsTable();

// Register a local user (email + password)
exports.registerLocal = async function (req, res) {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");
  const username = cleanName(req.body.username);
  const role = req.body.role;

  if (!email || !password) {
    res.status(400).json({ success: false, message: "Email and password required" });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ success: false, message: "Enter a valid email address" });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    return;
  }

  const normalizedRole = role === "doctor" ? "doctor" : "patient";

  try {
    let existing;
    try {
      existing = await db.oneOrNone("select * from login where email=$1", [email]);
    } catch (dbErr) {
      console.error("Error checking login existence:", dbErr.message);
      res.status(500).json({ success: false, message: "Database error" });
      return;
    }

    let loginId;
    if (existing) {
      const cred = await db.oneOrNone("select * from credentials where login_id=$1", [existing.id]);
      if (cred) {
        res.status(409).json({ success: false, message: "Account already exists" });
        return;
      }

      loginId = existing.id;
      await db.none("update login set user_role=$1 where id=$2", [normalizedRole, loginId]);

      if (normalizedRole === "patient") {
        await db.none(
          "insert into patient (email,f_name) values ($1,$2) on conflict (email) do nothing",
          [email, username || null]
        );
      } else {
        await db.none(
          "insert into doctor (email,f_name) values ($1,$2) on conflict (email) do nothing",
          [email, username || null]
        );
      }
    } else {
      const data = await db.one(
        "insert into login (email,user_role) values ($1,$2) returning id;",
        [email, normalizedRole]
      );
      loginId = data.id;

      if (normalizedRole === "patient") {
        await db.none(
          "insert into patient (email,f_name) values ($1,$2)",
          [email, username || null]
        );
      } else {
        await db.none(
          "insert into doctor (email,f_name) values ($1,$2)",
          [email, username || null]
        );
      }
    }

    const hash = await bcrypt.hash(password, 12);
    await db.none("insert into credentials (login_id,password_hash) values ($1,$2)", [loginId, hash]);

    const loginRow = await db.one("select * from login where id=$1", [loginId]);
    const user = { id: loginRow.id, role: loginRow.user_role, email: loginRow.email };
    req.login(user, function (err) {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Registered but login failed" });
        return;
      }
      res.json({ success: true, message: "Registered", role: user.role });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login local user (email + password)
exports.loginLocal = async function (req, res, next) {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || "");
  if (!email || !password) {
    res.status(400).json({ success: false, message: "Email and password required" });
    return;
  }

  if (tooManyAttempts(email)) {
    res.status(429).json({ success: false, message: "Too many login attempts. Try again later." });
    return;
  }

  try {
    const loginRow = await db.oneOrNone("select * from login where email=$1", [email]);
    if (!loginRow) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const cred = await db.oneOrNone("select * from credentials where login_id=$1", [loginRow.id]);
    if (!cred) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const match = await bcrypt.compare(password, cred.password_hash);
    if (!match) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    // login the user via passport
    const user = { id: loginRow.id, role: loginRow.user_role, email: loginRow.email };
    req.login(user, function (err) {
      if (err) return next(err);
      loginAttempts.delete(email);
      res.json({ success: true, message: "Logged in", role: user.role });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
