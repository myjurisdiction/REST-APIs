const mongoose = require('mongoose')
const validator = require('validator')


const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true,
        default: 'Anonymous'
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error('invalid email')
            }
        }
        
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,  
        validate(value){
            if (value.toLowerCase().includes('password')){
                throw new Error("your password contains 'password' ")
            }
        }
    }
})


module.exports = User


// const person = new User({
//     name: 'Louis Litt',
//     email: 'louisLitt@gmail.com',
//     password: '123password'
// })

// person.save().then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })





























// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value) {
//             if (!validator.isEmail(value)){
//                 throw new Error('Email is invalid')
//             }
//         }
//     },
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if (value < 0) {
//                 throw new Error('Age must be a positive value')
//             }
//         }

//     },
//     gender: {
//         type: String,
//         required: true
//     },
//     job: {
//         type: Boolean,
//         required: true
//     }
// })


// const me = new User({
//     name: '  Keshav        ',
//     email: '  ITSMYJURISDICTION@GMAIL.COM',
//     age: 19,
//     gender: 'Male',
//     job: true
// })

// me.save().then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })
