const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const expressSession = require("express-session");
const db = require("./models");
const router = require("./routes");
const schedule = require('node-schedule');
const moment = require('moment')
const { User, Account, Increment, Payout, Investment } = require("./models");
const { calculateAccruedInterest, payoutForIncrement } = require("./helpers/interest");
const path = require('path')
require('dotenv').config();

const app = express();
app.use(morgan("dev"));

// Allow larger JSON bodies to handle document verification,
// where documents are sent in base64 format
app.use(bodyParser.urlencoded({limit: "100mb"}));
app.use(bodyParser.json({limit: "100mb"}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // origin: process.env.DEVELOPMENT,
    credentials: true,
  }) 
);
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}


app.use(allowCrossDomain);




app.use(
  expressSession({
    secret: "dealence",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);






app.use('/api', router);



app.use(express.static(path.join(__dirname, '..', '/frontend/build')));
app.get('*', (req, res) =>
res.sendFile(path.join(__dirname,'..' ,'/frontend/build/index.html'))
);







const port = process.env.PORT||4000

app.listen(port, async () => {
  console.log('Server Has Started 🚀');
});

// Update investments every day at 3AM
schedule.scheduleJob("0 3 * * *", async () => {
  console.log("Investment cron started");

  const today = new Date();
  const users = await User.findAll();

  for (let i = 0; i < users.length; i++) {
    // For each user, check which increments have expired
    // and move the interest to the user's balance
    let user = users[i];

    const increments = await Increment.findAll({
      where: {
        userId: user.id
      }
    });

    const userAccount = await Account.findOne({
      where: {
        userId: user.id
      }
    });

    const interestResult = calculateAccruedInterest(increments);

    if (interestResult.interest > 0) {
      // Add the earned interest to the user's balance
      userAccount.availableCredit += interestResult.interest;

      // Update the start date of all expired increments
      for (let i = 0; i < interestResult.expiredIncrements.length; i++) {
        let increment = interestResult.expiredIncrements[i];  
        increment.startDate = today;

        // Record the payout
        await Payout.create({
          userId: user.id,
          incrementId: increment.id,
          amount: payoutForIncrement(increment)
        });

        await increment.save();
      }

      await userAccount.save();
    }
  }

  console.log("Investment cron completed");
});


