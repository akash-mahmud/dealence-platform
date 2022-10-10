const nodemailer = require("nodemailer");

class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
      },
    });
  }

  getPasswordRecoveryMail(toEmail, token) {
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: toEmail,
      subject: 'Password reset link',
      text:
        'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n' +
        `${process.env.PRODUCTION}/reset?token=${token} \n\n` +
        'If you did not request this, please ignore this email and your password will remain unchanged. \n',
    };

    return mailOptions;
  }

  async getDocumentVerificationMail(user, idFront, idBack, proofOfAddress) {
    const text =
      `L'utente ha richiesto la verifica del profilo ed ha inserito le seguenti informazioni: \n\n` +
      `<ul>\n` +
      `<li>Nome: ${user.first_name}</li>\n` +
      `<li>Nome: ${user.email}</li>\n` +
      `<li>Cognome: ${user.last_name}</li>\n` +
      `<li>Indirizzo: ${user.address}</li>\n` +
      `<li>Città: ${user.city}</li>\n` +
      `<li>Regione: ${user.state}</li>\n` +
      `<li>CAP: ${user.zip}</li>\n` +
      `<li>Nazione: ${user.country}</li>\n` +
      `</ul>\n\n` +
      `La copia fronte e retro di un documento è allegata a questa email `;

    const fileType = await import('file-type');

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: `Verifica documenti per ${user.first_name} ${user.last_name} (${user.email})`,
      html: text,
      attachments: [
        {
          filename: `id_fronte.${await this.getBase64Extension(
            idFront,
            fileType
          )}`,
          content: idFront,
          encoding: 'base64',
        },
        {
          filename: `id_retro.${await this.getBase64Extension(
            idBack,
            fileType
          )}`,
          content: idBack,
          encoding: 'base64',
        },
        {
          filename: `proofAddress.${await this.getBase64Extension(
            proofOfAddress,
            fileType
          )}`,
          content: proofOfAddress,
          encoding: 'base64',
        },
      ],
    };

    return mailOptions;
  }

  async getDepositInfoMail(user, amount) {


    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: user.email,
      subject: 'Nuovo deposito',
      text:
        `Utente ${user.first_name} ${user.last_name} (${user.email})\n\n` +
        `ha depositato ${amount}`,
    };

    return mailOptions;
  }

  async getDepositInfoMailToAdmin(user, amount) {
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: 'Nuovo deposito',
      text:
        `Utente ${user.first_name} ${user.last_name} (${user.email})\n\n` +
        `ha depositato ${amount}`,
    };

    return mailOptions;
  }

  async getWithdrawInfoMail(
    user,
    withdrawNameFull,
    bankName,
    swift,
    withdrawEmail,
    amount,
    iban
  ) {
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: user.email,
      subject: 'Nuovo prelievo',
      text:
        `Utente ${withdrawNameFull}  (${user.email})\n\n` +
        `bankName: ${bankName} ha depositato swift/bic: ${swift} \n\n
        iban:${iban}
      amount:  ${amount}`,
    };

    return mailOptions;
  }

  async getWithdrawInfoMailAdmin(
    user,
    withdrawNameFull,
    bankName,
    swift,
    withdrawEmail,
    amount,
    iban
  ) {
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: 'Nuovo prelievo',
      text:
        `Utente ${withdrawNameFull}  (${user.email})\n\n` +
        `bankName: ${bankName} ha depositato swift/bic: ${swift} \n\n
        iban:${iban}
      amount:  ${amount}`,
    };

    return mailOptions;
  }

  async getWithdrawInfoMailForCrypto(user, amount, crypto, cryptoAddress) {
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: user.email,
      subject: 'Nuovo prelievo',
      text:
        `Utente ${user.first_name}  (${user.email})\n\n` +
        `ha prelevato ${amount} crypto: ${crypto} cryptoAddress: ${cryptoAddress}`,
    };

    return mailOptions;
  }

  async getWithdrawInfoMailForCryptoAdmin(user, amount, crypto, cryptoAddress) {
    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL,
      subject: 'Nuovo prelievo',
      text:
        `Utente ${user.first_name} ${user.last_name} (${user.email})\n\n` +
        `ha prelevato ${amount} crypto: ${crypto} cryptoAddress: ${cryptoAddress}`,
    };

    return mailOptions;
  }
  async getBase64Extension(base64Data, fileType) {
    const mime = await fileType.fileTypeFromBuffer(
      await Buffer.from(base64Data, 'base64')
    );
    return mime.ext;
  }

  sendMailAsync(mailOptions, callback) {
    this.transporter.sendMail(mailOptions, callback);
  }

  sendMailSync(mailOptions) {
    const mailer = this;

    return new Promise(function (resolve, reject) {
      mailer.transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    });
  }
}

module.exports = Mailer;