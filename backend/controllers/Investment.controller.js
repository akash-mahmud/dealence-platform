const moment = require("moment");
const { Investment, Account, Increment, Earned } = require('../models');
const Joi = require('joi');
const plans = require("../constants/plans");
const { daysUntilNextPayout, payoutForIncrement } = require("../helpers/interest");
const { chunks } = require("../helpers/utils");

const schema = Joi.object().keys({
  plan: Joi.string().valid(plans.BIMONTHLY, plans.SEMIANNUAL).required(),
  amount: Joi.number().required(),
  reinvestIncome: Joi.boolean(),
});

/**
 * Creates an investment
 * 
 * If the user does not have an investment yet
 * this function creates an investment object
 * and a first increment object 
 */
exports.create = async function (req, res) {
  var account = await Account.findOne({
    where: {
      userId: req.user.id
    }
  });

  var investments = await Investment.findAll({
    where: { userId: req.user.id }
  });

  if (investments.length > 0) {
    res.send("Investment already present. Please update instead")
  } else {
  
    const validBody = schema.validate(req.body);

    if (validBody.error == null) {
      if (req.body.amount <= account.balance) {
         
        // Create investment object
        const initialInvestment = await Investment.create({
          userId: req.user.id,
          reinvestIncome: req.body.reinvestIncome
        });
    await Earned.create({
      plan: req.body.plan,
      principal: parseFloat(req.body.amount),
      startDate: new Date(),
      userId: req.user.id,
      investmentId: initialInvestment.id,
    });
        // Create initial increment
        await Increment.create({
          plan: req.body.plan,
          principal: parseFloat(req.body.amount),
          startDate: new Date(),
          userId: req.user.id,
          investmentId: initialInvestment.id
        });

        // Remove amount from the user's balance
        await Account.decrement("balance", {
          by: req.body.amount,
          where: { userId: req.user.id },
        });

        res.send("success");
      } else {
        res.send("Not enough balance");
      }
    } else {
      res.send("Bad request")
    }
  }
}

/**
 * Updates the user investment account.
 * 
 * If the user has started investing within
 * the previous 14 days this function will add
 * the invested amount to the user's first increment
 * object and update the plan accordingly. Otherwise
 * a new increment object (with the chosen plan) will
 * be created 
 */
exports.update = async function (req, res) {
  var account = await Account.findOne({
    where: {
      userId: req.user.id
    }
  });

  const validBody = schema.validate(req.body)

  if (validBody.error == null) {
    if (req.body.amount <= account.balance) {

      var investment = await Investment.findOne({
        where: { userId: req.user.id }
      });

      if (investment == null) {
        res.status(400).send({
          message: "User has no investment yet. Please create one first"
        });

        return;
      }
      await Earned.create({
        plan: req.body.plan,
        principal: parseFloat(req.body.amount),
        startDate: new Date(),
        userId: req.user.id,
        investmentId: investment.id,
      });
      const today = new Date();
      const daysElapsed = moment(new Date()).diff(investment.createdAt, "days");
      const increments = await Increment.findAll({
        order: [
          ["createdAt", "ASC"]
        ],
        where: {userId: req.user.id}
      });

      if (increments.length == 1 && daysElapsed <= 15) {
        // If the user has only made a single investment
        // and less than 15 days have passed update the
        // first increment's principal, plan and start
        // date
        const firstIncrement = increments[0];

        await firstIncrement.update({
          plan: req.body.plan,
          principal: firstIncrement.principal + parseFloat(req.body.amount),
          startDate: today
        });
      } else {
        // If more than 15 days have elapsed or the user
        // has more than a single increment create a new
        // increment with the invested amount as the principal
        await Increment.create({
          plan: req.body.plan,
          principal: parseFloat(req.body.amount),
          startDate: new Date(),
          userId: req.user.id,
          investmentId: investment.id
        });
      }

      await Account.decrement("balance", {
        by: req.body.amount,
        where: { userId: req.user.id },
      });
  
      res.send({
        message: "success"
      });
    } else {
      res.status(400).send({
        message: "not enough balance"
      });
    }
  } else {
    res.status(400).send({
      message: "invalid payload"
    });
  }
}

exports.get = async function (req, res) {
  var investment = await Investment.findOne({
    where: { userId: req.user.id }
  });

  const increments = await Increment.findAll({
    order: [["createdAt", "ASC"]],
    where: {userId: req.user.id}
  });

  if (increments.length > 0) {
    const principal = increments.reduce(
      (prev, curr) => prev + curr.principal,
      0.0
    ).toFixed(2);

    res.send({
      createdAt: investment.createdAt,
      id: investment.id,
      reinvestIncome: investment.reinvestIncome,
      tacitRenewal: investment.tacitRenewal,
      updatedAt: investment.updatedAt,
      userId: investment.userId,
      principal: principal,
      plan: increments[0].plan
    });
  } else {
    res.send("");
  }
}

exports.list = async function (req, res) {
  const increments = await Increment.findAll({
    order: [["createdAt", "ASC"]],
    where: {userId: req.user.id}
  });

  let incrementsJSON = [];

  for (const increment of increments) {
    incrementsJSON.push({
      id: increment.id,
      createdAt: moment(increment.createdAt).format("DD/MM/YYYY"),
      plan: increment.plan,
      principal: increment.principal,
      daysUntilPayout: daysUntilNextPayout(increment),
      interest: payoutForIncrement(increment).toFixed(2)
    })
  }

  let pages = chunks(incrementsJSON, parseInt(process.env.INVESTMENTS_ITEMS_PER_PAGE));

  res.send({
    paginatedIncrements: pages
  });
}