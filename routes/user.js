const { Router } = require("express");
const jwt = require("../utils/jwt");
const userCtrl = require('../controller/user')
const router = Router();

router.post("/register", userCtrl.register);

router.post("/login", userCtrl.login);

module.exports = router;
