const mongoose = require('mongoose')
const validator = require('validator')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const _ = require('lodash')
const randomString = require('randomstring')
const nodemailer = require('../helper/mailer')


var dayTodo = new Schema({
    title: {
        type: String,
        required: true
    },
    startsAt: {
        type: String,
        trim: true
    },
    endAt: {
        type: String,
        trim: true
    },
    dayOfMonth: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true,
        trim: true
    },
    year: {
        type: Number,
        required: true
    }
})

var monthTodo = new Schema({
    title: {
        type: String,
        required: true
    },
    week: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    }
})

var longTodo = new Schema({
    title: {
        type: String,
        required: true
    },
    when: {
        type: Number,
        required: true
    }
})



var userSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'To nie jest prawidłowy email'
        }
    },
    active: {
        type: String,
        default: false
    },
    emailVerification: {
        type: String
    }
    ,
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 20
    },
    monthTodos: [monthTodo],
    longTodos: [longTodo],
    dayTodos: [dayTodo],
    admin: {
        type: Boolean,
        default: false
    }
})

userSchema.methods.toJSON = function () {
    var user = this
    var userObject = user.toObject()

    return _.pick(userObject, ['_id', 'email', 'name', 'lastname', 'dayTodos', 'longTodos', 'monthTodos'])
}

userSchema.pre('save', function (next) {
    var user = this
    user.emailVerification = randomString.generate(12)

    // const content = `
    // <h1>Email Verification</h1>
    // <p>Aby aktywowac twoje konto kliknij tu: </p>
    // <a href="http://localhost:3000/verify/${user.emailVerification}">localhost:3000/verify/${user.emailVerification}</a>
    // `
    // nodemailer.sendEmail('admin@planner.com', user.email, 'Weryfikacja adresu email', content)

    for (let i = 0; i < 12; i++) {
        user.longTodos.push({
            _id: mongoose.Types.ObjectId(),
            when: i,
            title: ""
        })
    }

    if (!user.isModified('password')) {
        return next()
    }

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
            user.password = hash
            next()
        })
    })

})

var User = mongoose.model('User', userSchema)

module.exports = {
    User
}