const express = require("express");
const router = express.Router();

const { login, register } = require("../controllers/auth");

// Corrected routes
router.route("/register").post(register);  // Changed from GET to POST
router.route("/login").post(login);

module.exports = router;
