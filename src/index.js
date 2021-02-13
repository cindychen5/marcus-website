const express = require("express")
const morgan = require("morgan")
const bodyParser = require("body-parser")
require('dotenv').config()
const Recaptcha = require("express-recaptcha").RecaptchaV2
const mailgun = require("mailgun-js")
const {check, validationResult} = require("express-validator")

const validation = [
    check("name", "A valid name is required.").not().isEmpty().trim().escape(),
    check("email", "Please provide a valid email.").isEmail(),
    check("phone").optional().trim().escape(),
    check("message", "A message shorter than 2000 characters is required.").trim().escape().isLength({min:1, max:2000})
]

const app = express()
const recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY)
const mg = mailgun({apiKey:process.env.MAILGUN_API_KEY, domain:process.env.MAILGUN_DOMAIN})



//define middleware
app.use(morgan("dev"))
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//define & setting routes
const indexRoute = express.Router()

//define get & post requests
const handleGetRequest = (req, res) => {
    return res.json("The express server is live.")
}
const handlePostRequest = (request, response, nextFunction) => {
    response.append("Content-Type", "text/html")

    if (request.recaptcha.error) {
        return response.send(`<div class='alert alert-danger' role='alert'><strong>Oh snap!</strong>There was an error with Recaptcha please try again</div>`)
}

const errors = validationResult(request)

if (errors.isEmpty() === false) {
    const currentError = errors.array()[0]

    return response.send(`<div class='alert alert-danger' role='alert'><strong>Oh snap!</strong> ${currentError.msg}</div>`)
}

const {email, phone, name, message} = request.body

const mailgunData = {
    to: process.env.MAIL_RECIPIENT,
    from: `${name} <postmaster@${process.env.MAILGUN_DOMAIN}>`,
    subject: `${email}: ${phone}`,
    text: message
}

mg.messages().send(mailgunData, (error) => {
    if (error) {
        return response.send(Buffer.from(`<div class='alert alert-danger' role='alert'><strong>Oh snap!</strong>Unable to send email error with email sender</div>`))
    }

    return response.send(Buffer.from("<div class='alert alert-success' role='alert'>Email successfully sent.</div>"))
    })
}

indexRoute.route("/")
    .get(handleGetRequest)
    .post(recaptcha.middleware.verify, validation, handlePostRequest)

app.use("/apis", indexRoute)

app.listen(4200, () => {
    console.log("Express Successfully built")
})