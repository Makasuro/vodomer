const nodemailer = require("nodemailer");
var hb = require('express-handlebars').create();

exports.SendMail = (mailTo, mailBody) => {};

exports.MakeMailBody = async (lastHot, currentHot, rateHot, lastCold, currentCold, rateCold) => {
    let result = hb.render("./Templates/mail.hbs",{lastHot, currentHot, rateHot, lastCold, currentCold, rateCold});
    return result;
};