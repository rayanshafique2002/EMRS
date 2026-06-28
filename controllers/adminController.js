const db = require("../db/dbConnector");

exports.getAccount = function (req, res) {
  const { offset } = req.body;
  let response = {};

  db.task((t) => {
    return t
      .one("select count(*) from login where login.user_role = 'doctor'; ")
      .then((total) => {
        return t
          .any(
            "select doctor.id, doctor.f_name as doc_fname,doctor.l_name as doc_lname,doctor.email from doctor,login where doctor.email = login.email and login.user_role = 'doctor' order by doctor.id limit 5 offset $1;",
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
  const { fname, lname, email, num, cnic } = req.body;
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
    });
};

exports.delAccount = function (req, res) {
  const email = req.body.email;
  db.none("delete from login where email = $1 and user_role = 'doctor';", [
    email,
  ])
    .then(() => {
      res.json({
        status: "ok",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getDisease = function (req, res) {
  const { offset } = req.body;
  let response = {};

  db.task((t) => {
    return t.one("select count(*) from disease;").then((total) => {
      return t
        .any(
          "select disease_name as disease from disease order by disease_name limit 5 offset $1",
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
  const dis_name = req.body.disease;
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
