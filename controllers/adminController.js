const db = require("../db/dbConnector");

exports.getDashboard = async function (req, res) {
  try {
    const data = await db.task(async (t) => {
    const totals = await t.one(
      `select
          (select count(*) from patient) as patients,
          (select count(*)
             from doctor
             join login on login.email = doctor.email
            where login.user_role = 'doctor') as doctors,
          (select count(*) from record) as records,
          (select count(*) from disease) as diseases`
    );
      const recentRecords = await t.any(
        `select record.id, record.date, patient.f_name as pat_fname, patient.l_name as pat_lname,
          doctor.f_name as doc_fname, doctor.l_name as doc_lname
         from record
         join patient on patient.id = record.pat_id
         join doctor on doctor.id = record.doc_id
         order by record.date desc, record.id desc
         limit 5`
      );

      return { totals, recentRecords };
    });

    res.json({ status: "ok", data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Failed to load dashboard" });
  }
};

exports.getAccount = function (req, res) {
  const { offset } = req.body;
  let response = {};

  db.task((t) => {
    return t
      .one("select count(*) from login where login.user_role = 'doctor'; ")
      .then((total) => {
        return t
          .any(
            "select doctor.id, doctor.f_name as doc_fname,doctor.l_name as doc_lname,doctor.email,doctor.cnic,doctor.phone_num as num from doctor,login where doctor.email = login.email and login.user_role = 'doctor' order by doctor.id limit 5 offset $1;",
            [offset]
          )
          .then((records) => {
            response["total"] = total;
            response["records"] = records;
            res.json({
              status: "ok",
              response: response,
            });
          });
      });
  });
};

exports.newAccount = function (req, res) {
  const { fname, lname, num, cnic } = req.body;
  const email = String(req.body.email || "").trim().toLowerCase();

  if (!email) {
    res.status(400).json({ status: "error", message: "Email is required" });
    return;
  }

  db.task((t) => {
    return t
      .none(
        "insert into doctor (cnic,f_name,l_name,email,phone_num) values ($1,$2,$3,$4,$5);",
        [cnic, fname, lname, email, num]
      )
      .then(() => {
        return t.none(
          "insert into login (email,user_role) values ($1,'doctor');",
          [email]
        );
      });
  })
    .then(() => {
      res.json({
        status: "ok",
      });
    })
    .catch((err) => {
      console.log(err);
      const exists = err.code === "23505";
      res.status(exists ? 409 : 500).json({
        status: "error",
        message: exists ? "An account with this email already exists" : "Failed to create account",
      });
    });
};

exports.updateAccount = function (req, res) {
  const { id, fname, lname, num, cnic } = req.body;
  const email = String(req.body.email || "").trim().toLowerCase();

  if (!id) {
    res.status(400).json({ status: "error", message: "Account id is required" });
    return;
  }
  if (!email) {
    res.status(400).json({ status: "error", message: "Email is required" });
    return;
  }

  db.tx(async (t) => {
    const existing = await t.oneOrNone("select id, email from doctor where id = $1;", [id]);
    if (!existing) {
      return { notFound: true };
    }

    // Keep the login identity row in sync when the email changes.
    if (existing.email && existing.email.toLowerCase() !== email) {
      await t.none(
        "update login set email = $1 where email = $2 and user_role = 'doctor';",
        [email, existing.email]
      );
    }

    await t.none(
      "update doctor set f_name=$1, l_name=$2, phone_num=$3, cnic=$4, email=$5 where id = $6;",
      [fname, lname, num, cnic, email, id]
    );

    return { notFound: false };
  })
    .then((result) => {
      if (result.notFound) {
        res.status(404).json({ status: "error", message: "Doctor not found" });
        return;
      }
      res.json({ status: "ok" });
    })
    .catch((err) => {
      console.log(err);
      const exists = err.code === "23505";
      res.status(exists ? 409 : 500).json({
        status: "error",
        message: exists ? "Another account already uses this email" : "Failed to update account",
      });
    });
};

exports.delAccount = function (req, res) {
  const { id } = req.body;
  const email = String(req.body.email || "").trim().toLowerCase();

  if (!id && !email) {
    res.status(400).json({ status: "error", message: "Doctor id or email is required" });
    return;
  }

  db.tx(async (t) => {
    const doctor = id
      ? await t.oneOrNone("select id, email from doctor where id = $1;", [id])
      : await t.oneOrNone("select id, email from doctor where email = $1;", [email]);

    if (!doctor) {
      return { notFound: true };
    }

    // Delete the doctor row first so doctor-owned records cascade away.
    await t.none("delete from doctor where id = $1;", [doctor.id]);

    // Then remove the corresponding login and credentials.
    await t.none("delete from login where email = $1 and user_role = 'doctor';", [
      doctor.email,
    ]);

    return { notFound: false };
  })
    .then((result) => {
      if (result.notFound) {
        res.status(404).json({ status: "error", message: "Doctor not found" });
        return;
      }

      res.json({
        status: "ok",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: "error", message: "Failed to delete account" });
    });
};

exports.getDisease = function (req, res) {
  const { offset } = req.body;
  let response = {};

  db.task((t) => {
    return t.one("select count(*) from disease;").then((total) => {
      return t
        .any(
          "select id, disease_name as disease from disease order by disease_name limit 5 offset $1",
          [offset]
        )
        .then((records) => {
          response["total"] = total;
          response["records"] = records;
          res.json({
            status: "ok",
            response: response,
          });
        });
    });
  }).catch((err) => {
    console.log(err);
    res.status(500).json({ status: "error" });
  });
};

exports.addDisease = function (req, res) {
  const dis_name = String(req.body.disease || "").trim();
  if (!dis_name) {
    res.status(400).json({ status: "error", message: "Disease name is required" });
    return;
  }
  db.none("insert into disease (disease_name) values ($1)", [dis_name])
    .then(() => {
      res.json({
        status: "ok",
      });
    })
    .catch((err) => {
      console.log(err);
      const message =
        err.code === "23505" ? "Disease already exists" : "Failed to add disease";
      res.status(err.code === "23505" ? 409 : 500).json({
        status: "error",
        message,
      });
    });
};

exports.updateDisease = function (req, res) {
  const { id } = req.body;
  const name = String(req.body.name || "").trim();

  if (!id) {
    res.status(400).json({ status: "error", message: "Disease id is required" });
    return;
  }
  if (!name) {
    res.status(400).json({ status: "error", message: "Disease name is required" });
    return;
  }

  db.tx(async (t) => {
    const existing = await t.oneOrNone("select disease_name from disease where id = $1;", [id]);
    if (!existing) {
      return { notFound: true };
    }

    await t.none("update disease set disease_name = $1 where id = $2;", [name, id]);
    // record_to_disease stores the disease name as a denormalized string,
    // so keep historical records consistent with the rename.
    await t.none("update record_to_disease set disease = $1 where disease = $2;", [
      name,
      existing.disease_name,
    ]);

    return { notFound: false };
  })
    .then((result) => {
      if (result.notFound) {
        res.status(404).json({ status: "error", message: "Disease not found" });
        return;
      }
      res.json({ status: "ok" });
    })
    .catch((err) => {
      console.log(err);
      const exists = err.code === "23505";
      res.status(exists ? 409 : 500).json({
        status: "error",
        message: exists ? "Disease already exists" : "Failed to update disease",
      });
    });
};

exports.delDisease = function (req, res) {
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ status: "error", message: "Disease id is required" });
    return;
  }
  db.none("delete from disease where id = $1;", [id])
    .then(() => {
      res.json({ status: "ok" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: "error", message: "Failed to delete disease" });
    });
};

// Lists all patients in the system (admin view), paginated.
exports.getPatients = function (req, res) {
  const { offset } = req.body;
  let response = {};

  db.task((t) => {
    return t.one("select count(*) from patient;").then((total) => {
      return t
        .any(
          `select id, f_name as pat_fname, l_name as pat_lname, cnic,
            phone_num as num, email, dob, gender, blood
           from patient
           order by id
           limit 5 offset $1;`,
          [offset]
        )
        .then((records) => {
          response["total"] = total;
          response["records"] = records;
          res.json({ status: "ok", response: response });
        });
    });
  }).catch((err) => {
    console.log(err);
    res.status(500).json({ status: "error", message: "Failed to load patients" });
  });
};

// Deletes a patient and all dependent patient-owned data.
exports.delPatient = function (req, res) {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ status: "error", message: "Patient id is required" });
    return;
  }

  db.tx(async (t) => {
    const patient = await t.oneOrNone("select id, email from patient where id = $1;", [id]);
    if (!patient) {
      return { notFound: true };
    }

    // Patient-owned tables cascade from the patient row.
    await t.none("delete from patient where id = $1;", [id]);

    // Remove the associated login row and credentials for this patient account.
    await t.none("delete from login where email = $1 and user_role = 'patient';", [
      patient.email,
    ]);

    return { notFound: false };
  })
    .then((result) => {
      if (result.notFound) {
        res.status(404).json({ status: "error", message: "Patient not found" });
        return;
      }

      res.json({ status: "ok" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: "error", message: "Failed to delete patient" });
    });
};

// Lists medical records in the system (admin view), paginated.
// When a pat_id is supplied, only that patient's records are returned.
exports.getRecords = function (req, res) {
  const { offset, pat_id } = req.body;
  const filterByPatient =
    pat_id !== undefined && pat_id !== null && pat_id !== "";
  let response = {};

  db.task((t) => {
    const countSql = filterByPatient
      ? "select count(*) from record where pat_id = $1;"
      : "select count(*) from record;";
    const countParams = filterByPatient ? [pat_id] : [];

    return t.one(countSql, countParams).then((total) => {
      const listSql = `select record.id, record.date,
            patient.f_name as pat_fname, patient.l_name as pat_lname,
            doctor.f_name as doc_fname, doctor.l_name as doc_lname
           from record
           join patient on patient.id = record.pat_id
           join doctor on doctor.id = record.doc_id
           ${filterByPatient ? "where record.pat_id = $2" : ""}
           order by record.date desc, record.id desc
           limit 5 offset $1;`;
      const listParams = filterByPatient ? [offset, pat_id] : [offset];

      return t.any(listSql, listParams).then((records) => {
        response["total"] = total;
        response["records"] = records;
        res.json({ status: "ok", response: response });
      });
    });
  }).catch((err) => {
    console.log(err);
    res.status(500).json({ status: "error", message: "Failed to load records" });
  });
};

// Returns a single record for the admin view.
// The doctor's private note is intentionally excluded.
exports.singleRecord = function (req, res) {
  const { rid } = req.body;
  let result = {};

  db.task((t) => {
    return t
      .oneOrNone(
        `select record.id, record.date,
          patient.f_name as pat_fname, patient.l_name as pat_lname, patient.dob, patient.gender,
          doctor.f_name as doc_fname, doctor.l_name as doc_lname,
          record.prescription, record.observation
         from patient, doctor, record
         where record.id = $1 and patient.id = record.pat_id and record.doc_id = doctor.id;`,
        [rid]
      )
      .then((data) => {
        if (data) {
          return t
            .any(
              "select disease from record_to_disease where record_id = $1;",
              [data.id]
            )
            .then((diseases) => {
              result["data"] = data;
              result["diseases"] = diseases;
            });
        }
      });
  })
    .then(() => {
      res.json({ status: "ok", res: result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: "error", message: "Failed to load record" });
    });
};
