const express = require("express");
const AccountController = require("../controllers/Account.controller");
const { checkAuthentication } = require("../middleware/Auth");
const router = express.Router();

router.get("/balance", checkAuthentication, AccountController.balance);
router.get('/ie', checkAuthentication, AccountController.interestEarned);
router.get("/balance", checkAuthentication, AccountController.balance);

module.exports = router;
