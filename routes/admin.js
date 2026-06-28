// admin.js - admin route module
const express = require("express");
const router = express.Router();
const admin_controller = require("../controllers/adminController");
const { requireAdmin } = require("../middleware/auth");

router.use(requireAdmin);

router.get("/dashboard", (req, res) => {
  admin_controller.getDashboard(req, res);
});

// Account management route
router.post("/accounts-list", (req, res) => {
  admin_controller.getAccount(req, res);
});

// new account route
router.post("/account", (req, res) => {
  admin_controller.newAccount(req, res);
});

// update account route
router.post("/account/update", (req, res) => {
  admin_controller.updateAccount(req, res);
});

// delete account route
router.post("/delaccount", (req, res) => {
  admin_controller.delAccount(req, res);
});

// Disease route
router.post("/disease-list", (req, res) => {
  admin_controller.getDisease(req, res);
});

// Disease add route
router.post("/disease", (req, res) => {
  admin_controller.addDisease(req, res);
});

// Disease update route
router.post("/disease/update", (req, res) => {
  admin_controller.updateDisease(req, res);
});

// Disease delete route
router.post("/disease/delete", (req, res) => {
  admin_controller.delDisease(req, res);
});

// Patients list route
router.post("/patients-list", (req, res) => {
  admin_controller.getPatients(req, res);
});

// Delete patient route
router.post("/patient/delete", (req, res) => {
  admin_controller.delPatient(req, res);
});

// All records list route
router.post("/records-list", (req, res) => {
  admin_controller.getRecords(req, res);
});

// Single record route
router.post("/record", (req, res) => {
  admin_controller.singleRecord(req, res);
});

module.exports = router;
