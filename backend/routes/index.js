const express = require("express");
const userRoutes = require("./user");
const accountRoutes = require("./account");
const transactionRoutes = require("./transaction");
const investmentRoutes = require("./investment");
const PaypalController = require("../controllers/Paypal.controller");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("API is Running 🏃‍♂️");
});

router.use("/account", accountRoutes);
router.use("/user", userRoutes);
router.use("/transaction", transactionRoutes);
router.use("/investment", investmentRoutes);
router.use("/api/config/paypal", PaypalController);
module.exports = router;
