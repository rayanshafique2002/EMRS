const db = require("../db/dbConnector");

//Adds the table id from the patient table into request
exports.addTableId = function (req, res, next) {
  if (!req.user) {
    res.status(401).json({ status: "error", message: "Not authenticated" });
    return;
  }

  const { id, role } = req.user;
  if (role !== "patient") {
    res.status(403).json({ status: "error", message: "Not authorized" });
    return;
  }

  db.oneOrNone(
    "select patient.id from patient,login where login.id=$1 and login.email = patient.email;",
    [id]
  )
    .then((data) => {
      if (data) {
        req.user = {
          id: id,
          role: "patient",
          tid: data.id,
          email: req.user.email,
        };
        next();
      } else {
        res.status(403).json({ status: "error", message: "Patient profile not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: "error", message: "Server error" });
    });
};

// Inserts new patient account information into database.
exports.newAccount = function (req, res) {
  if (!req.user || !req.user.email) {
    res.status(401).json({ status: "error", message: "Not authenticated" });
    return;
  }

  const { fname, lname, dob, num, cnic, gender, bloodGroup } = req.body;
  const email = req.user.email;
  db.none(
    "update patient set cnic=$2,f_name=$3,l_name=$4,dob=$5,blood=$6,gender=$7,phone_num=$8 where email=$1;",
    [email, cnic, fname, lname, dob, bloodGroup, gender, num]
  )
    .then(() => {
      res.json({
        status: "ok",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: "error", message: "Failed to save profile" });
    });
};

// Gets the patient's profile information from the database.
exports.getProfile = function (req, res) {
  const id = req.user.tid;
  db.one(
    "select patient.f_name,patient.l_name,patient.cnic,patient.dob,patient.email,patient.gender,patient.blood,patient.phone_num from patient where patient.id = $1;",
    [id]
  )
    .then((data) => {
      res.json({
        status: "ok",
        data: data,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// Updates patient's profile information with the provided information.
exports.updateProfile = function (req, res) {
  const id = req.user.tid;
  const { fname, lname, num, cnic, dob, gender, bloodGroup } = req.body;
  db.none(
    "update patient set f_name=$1,l_name=$2,phone_num=$3,cnic=$4,dob=$5,gender=$6,blood=$7 where id = $8;",
    [fname, lname, num, cnic, dob || null, gender, bloodGroup, id]
  )
    .then(() => {
      res.json({
        status: "ok",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: "error", message: "Failed to update profile" });
    });
};

// Gets the records of the patient from the database
exports.getRecords = function (req, res) {
  const id = req.user.tid;
  const { offset } = req.body;
  let response = {};
  db.task((t) => {
    return t
      .one("select count(*) from record where record.pat_id = $1;", [id])
      .then((total) => {
        return t
          .any(
            "select record.id,record.date,doctor.f_name as doc_fname,doctor.l_name as doc_lname from patient,record,doctor where record.pat_id = $1 and doctor.id = record.doc_id and record.pat_id = patient.id order by record.id limit 5 offset $2;",
            [id, offset]
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

// Gets the information of a single record of the patient from the database
exports.singleRecord = function (req, res) {
  const id = req.user.tid;
  const { rid } = req.body;

  var result = {};
  db.task((t) => {
    return t
      .oneOrNone(
        "select record.id,record.date,patient.f_name as pat_fname,patient.l_name as pat_lname,patient.dob,patient.gender,doctor.f_name as doc_fname,doctor.l_name as doc_lname,record.prescription,record.observation from patient,doctor,record where record.id = $1 and patient.id = record.pat_id and record.doc_id=doctor.id;",
        [rid]
      )
      .then((data) => {
        if (data) {
          return t
            .any(
              "select record_to_disease.disease from record_to_disease where record_to_disease.record_id = $1;",
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
      res.json({
        status: "ok",
        res: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getDashboard = async function (req, res) {
  const id = req.user.tid;

  try {
    const data = await db.task(async (t) => {
      const totals = await t.one(
        `select
          (select count(*) from record where pat_id = $1) as records,
          (select count(distinct doc_id) from record where pat_id = $1) as doctors,
          (select count(*) from record_to_disease rtd
            join record r on r.id = rtd.record_id
            where r.pat_id = $1) as diagnoses`,
        [id]
      );
      const recentRecords = await t.any(
        `select record.id, record.date, doctor.f_name as doc_fname, doctor.l_name as doc_lname,
          record.prescription
         from record
         join doctor on doctor.id = record.doc_id
         where record.pat_id = $1
         order by record.date desc, record.id desc
         limit 5`,
        [id]
      );

      return { totals, recentRecords };
    });

    res.json({ status: "ok", data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Failed to load dashboard" });
  }
};
