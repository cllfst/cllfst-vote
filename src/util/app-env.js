


module.exports = {
    adminPassword: process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD : 'whatever',
    senderEmail: process.env.SENDER_EMAIL ? process.env.SENDER_EMAIL : 'whatever',
    senderPassword: process.env.SENDER_PASSWORD ? process.env.SENDER_PASSWORD : 'whatever',
    dbHost: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
    dbPort: process.env.DB_PORT ? process.env.DB_PORT : 27017,
    dbName: process.env.DB_NAME ? process.env.DB_NAME : 'cllfs-ballot',
    domainName: process.env.DOMAIN_NAME ? process.env.DOMAIN_NAME : 'vote.cllfs.org.tn',
}