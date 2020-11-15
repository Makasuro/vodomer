// https://sendgrid.com/
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('кеу');
var hb = require('express-handlebars').create();

exports.SendMail = async (mailTo, mailBody) => {
    const msg = {
        to: mailTo, 
        from: 'efimov-76@yandex.ru', 
        subject: 'Показания счетчиков воды квартира 437',
        html: mailBody,
      }
      await sgMail.send(msg);
};

exports.MakeMailBody = async (lastHot, currentHot, rateHot, lastCold, currentCold, rateCold) => {
    let result = hb.render("./Templates/mail.hbs",{lastHot, currentHot, rateHot, lastCold, currentCold, rateCold, date: new Date()});
    return result;
};