const nodemailer = require('nodemailer');


class MailService {
    сonstructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER, // sender address
            to, // list of receivers
            subject: `Активация аккаунта на NoLabel`, // Subject line
            text: '', // plain text body
            html:
                `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                </div>
                `, // html body
        });
    }
}

module.exports = new MailService();