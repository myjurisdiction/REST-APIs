// const user = require('../routers/userRouter')
const sendGrid = require('@sendgrid/mail')

sendGrid.setApiKey(process.env.SEND_GRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sendGrid.send({
        to: email,
        from: 'taskmanagerApplication@gmail.com',
        subject: `Welcome ${name}`,
        text: `A big thankyou to you ${name} for using my application and feel free to reach me whenever you want`
    })
}

const sendSadEmail = (email, name) => {
    sendGrid.send({
        to: email,
        from: 'taskmanagerApplication@gmail.com',
        subject: `Account Deleted`,
        text: `Sorry to se you go, ${name}`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendSadEmail
}