const { Account, Payout, Increment,Earned } = require("../models");
const rates = require("../constants/rates");
const plans = require('../constants/plans');
const { daysUntilNextPayout, payoutForIncrement, calculatePayoutsOverTime } = require("../helpers/interest");
const moment = require('moment')
exports.balance = async function (req, res) {
  var account = await Account.findOne({
    where: {
      userId: req.user.id
    }
  });

  // Calculate the total earned interest
  const payouts = await Payout.findAll({
    where: {userId: req.user.id}
  });

  const interestEarned = payouts.reduce(
    (prev, curr) => prev + curr.amount,
    0.0
  ).toFixed(2);

  let increments = await Increment.findAll({
    where: {userId: req.user.id}
  });

  res.send({
    balance: account.balance,
    credit: account.availableCredit,
    interestEarned: interestEarned,
    payouts: calculatePayoutsOverTime(increments),
  });
}

exports.interestEarned = async function (req , res) {
  let earns = await Increment.findAll({
    where: { userId: req.user.id },
  });
  let earnJSON = [];

  for (const earn of earns) {
    earnJSON.push({
      id: earn.id,
      createdAt: moment(earn.startDate).format('YYYY-MM-DD'),
      plan: earn.plan,
      principal: earn.principal,
      userId: earn.userId,
    });
  }

    const today = new Date();
    const todayMoment = moment(today);


let biomonthlyInterest = 0.0;
let semiManualInteres =0.0

let diffrenceAsPrimaryNumber;
    for (let j = 0; j < earnJSON.length; j++) {
      // Check if the increment expired. If so add the accrued interest
      const earn = earnJSON[j];
      var start = moment(earn.createdAt); ; 
      var end = moment();

      //Difference in number of days
      moment.duration(start.diff(end)).asDays();

      //Difference in number of days
      const diffrence = moment.duration(start.diff(end)).asDays();
      console.log(diffrence);

      if (diffrence===0) {
diffrenceAsPrimaryNumber = diffrence;
      }else{

        diffrenceAsPrimaryNumber = diffrence * -1;
      }


        const monthsElapsed = todayMoment.diff(
          moment(earn.createdAt),
          'months',
          true
        );

      if (earn.plan == plans.BIMONTHLY ) {
        console.log(diffrenceAsPrimaryNumber);
        // if (diffrenceAsPrimaryNumber<60) {
 biomonthlyInterest +=
   (rates.BIMONTHLY / 60) *
   earn.principal *
   Math.floor(diffrenceAsPrimaryNumber); 
        // } else {
        //    biomonthlyInterest +=0
        // }
       
      } else if (earn.plan == plans.SEMIANNUAL ) {
        console.log(Math.floor(diffrenceAsPrimaryNumber));
        // if (Math.floor(diffrenceAsPrimaryNumber) < 180) {
          console.log(earn.principal);
  semiManualInteres +=
    (rates.SEMIANNUAL / 180) *
    earn.principal *
    Math.floor(diffrenceAsPrimaryNumber); 
    console.log(rates.SEMIANNUAL / 180);
        // }else{
            // semiManualInteres += 0;
        // }
      
      }

      if (typeof biomonthlyInterest==='string') {
        biomonthlyInterest = parseFloat(biomonthlyInterest).toFixed(2);
      }
           if (typeof semiManualInteres === 'string') {
             semiManualInteres = parseFloat(semiManualInteres).toFixed(2);
           }
    }




  const totalEarn = biomonthlyInterest + semiManualInteres;

console.log(semiManualInteres);
  res.send({
    totalEarn: totalEarn.toFixed(2),
    BioMonthlyEarn: biomonthlyInterest.toFixed(2),
    SemiManualEarn: semiManualInteres.toFixed(2),
  });
}