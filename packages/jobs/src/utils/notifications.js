const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'b.basto@gmail.com',
        pass: 'Il0veapple'
    }
});

const notify = (email, { comparator, field, symbol, trigger, value }) => {
    console.log(`[Alert] Notifying ${email} because {${field} = ${trigger}} is ${comparator} ${value}.`);

    const mailOptions = {
        from: 'b.basto@gmail.com',
        to: 'b.basto@gmail.com',
        subject: `[MyTrade Alert] ${symbol}`,
        text: `${field} R$${trigger} is ${comparator} R$${value}.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('[Alert] Notification sent: ' + info.response);
        }
    });
}

module.exports = {
    notify
};