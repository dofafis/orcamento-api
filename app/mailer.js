var nodemailer = require('nodemailer');
var environment = require('../config/environment')

var transporter = nodemailer.createTransport({
    service: environment.MAILER.service,
    auth: {
           user: environment.MAILER.user,
           pass: environment.MAILER.pass
       }
   });

module.exports = transporter