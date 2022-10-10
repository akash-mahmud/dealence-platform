const transactionsType = require('../constants/transactionsType');

const { Transaction } = require('../models');
const { Account } = require('../models');
const Mailer = require('../utils/mailer');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const coinbase = require('coinbase-commerce-node');
const Client = coinbase.Client;

const clientObj = Client.init('3b9180f5-62f9-4313-960c-41185089fa60');
clientObj.setRequestTimeout(3000);
var Checkout = coinbase.resources.Checkout;

exports.list = async function (req, res) {
  const transactions = await Transaction.findAll({
    where: {
      userId: req.user.id,
    },
  });
  res.send(transactions);
};

exports.deposit = async function (req, res) {

if (req.body.paymentIntent.id) {
  if (req.body.paymentIntent.client_secret) {
    if (req.body.paymentIntent.confirmation_method === 'automatic') {
      if (req.body.paymentIntent.payment_method) {
        if (req.body.paymentIntent.currency) {
           try {
           
           
               // Actual verified value which is comes from stripe card. We need to save this value in database
               await Transaction.create({
                 userId: req.user.id,
                 date: Date.now(),
                 type: transactionsType.DEPOSIT,
                 amount: parseFloat(req.body.amount) ,
               });

               await Account.increment('balance', {
                 by:  parseFloat(req.body.amount),
                 where: { userId: req.user.id },
               });

               const mailer = new Mailer();
               let depositInfoEmail = await mailer.getDepositInfoMail(
                 req.user,
                  parseFloat(req.body.amount)
               );
   let depositInfoEmailToAdmin = await mailer.getDepositInfoMailToAdmin(
     req.user,
      parseFloat(req.body.amount)
   );
               try {
                 await mailer.sendMailSync(depositInfoEmail);
                 await mailer.sendMailSync(depositInfoEmailToAdmin);

                return res.status(201).send({ message: 'success' });
  
                 } catch (error) {
                 const errorString = `Error sending email: ${error}`;

                 console.log(errorString);
                 res.status(500).send({ message: errorString });
               }
             
           } catch (error) {
             console.log(error);
           } 
        }
      }
    }
  }
}


};

exports.cryptoDepositSaveValue = async function (req, res) {

  try {
    // Actual verified value which is comes from stripe card. We need to save this value in database
    await Transaction.create({
      userId: req.user.id,
      date: Date.now(),
      type: transactionsType.DEPOSIT,
      amount: parseInt(req.body.depositAmmount),
    });

    await Account.increment('balance', {
      by: parseInt(req.body.depositAmmount),
      where: { userId: req.user.id },
    });

    const mailer = new Mailer();
    let depositInfoEmail = await mailer.getDepositInfoMail(
      req.user,
      parseInt(req.body.depositAmmount)
    );
    let depositInfoEmailToAdmin = await mailer.getDepositInfoMailToAdmin(
      req.user,
      parseInt(req.body.depositAmmount)
    );
    try {
      await mailer.sendMailSync(depositInfoEmail);
      await mailer.sendMailSync(depositInfoEmailToAdmin);

      console.log('Deposit email sent');
       return res.status(201).send({ message: 'success' });
  
    } catch (error) {
      const errorString = `Error sending email: ${error}`;

      console.log(errorString);
      res.status(500).send({ message: errorString });
    }
  } catch (error) {
    console.log(error);
  }

};
exports.stripeDeposit = async (req, res) => {

  let { id, amount } = req.body;
  amount = parseFloat(amount);
console.log(typeof(amount));

  const transactionFee =(amount* 0.0125);
  const depositAmount = amount + transactionFee;
console.log(depositAmount);
console.log(typeof(depositAmount));
  try {
    const deposit = await stripe.paymentIntents.create({
      amount: depositAmount * 100,
      currency: 'EUR',
      payment_method: id,
      confirm: true,
    });

    if (deposit.status === 'succeeded') {
      // Actual verified value which is comes from stripe card. We need to save this value in database
      await Transaction.create({
        userId: req.user.id,
        date: Date.now(),
        type: transactionsType.DEPOSIT,
        amount:amount,
      });

      await Account.increment('balance', {
        by: amount,
        where: { userId: req.user.id },
      });


            const mailer = new Mailer();
            let depositInfoEmail = await mailer.getDepositInfoMail(
              req.user,
              amount
            );
                let depositInfoEmailToAdmin =
                  await mailer.getDepositInfoMailToAdmin(
                    req.user,
                    amount
                  );

            try {
              await mailer.sendMailSync(depositInfoEmail);
              await mailer.sendMailSync(depositInfoEmailToAdmin);

      
                    return res.status(201).send({ message: 'success' });
            } catch (error) {
              const errorString = `Error sending email: ${error}`;

              console.log(errorString);
              res.status(500).send({ message: errorString });
            }

    }
     
      
    
    

   
  } catch (error) {

res.send({message:error.message});

  }
};



exports.stripeDepositEban = async (req, res) => {
    let {  amount } = req.body;
      amount = parseFloat(amount);
    console.log(amount);
    const transactionFee = amount * 0.0125;
    const depositAmount = amount + transactionFee;
  const customer = await stripe.customers.create();

  const intent = await stripe.paymentIntents.create({
    amount: depositAmount * 100,

    currency: 'eur',
    setup_future_usage: 'off_session',
    customer: customer.id,
    payment_method_types: ['sepa_debit'],
    metadata: { integration_check: 'sepa_debit_accept_a_payment' },
  });

 return res.status(201).send({ clientSecret: intent.client_secret });
};



exports.cryptoDeposit = async (req, res) => {

  let { amount } = req.body;
       amount = parseFloat(amount);
    if (!amount) {
      return res.status(404).send('enter a amount');
    }
  const transactionFee = amount*0.03;
  const deposit = amount + transactionFee;

  var checkoutData = {
    name: 'Deposit money',
    description: 'Please select a cryptocurrency and proceed with the deposit. Transaction fees will be added to your amount.',
    logo_url:
      'https://res.cloudinary.com/commerce/image/upload/v1648735619/gej4brwfic2d5klru0q4.png',
    pricing_type: 'fixed_price',
    local_price: {
      amount: deposit,
      currency: 'EUR',
    },
    requested_info: [],
  };
try {
//         await Checkout.create(checkoutData, function (error, response) {
//           if (!error) {
//  console.log(response);
//  return res.status(201).send(response);
//           }else{
//              console.log(error);
//                return res.status(403).send(error);
//           }
         
//         });

} catch (error) {
    return res.status(403).send(error);
}




};

exports.withdraw = async function (req, res) {
  const withdrawAmount = parseFloat(req.body.withdrawAmount);
  console.log(req.body);
  var account = await Account.findOne({
    where: {
      userId: req.user.id,
    },
  });
  if (withdrawAmount <= account.availableCredit) {
    await Transaction.create({
      userId: req.user.id,
      date: Date.now(),
      type: transactionsType.WITHDRAWAL,
      amount: withdrawAmount,
      iban: req.body.iban,
    });

    await Account.decrement('availableCredit', {
      by: withdrawAmount,
      where: { userId: req.user.id },
    });
    const mailer = new Mailer();
    let depositInfoEmail = await mailer.getWithdrawInfoMail(
      req.user,
      req.body.withdrawNameFull,
      req.body.bankName,
      req.body.swift,
      req.body.withdrawEmail,

      withdrawAmount,
      req.body.iban
    );

    let depositInfoEmailAdmin = await mailer.getWithdrawInfoMailAdmin(
      req.user,
      req.body.withdrawNameFull,
      req.body.bankName,
      req.body.swift,
      req.body.withdrawEmail,

      withdrawAmount,
      req.body.iban
    );

    await mailer.sendMailSync(depositInfoEmail);
    await mailer.sendMailSync(depositInfoEmailAdmin);

    return res.status(201).send('success');
  } else {
    res.send('Not enough balance');
  }
};

exports.cryptoWithdraw = async function (req, res) {
  const withdrawAmount = parseFloat(req.body.withdrawAmount);
  console.log(req.body);
  var account = await Account.findOne({
    where: {
      userId: req.user.id,
    },
  });
  if (withdrawAmount <= account.availableCredit) {
    await Transaction.create({
      userId: req.user.id,
      date: Date.now(),
      type: transactionsType.WITHDRAWAL,
      amount: withdrawAmount,
      // cryptoAdress: req.body.cryptoAddress,
    });

    await Account.decrement('availableCredit', {
      by: withdrawAmount,
      where: { userId: req.user.id },
    });
    const mailer = new Mailer();
    let depositInfoEmail = await mailer.getWithdrawInfoMailForCrypto(
      req.user,
      req.body.amount,
      req.body.crypto,
      req.body.cryptoAddress
    );
 await mailer.sendMailSync(depositInfoEmail);

        let depositInfoEmailAdmin =
          await mailer.getWithdrawInfoMailForCryptoAdmin(
            req.user,
            req.body.amount,
            req.body.crypto,
            req.body.cryptoAddress
          );
   await mailer.sendMailSync(depositInfoEmailAdmin);
  
 return res.status(201).send('success');
  } else {
    res.send('Not enough balance');
  }
};