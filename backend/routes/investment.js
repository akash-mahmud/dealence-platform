const express = require("express");
const InvestmentController = require("../controllers/Investment.controller");
const { checkAuthentication, checkIsActive } = require("../middleware/Auth");
const router = express.Router();

router.post("/", checkAuthentication, checkIsActive, InvestmentController.create);
router.put("/", checkAuthentication, checkIsActive, InvestmentController.update);
router.get("/", checkAuthentication, InvestmentController.get);
router.get("/list", checkAuthentication, InvestmentController.list);

module.exports = router;
