const nodemailer = require('nodemailer');
const fetch = require('cross-fetch');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
});

const notify = async (email, { comparator, field, symbol, trigger, value }) => {
    console.log(`[Alert] Notifying ${email} because {${field} = ${trigger}} is ${comparator} ${value}.`);

    const title = `[MyTrade Alert] ${symbol}`;
    const message = `${field} R$${trigger} is ${comparator} R$${value}.`;

    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: process.env.GMAIL_EMAIL,
        subject: title,
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('[Alert] Notification sent: ' + info.response);
        }
    });

    await fetch('https://api.pushover.net/1/messages.json', {
        body: JSON.stringify({
            message,
            title,
            token: process.env.PUSHOVER_TOKEN,
            user: process.env.PUSHOVER_USER
        }),
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST'
    });
}

module.exports = {
    notify
};