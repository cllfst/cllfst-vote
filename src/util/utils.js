'use strict'

const nodemailer = require('nodemailer')
const randomstring = require('randomstring')
const appEnv = require('./app-env')

const roles = ['Secrétaire', 'Interne', 'Externe', 'Materiel', 'Sponsoring',
    'Médiatisation', 'Communauté']

module.exports = {
    roles: roles,

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

    error: (status, message) => {
        return {isError: true, details: viewData(status, message)}
    },

    viewData: (status, message) => {
        return {status: status, message: message}
    }
    
}
