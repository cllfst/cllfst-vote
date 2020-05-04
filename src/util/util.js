'use strict'

const nodemailer = require('nodemailer')
const randomstring = require('randomstring')
const env = require('./env')

const roles = ['General secretary', 'Internal relations manager', 'External relations manager', 'Materials manager',
    'Sponsorship manager', 'Media manager', 'Community Manager']

const senderEmail = env.senderEmail
const senderPassword = env.senderPassword
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    pool: true, // thanks @abir-abdelli
    auth: {
        user: senderEmail,
        pass: senderPassword
    }
})

module.exports = {
    roles: roles,

    isAdmin: (authorization) => {
        return authorization === env.adminPassword
    },
    
    generateRandomString: (length) => {
        if (!length) {
            length = 64
        }
        return randomstring.generate(length);
    },
    
    sendEmail: (to, subject, body) => {
        const mailOptions = {
            from: senderEmail,
            to: to,
            subject: subject,
            text: body
        }
        
        console.log(`=> Sending email [to:${to}]`)
        transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                console.error(`=> Error sending email [to:${to}, error:${err.message}]`)
            }
        })
    },
    
    isValidRole: (role) => {
        return roles.includes(role)
    },

    failedCheck: (status, message, date) => {
        return {
            isError: true,
            error: {
                status: status,
                message: !date ? message : message + ' <span class="date">' + date + '</span>'
            }
        }
    },
}
