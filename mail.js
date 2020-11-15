const nodemailer = require("nodemailer");
const config = require('./config.json');
var hb = require('express-handlebars').create();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

exports.SendMail = async (mailTo, mailBody) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.yandex.ru",
        port: 465,
        secure: true, 
        auth: {
          user: config["mail-username"], 
          pass: config["mail-password"] 
        }
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: 'efimov-76@yandex.ru', 
        to: "makasuro76@gmail.com", 
        subject: "Показания счетчиков воды, квартира 437", 
        html: mailBody
      });
};

exports.MakeMailBody = async (lastHot, currentHot, rateHot, lastCold, currentCold, rateCold) => {
    let result = hb.render("./Templates/mail.hbs",{lastHot, currentHot, rateHot, lastCold, currentCold, rateCold, date: (new Date()).toLocaleDateString('ru-RU', options)});
    return result;
};