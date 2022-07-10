const express = require("express");
const router = express.Router();
const usersCtrl = require("../../controllers/api/users");
//Authorization middleware
const ensureLoggedIn = require("../../config/ensureLoggedIn");

// GET /api/users/check-token
router.get("/check-token", ensureLoggedIn, usersCtrl.checkToken);

// POST /api/users
router.post("/", usersCtrl.create);
router.post("/login", usersCtrl.login);
router.post("/googlelogin", usersCtrl.googleLogin);

module.exports = router;
