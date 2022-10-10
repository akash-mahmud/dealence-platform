const express = require("express");
const TransactionController = require("../controllers/Transaction.controller");
const { checkAuthentication, checkIsActive } = require("../middleware/Auth");
const router = express.Router();

router.get("/", checkAuthentication, TransactionController.list);
router.post('/test',async(req,res) => {

});
router.post("/deposit", checkAuthentication, checkIsActive, TransactionController.deposit);
router.post(
  '/create-payment-intent',
  checkAuthentication,
  checkIsActive,
  TransactionController.stripeDeposit
);
router.post(
  '/create-payment',
  checkAuthentication,
  checkIsActive,
  TransactionController.stripeDepositEban
);
router.post(
  '/crypto',
  // checkAuthentication,
  // checkIsActive,
  TransactionController.cryptoDeposit
);
router.post(
  '/cr',
  checkAuthentication,
  checkIsActive,
  TransactionController.cryptoDepositSaveValue
);
router.post(
  '/withdraw',
  checkAuthentication,
  checkIsActive,
  TransactionController.withdraw
);
router.post(
  '/crypto/withdraw',
  checkAuthentication,
  checkIsActive,
  TransactionController.cryptoWithdraw
);

module.exports = router;
