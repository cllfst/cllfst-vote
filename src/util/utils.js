'use strict'

const nodemailer = require('nodemailer')
const randomstring = require('randomstring')
const appEnv = require('./app-env')

const roles = ['SG', 'IN', 'EX', 'MA', 'SP', "ME"]

module.exports = {
    isAdmin: (authorization) => {
        return authorization === appEnv.adminPassword
    },
    
    generateRandomString: (length) => {
        if (!length) {
            length = 64
        }
        return randomstring.generate(length);
    },
    
    sendEmail: (senderEmail, senderPassword, to, subject, body) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: senderEmail,
                pass: senderPassword
            }
        })
        
        const mailOptions = {
            from: senderEmail,
            to: to,
            subject: subject,
            text: body
        }
        
        console.log(`Sending email [to:${to}]`)
        transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                console.log(`Error sending email [to:${to}, error:${err.message}]`)
            }
        })
    },
    
    isValidRole: (role) => {
        return roles.includes(role)
    },
}
