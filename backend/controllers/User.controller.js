const passport = require("passport");
const { User, Account } = require("../models");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Mailer = require("../utils/mailer");
const addrs = require("email-addresses");
const { use } = require("passport");
const { GetResponse } = require('api-getresponse');
let gr = new GetResponse({
  apiKey: '414slk9430ca4b917twt2vkw5xuvugi3',
});
async function hashPassword(plainTextPassword) {
    return await bcrypt.hash(plainTextPassword, 10);
}

exports.me = async function(req, res) {
    if (req.user != null) {
        const user = await User.findOne({ where: { id: req.user.id } });

        res.send(user);
    } else {
        res.send(req.user);
    }
}

exports.login = function(req, res, next) {
    passport.authenticate("local", (err, user) => {
        if (err) throw err;
        if (!user) res.send("No User Exists");
        else {
            req.logIn(user, err => {
                if (err) throw err;
                res.send("success")
            })
        }
    })(req, res, next);
}

exports.register = async function(req, res) {

    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) res.send("User Already Exists");
    if (!user) {
        try {
              const hashedPassword = await hashPassword(req.body.password);

              const user = await User.create({
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                phone_number: req.body.phone_number,
                referrer_code: req.body.referrer_code,
                password: hashedPassword,
              });

              await Account.create({
                balance: 0.0,
                userId: user.id,
              });
              const data = await gr.addContact({
                name: `${req.body.first_name} ${req.body.last_name}`,
                email: `${req.body.email}`,
                token: 'Z72yr',
              });
                console.log(data);
                return    res.send('success');
        } catch (error) {
              return res.status(404).send('success');
        } 
      
      
        //   .then((ok) => {
        //     if (ok) console.log('Contact added!');
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });
    
    }
}

exports.forgotPassword = async function(req, res) {
    if (req.body.email == "") {
        res.send('email required');
    }
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user == null) {
        res.send('email does not exist');
    } else {
        const token = crypto.randomBytes(20).toString('hex');
        user.update({
            resetPasswordToken: token,
            resetPasswordExpires: Date.now() + 3600000
        });

        const mailer = new Mailer();

        let passwordRecoveryEmail = mailer.getPasswordRecoveryMail(
            user.email,
            token
        )

        try {
            await mailer.sendMailSync(passwordRecoveryEmail);

         
            res.status(200).send({message: "Email sent successfully"});
        } catch (error) {
            const errorString = `Error sending email: ${error}`;

            console.log(errorString);
            res.status(500).send({message: errorString});
        }
    }   
}

exports.resetPassword = async function(req, res) {
    const user = await User.findOne({
        where: {
            resetPasswordToken: req.query.resetPasswordToken,
            // resetPasswordExpires: {
            //     $gte: Date.now(),
            // }
        }
    });
    if (user == null) {
        res.send('password reset link is invalid or has expired');
    } else {
        res.send({
            email: user.email,
            message: 'password reset link ok'
        });
    }
} 

exports.updatePasswordViaEmail = async function(req, res) {
    const user = await User.findOne({
        where: {
            email: req.body.email,
            resetPasswordToken: req.body.resetPasswordToken,
            // resetPasswordExpires: {
            //     $gte: Date.now(),
            // }
        }
    });
    if (user != null) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        await user.update({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        });
        res.send({message: "password updated"});
    } else {
        res.send("no user exists in db to update");
    }
}

exports.updateInfo = async function(req, res) {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!user) res.send("User does not exists");
    if (user.isDocumentUploaded) res.status(403).send("User does not exists");

    if (user) {
        await User.update({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone_number: req.body.phone_number,
            address: req.body.address,
            state: req.body.state,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            isDocumentUploaded: true,
            isContractSigned: true,
        }, {where: {id: req.user.id}})

        const updatedUser = await User.findOne({ where: { id: user.id } });
        const mailer = new Mailer();

        let documentVerificationEmail = await mailer.getDocumentVerificationMail(
            updatedUser,
            req.body.id_front,
            req.body.id_back,
            req.body.proof_address
        )
 
        try {
            await mailer.sendMailSync(documentVerificationEmail);

           
            res.send({message: "User updated successfully"})
        } catch (error) {
            const errorString = `Error sending email: ${error}`;

            console.log(errorString);
            res.status(500).send({message: errorString});
        }
    }
}

exports.signContract = async function(req, res) {

    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) res.send("User does not exists");
    if (user) {
        await User.update({ isContractSigned: true }, { where: { id: req.user.id }});
        res.send("success");
    }
}

exports.uploadDocument = async function(req, res) {

    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) res.send("User does not exists");
    if (user) {
        await User.update({ isDocumentUploaded: true }, { where: { id: req.user.id }});
        res.send("success");
    }
}

exports.logout = function(req, res) {
    req.logout();
    res.send("success");
}

exports.updatePassword = async function(req, res) {
    const user = await User.findOne({
        where: {id: req.user.id}
    });

    if (!user) {
        res.status(404).send("User does not exists");
        return;
    }

    if (!req.body.newPassword || !req.body.oldPassword) {
        res.status(400).send("Invalid data");

        return;
    }

    if (user) {
        const validOldPassword = await bcrypt.compare(req.body.oldPassword, user.password);

        if (validOldPassword) {
            // Update password
            user.password = await hashPassword(req.body.newPassword);
            await user.save();

            res.send("Password updated");
        } else {
            // Passwords do not match, return an error
            res.status(400).send("Invalid password");
        }
    }
}

exports.updateContactInfo = async function(req, res) {
    const user = await User.findOne({
        where: {id: req.user.id}
    });

    if (!user) {
        res.status(404).send("User does not exists");
        return;
    }

    // Validate email
    const parsedEmail = addrs.parseOneAddress(req.body.email);

    if (!parsedEmail) {
        res.status(400).send("Invalid email");
        return;
    }

    // Check if the email is used by another user
    const emailMatchingUser = await User.findOne({
        where: {email: req.body.email}
    });

    if (emailMatchingUser && emailMatchingUser.id !== user.id) {
        res.status(400).send("Invalid email");
        return;
    }

    if (user) {
        // Update user info
        user.email = req.body.email;
        user.phone_number = req.body.phone_number;

        await user.save();

        res.send("Contact info updated");
    }
}

exports.updatePersonalDetails = async function(req, res) {
    const user = await User.findOne({
        where: {id: req.user.id}
    });

    if (!user) {
        res.status(404).send("User does not exists");
        return;
    }

    if (!req.body.address || !req.body.city || !req.body.state || !req.body.zip) {
        res.status(400).send("Bad request");
        return;
    }

    if (user) {
        // Update user info
        user.address = req.body.address;
        user.city = req.body.city;
        user.state = req.body.state;
        user.zip = req.body.zip;

        await user.save();

        res.send("Personal details updated");
    }
}

exports.updateNotificationStatus = async function(req, res) {
    const user = await User.findOne({
        where: {id: req.user.id}
    });

    if (!user) {
        res.status(404).send("User does not exists");
        return;
    }

    user.notificationsEnabled = req.body.notificationsEnabled;
    await user.save();

    res.send("Notification status updated");
}